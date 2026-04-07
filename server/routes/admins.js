import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { admin } from "@/config/firebase";
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const adminsRouter = Router();

// POST /admins - create a new staff/supervisor
adminsRouter.post("/", verifyRole("supervisor"), async (req, res) => {
  let firebaseUid = null;
  try {
    const { firstName, lastName, email, phoneNumber, isSupervisor } = req.body;

    if (!email) return res.status(400).send("email is required");

    // Create Firebase Auth account with a temporary password
    const tempPassword = crypto.randomUUID().slice(0, 12) + "Aa1!";
    const firebaseUser = await admin.auth().createUser({
      email,
      password: tempPassword,
      displayName: `${firstName} ${lastName}`,
    });
    firebaseUid = firebaseUser.uid;

    let userId;
    try {
      const userResult = await db.query(
        `INSERT INTO users (email, firebase_uid, role) VALUES ($1, $2, $3) RETURNING *`,
        [email, firebaseUid, isSupervisor ? "supervisor" : "staff"]
      );
      userId = userResult[0].id;
    } catch (err) {
      if (err.code === "23505") {
        const existing = await db.query(`SELECT id FROM users WHERE email = $1`, [email]);
        if (!existing.length) throw err;
        userId = existing[0].id;
      } else {
        throw err;
      }
    }

    const existing = await db.query(`SELECT id FROM admins WHERE id = $1`, [userId]);
    if (existing.length) {
      return res.status(409).json({ message: "Admin already exists", admin: keysToCamel(existing[0]) });
    }

    const result = await db.query(
      `INSERT INTO admins (id, first_name, last_name, email, phone_number, is_supervisor)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, firstName, lastName, email, phoneNumber ?? null, isSupervisor ?? false]
    );

    res.status(201).json(keysToCamel(result[0]));
  } catch (err) {
    // Clean up Firebase user if DB insert failed
    if (firebaseUid) {
      await admin.auth().deleteUser(firebaseUid).catch(() => {});
    }
    res.status(500).send(err.message);
  }
});

// GET /admins - get all admins
adminsRouter.get("/", verifyRole("supervisor"), async (req, res) => {
  try {
    const admins = await db.query("SELECT * FROM admins ORDER BY id ASC");
    res.status(200).json(keysToCamel(admins));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// GET /admins/staff - get all active (non-archived) staff and supervisors
adminsRouter.get("/staff", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const staff = await db.query(
      `
        SELECT
          a.id,
          a.first_name,
          a.last_name,
          a.email,
          a.phone_number,
          a.start_date,
          CASE WHEN a.is_supervisor THEN 'Supervisor' ELSE 'Staff' END AS role
        FROM admins a
        WHERE NOT EXISTS (
          SELECT 1 FROM admin_archived aa WHERE aa.admin_id = a.id
        )
        ORDER BY a.last_name ASC, a.first_name ASC;
      `
    );
    res.status(200).json(keysToCamel(staff));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// GET /admins/archived - get all archived staff
adminsRouter.get("/archived", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const archived = await db.query(
      `
        SELECT
          a.id,
          a.first_name,
          a.last_name,
          a.email,
          CASE WHEN a.is_supervisor THEN 'Supervisor' ELSE 'Staff' END AS role,
          aa.archived_date,
          aa.reactivation,
          aa.archived_notes
        FROM admins a
        JOIN admin_archived aa ON aa.admin_id = a.id
        ORDER BY aa.archived_date DESC;
      `
    );
    res.status(200).json(keysToCamel(archived));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// PATCH /admins/:id/archive - archive a staff member
adminsRouter.patch("/:id/archive", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { reactivation, notes } = req.body;

    const result = await db.query(
      `
        INSERT INTO admin_archived (admin_id, reactivation, archived_notes)
        VALUES ($1, $2, $3)
        ON CONFLICT (admin_id) DO UPDATE
          SET archived_date  = NOW(),
              reactivation   = EXCLUDED.reactivation,
              archived_notes = EXCLUDED.archived_notes
        RETURNING *;
      `,
      [id, reactivation ?? null, notes ?? null]
    );

    res.status(200).json(keysToCamel(result[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// PATCH /admins/:id/unarchive - unarchive a staff member
adminsRouter.patch("/:id/unarchive", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
        DELETE FROM admin_archived
        WHERE admin_id = $1
        RETURNING *;
      `,
      [id]
    );

    if (!result.length) {
      return res.status(404).json({ message: "Staff member not found in archived list" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// GET /admins/id/:id - get admin by database ID
adminsRouter.get("/id/:id", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const adminId = Number(req.params.id);
    if (!Number.isInteger(adminId)) {
      return res.status(400).send("Invalid staff profile id");
    }

    const admin = await db.query(
      "SELECT * FROM admins WHERE id = $1",
      [adminId]
    );

    if (!admin.length) {
      return res.status(404).json({ error: "Staff profile not found" });
    }

    res.status(200).json(keysToCamel(admin[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// POST /admins - create admin
adminsRouter.post("/create", verifyRole("supervisor"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      calendarEmail,
      firebaseUid,
      isSupervisor,
    } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).send("firebaseUid and email are required");
    }

    const role = isSupervisor ? "supervisor" : "staff";
    const admin = await db.tx(async t => {
      // Upsert the base user record atomically, setting role to staff or supervisor.
      const userResult = await t.query(
        `INSERT INTO users (email, firebase_uid, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET role = $3
         RETURNING id`,
        [email, firebaseUid, role]
      );

      if (!userResult.length) {
        throw new Error("Failed to create or find user");
      }

      return t.query(
        `INSERT INTO admins
          (id, first_name, last_name, email, calendar_email, is_supervisor)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userResult[0].id, firstName, lastName, email, calendarEmail, !!isSupervisor]
      );
    });

    res.status(200).json(keysToCamel(admin));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT /admins/:id - update admin
adminsRouter.put("/:id", verifyRole("supervisor"), async (req, res) => {
  try {
    const adminId = Number(req.params.id);
    if (!Number.isInteger(adminId)) {
      return res.status(400).send("Invalid staff profile id");
    }

    const { firstName, lastName, email, calendarEmail, isSupervisor, startDate } = req.body;

    const result = await db.query(
      `UPDATE admins
       SET first_name = $1,
           last_name = $2,
           email = $3,
           calendar_email = $4,
           is_supervisor = COALESCE($5, is_supervisor),
           start_date = COALESCE($7, start_date)
       WHERE id = $6
       RETURNING *`,
      [firstName, lastName, email, calendarEmail, isSupervisor, adminId, startDate || null]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Staff profile not found");
    }

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE /admins/:id - delete admin
adminsRouter.delete("/:id", verifyRole("supervisor"), async (req, res) => {
  try {
    const adminId = Number(req.params.id);
    if (!Number.isInteger(adminId)) {
      return res.status(400).send("Invalid staff profile id");
    }

    const userRow = await db.query(`SELECT firebase_uid FROM users WHERE id = $1`, [adminId]);

    const result = await db.query(
      `DELETE FROM admins WHERE id = $1 RETURNING *`,
      [adminId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Staff profile not found");
    }

    await db.query(`DELETE FROM users WHERE id = $1`, [adminId]);

    if (userRow.length && userRow[0].firebase_uid) {
      await admin.auth().deleteUser(userRow[0].firebase_uid).catch(() => {});
    }

    res.status(200).json({ message: "Staff profile deleted successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// TD NOTE: The below routes are probably not needed as firebase UID is never publicly exposed  

// GET /admins/:firebaseUid - get admin by Firebase UID
adminsRouter.get("/:firebaseUid", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const admin = await db.query(
      "SELECT * FROM admins WHERE firebase_uid = $1",
      [firebaseUid]
    );

    res.status(200).json(keysToCamel(admin));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// DELETE /admins - delete admin by Firebase UID
adminsRouter.delete("/:firebaseUid", verifyRole("supervisor"), async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const admin = await db.query(
      "DELETE FROM admins WHERE firebase_uid = $1 RETURNING *",
      [firebaseUid]
    );

    res.status(200).json(keysToCamel(admin));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
