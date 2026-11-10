import {
  checkS3ObjectExists,
  deleteS3Object,
  getHandbookUploadURL,
  getProfilePictureGetURL,
  getProfilePictureUploadURL,
  getS3ViewURL,
} from "@/common/s3";
import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole, verifyToken } from "@/middleware";
import type { Request, Response } from "express";
import { Router } from "express";

export const usersRouter = Router();

const getCallerUid = async (req: Request, res: Response): Promise<string | null> => {
  if (res.locals.decodedToken?.uid) {
    return res.locals.decodedToken.uid;
  }
  if (req.cookies?.accessToken) {
    try {
      const decoded = await admin.auth().verifyIdToken(req.cookies.accessToken);
      res.locals.decodedToken = decoded;
      return decoded.uid;
    } catch {
      // ignore
    }
  }
  return null;
};

const isStaffOrSupervisor = async (uid?: string | null): Promise<boolean> => {
  if (!uid) return false;
  const rows = await db.query(
    "SELECT role FROM users WHERE firebase_uid = $1 LIMIT 1",
    [uid]
  );
  const role = rows[0]?.role;
  return role === "staff" || role === "supervisor";
};

type UserRecord = Record<string, unknown>;

const enrichUserWithProfilePicture = async (user: UserRecord): Promise<UserRecord> => {
  const stored = user.profilePictureUrl;
  const storedValue = typeof stored === "string" ? stored.trim() : "";

  if (!storedValue) {
    return { ...user, profilePictureKey: null, profilePictureUrl: null };
  }

  if (storedValue.startsWith("http://") || storedValue.startsWith("https://")) {
    return { ...user, profilePictureKey: null, profilePictureUrl: storedValue };
  }

  const viewUrl = await getProfilePictureGetURL(storedValue);
  return { ...user, profilePictureKey: storedValue, profilePictureUrl: viewUrl };
};

const enrichUsersWithProfilePicture = async (users: UserRecord[]) =>
  Promise.all(users.map((user) => enrichUserWithProfilePicture(user)));

// Create a Firebase custom token for an existing user
usersRouter.post("/custom-token", async (req, res) => {
  try {
    const { firebaseUid, email, firstName, lastName } = req.body as {
      firebaseUid?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    };

    let resolvedFirebaseUid = firebaseUid?.trim();

    if (!resolvedFirebaseUid && email?.trim()) {
      let query = "SELECT u.firebase_uid FROM users u";
      const params = [email.trim()];

      if (!firstName?.trim() || !lastName?.trim()) {
        return res.status(400).json({ message: "firstName and lastName are required" });
      }

      query += `
          JOIN volunteers v ON u.id = v.id
          WHERE LOWER(u.email) = LOWER($1)
            AND LOWER(v.first_name) = LOWER($2)
            AND LOWER(v.last_name) = LOWER($3)
          LIMIT 1
        `;
      params.push(firstName.trim(), lastName.trim());

      const userByEmail = await db.query(query, params);

      if (userByEmail.length === 0) {
        return res.status(404).json({ message: "User not found or credentials mismatch" });
      }

      const row = keysToCamel(userByEmail[0]) as { firebaseUid?: string };
      resolvedFirebaseUid = row.firebaseUid?.trim();
    }

    if (!resolvedFirebaseUid) {
      return res
        .status(400)
        .json({ message: "firebaseUid or email is required" });
    }

    // If the UID is a temp placeholder (no real Firebase Auth account, or a
    // shell account with no email created by a prior signInWithCustomToken),
    // create a proper Firebase Auth account and update the DB.
    let isTempUid = false;
    let tempUidToDelete: string | null = null;

    try {
      const fbUser = await admin.auth().getUser(resolvedFirebaseUid);
      if (!fbUser.email) {
        // Shell account created by a previous signInWithCustomToken with the fake UUID
        isTempUid = true;
        tempUidToDelete = resolvedFirebaseUid;
      }
    } catch (e: unknown) {
      const fbErr = e as { code?: string };
      if (fbErr.code === "auth/user-not-found") {
        isTempUid = true;
      } else {
        throw e;
      }
    }

    if (isTempUid) {
      const lookupEmail = email?.trim() ?? (
        await db.query("SELECT email FROM users WHERE firebase_uid = $1 LIMIT 1", [resolvedFirebaseUid])
      ).at(0)?.email;

      if (!lookupEmail) {
        return res.status(400).json({ message: "Cannot resolve email for UID" });
      }

      if (tempUidToDelete) {
        await admin.auth().deleteUser(tempUidToDelete).catch(() => {});
      }

      const newFirebaseUser = await admin.auth().createUser({ email: lookupEmail });
      const realUid = newFirebaseUser.uid;

      await db.query(
        "UPDATE users SET firebase_uid = $1 WHERE firebase_uid = $2",
        [realUid, resolvedFirebaseUid]
      );

      resolvedFirebaseUid = realUid;
    }

    const customToken = await admin.auth().createCustomToken(resolvedFirebaseUid);
    return res.status(200).json({ customToken });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// Check whether an email is already in use by a user in DB or Firebase Auth
usersRouter.post("/check-email", async (req, res) => {
  try {
    const rawEmail =
      typeof req.body?.email === "string"
        ? req.body.email
        : typeof req.query?.email === "string"
        ? req.query.email
        : "";
    const email = rawEmail.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    // 1. Check PostgreSQL users table
    const existingDbUser = await db.query(
      "SELECT id, role FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [email]
    );

    if (existingDbUser.length > 0) {
      return res.status(200).json({ exists: true, message: "Email is already registered" });
    }

    // 2. Check Firebase Auth
    try {
      const fbUser = await admin.auth().getUserByEmail(email);
      if (fbUser) {
        return res.status(200).json({ exists: true, message: "Email is already registered in auth" });
      }
    } catch (e: unknown) {
      const fbErr = e as { code?: string };
      if (fbErr.code === "auth/user-not-found") {
        // User not found in Firebase Auth; email is free to use
      } else {
        throw e;
      }
    }

    return res.status(200).json({ exists: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error checking email";
    return res.status(500).json({ message });
  }
});

// Get all users
usersRouter.get("/", verifyRole("staff"), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users ORDER BY id ASC`);

    res.status(200).json(await enrichUsersWithProfilePicture(keysToCamel(users)));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Presigned URL for profile picture upload (must be registered before /:firebaseUid)
usersRouter.get("/profile-picture/upload-url", async (req, res) => {
  try {
    const contentType =
      typeof req.query.contentType === "string" ? req.query.contentType : "";
    const requestedUid =
      typeof req.query.firebaseUid === "string" ? req.query.firebaseUid.trim() : "";
    const callerUid = res.locals.decodedToken?.uid;

    const targetUid = requestedUid || callerUid;
    if (!targetUid) {
      return res.status(400).json({ message: "firebaseUid is required" });
    }

    // Look up target user's role from database
    const targetRows = await db.query(
      "SELECT role FROM users WHERE firebase_uid = $1 LIMIT 1",
      [targetUid]
    );
    const targetDbRole = targetRows[0]?.role;
    // Server derives role: "admin" prefix ONLY for staff/supervisor users in DB
    const derivedRole = targetDbRole === "staff" || targetDbRole === "supervisor" ? "admin" : "volunteer";

    // Authorize caller if uploading for a different user
    if (requestedUid && callerUid && requestedUid !== callerUid) {
      const isStaff = await isStaffOrSupervisor(callerUid);
      if (!isStaff) {
        return res.status(403).json({ message: "Forbidden: Cannot upload profile picture for another user" });
      }
    }

    const { uploadUrl, key } = await getProfilePictureUploadURL(
      contentType,
      targetUid,
      derivedRole,
    );

    return res.status(200).json({ uploadUrl, key });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create upload URL";
    return res.status(400).json({ message });
  }
});

// Presigned URL for handbook PDF upload
usersRouter.get("/handbook/upload-url", async (req, res) => {
  try {
    const contentType =
      typeof req.query.contentType === "string" ? req.query.contentType : "application/pdf";
    const requestedUid =
      typeof req.query.firebaseUid === "string" ? req.query.firebaseUid.trim() : "";
    const callerUid = res.locals.decodedToken?.uid;

    const targetUid = requestedUid || callerUid;
    if (!targetUid) {
      return res.status(400).json({ message: "firebaseUid is required" });
    }

    // If uploading for another user, caller must be staff or supervisor
    if (requestedUid && callerUid && requestedUid !== callerUid) {
      const isStaff = await isStaffOrSupervisor(callerUid);
      if (!isStaff) {
        return res.status(403).json({ message: "Forbidden: Cannot upload handbook for another user" });
      }
    }

    const { uploadUrl, key } = await getHandbookUploadURL(
      contentType,
      targetUid,
    );

    return res.status(200).json({ uploadUrl, key });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create handbook upload URL";
    return res.status(400).json({ message });
  }
});

// Presigned URL for downloading the blank volunteer handbook template from S3
usersRouter.get("/handbook/template-url", async (_req, res) => {
  try {
    const exists = await checkS3ObjectExists("templates/handbook.pdf");
    if (!exists) {
      return res.status(404).json({ message: "Handbook template does not exist in S3" });
    }
    const downloadUrl = await getS3ViewURL("templates/handbook.pdf", 3600);
    return res.status(200).json({ downloadUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create template download URL";
    return res.status(400).json({ message });
  }
});

// Presigned URL for profile picture display
usersRouter.get("/profile-picture/view-url", async (req, res) => {
  try {
    const key = typeof req.query.key === "string" ? req.query.key.trim() : "";

    if (!key) {
      return res.status(400).json({ message: "key is required" });
    }

    const viewUrl = await getProfilePictureGetURL(key);
    return res.status(200).json({ viewUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create view URL";
    return res.status(400).json({ message });
  }
});

// Presigned URL for viewing or downloading any document (e.g. handbook PDF)
usersRouter.get("/document/view-url", async (req, res) => {
  try {
    const key = typeof req.query.key === "string" ? req.query.key.trim() : "";
    const download = typeof req.query.download === "string" ? req.query.download.trim() : undefined;

    if (!key) {
      return res.status(400).json({ message: "key is required" });
    }

    // Authorize access to documents:
    // templates/ and profiles/ are public for app usage
    const isPublicPrefix = key.startsWith("templates/") || key.startsWith("profiles/");
    const callerUid = await getCallerUid(req, res);

    if (!isPublicPrefix) {
      if (!callerUid) {
        return res.status(401).json({ message: "Authentication required to view private documents" });
      }

      const isOwner = key.startsWith(`handbooks/${callerUid}/`);
      if (!isOwner) {
        const isStaff = await isStaffOrSupervisor(callerUid);
        if (!isStaff) {
          return res.status(403).json({ message: "Forbidden: Not authorized to view this document" });
        }
      }
    }

    const viewUrl = await getS3ViewURL(key, 3600, download);
    return res.status(200).json({ viewUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create document view URL";
    return res.status(400).json({ message });
  }
});

// Delete a document from S3 (used during signup rollback or document replacement)
usersRouter.delete("/document", async (req, res) => {
  try {
    const key = typeof req.query.key === "string" ? req.query.key.trim() : "";
    const callerUid = await getCallerUid(req, res);

    if (!key) {
      return res.status(400).json({ message: "key is required" });
    }

    if (!callerUid) {
      return res.status(401).json({ message: "Authentication required to delete documents" });
    }

    const isOwner = key.startsWith(`handbooks/${callerUid}/`);
    if (!isOwner) {
      const isStaff = await isStaffOrSupervisor(callerUid);
      if (!isStaff) {
        return res.status(403).json({ message: "Forbidden: Not authorized to delete this document" });
      }
    }

    await deleteS3Object(key);
    return res.status(200).json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete document";
    return res.status(400).json({ message });
  }
});

// Get a user by ID
usersRouter.get("/:firebaseUid", verifyRole("volunteer"), async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const callerUid = res.locals.decodedToken?.uid;

    if (process.env.NODE_ENV === "production" && (!callerUid || callerUid !== firebaseUid)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await db.query("SELECT * FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    const enriched = await enrichUsersWithProfilePicture(keysToCamel(user));
    res.status(200).json(enriched);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a user by ID, both in Firebase and NPO DB (supervisors can delete any user; uncompleted volunteers can delete self during signup rollback)
usersRouter.delete("/:firebaseUid", verifyToken, async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const callerUid = res.locals.decodedToken?.uid;

    const userResult = await db.query(
      `SELECT u.role, v.form_completed
       FROM users u
       LEFT JOIN volunteers v ON u.id = v.id
       WHERE u.firebase_uid = $1`,
      [callerUid]
    );
    const callerRecord = userResult.at(0) as { role?: string; form_completed?: boolean } | undefined;
    const isSupervisor = callerRecord?.role === "supervisor";
    const isSelf = Boolean(callerUid && callerUid === firebaseUid);
    const isRollbackSelfDelete = isSelf && callerRecord?.form_completed !== true;

    if (!isSupervisor && !isRollbackSelfDelete) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Ignore only the expected auth/user-not-found case, propagate other Firebase errors
    try {
      await admin.auth().deleteUser(firebaseUid);
    } catch (fbErr: unknown) {
      const errWithCode = fbErr as { code?: string };
      if (errWithCode?.code !== "auth/user-not-found") {
        throw fbErr;
      }
    }

    const user = await db.query("DELETE FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create user
usersRouter.post("/create", async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;

    const user = await db.query(
      "INSERT INTO users (email, firebase_uid) VALUES ($1, $2) RETURNING *",
      [email, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a user by ID
usersRouter.put("/update", verifyToken, async (req, res) => {
  try {
    const { email, profilePictureKey } = req.body as {
      email?: string;
      profilePictureKey?: string | null;
    };

    // Use the authenticated user's UID from the verified token
    const firebaseUid = res.locals.decodedToken?.uid;
    if (!firebaseUid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }

    if (profilePictureKey !== undefined) {
      updates.push(`profile_picture_url = $${paramIndex++}`);
      values.push(profilePictureKey);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(firebaseUid);
    const user = await db.query(
      `UPDATE users SET ${updates.join(", ")} WHERE firebase_uid = $${paramIndex} RETURNING *`,
      values,
    );

    const enriched = await enrichUsersWithProfilePicture(keysToCamel(user));
    res.status(200).json(enriched);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all users (as admin)
usersRouter.get("/admin/all", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users`);

    res.status(200).json(await enrichUsersWithProfilePicture(keysToCamel(users)));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a user's password via Firebase Admin
usersRouter.put("/update-password", verifyRole("supervisor"), async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const users = await db.query(
      "SELECT firebase_uid FROM users WHERE email = $1",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firebaseUid } = keysToCamel(users[0]) as { firebaseUid: string };
    await admin.auth().updateUser(firebaseUid, { password: newPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a user's role
usersRouter.put("/update/set-role", verifyRole("supervisor"), async (req, res) => {
  try {
    const { role, firebaseUid } = req.body;

    const user = await db.query(
      "UPDATE users SET role = $1 WHERE firebase_uid = $2 RETURNING *",
      [role, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
