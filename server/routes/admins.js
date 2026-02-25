import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const adminsRouter = Router();

// GET /admins - get all admins
adminsRouter.get("/", async (req, res) => {
  try {
    const admins = await db.query("SELECT * FROM admins ORDER BY id ASC");
    res.status(200).json(keysToCamel(admins));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// GET /admins/id/:id - get admin by database ID
adminsRouter.get("/id/:id", async (req, res) => {
  try {
    const adminId = Number(req.params.id);
    if (!Number.isInteger(adminId)) {
      return res.status(400).send("Invalid admin id");
    }

    const admin = await db.query(
      "SELECT * FROM admins WHERE id = $1",
      [adminId]
    );

    if (!admin.length) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(keysToCamel(admin[0]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// POST /admins - create admin
adminsRouter.post("/create", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      calendarEmail,
      firebaseUid,
    } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).send("firebaseUid and email are required");
    }

    // Create or reuse a base user with admin role
    let userId;
    try {
      const userResult = await db.query(
        `INSERT INTO users (email, firebase_uid, role)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [email, firebaseUid, "admin"]
      );

      userId = userResult[0].id;
    } catch (err) {
      if (err.code === "23505") {
        const existingUser = await db.query(
          `
          SELECT id
          FROM users
          WHERE email = $1;
          `,
          [email]
        );

        if (!existingUser.length) {
          throw err;
        }

        userId = existingUser[0].id;
      } else {
        throw err;
      }
    }

    const admin = await db.query(
      `INSERT INTO admins 
        (id, first_name, last_name, email, calendar_email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, firstName, lastName, email, calendarEmail]
    );

    res.status(200).json(keysToCamel(admin));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT /admins/:id - update admin
adminsRouter.put("/:id", async (req, res) => {
  try {
    const adminId = Number(req.params.id);
    if (!Number.isInteger(adminId)) {
      return res.status(400).send("Invalid admin id");
    }

    const { firstName, lastName, email, calendarEmail } = req.body;

    const result = await db.query(
      `UPDATE admins
       SET first_name = $1,
           last_name = $2,
           email = $3,
           calendar_email = $4
       WHERE id = $5
       RETURNING *`,
      [firstName, lastName, email, calendarEmail, adminId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Admin not found");
    }

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE /admins/:id - delete admin
adminsRouter.delete("/:id", async (req, res) => {
  try {
    const adminId = Number(req.params.id);
    if (!Number.isInteger(adminId)) {
      return res.status(400).send("Invalid admin id");
    }

    const result = await db.query(
      `DELETE FROM admins
       WHERE id = $1
       RETURNING *`,
      [adminId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Admin not found");
    }

    res.status(200).json({
      message: "Admin deleted successfully",
      admin: keysToCamel(result),
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// TD NOTE: The below routes are probably not needed as firebase UID is never publicly exposed  

// GET /admins/:firebaseUid - get admin by Firebase UID
adminsRouter.get("/:firebaseUid", async (req, res) => {
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
adminsRouter.delete("/:firebaseUid", async (req, res) => {
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
