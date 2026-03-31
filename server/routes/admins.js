import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const adminsRouter = Router();

// GET /admins - get all admins
adminsRouter.get("/", verifyRole("supervisor"), async (req, res) => {
  try {
    const admins = await db.query("SELECT * FROM admins ORDER BY id ASC");
    res.status(200).json(keysToCamel(admins));
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

    const { firstName, lastName, email, calendarEmail, isSupervisor } = req.body;

    const result = await db.query(
      `UPDATE admins
       SET first_name = $1,
           last_name = $2,
           email = $3,
           calendar_email = $4,
           is_supervisor = COALESCE($5, is_supervisor)
       WHERE id = $6
       RETURNING *`,
      [firstName, lastName, email, calendarEmail, isSupervisor, adminId]
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

    const result = await db.query(
      `DELETE FROM admins
       WHERE id = $1
       RETURNING *`,
      [adminId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Staff profile not found");
    }

    res.status(200).json({
      message: "Staff profile deleted successfully",
      admin: keysToCamel(result),
    });
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
