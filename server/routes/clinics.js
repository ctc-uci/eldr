import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const clinicsRouter = Router();

// Create a workshop
clinicsRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      start_time,
      end_time,
      date,
      attendees,
      min_attendees,
      capacity,
      max_target_roles,
      parking,
    } = req.body;
    const clinic = await db.query(
      `INSERT INTO clinics (name, description, location, start_time, end_time, date, attendees, min_attendees, capacity, max_target_roles, parking)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        name,
        description,
        location,
        start_time,
        end_time,
        date,
        attendees,
        min_attendees,
        capacity,
        max_target_roles,
        parking,
      ]
    );
    res.status(201).json(keysToCamel(clinic[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all workshops
clinicsRouter.get("/", async (req, res) => {
  try {
    const clinics = await db.query("SELECT * FROM clinics");
    res.status(200).json(keysToCamel(clinics));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get a single workshop
clinicsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const clinic = await db.query("SELECT * FROM clinics WHERE id = $1", [id]);
    if (clinic.length === 0) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json(keysToCamel(clinic[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Update a workshop
clinicsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      location,
      start_time,
      end_time,
      date,
      attendees,
      min_attendees,
      capacity,
      max_target_roles,
      parking,
    } = req.body;
    const clinic = await db.query(
      `UPDATE clinics SET name = $1, description = $2, location = $3, start_time = $4, end_time = $5, date = $6, attendees = $7, min_attendees = $8, capacity = $9, max_target_roles = $10, parking = $11
       WHERE id = $12 RETURNING *`,
      [
        name,
        description,
        location,
        start_time,
        end_time,
        date,
        attendees,
        min_attendees,
        capacity,
        max_target_roles,
        parking,
        id,
      ]
    );
    if (clinic.length === 0) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json(keysToCamel(clinic[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a workshop
clinicsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const clinic = await db.query(
      "DELETE FROM clinics WHERE id = $1 RETURNING *",
      [id]
    );
    if (clinic.length === 0) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json(keysToCamel(clinic[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Workshop Languages Routes
// Assign a language to a workshop
clinicsRouter.post("/:clinicId/languages", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { languageId, proficiency } = req.body;

    const result = await db.query(
      `INSERT INTO clinic_languages (clinic_id, language_id, proficiency)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [clinicId, languageId, proficiency]
    );

    res.status(201).json(keysToCamel(result[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Remove a language from a workshop
clinicsRouter.delete("/:clinicId/languages/:languageId", async (req, res) => {
  try {
    const { clinicId, languageId } = req.params;
    const result = await db.query(
      `DELETE FROM clinic_languages
       WHERE clinic_id = $1 AND language_id = $2
       RETURNING *`,
      [clinicId, languageId]
    );

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Language not assigned to this clinic" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// List all languages for a workshop
clinicsRouter.get("/:clinicId/languages", async (req, res) => {
  try {
    const { clinicId } = req.params;

    const languages = await db.query(
      `SELECT l.*, wl.proficiency
       FROM languages l
       JOIN clinic_languages wl ON wl.language_id = l.id
       WHERE wl.clinic_id = $1`,
      [clinicId]
    );

    res.status(200).json(keysToCamel(languages));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Workshop Attendance Routes
// WorkshopAttendance (Volunteer ↔ Workshop)
clinicsRouter.get("/:clinicId/attendees", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const data = await db.query(
      `
        SELECT 
            v.*
        FROM clinics c
        JOIN clinic_attendance wa ON wa.clinic_id = c.id
        JOIN volunteers v ON v.id = wa.volunteer_id
        WHERE c.id = $1;
        `,
      [clinicId]
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
        `,
      [volunteerId, clinicId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.delete("/:clinicId/attendees/:volunteerId", async (req, res) => {
  try {
    const { clinicId, volunteerId } = req.params;
    const data = await db.query(
      `
            DELETE FROM clinic_attendance
            WHERE clinic_id = $1 AND volunteer_id = $2
            RETURNING *
            `,
      [clinicId, volunteerId]
    );

    if (!data.length) {
      return res.status(404).send("Volunteer not found for this clinic");
    }

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Workshop Areas of Practice Routes
// POST: assign an area to a workshop
// /workshops/{workshopId}/areas-of-practice
clinicsRouter.post("/:clinicId/areas-of-practice", async (req, res) => {
  try {
    const { areaOfPracticeId } = req.body; // get JSON body
    const { clinicId } = req.params; // get URL parameters

    if (!areaOfPracticeId) {
      return res.status(400).json({ message: "Area of practice is required" });
    }

    const newRelationship = await db.query(
      "INSERT INTO clinic_areas_of_practice (clinic_id, area_of_practice_id) VALUES ($1, $2) RETURNING *",
      [clinicId, areaOfPracticeId]
    );

    res.status(200).json(keysToCamel(newRelationship));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE: remove an area from a workshop
// /workshops/{workshopId}/areas-of-practice/{areaId}
clinicsRouter.delete(
  "/:clinicId/areas-of-practice/:areaId",
  async (req, res) => {
    try {
      const { clinicId, areaId } = req.params;

      const deletedRelationship = await db.query(
        "DELETE FROM clinic_areas_of_practice WHERE clinic_id = $1 AND area_of_practice_id = $2 RETURNING *",
        [clinicId, areaId]
      );

      if (deletedRelationship.length === 0) {
        return res.status(404).json({ message: "Relationship not found" });
      }

      res.status(200).json(keysToCamel(deletedRelationship));
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// GET: list all areas for a clinic, including area IDs and text
// /clinics/{clinicId}/areas-of-practice
clinicsRouter.get("/:clinicId/areas-of-practice", async (req, res) => {
  try {
    const { clinicId } = req.params;

    const listAll = await db.query(
      `SELECT aop.id, aop.areas_of_practice
       FROM clinic_areas_of_practice caop
       JOIN areas_of_practice aop ON caop.area_of_practice_id = aop.id
       WHERE caop.clinic_id = $1`,
      [clinicId]
    );

    res.status(200).json(keysToCamel(listAll));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Clinic Roles Routes
// POST: assign a role to a clinic
// /clinics/{clinicId}/roles
clinicsRouter.post("/:clinicId/roles", async (req, res) => {
    try {
        const { roleId } = req.body; // get JSON body
        const { clinicId } = req.params; // get URL parameters

        if (!roleId){
            return res.status(400).json({ message: "Role ID is required" });
        }

        const newRelationship = await db.query(
            "INSERT INTO clinic_roles (clinic_id, role_id) VALUES ($1, $2) RETURNING *",
            [clinicId, roleId]
        );

        res.status(201).json(keysToCamel(newRelationship));
    } catch (err){
        res.status(500).send(err.message);
    }
});

// DELETE: remove a role from a clinic
// /clinics/{clinicId}/roles/{roleId}
clinicsRouter.delete("/:clinicId/roles/:roleId", async(req, res) => {
    try {
        const { clinicId, roleId } = req.params;

        const deletedRelationship = await db.query(
            "DELETE FROM clinic_roles WHERE clinic_id = $1 AND role_id = $2 RETURNING *",
            [clinicId, roleId]
        );

        if (deletedRelationship.length === 0) {
            return res.status(404).json({ message: "Role not assigned to this clinic" });
        }

        res.status(200).json(keysToCamel(deletedRelationship));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET: list all roles for a clinic, including role IDs and text
// /clinics/{clinicId}/roles
clinicsRouter.get("/:clinicId/roles", async (req, res) => {
    try {
        const { clinicId } = req.params;

        const listAll = await db.query(
            `SELECT r.id, r.role_name
             FROM clinic_roles cr
             JOIN roles r ON cr.role_id = r.id
             WHERE cr.clinic_id = $1`,
            [clinicId]
        );

        res.status(200).json(keysToCamel(listAll));
    } catch (err) {
        res.status(500).send(err.message);
    }
});