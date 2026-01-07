import { keysToCamel } from "@/common/utils";
import express from "express";
import { db } from "@/db/db-pgp";

const clinicsRouter = express.Router();
clinicsRouter.use(express.json());

// ClinicTable
clinicsRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      time,
      date,
      experienceLevel,
      parking
    } = req.body
    
    const data = await db.query(
      `
      INSERT INTO clinics(name, description, location, time, date, experience_level, parking)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `, [name, description, location, time, date, experienceLevel, parking]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(
      `
      SELECT *
      FROM clinics
      ORDER BY date, time;
      `
    )

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(
      `
      SELECT *
      FROM clinics
      WHERE id = $1;
      `, [id]
    )

    if (data.length === 0) {
      return res.status(404).send("Clinic not found")
    }

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      location,
      time,
      date,
      experienceLevel,
      parking
    } = req.body;

    const data = await db.query(
      `
      UPDATE clinics
      SET name = $1, description = $2, location = $3, time = $4, date = $5, experience_level = $6, parking = $7
      WHERE id = $8
      RETURNING *;
      `, [name, description, location, time, date, experienceLevel, parking, id]
    )

    if (data.length === 0) {
      return res.status(404).send("Clinic not found")
    }

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(
      `
      DELETE FROM clinics WHERE id = $1
      RETURNING *;
      `, [id]
    )

    if (data.length === 0) {
      return res.status(404).send("Clinic not found")
    }

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ClinicAttendance (Volunteer ↔ Clinic)
clinicsRouter.get("/:clinicId/attendees", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const data = await db.query(
        `
        SELECT 
            v.*
        FROM clinics c
        JOIN clinic_attendance ca ON ca.clinic_id = c.id
        JOIN volunteers v ON v.id = ca.volunteer_id
        WHERE c.id = $1;
        `, [clinicId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.post("/:clinicId/attendees", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { volunteerId } = req.body;
    const data = await db.query(
        `
        INSERT INTO clinic_attendance (volunteer_id, clinic_id)
        VALUES ($1, $2)
        RETURNING *;
        `, [volunteerId, clinicId]
    )

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.delete("/:clinicId/attendees/:volunteerId", async (req, res) => {
    try{
        const { clinicId, volunteerId } = req.params;
        const data = await db.query(
            `
            DELETE FROM clinic_attendance
            WHERE clinic_id = $1 AND volunteer_id = $2
            RETURNING *
            `, [clinicId, volunteerId]
        )

        if (!data.length) {
          return res.status(404).send("Volunteer not found for this clinic")
        }

        res.status(200).json(keysToCamel(data));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export { clinicsRouter };
