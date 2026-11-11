import { getS3ViewURL } from "@/common/s3";
import { keysToCamel, normalizeProficiency } from "@/common/utils";
import { registerWorkshopTypeAssignmentRoutes } from "@/common/workshopTypeAssignments";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp";
import { verifyRole, verifyToken } from "@/middleware";
import { Router } from "express";

export const volunteersRouter = Router();

const parseOptionalBoolean = (value, field) => {
  if (value === undefined || value === null) return null;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new Error(`${field} must be a boolean`);
};

const normalizeNullableText = (value) => {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized === "" ? null : normalized;
};

const enrichVolunteerUrls = async (volunteer, allowHandbook = false) => {
  if (!volunteer) return volunteer;
  let profilePictureUrl = null;
  let handbookUrl = null;

  const storedPic = volunteer.profilePictureUrl;
  if (storedPic && typeof storedPic === "string" && storedPic.trim()) {
    const trimmed = storedPic.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      profilePictureUrl = trimmed;
    } else {
      try {
        profilePictureUrl = await getS3ViewURL(trimmed);
      } catch (err) {
        console.error("Failed to sign profile picture URL:", err.message);
      }
    }
  }

  if (allowHandbook) {
    const storedHandbook = volunteer.formLink;
    if (storedHandbook && typeof storedHandbook === "string" && storedHandbook.trim()) {
      const trimmed = storedHandbook.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        handbookUrl = trimmed;
      } else {
        const expectedPrefix = volunteer.firebaseUid
          ? `handbooks/${volunteer.firebaseUid}/`
          : null;
        const isSafeKey =
          (expectedPrefix && trimmed.startsWith(expectedPrefix)) ||
          trimmed.startsWith("templates/");
        if (isSafeKey) {
          try {
            handbookUrl = await getS3ViewURL(trimmed);
          } catch (err) {
            console.error("Failed to sign handbook URL:", err.message);
          }
        }
      }
    }
  }

  return {
    ...volunteer,
    profilePictureUrl: profilePictureUrl ?? null,
    handbookUrl: handbookUrl ?? null,
  };
};

const enrichVolunteersUrls = async (volunteers, allowHandbook = false) => {
  if (!Array.isArray(volunteers)) return volunteers;
  return Promise.all(volunteers.map((v) => enrichVolunteerUrls(v, allowHandbook)));
};

const getCallerInfo = async (req, res) => {
  let user = res.locals.user;
  let decodedToken = res.locals.decodedToken;

  if (!decodedToken && req.cookies?.accessToken) {
    try {
      decodedToken = await admin.auth().verifyIdToken(req.cookies.accessToken);
      res.locals.decodedToken = decodedToken;
    } catch (_) {
      // ignore
    }
  }

  if (!user && decodedToken?.uid) {
    const userRows = await db.query(
      "SELECT id, role, firebase_uid FROM users WHERE firebase_uid = $1 LIMIT 1",
      [decodedToken.uid]
    );
    if (userRows.length > 0) {
      user = userRows[0];
      res.locals.user = user;
    }
  }

  const role = user?.role;
  const isStaffOrSupervisor = role === "staff" || role === "supervisor";

  return {
    isStaffOrSupervisor,
    callerUid: decodedToken?.uid ?? user?.firebase_uid ?? null,
    callerDbId: user?.id ? String(user.id) : null,
    callerRole: role ?? null,
  };
};

const canModifyVolunteer = async (req, res, volunteerId, targetFirebaseUid = null) => {
  if (process.env.NODE_ENV !== "production" && !res.locals.decodedToken && !req.cookies?.accessToken) {
    return true;
  }

  const callerInfo = await getCallerInfo(req, res);
  if (callerInfo.isStaffOrSupervisor) {
    return true;
  }

  if (callerInfo.callerDbId === String(volunteerId)) {
    return true;
  }

  if (callerInfo.callerUid) {
    let fbUid = targetFirebaseUid;
    if (!fbUid) {
      const uRows = await db.query(
        "SELECT firebase_uid FROM users WHERE id = $1 LIMIT 1",
        [volunteerId]
      );
      fbUid = uRows[0]?.firebase_uid;
    }
    if (fbUid && callerInfo.callerUid === fbUid) {
      return true;
    }
  }

  return false;
};

// Create a new volunteer
volunteersRouter.post("/", verifyToken, async (req, res) => {
  try {
    const {
      firebaseUid: reqFirebaseUid,
      first_name,
      last_name,
      email: reqEmail,
      phone_number,
      secondary_phone_number,
      is_primary_mobile,
      is_secondary_mobile,
      can_text,
      form_completed,
      form_link,
      form_received: reqFormReceived,
      handbook_uploaded_at: reqHandbookUploadedAt,
      handbook_acknowledged: reqHandbookAcknowledged,
      emergency_contact_verified: reqEmergencyContactVerified,
      confidentiality_waiver_verified: reqConfidentialityWaiverVerified,
      is_signed_confidentiality: reqIsSignedConfidentiality,
      is_attorney: reqIsAttorney,
      is_notary: reqIsNotary,
      notary_status: reqNotaryStatus,
      is_california_licensed: reqIsCaliforniaLicensed,
      affiliated_employer,
      law_school_year: reqLawSchoolYear,
      state_bar_certificate: reqStateBarCertificate,
      state_bar_number: reqStateBarNumber,
      listed_experience,
    } = req.body;

    let firebaseUid = reqFirebaseUid;
    let email = reqEmail;
    let is_attorney = reqIsAttorney;
    let is_notary = reqIsNotary;
    let notary_status = reqNotaryStatus;
    let state_bar_certificate = reqStateBarCertificate;
    let state_bar_number = reqStateBarNumber;
    let law_school_year = reqLawSchoolYear;
    let is_signed_confidentiality = reqIsSignedConfidentiality;

    const rawNotaryStatus =
      reqNotaryStatus ?? (reqIsNotary === true ? "active" : "no");
    notary_status = ["active", "inactive", "no"].includes(rawNotaryStatus)
      ? rawNotaryStatus
      : reqIsNotary
        ? "active"
        : "no";
    is_notary = notary_status === "active";

    const normalizedSecondaryPhone = normalizeNullableText(secondary_phone_number);
    const hasFormReceived =
      Object.prototype.hasOwnProperty.call(req.body, "form_received") &&
      reqFormReceived !== undefined;
    const hasHandbookAcknowledged =
      Object.prototype.hasOwnProperty.call(req.body, "handbook_acknowledged") &&
      reqHandbookAcknowledged !== undefined;
    const hasEmergencyContactVerified =
      Object.prototype.hasOwnProperty.call(req.body, "emergency_contact_verified") &&
      reqEmergencyContactVerified !== undefined;
    const hasConfidentialityWaiverVerified =
      Object.prototype.hasOwnProperty.call(req.body, "confidentiality_waiver_verified") &&
      reqConfidentialityWaiverVerified !== undefined;

    let parsedIsCaliforniaLicensed;
    let parsedIsAttorney;
    let parsedIsPrimaryMobile;
    let parsedIsSecondaryMobile;
    let parsedCanText;
    let parsedFormReceived;
    let parsedHandbookAcknowledged;
    let parsedEmergencyContactVerified;
    let parsedConfidentialityWaiverVerified;
    try {
      parsedIsCaliforniaLicensed = parseOptionalBoolean(reqIsCaliforniaLicensed, "is_california_licensed");
      parsedIsAttorney = parseOptionalBoolean(is_attorney, "is_attorney");
      parsedIsPrimaryMobile = parseOptionalBoolean(is_primary_mobile, "is_primary_mobile") ?? false;
      parsedIsSecondaryMobile = parseOptionalBoolean(is_secondary_mobile, "is_secondary_mobile") ?? false;
      parsedCanText = parseOptionalBoolean(can_text, "can_text") ?? false;
      parsedFormReceived = parseOptionalBoolean(reqFormReceived, "form_received");
      parsedHandbookAcknowledged = parseOptionalBoolean(reqHandbookAcknowledged, "handbook_acknowledged");
      parsedEmergencyContactVerified = parseOptionalBoolean(reqEmergencyContactVerified, "emergency_contact_verified");
      parsedConfidentialityWaiverVerified = parseOptionalBoolean(reqConfidentialityWaiverVerified, "confidentiality_waiver_verified");
    } catch (valErr) {
      return res.status(400).send(valErr.message);
    }

    const handbook_uploaded_at = reqHandbookUploadedAt ?? (form_link ? new Date().toISOString() : null);

    const callerUid = res.locals.decodedToken?.uid;
    const callerEmail = res.locals.decodedToken?.email;

    // Check if the caller is a staff/supervisor
    let isStaffOrSupervisor = false;
    if (callerUid) {
      const callerRows = await db.query(
        "SELECT role FROM users WHERE firebase_uid = $1 LIMIT 1",
        [callerUid]
      );
      const role = callerRows[0]?.role;
      if (role === "staff" || role === "supervisor") {
        isStaffOrSupervisor = true;
      }
    }

    let normalizedEmail = normalizeNullableText(email)?.toLowerCase();

    if (!isStaffOrSupervisor) {
      // Self-registration: override request body inputs with token details to prevent account manipulation/hijacking
      if (!callerUid || !callerEmail) {
        return res.status(401).send("Unauthorized: Invalid session token");
      }
      firebaseUid = callerUid;
      email = callerEmail;
      normalizedEmail = normalizeNullableText(callerEmail)?.toLowerCase();

      // Validate handbook key belongs to this caller
      if (form_link) {
        const trimmedFormLink = String(form_link).trim();
        const isExternalUrl = trimmedFormLink.startsWith("http://") || trimmedFormLink.startsWith("https://");
        const expectedPrefix = `handbooks/${callerUid}/`;
        if (!isExternalUrl && !trimmedFormLink.startsWith(expectedPrefix)) {
          return res.status(403).send("Forbidden: Handbook key must belong to your account");
        }
      }

      // Look up whether this is a returning user
      const existingDbUser = normalizedEmail
        ? await db.query(
            "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
            [normalizedEmail]
          )
        : [];
      const isNewUser = existingDbUser.length === 0;

      // Prevent self-asserting credentials/confidentiality fields during self-registration
      is_attorney = false;
      parsedIsAttorney = false;
      is_notary = false;
      notary_status = "no";
      parsedIsCaliforniaLicensed = false;
      state_bar_certificate = null;
      state_bar_number = null;
      law_school_year = null;

      if (isNewUser) {
        parsedHandbookAcknowledged = false;
        parsedEmergencyContactVerified = false;
        parsedConfidentialityWaiverVerified = false;
        is_signed_confidentiality = null;
        if (parsedFormReceived === null) {
          parsedFormReceived = false;
        }
      } else {
        // Returning user upsert (e.g. SSO redirect): keep verification fields as null so COALESCE preserves them
        parsedHandbookAcknowledged = null;
        parsedEmergencyContactVerified = null;
        parsedConfidentialityWaiverVerified = null;
        is_signed_confidentiality = null;
      }
    }

    let resolvedSignedConfidentiality = null;
    if (is_signed_confidentiality === true) {
      resolvedSignedConfidentiality = new Date().toISOString();
    } else if (typeof is_signed_confidentiality === "string" && is_signed_confidentiality.trim() !== "") {
      resolvedSignedConfidentiality = is_signed_confidentiality.trim();
    } else {
      resolvedSignedConfidentiality = null;
    }

    if (!normalizedEmail) {
      return res.status(400).send("email are required");
    }

    // Always query if a user with this email exists case-insensitively
    const existingUserRows = await db.query(
      "SELECT id, firebase_uid, role, email FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [normalizedEmail]
    );
    const existingUser = existingUserRows[0];

    if (!isStaffOrSupervisor && existingUser) {
      if (
        existingUser.role === "staff" ||
        existingUser.role === "supervisor" ||
        (existingUser.firebase_uid && existingUser.firebase_uid !== firebaseUid)
      ) {
        return res.status(409).json({
          message:
            "Conflict: This email is already registered to another account.",
        });
      }
    }

    // Use the exact database casing of the email if it exists, to avoid constraint mismatches and duplicate rows
    const emailToUse = existingUser ? existingUser.email : normalizedEmail;

    const normalizedFirstName = normalizeNullableText(first_name);
    const normalizedLastName = normalizeNullableText(last_name);
    const normalizedPhoneNumber = normalizeNullableText(phone_number);
    const normalizedAffiliatedEmployer =
      normalizeNullableText(affiliated_employer);
    const normalizedLawSchoolYear = normalizeNullableText(law_school_year);
    const normalizedStateBarCertificate = normalizeNullableText(
      state_bar_certificate
    );
    const normalizedStateBarNumber = normalizeNullableText(state_bar_number);
    const normalizedListedExperience = normalizeNullableText(listed_experience);

    const effectiveIsAttorney = parsedIsAttorney;
    let effectiveIsCalLicensed = parsedIsCaliforniaLicensed;
    if (effectiveIsAttorney === false) {
      effectiveIsCalLicensed = false;
    }

    const resolvedStateBarCertificate =
      effectiveIsAttorney === false || effectiveIsCalLicensed === false
        ? null
        : (normalizedStateBarCertificate || (effectiveIsCalLicensed === true ? "California" : null));

    const resolvedStateBarNumber =
      effectiveIsAttorney === false || effectiveIsCalLicensed === false
        ? null
        : normalizedStateBarNumber;

    const result = await db.tx(async (t) => {
      const userResult = await t.one(
        `
          INSERT INTO users (email, firebase_uid, role)
          VALUES ($1, $2, 'volunteer')
          ON CONFLICT (email) DO UPDATE
            SET firebase_uid = COALESCE(users.firebase_uid, EXCLUDED.firebase_uid),
                role = CASE
                  WHEN users.role = 'guest' THEN 'volunteer'
                  ELSE users.role
                END
          RETURNING id, email, firebase_uid, role;
        `,
        [emailToUse, firebaseUid ?? null]
      );

      // Verify that the firebase_uid matches (atomic ownership decision)
      if (firebaseUid && userResult.firebase_uid !== firebaseUid) {
        throw new Error(
          "Conflict: This email is already linked to another account."
        );
      }

      const volunteerResult = await t.one(
        `
          INSERT INTO volunteers (
            id,
            first_name,
            last_name,
            email,
            phone_number,
            secondary_phone_number,
            is_primary_mobile,
            is_secondary_mobile,
            can_text,
            form_completed,
            form_link,
            form_received,
            handbook_uploaded_at,
            handbook_acknowledged,
            emergency_contact_verified,
            confidentiality_waiver_verified,
            is_signed_confidentiality,
            is_attorney,
            is_notary,
            notary_status,
            is_california_licensed,
            affiliated_employer,
            law_school_year,
            state_bar_certificate,
            state_bar_number,
            listed_experience
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
          ON CONFLICT (id) DO UPDATE
            SET first_name = COALESCE(EXCLUDED.first_name, volunteers.first_name),
                last_name = COALESCE(EXCLUDED.last_name, volunteers.last_name),
                email = COALESCE(EXCLUDED.email, volunteers.email),
                phone_number = COALESCE(EXCLUDED.phone_number, volunteers.phone_number),
                secondary_phone_number = COALESCE(EXCLUDED.secondary_phone_number, volunteers.secondary_phone_number),
                is_primary_mobile = COALESCE(EXCLUDED.is_primary_mobile, volunteers.is_primary_mobile),
                is_secondary_mobile = COALESCE(EXCLUDED.is_secondary_mobile, volunteers.is_secondary_mobile),
                can_text = COALESCE(EXCLUDED.can_text, volunteers.can_text),
                form_completed = COALESCE(EXCLUDED.form_completed, volunteers.form_completed),
                form_link = COALESCE(EXCLUDED.form_link, volunteers.form_link),
                form_received = CASE
                  WHEN $27 THEN EXCLUDED.form_received
                  ELSE volunteers.form_received
                END,
                handbook_uploaded_at = COALESCE(EXCLUDED.handbook_uploaded_at, volunteers.handbook_uploaded_at),
                handbook_acknowledged = CASE
                  WHEN $28 THEN EXCLUDED.handbook_acknowledged
                  ELSE volunteers.handbook_acknowledged
                END,
                emergency_contact_verified = CASE
                  WHEN $29 THEN EXCLUDED.emergency_contact_verified
                  ELSE volunteers.emergency_contact_verified
                END,
                confidentiality_waiver_verified = CASE
                  WHEN $30 THEN EXCLUDED.confidentiality_waiver_verified
                  ELSE volunteers.confidentiality_waiver_verified
                END,
                is_signed_confidentiality = COALESCE(EXCLUDED.is_signed_confidentiality, volunteers.is_signed_confidentiality),
                is_attorney = COALESCE(EXCLUDED.is_attorney, volunteers.is_attorney),
                is_notary = COALESCE(EXCLUDED.is_notary, volunteers.is_notary),
                notary_status = COALESCE(EXCLUDED.notary_status, volunteers.notary_status),
                is_california_licensed = CASE
                  WHEN EXCLUDED.is_attorney IS FALSE THEN FALSE
                  ELSE COALESCE(EXCLUDED.is_california_licensed, volunteers.is_california_licensed)
                END,
                affiliated_employer = COALESCE(EXCLUDED.affiliated_employer, volunteers.affiliated_employer),
                law_school_year = COALESCE(EXCLUDED.law_school_year, volunteers.law_school_year),
                state_bar_certificate = CASE
                  WHEN EXCLUDED.is_attorney IS FALSE OR EXCLUDED.is_california_licensed IS FALSE THEN NULL
                  ELSE COALESCE(EXCLUDED.state_bar_certificate, volunteers.state_bar_certificate)
                END,
                state_bar_number = CASE
                  WHEN EXCLUDED.is_attorney IS FALSE OR EXCLUDED.is_california_licensed IS FALSE THEN NULL
                  ELSE COALESCE(EXCLUDED.state_bar_number, volunteers.state_bar_number)
                END,
                listed_experience = COALESCE(EXCLUDED.listed_experience, volunteers.listed_experience)
          RETURNING *;
        `,
        [
          userResult.id,
          normalizedFirstName,
          normalizedLastName,
          emailToUse,
          normalizedPhoneNumber,
          normalizedSecondaryPhone,
          parsedIsPrimaryMobile,
          parsedIsSecondaryMobile,
          parsedCanText,
          form_completed ?? null,
          normalizeNullableText(form_link),
          parsedFormReceived ?? false,
          handbook_uploaded_at ?? null,
          parsedHandbookAcknowledged ?? false,
          parsedEmergencyContactVerified ?? false,
          parsedConfidentialityWaiverVerified ?? false,
          resolvedSignedConfidentiality,
          is_attorney ?? null,
          is_notary ?? null,
          notary_status ?? "no",
          effectiveIsCalLicensed,
          normalizedAffiliatedEmployer,
          normalizedLawSchoolYear,
          resolvedStateBarCertificate,
          resolvedStateBarNumber,
          normalizedListedExperience,
          hasFormReceived,
          hasHandbookAcknowledged,
          hasEmergencyContactVerified,
          hasConfidentialityWaiverVerified,
        ]
      );

      return {
        user: userResult,
        volunteer: volunteerResult,
      };
    });

    const enriched = await enrichVolunteerUrls({
      ...keysToCamel(result.volunteer),
      profilePictureUrl: result.user?.profile_picture_url ?? null,
      firebaseUid: result.user?.firebase_uid ?? null,
    });
    res.status(201).json(enriched);
  } catch (e) {
    if (e.message?.includes("Conflict:")) {
      return res.status(409).send(e.message);
    }
    res.status(500).send(e.message);
  }
});

// Get all active (non-archived) volunteers
volunteersRouter.get("/", verifyRole("volunteer"), async (req, res) => {
  try {
    const volunteersQuery = await db.query(
      `
        SELECT v.*,
          u.profile_picture_url,
          u.firebase_uid,
          COALESCE(
            array_agg(DISTINCT r.role_name) FILTER (WHERE r.role_name IS NOT NULL),
            '{}'::text[]
          ) AS roles,
          COALESCE(
            array_agg(DISTINCT aop.areas_of_practice) FILTER (WHERE aop.areas_of_practice IS NOT NULL),
            '{}'::text[]
          ) AS areas_of_practice,
          COALESCE(
            array_agg(DISTINCT l.language) FILTER (WHERE l.language IS NOT NULL),
            '{}'::text[]
          ) AS languages,
          (
            SELECT c.date
            FROM clinic_registration cr
            JOIN clinics c ON cr.clinic_id = c.id
            WHERE cr.volunteer_id = v.id
              AND cr.has_attended = TRUE
            ORDER BY c.date DESC
            LIMIT 1
          ) AS most_recent_event
        FROM volunteers v
        LEFT JOIN users u ON v.id = u.id
        LEFT JOIN volunteer_roles vr ON v.id = vr.volunteer_id
        LEFT JOIN roles r ON vr.role_id = r.id
        LEFT JOIN volunteer_areas_of_practice vaop ON v.id = vaop.volunteer_id
        LEFT JOIN areas_of_practice aop ON vaop.area_of_practice_id = aop.id
        LEFT JOIN volunteer_language vl ON v.id = vl.volunteer_id
        LEFT JOIN languages l ON vl.language_id = l.id
        WHERE NOT EXISTS (
          SELECT 1 FROM volunteer_archived av WHERE av.volunteer_id = v.id
        )
        GROUP BY v.id, u.profile_picture_url, u.firebase_uid;
      `
    );
    const callerInfo = await getCallerInfo(req, res);
    const allowHandbook =
      callerInfo.isStaffOrSupervisor || (process.env.NODE_ENV !== "production" && !callerInfo.callerUid);
    res.status(200).json(await enrichVolunteersUrls(keysToCamel(volunteersQuery), allowHandbook));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all archived volunteers
volunteersRouter.get("/archived", async (req, res) => {
  try {
    const volunteersQuery = await db.query(
      `
        SELECT v.*,
          av.archived_date,
          av.reactivation,
          av.archived_notes,
          COALESCE(
            array_agg(r.role_name) FILTER (WHERE r.role_name IS NOT NULL),
            '{}'::text[]
          ) AS roles
        FROM volunteers v
        JOIN volunteer_archived av ON av.volunteer_id = v.id
        LEFT JOIN volunteer_roles vr ON v.id = vr.volunteer_id
        LEFT JOIN roles r ON vr.role_id = r.id
        GROUP BY v.id, av.archived_date, av.reactivation, av.archived_notes;
      `
    );
    res.status(200).json(keysToCamel(volunteersQuery));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Archive a volunteer
volunteersRouter.patch("/:id/archive", async (req, res) => {
  try {
    const { id } = req.params;
    const { reactivation, notes } = req.body;

    const result = await db.query(
      `
        INSERT INTO volunteer_archived (volunteer_id, reactivation, archived_notes)
        VALUES ($1, $2, $3)
        ON CONFLICT (volunteer_id) DO UPDATE
          SET archived_date  = NOW(),
              reactivation   = EXCLUDED.reactivation,
              archived_notes = EXCLUDED.archived_notes
        RETURNING *;
      `,
      [id, reactivation ?? null, notes ?? null]
    );

    res.status(200).json(keysToCamel(result[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Unarchive a volunteer
volunteersRouter.patch("/:id/unarchive", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
        DELETE FROM volunteer_archived
        WHERE volunteer_id = $1
        RETURNING *;
      `,
      [id]
    );

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Volunteer not found in archived list" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get a single volunteer via ID
volunteersRouter.get("/:id", verifyRole("volunteer"), async (req, res) => {
  try {
    const { id } = req.params;

    const volunteerQuery = await db.query(
      `
        SELECT v.*, u.profile_picture_url, u.firebase_uid
        FROM volunteers v
        LEFT JOIN users u ON v.id = u.id
        WHERE v.id = $1;
      `,
      [id]
    );

    if (!volunteerQuery.length) {
      return res.status(404).send(`Volunteer ${id} not found`);
    }

    const callerInfo = await getCallerInfo(req, res);
    const target = volunteerQuery[0];
    const isOwner =
      callerInfo.callerDbId === String(id) ||
      (Boolean(callerInfo.callerUid) && Boolean(target.firebase_uid) && target.firebase_uid === callerInfo.callerUid);
    const allowHandbook =
      callerInfo.isStaffOrSupervisor || isOwner || (process.env.NODE_ENV !== "production" && !callerInfo.callerUid);

    res.status(200).json(await enrichVolunteersUrls(keysToCamel(volunteerQuery), allowHandbook));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Delete a volunteer via ID (staff/supervisors can delete any volunteer; uncompleted volunteers can delete self during signup rollback)
volunteersRouter.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerId = Number(id);
    if (!Number.isInteger(volunteerId)) {
      return res.status(400).send("Invalid volunteer id");
    }

    const callerUid = res.locals.decodedToken?.uid;
    const callerUsers = await db.query(
      `SELECT u.id, u.role, v.form_completed
       FROM users u
       LEFT JOIN volunteers v ON u.id = v.id
       WHERE u.firebase_uid = $1`,
      [callerUid]
    );
    const caller = callerUsers.at(0);
    const isStaffOrSupervisor = caller?.role === "staff" || caller?.role === "supervisor";
    const isSelfRollback = Boolean(caller && caller.id === volunteerId && caller.form_completed !== true);

    if (!isStaffOrSupervisor && !isSelfRollback) {
      return res.status(403).send("Forbidden");
    }

    const userRow = await db.query(
      `SELECT firebase_uid FROM users WHERE id = $1`,
      [volunteerId]
    );

    if (!userRow.length) {
      return res.status(404).send(`Volunteer ${volunteerId} not found`);
    }

    if (userRow.length && userRow[0].firebase_uid) {
      try {
        await admin.auth().deleteUser(userRow[0].firebase_uid);
      } catch (fbErr) {
        if (fbErr?.code !== "auth/user-not-found") {
          throw fbErr;
        }
      }
    }

    await db.tx(async (t) => {
      await t.query(`DELETE FROM volunteer_archived WHERE volunteer_id = $1`, [
        volunteerId,
      ]);
      await t.query(`DELETE FROM volunteers WHERE id = $1`, [volunteerId]);
      await t.query(`DELETE FROM users WHERE id = $1`, [volunteerId]);
    });

    res.status(200).send(`Volunteer ${volunteerId} deleted successfully`);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Update a volunteer's information via ID
volunteersRouter.put("/:id", verifyRole("volunteer"), async (req, res) => {
  try {
    const { id } = req.params;

    const targetUsers = await db.query(
      "SELECT id, firebase_uid FROM users WHERE id = $1 LIMIT 1",
      [id]
    );
    if (!targetUsers.length) {
      return res.status(404).send(`Volunteer ${id} not found`);
    }
    const targetUser = targetUsers[0];

    if (!(await canModifyVolunteer(req, res, id, targetUser.firebase_uid))) {
      return res.status(403).send("Forbidden: Cannot modify another volunteer's record");
    }

    const callerInfo = await getCallerInfo(req, res);
    const canUpdateVerification =
      callerInfo.isStaffOrSupervisor || (process.env.NODE_ENV !== "production" && !callerInfo.callerUid);

    const {
      first_name,
      last_name,
      email,
      phone_number,
      secondary_phone_number,
      is_primary_mobile,
      is_secondary_mobile,
      can_text,
      form_completed,
      form_link,
      form_received,
      handbook_uploaded_at,
      handbook_acknowledged,
      emergency_contact_verified,
      confidentiality_waiver_verified,
      is_signed_confidentiality,
      is_attorney,
      is_notary,
      notary_status,
      is_california_licensed,
      affiliated_employer,
      law_school_year,
      state_bar_certificate,
      state_bar_number,
      listed_experience,
    } = req.body;

    const hasListedExperience = Object.prototype.hasOwnProperty.call(
      req.body,
      "listed_experience"
    );
    const listedExperienceClause = hasListedExperience
      ? "listed_experience = $21"
      : "listed_experience = listed_experience";
    const hasSecondaryPhone = Object.prototype.hasOwnProperty.call(
      req.body,
      "secondary_phone_number"
    );
    const hasFormLink = Object.prototype.hasOwnProperty.call(
      req.body,
      "form_link"
    );

    if (hasFormLink && form_link && !callerInfo.isStaffOrSupervisor) {
      const trimmedFormLink = String(form_link).trim();
      const isExternalUrl = trimmedFormLink.startsWith("http://") || trimmedFormLink.startsWith("https://");
      const targetUid = targetUser.firebase_uid;
      const expectedPrefix = targetUid ? `handbooks/${targetUid}/` : null;
      if (!isExternalUrl && (!expectedPrefix || !trimmedFormLink.startsWith(expectedPrefix))) {
        return res.status(403).send("Forbidden: Handbook key must belong to your account");
      }
    }
    const hasFormReceived = Object.prototype.hasOwnProperty.call(
      req.body,
      "form_received"
    );
    const hasHandbookUploadedAt = Object.prototype.hasOwnProperty.call(
      req.body,
      "handbook_uploaded_at"
    );
    const hasHandbookAcknowledged = canUpdateVerification && Object.prototype.hasOwnProperty.call(
      req.body,
      "handbook_acknowledged"
    );
    const hasEmergencyContactVerified = canUpdateVerification && Object.prototype.hasOwnProperty.call(
      req.body,
      "emergency_contact_verified"
    );
    const hasConfidentialityWaiverVerified = canUpdateVerification && Object.prototype.hasOwnProperty.call(
      req.body,
      "confidentiality_waiver_verified"
    );
    const hasIsSignedConfidentiality = canUpdateVerification && Object.prototype.hasOwnProperty.call(
      req.body,
      "is_signed_confidentiality"
    );

    let parsedIsCaliforniaLicensed;
    let parsedIsAttorney;
    let parsedIsPrimaryMobile;
    let parsedIsSecondaryMobile;
    let parsedCanText;
    let parsedFormReceived;
    let parsedHandbookAcknowledged;
    let parsedEmergencyContactVerified;
    let parsedConfidentialityWaiverVerified;
    try {
      parsedIsCaliforniaLicensed = parseOptionalBoolean(is_california_licensed, "is_california_licensed");
      parsedIsAttorney = parseOptionalBoolean(is_attorney, "is_attorney");
      parsedIsPrimaryMobile = parseOptionalBoolean(is_primary_mobile, "is_primary_mobile");
      parsedIsSecondaryMobile = parseOptionalBoolean(is_secondary_mobile, "is_secondary_mobile");
      parsedCanText = parseOptionalBoolean(can_text, "can_text");
      parsedFormReceived = parseOptionalBoolean(form_received, "form_received");
      parsedHandbookAcknowledged = parseOptionalBoolean(handbook_acknowledged, "handbook_acknowledged");
      parsedEmergencyContactVerified = parseOptionalBoolean(emergency_contact_verified, "emergency_contact_verified");
      parsedConfidentialityWaiverVerified = parseOptionalBoolean(confidentiality_waiver_verified, "confidentiality_waiver_verified");
    } catch (valErr) {
      return res.status(400).send(valErr.message);
    }

    let resolvedSignedConfidentiality = is_signed_confidentiality;
    if (is_signed_confidentiality === true) {
      resolvedSignedConfidentiality = new Date().toISOString();
    } else if (is_signed_confidentiality === false) {
      resolvedSignedConfidentiality = null;
    }

    const resolvedNotaryStatus =
      notary_status ??
      (is_notary === true ? "active" : is_notary === false ? "no" : null);
    const resolvedIsNotary =
      resolvedNotaryStatus === "active"
        ? true
        : resolvedNotaryStatus === "inactive" || resolvedNotaryStatus === "no"
          ? false
          : is_notary;

    await db.query(
      `
        UPDATE volunteers
        SET first_name = COALESCE($2, first_name),
            last_name = COALESCE($3, last_name),
            email = COALESCE($4, email),
            phone_number = COALESCE($5, phone_number),
            secondary_phone_number = CASE WHEN $22 THEN $6 ELSE secondary_phone_number END,
            is_primary_mobile = COALESCE($7, is_primary_mobile),
            is_secondary_mobile = COALESCE($8, is_secondary_mobile),
            can_text = COALESCE($9, can_text),
            form_completed = COALESCE($10, form_completed),
            form_link = CASE WHEN $23 THEN $24 ELSE form_link END,
            form_received = CASE WHEN $25 THEN $26 ELSE form_received END,
            handbook_uploaded_at = CASE WHEN $27 THEN $28 ELSE handbook_uploaded_at END,
            handbook_acknowledged = CASE WHEN $29 THEN $30 ELSE handbook_acknowledged END,
            emergency_contact_verified = CASE WHEN $31 THEN $32 ELSE emergency_contact_verified END,
            confidentiality_waiver_verified = CASE WHEN $33 THEN $34 ELSE confidentiality_waiver_verified END,
            is_signed_confidentiality = CASE WHEN $35 THEN $36 ELSE is_signed_confidentiality END,
            is_attorney = COALESCE($13, is_attorney),
            is_notary = COALESCE($14, is_notary),
            notary_status = COALESCE($15, notary_status),
            is_california_licensed = CASE
              WHEN $13 IS FALSE THEN FALSE
              ELSE COALESCE($16, is_california_licensed)
            END,
            affiliated_employer = COALESCE($17, affiliated_employer),
            law_school_year = COALESCE($18, law_school_year),
            state_bar_certificate = CASE
              WHEN $13 IS FALSE OR $16 IS FALSE THEN NULL
              ELSE COALESCE($19, state_bar_certificate)
            END,
            state_bar_number = CASE
              WHEN $13 IS FALSE OR $16 IS FALSE THEN NULL
              ELSE COALESCE($20, state_bar_number)
            END,
            ${listedExperienceClause}
        WHERE id = $1;
      `,
      [
        id,
        first_name,
        last_name,
        email,
        phone_number,
        hasSecondaryPhone ? normalizeNullableText(secondary_phone_number) : null,
        parsedIsPrimaryMobile,
        parsedIsSecondaryMobile,
        parsedCanText,
        form_completed,
        null, // placeholder for legacy $11
        null, // placeholder for legacy $12
        parsedIsAttorney,
        resolvedIsNotary,
        resolvedNotaryStatus,
        parsedIsCaliforniaLicensed,
        affiliated_employer ?? null,
        law_school_year ?? null,
        state_bar_certificate ?? null,
        state_bar_number ?? null,
        hasListedExperience ? normalizeNullableText(listed_experience) : null,
        hasSecondaryPhone,
        hasFormLink,
        normalizeNullableText(form_link),
        hasFormReceived,
        parsedFormReceived,
        hasHandbookUploadedAt,
        handbook_uploaded_at ?? null,
        hasHandbookAcknowledged,
        parsedHandbookAcknowledged,
        hasEmergencyContactVerified,
        parsedEmergencyContactVerified,
        hasConfidentialityWaiverVerified,
        parsedConfidentialityWaiverVerified,
        hasIsSignedConfidentiality,
        resolvedSignedConfidentiality,
      ]
    );

    res.status(200).send(`Volunteer ${id} updated successfully`);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// -----------------------------
// Volunteer Areas of Practice Routes
// -----------------------------

// Assign an area of practice to a volunteer
// POST /volunteers/:volunteerId/areas-of-practice
// body: { areaOfPracticeId }
volunteersRouter.post(
  "/:volunteerId/areas-of-practice",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;
      const { areaOfPracticeId } = req.body;

      if (!areaOfPracticeId) {
        return res
          .status(400)
          .json({ message: "areaOfPracticeId is required" });
      }

      const areaAssignment = await db.query(
        `
        INSERT INTO volunteer_areas_of_practice (
          volunteer_id,
          area_of_practice_id
        )
        VALUES ($1, $2)
        ON CONFLICT (volunteer_id, area_of_practice_id)
        DO NOTHING
        RETURNING *;
      `,
        [volunteerId, areaOfPracticeId]
      );

      if (!areaAssignment.length) {
        return res
          .status(200)
          .json({ message: "Area of practice already assigned" });
      }

      res.status(201).json(keysToCamel(areaAssignment[0]));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// List all areas of practice for a volunteer
// GET /volunteers/:volunteerId/areas-of-practice
volunteersRouter.get(
  "/:volunteerId/areas-of-practice",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;

      const areasOfPractice = await db.query(
        `
        SELECT
          aop.id AS area_of_practice_id,
          aop.areas_of_practice
        FROM volunteer_areas_of_practice vs
        JOIN areas_of_practice aop ON aop.id = vs.area_of_practice_id
        WHERE vs.volunteer_id = $1
        ORDER BY aop.areas_of_practice ASC;
      `,
        [volunteerId]
      );

      res.status(200).json(keysToCamel(areasOfPractice));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// Remove an area of practice from a volunteer
// DELETE /volunteers/:volunteerId/areas-of-practice/:areaOfPracticeId
volunteersRouter.delete(
  "/:volunteerId/areas-of-practice/:areaOfPracticeId",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId, areaOfPracticeId } = req.params;

      const deleted = await db.query(
        `
          DELETE FROM volunteer_areas_of_practice
          WHERE volunteer_id = $1 AND area_of_practice_id = $2
          RETURNING *;
        `,
        [volunteerId, areaOfPracticeId]
      );

      if (!deleted.length) {
        return res.status(404).json({
          message: "Area of practice not found for this volunteer",
        });
      }

      res.status(200).json(keysToCamel(deleted[0]));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// -----------------------------
// Volunteer Tags Routes
// -----------------------------

volunteersRouter.post(
  "/:volunteerId/tags",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;
      const { tagId } = req.body;

      const volunteerResult = await db.query(
        `
        INSERT INTO volunteer_tags (volunteer_id, tag_id)
        VALUES ($1, $2)
        RETURNING *;
      `,
        [volunteerId, tagId]
      );

      res.status(201).json(keysToCamel(volunteerResult));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.delete(
  "/:volunteerId/tags/:tagId",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId, tagId } = req.params;

      await db.query(
        `
        DELETE
        FROM volunteer_tags
        WHERE volunteer_id = $1 AND tag_id = $2;
      `,
        [volunteerId, tagId]
      );

      res
        .status(200)
        .send(`Tag ${tagId} deleted from volunteer ${volunteerId}`);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.get(
  "/:volunteerId/tags",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;

      const volunteerResult = await db.query(
        `
        SELECT t.id, t.tag
        FROM volunteer_tags vt
        JOIN tags t ON t.id = vt.tag_id
        WHERE vt.volunteer_id = $1;
      `,
        [volunteerId]
      );

      res.status(200).json(keysToCamel(volunteerResult));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// -----------------------------
// Volunteer Languages Routes (verbal & written proficiency)
// -----------------------------

// Batch upsert languages for a volunteer
// POST /volunteers/:volunteerId/languages
// body: { languages: [{ languageId, verbalProficiency?, writtenProficiency? }] }
volunteersRouter.post(
  "/:volunteerId/languages",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;
      const { languages } = req.body;

      if (!Array.isArray(languages) || languages.length === 0) {
        return res.status(400).json({ message: "languages array is required" });
      }

      for (const entry of languages) {
        if (!entry?.languageId) {
          return res.status(400).json({
            message: "Each language must include languageId",
          });
        }
      }

      const valuesSql = languages
        .map(
          (_, idx) => `($1, $${idx * 3 + 2}, $${idx * 3 + 3}, $${idx * 3 + 4})`
        )
        .join(", ");

      const params = [volunteerId];
      for (const entry of languages) {
        const verbal = normalizeProficiency(
          entry?.verbalProficiency ??
            entry?.verbal_proficiency ??
            entry?.proficiency
        );
        const written = normalizeProficiency(
          entry?.writtenProficiency ??
            entry?.written_proficiency ??
            entry?.proficiency
        );
        params.push(entry.languageId, verbal, written);
      }

      const result = await db.query(
        `
        INSERT INTO volunteer_language (volunteer_id, language_id, verbal_proficiency, written_proficiency)
        VALUES ${valuesSql}
        ON CONFLICT (volunteer_id, language_id)
        DO UPDATE SET
          verbal_proficiency = EXCLUDED.verbal_proficiency,
          written_proficiency = EXCLUDED.written_proficiency
        RETURNING *;
      `,
        params
      );

      res.status(201).json(keysToCamel(result));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// List all languages for a volunteer (joins to languages.language)
volunteersRouter.get(
  "/:volunteerId/languages",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;

      const languages = await db.query(
        `
        SELECT l.id, l.language, vl.verbal_proficiency, vl.written_proficiency
        FROM volunteer_language vl
        JOIN languages l ON l.id = vl.language_id
        WHERE vl.volunteer_id = $1
        ORDER BY l.language ASC;
      `,
        [volunteerId]
      );

      res.status(200).json(keysToCamel(languages));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// Remove a language from a volunteer
volunteersRouter.delete(
  "/:volunteerId/languages/:languageId",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId, languageId } = req.params;

      const result = await db.query(
        `
          DELETE FROM volunteer_language
          WHERE volunteer_id = $1 AND language_id = $2
          RETURNING *;
        `,
        [volunteerId, languageId]
      );

      if (!result.length) {
        return res
          .status(404)
          .json({ message: "Language not assigned to this volunteer" });
      }

      res.status(200).json(keysToCamel(result[0]));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// -----------------------------
// Volunteer Roles Routes
// -----------------------------

volunteersRouter.post(
  "/:volunteerId/roles",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;
      const { roleId } = req.body;

      if (!roleId) {
        return res.status(400).json({ message: "roleId is required" });
      }

      const newRelationship = await db.query(
        `
        INSERT INTO volunteer_roles (volunteer_id, role_id)
        VALUES ($1, $2)
        RETURNING *;
      `,
        [volunteerId, roleId]
      );

      res.status(201).json(keysToCamel(newRelationship));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.delete(
  "/:volunteerId/roles/:roleId",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId, roleId } = req.params;

      const deletedRelationship = await db.query(
        `
        DELETE FROM volunteer_roles
        WHERE volunteer_id = $1 AND role_id = $2
        RETURNING *;
      `,
        [volunteerId, roleId]
      );

      if (deletedRelationship.length === 0) {
        return res
          .status(404)
          .json({ message: "Role not assigned to this volunteer" });
      }

      res.status(200).json(keysToCamel(deletedRelationship));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.get(
  "/:volunteerId/roles",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;

      const listAll = await db.query(
        `
        SELECT r.id, r.role_name
        FROM volunteer_roles vr
        JOIN roles r ON vr.role_id = r.id
        WHERE vr.volunteer_id = $1
        ORDER BY r.id ASC;
      `,
        [volunteerId]
      );

      res.status(200).json(keysToCamel(listAll));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

registerWorkshopTypeAssignmentRoutes(
  volunteersRouter,
  "volunteer",
  (req, res) => canModifyVolunteer(res, req.params.volunteerId)
);

// -----------------------------
// Volunteer Locations Routes
// -----------------------------

volunteersRouter.post(
  "/:volunteerId/locations",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;
      const { locationId } = req.body;

      if (!locationId) {
        return res.status(400).json({ message: "locationId is required" });
      }

      const newRelationship = await db.query(
        `
        INSERT INTO volunteer_locations (volunteer_id, location_id)
        VALUES ($1, $2)
        RETURNING *;
      `,
        [volunteerId, locationId]
      );

      res.status(201).json(keysToCamel(newRelationship));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.delete(
  "/:volunteerId/locations/:locationId",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId, locationId } = req.params;

      const deletedRelationship = await db.query(
        `
        DELETE FROM volunteer_locations
        WHERE volunteer_id = $1 AND location_id = $2
        RETURNING *;
      `,
        [volunteerId, locationId]
      );

      if (deletedRelationship.length === 0) {
        return res
          .status(404)
          .json({ message: "Location not assigned to this volunteer" });
      }

      res.status(200).json(keysToCamel(deletedRelationship));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.get(
  "/:volunteerId/locations",
  verifyRole("volunteer"),
  async (req, res) => {
    try {
      const { volunteerId } = req.params;

      const listAll = await db.query(
        `
        SELECT l.id, l.city, l.state, l.zip_code
        FROM volunteer_locations vl
        JOIN locations l ON vl.location_id = l.id
        WHERE vl.volunteer_id = $1;
      `,
        [volunteerId]
      );

      res.status(200).json(keysToCamel(listAll));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);
