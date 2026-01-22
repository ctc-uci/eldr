import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";
import { Router } from "express";

export const workshopsRouter = Router();

// Create a workshop
workshopsRouter.post("/", async (req, res) => {
  try {
    const { name, description, location, time, date, attendees, experience_level, parking } = req.body;
    const workshop = await db.query(
      `INSERT INTO workshops (name, description, location, time, date, attendees, experience_level, parking) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, description, location, time, date, attendees, experience_level, parking]
    );
    res.status(201).json(keysToCamel(workshop[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all workshops
workshopsRouter.get('/', async (req, res) => {
  try {
    const workshops = await db.query("SELECT * FROM workshops");
    res.status(200).json(keysToCamel(workshops));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get a single workshop
workshopsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await db.query("SELECT * FROM workshops WHERE id = $1", [id]);
    if (workshop.length === 0) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    res.status(200).json(keysToCamel(workshop[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Update a workshop
workshopsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, time, date, attendees, language, experience_level, parking } = req.body;
    const workshop = await db.query(
      `UPDATE workshops SET name = $1, description = $2, location = $3, time = $4, date = $5, attendees = $6, language = $7, experience_level = $8, parking = $9 
       WHERE id = $10 RETURNING *`,
      [name, description, location, time, date, attendees, language, experience_level, parking, id]
    );
    if (workshop.length === 0) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    res.status(200).json(keysToCamel(workshop[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a workshop
workshopsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await db.query("DELETE FROM workshops WHERE id = $1 RETURNING *", [id]);
    if (workshop.length === 0) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    res.status(200).json(keysToCamel(workshop[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Workshop Languages Routes
// Assign a language to a workshop
workshopsRouter.post('/:workshopId/languages', async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { languageId, proficiency } = req.body;

    const result = await db.query(
      `INSERT INTO workshop_languages (workshop_id, language_id, proficiency)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [workshopId, languageId, proficiency]
    );

    res.status(201).json(keysToCamel(result[0]));
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({ message: "Language already assigned to this workshop" });
    }
    res.status(500).send(err.message);
  }
});

// Remove a language from a workshop
workshopsRouter.delete('/:workshopId/languages/:languageId', async (req, res) => {
  try {
    const { workshopId, languageId, proficiency } = req.params;
    const result = await db.query(
      `DELETE FROM workshop_languages
       WHERE workshop_id = $1 AND language_id = $2 AND proficiency = $3
       RETURNING *`, [workshopId, languageId, proficiency]
    );
    res.status(200).json(keysToCamel(result[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// List all languages for a workshop
workshopsRouter.get('/:workshopId/languages', async (req, res) => {
  try {
    const { workshopId } = req.params;

    const languages = await db.query(
      `SELECT l.*
       FROM languages l
       JOIN workshop_languages wl ON wl.language_id = l.id
       WHERE wl.workshop_id = $1`,
      [workshopId]
    );

    res.status(200).json(keysToCamel(languages));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Workshop Attendance Routes
// WorkshopAttendance (Volunteer ↔ Workshop)
workshopsRouter.get("/:workshopId/attendees", async (req, res) => {
  try {
    const { workshopId } = req.params;
    const data = await db.query(
        `
        SELECT 
            v.*
        FROM workshops w
        JOIN workshop_attendance wa ON wa.workshop_id = w.id
        JOIN volunteers v ON v.id = wa.volunteer_id
        WHERE w.id = $1;
        `, [workshopId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

workshopsRouter.post("/:workshopId/attendees", async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { volunteerId } = req.body;
    const data = await db.query(
        `
        INSERT INTO workshop_attendance (volunteer_id, workshop_id)
        VALUES ($1, $2)
        RETURNING *;
        `, [volunteerId, workshopId]
    )

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

workshopsRouter.delete("/:workshopId/attendees/:volunteerId", async (req, res) => {
    try {
        const { workshopId, volunteerId } = req.params;
        const data = await db.query(
            `
            DELETE FROM workshop_attendance
            WHERE workshop_id = $1 AND volunteer_id = $2
            RETURNING *
            `, [workshopId, volunteerId]
        )

        if (!data.length) {
          return res.status(404).send("Volunteer not found for this workshop")
        }

        res.status(200).json(keysToCamel(data));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Workshop Areas of Interest Routes
// POST: assign an area to a workshop
// /workshops/{workshopId}/areas-of-interest
workshopsRouter.post("/:workshopId/areas-of-interest", async (req, res) => {
    try {
        const {areaOfInterestID} = req.body; // get JSON body
        const { workshopId } = req.params; // get URL parameters

        if (!areaOfInterestID){
            return res.status(400).json({ message: "Area of interest is required" });
        }

        const newRelationship = await db.query(
            "INSERT INTO workshop_areas_of_interest (workshop_id, area_of_interest_id) VALUES ($1, $2) RETURNING *",
            [workshopId, areaOfInterestID]
        );

        res.status(200).json(keysToCamel(newRelationship));
    } catch (err){
        res.status(500).send(err.message);
    }
});

// DELETE: remove an area from a workshop
// /workshops/{workshopId}/areas-of-interest/{areaId}
workshopsRouter.delete("/:workshopId/areas-of-interest/:areaId", async(req, res) => {
    try {
        const { workshopId, areaId } = req.params;

        const deletedRelationship = await db.query(
            "DELETE FROM workshop_areas_of_interest WHERE workshop_id = $1 AND area_of_interest_id = $2 RETURNING *",
            [workshopId, areaId]
        );

        if (deletedRelationship.length === 0) {
            return res.status(404).json({ message: "Relationship not found" });
        }

        res.status(200).json(keysToCamel(deletedRelationship));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET: list all areas for a workshop
// /workshops/{workshopId}/areas-of-interest
workshopsRouter.get("/:workshopId/areas-of-interest", async(req, res) => {
    try {
        const { workshopId } = req.params;

        const listAll = await db.query(
            "SELECT * FROM workshop_areas_of_interest WHERE workshop_id = $1", [workshopId]
        );

        res.status(200).json(keysToCamel(listAll));
    } catch (err) {
        res.status(500).send(err.message);
    }
});
