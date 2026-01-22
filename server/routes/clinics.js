import { keysToCamel } from "@/common/utils";
import express from "express";
import { db } from "@/db/db-pgp";

export const clinicsRouter = express.Router();

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

// GET: list all areas for a clinic
// {port}/clinics/{clinicId}/areas-of-interest
clinicsRouter.get("/:id/areas-of-interest", async (req, res) => {
    try {
        const { id } = req.params;
        const areasOfInterest = await db.query("SELECT * FROM clinic_areas_of_interest WHERE clinic_id = $1", [id]);

        res.status(200).json(keysToCamel(areasOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: assign an area to a clinic
// {port}/clinics/{clinicId}/areas-of-interest
clinicsRouter.post("/:id/areas-of-interest", async (req, res) => {
    try {
        const { id } = req.params;
        const { areaOfInterestId } = req.body;

        // make sure area of interest id is not null or empty
        if (!areaOfInterestId) {
            return res.status(400).json({ message: "Area of interest id is required" });
        }

        const areaOfInterest = await db.query(
            "INSERT INTO clinic_areas_of_interest (clinic_id, area_of_interest_id) VALUES ($1, $2) RETURNING *",
            [id, areaOfInterestId]
        );

        // check to see if area of interest was created and returned
        if (areaOfInterest.length === 0) {
            return res.status(404).json({ message: "Area of interest not created" });
        }

        res.status(200).json(keysToCamel(areaOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: remove an area from a clinic
// {port}/clinics/{clinicId}/areas-of-interest/{areaId}
clinicsRouter.delete("/:id/areas-of-interest/:areaId", async (req, res) => {
    try {
        const { id, areaId } = req.params;
        const deletedArea = await db.query(
            "DELETE FROM clinic_areas_of_interest WHERE clinic_id = $1 AND area_of_interest_id = $2 RETURNING *",
            [id, areaId]
        );

        // check to see if area was deleted and returned
        if (deletedArea.length === 0) {
            return res.status(404).json({ message: "Area of interest not found" });
        }

        res.status(200).json(keysToCamel(deletedArea));
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// Assign a language to a clinic
clinicsRouter.post("/:clinicId/languages", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { languageId } = req.body;

    const clinicLanguage = await db.query(
      "INSERT INTO clinic_languages (clinic_id, language_id) VALUES ($1, $2) RETURNING *",
      [clinicId, languageId]
    );

    res.status(201).json(keysToCamel(clinicLanguage));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a language from a clinic
clinicsRouter.delete("/:clinicId/languages/:languageId", async (req, res) => {
  try {
    const { clinicId, languageId } = req.params;

    await db.query(
      "DELETE FROM clinic_languages WHERE clinic_id = $1 AND language_id = $2",
      [clinicId, languageId]
    );

    res.status(200).send(`Language ${languageId} deleted from clinic ${clinicId} successfully`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all languages for a clinic
clinicsRouter.get("/:clinicId/languages", async (req, res) => {
  try {
    const { clinicId } = req.params;

    const clinicLanguages = await db.query(
      "SELECT * FROM clinic_languages WHERE clinic_id = $1",
      [clinicId]
    );

    res.status(200).json(keysToCamel(clinicLanguages));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
