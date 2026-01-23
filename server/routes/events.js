import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";
import { Router } from "express";

export const eventsRouter = Router();

// Create a workshop
eventsRouter.post("/", async (req, res) => {
  try {
    const { name, description, location, time, date, attendees, experience_level, parking } = req.body;
    const event = await db.query(
      `INSERT INTO events (name, description, location, time, date, attendees, experience_level, parking) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, description, location, time, date, attendees, experience_level, parking]
    );
    res.status(201).json(keysToCamel(event[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all workshops
eventsRouter.get('/', async (req, res) => {
  try {
    const events = await db.query("SELECT * FROM events");
    res.status(200).json(keysToCamel(events));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get a single workshop
eventsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.query("SELECT * FROM events WHERE id = $1", [id]);
    if (event.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(keysToCamel(event[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Update a workshop
eventsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, time, date, attendees, language, experience_level, parking } = req.body;
    const event = await db.query(
      `UPDATE events SET name = $1, description = $2, location = $3, time = $4, date = $5, attendees = $6, language = $7, experience_level = $8, parking = $9 
       WHERE id = $10 RETURNING *`,
      [name, description, location, time, date, attendees, language, experience_level, parking, id]
    );
    if (event.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(keysToCamel(event[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a workshop
eventsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);
    if (event.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(keysToCamel(event[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Workshop Languages Routes
// Assign a language to a workshop
eventsRouter.post('/:eventId/languages', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { languageId, proficiency } = req.body;

    const result = await db.query(
      `INSERT INTO event_languages (event_id, language_id, proficiency)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [eventId, languageId, proficiency]
    );

    res.status(201).json(keysToCamel(result[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Remove a language from a workshop
eventsRouter.delete('/:eventId/languages/:languageId', async (req, res) => {
  try {
    const { eventId, languageId } = req.params;
    const result = await db.query(
      `DELETE FROM event_languages
       WHERE event_id = $1 AND language_id = $2
       RETURNING *`,
      [eventId, languageId]
    );

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Language not assigned to this event" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// List all languages for a workshop
eventsRouter.get('/:eventId/languages', async (req, res) => {
  try {
    const { eventId } = req.params;

    const languages = await db.query(
      `SELECT l.*, wl.proficiency
       FROM languages l
       JOIN event_languages wl ON wl.language_id = l.id
       WHERE wl.event_id = $1`,
      [eventId]
    );

    res.status(200).json(keysToCamel(languages));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Workshop Attendance Routes
// WorkshopAttendance (Volunteer ↔ Workshop)
eventsRouter.get("/:eventId/attendees", async (req, res) => {
  try {
    const { eventId } = req.params;
    const data = await db.query(
        `
        SELECT 
            v.*
        FROM events e
        JOIN event_attendance wa ON wa.event_id = e.id
        JOIN volunteers v ON v.id = wa.volunteer_id
        WHERE e.id = $1;
        `, [eventId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.post("/:eventId/attendees", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { volunteerId } = req.body;
    const data = await db.query(
        `
        INSERT INTO event_attendance (volunteer_id, event_id)
        VALUES ($1, $2)
        RETURNING *;
        `, [volunteerId, eventId]
    )

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.delete("/:eventId/attendees/:volunteerId", async (req, res) => {
    try {
        const { eventId, volunteerId } = req.params;
        const data = await db.query(
            `
            DELETE FROM event_attendance
            WHERE event_id = $1 AND volunteer_id = $2
            RETURNING *
            `, [eventId, volunteerId]
        )

        if (!data.length) {
          return res.status(404).send("Volunteer not found for this event")
        }

        res.status(200).json(keysToCamel(data));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Workshop Areas of Interest Routes
// POST: assign an area to a workshop
// /workshops/{workshopId}/areas-of-interest
eventsRouter.post("/:eventId/areas-of-interest", async (req, res) => {
    try {
        const {areaOfInterestID} = req.body; // get JSON body
        const { eventId } = req.params; // get URL parameters

        if (!areaOfInterestID){
            return res.status(400).json({ message: "Area of interest is required" });
        }

        const newRelationship = await db.query(
            "INSERT INTO event_areas_of_interest (event_id, area_of_interest_id) VALUES ($1, $2) RETURNING *",
            [eventId, areaOfInterestID]
        );

        res.status(200).json(keysToCamel(newRelationship));
    } catch (err){
        res.status(500).send(err.message);
    }
});

// DELETE: remove an area from a workshop
// /workshops/{workshopId}/areas-of-interest/{areaId}
eventsRouter.delete("/:eventId/areas-of-interest/:areaId", async(req, res) => {
    try {
        const { eventId, areaId } = req.params;

        const deletedRelationship = await db.query(
            "DELETE FROM event_areas_of_interest WHERE event_id = $1 AND area_of_interest_id = $2 RETURNING *",
            [eventId, areaId]
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
eventsRouter.get("/:eventId/areas-of-interest", async(req, res) => {
    try {
        const { eventId } = req.params;

        const listAll = await db.query(
            "SELECT * FROM event_areas_of_interest WHERE event_id = $1", [eventId]
        );

        res.status(200).json(keysToCamel(listAll));
    } catch (err) {
        res.status(500).send(err.message);
    }
});
