import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { verifyRole } from "@/middleware";
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

// POST /admins - create admin
adminsRouter.post("/create", verifyRole("admin"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      calendarEmail,
      firebaseUid,
    } = req.body;

    const admin = await db.query(
      `INSERT INTO admins 
        (first_name, last_name, email, calendar_email, firebase_uid)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [firstName, lastName, email, calendarEmail, firebaseUid]
    );

    res.status(200).json(keysToCamel(admin));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT /admin - update all admins
adminsRouter.put("/update", verifyRole("admin"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      calendarEmail,
      firebaseUid,
    } = req.body;

    const admin = await db.query(
      `UPDATE admins
       SET first_name = $1,
           last_name = $2,
           email = $3,
           calendar_email = $4
       WHERE firebase_uid = $5
       RETURNING *`,
      [firstName, lastName, email, calendarEmail, firebaseUid]
    );

    res.status(200).json(keysToCamel(admin));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// GET - all admins (admin-only)
adminsRouter.get("/admin/all", verifyRole("admin"), async (req, res) => {
  try {
    const admins = await db.query(`SELECT * FROM admins`);

    res.status(200).json(keysToCamel(admins));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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




