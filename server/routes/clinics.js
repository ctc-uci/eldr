import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const clinicsRouter = Router();

const allowedLocationTypes = ["in-person", "hybrid", "online"];
const allowedClinicTypes = [
  "Estate Planning",
  "Limited Conservatorship",
  "Probate Note Clearing",
];

// Create a workshop
clinicsRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      start_time,
      end_time,
      date,
      min_attendees,
      capacity,
      max_target_roles,
      parking,
      address,
      city,
      state,
      zip,
      meeting_link,
      location_type,
      type,
    } = req.body;

    if (location_type && !allowedLocationTypes.includes(location_type)) {
      return res.status(400).json({
        message: "Invalid location_type. Must be 'in-person', 'hybrid', or 'online'.",
      });
    }

    if (type && !allowedClinicTypes.includes(type)) {
      return res.status(400).json({
        message:
          "Invalid type. Must be 'Estate Planning', 'Limited Conservatorship', or 'Probate Note Clearing'.",
      });
    }

    const clinic = await db.query(
      `INSERT INTO clinics (name, description, start_time, end_time, date, min_attendees, capacity, max_target_roles, parking, address, city, state, zip, meeting_link, location_type, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        name,
        description,
        start_time,
        end_time,
        date,
        min_attendees,
        capacity,
        max_target_roles,
        parking,
        address,
        city,
        state,
        zip,
        meeting_link,
        location_type,
        type,
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



// GET: list all clinics based on filters (type, language, location, occupation)
// type - clinics areas of practice / areas of practice table
// language - clinic languages / languages table
// location - clinics.location_type enum (in-person, hybrid, online)
// occupation - clinic roles / roles table
// /clinics/search?areaOfPracticeIds=1,2,3&languageIds=1,2&locations=in-person,online&roleIds=1,2
clinicsRouter.get("/search", async (req, res) => {
  try {
    const { areaOfPracticeIds, languageIds, locations, roleIds } = req.query;

    // parse comma-separated strings into arrays for proper SQL querying
    const areaIdsArr = areaOfPracticeIds ? areaOfPracticeIds.split(",").map(Number) : null;
    const languageIdsArr = languageIds ? languageIds.split(",").map(Number) : null;
    const locationsRaw = locations ? locations.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const invalidLocations = locationsRaw.filter((t) => !allowedLocationTypes.includes(t));
    if (invalidLocations.length > 0) {
      return res.status(400).json({
        message: "Invalid locations. Each value must be exactly: in-person, hybrid, or online.",
      });
    }
    const locationsArr = locationsRaw.length > 0 ? [...new Set(locationsRaw)] : null;
    const roleIdsArr = roleIds ? roleIds.split(",").map(Number) : null;

    // IS NULL - if no filters provided for a category, ignore that category in filtering
    // EXISTS with subquery - check if clinic has at least one of the selected options for that category
    const clinics = await db.query(
      `SELECT * FROM clinics C
        WHERE ($1::int[] IS NULL OR EXISTS (
          SELECT 1 FROM clinic_areas_of_practice CAP
          WHERE CAP.clinic_id = C.id AND CAP.area_of_practice_id = ANY($1::int[])
        ))
        AND ($2::int[] IS NULL OR EXISTS (
          SELECT 1 FROM clinic_languages CL
          WHERE CL.clinic_id = C.id AND CL.language_id = ANY($2::int[])
        ))
        AND ($3::text[] IS NULL OR C.location_type::text = ANY($3::text[]))
        AND ($4::int[] IS NULL OR EXISTS (
          SELECT 1 FROM clinic_roles CR
          WHERE CR.clinic_id = C.id AND CR.role_id = ANY($4::int[])
      ))`,
      [
        areaIdsArr,
        languageIdsArr,
        locationsArr,
        roleIdsArr,
      ]
    );
    res.status(200).json(keysToCamel(clinics));
  } catch (err) {
    res.status(500).send(err.message);
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
      start_time,
      end_time,
      date,
      min_attendees,
      capacity,
      max_target_roles,
      parking,
      address,
      city,
      state,
      zip,
      meeting_link,
      location_type,
      type,
    } = req.body;

    if (location_type && !allowedLocationTypes.includes(location_type)) {
      return res.status(400).json({
        message: "Invalid location_type. Must be 'in-person', 'hybrid', or 'online'.",
      });
    }

    if (type && !allowedClinicTypes.includes(type)) {
      return res.status(400).json({
        message:
          "Invalid type. Must be 'Estate Planning', 'Limited Conservatorship', or 'Probate Note Clearing'.",
      });
    }

    const clinic = await db.query(
      `UPDATE clinics SET
        name = $1,
        description = $2,
        start_time = $3,
        end_time = $4,
        date = $5,
        min_attendees = $6,
        capacity = $7,
        max_target_roles = $8,
        parking = $9,
        address = $10,
        city = $11,
        state = $12,
        zip = $13,
        meeting_link = $14,
        location_type = $15,
        type = $16
       WHERE id = $17 RETURNING *`,
      [
        name,
        description,
        start_time,
        end_time,
        date,
        min_attendees,
        capacity,
        max_target_roles,
        parking,
        address,
        city,
        state,
        zip,
        meeting_link,
        location_type,
        type,
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

// Workshop Registration Routes
clinicsRouter.get("/:clinicId/registrations", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const data = await db.query(
      `
        SELECT 
            v.*, cr.has_attended
        FROM clinics c
        JOIN clinic_registration cr ON cr.clinic_id = c.id
        JOIN volunteers v ON v.id = cr.volunteer_id
        WHERE c.id = $1;
        `,
      [clinicId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.post("/:clinicId/registrations", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { volunteerId } = req.body;
      const data = await db.query(
      `
        INSERT INTO clinic_registration (volunteer_id, clinic_id, has_attended)
        VALUES ($1, $2, false)
        RETURNING *;
        `,
      [volunteerId, clinicId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.delete(
  "/:clinicId/registrations/:volunteerId",
  async (req, res) => {
    try {
      const { clinicId, volunteerId } = req.params;
      const data = await db.query(
        `
            DELETE FROM clinic_registration
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
  }
);

clinicsRouter.patch(
  "/:clinicId/registrations/:volunteerId/attendance",
  async (req, res) => {
    try {
      const { clinicId, volunteerId } = req.params;
      const { hasAttended } = req.body; // Expecting boolean true/false

      const data = await db.query(
        `
        UPDATE clinic_registration
        SET has_attended = $1
        WHERE clinic_id = $2 AND volunteer_id = $3
        RETURNING *;
        `,
        [hasAttended, clinicId, volunteerId]
      );

      if (!data.length) {
        return res.status(404).send("Registration record not found");
      }

      res.status(200).json(keysToCamel(data[0]));
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

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

    if (!roleId) {
      return res.status(400).json({ message: "Role ID is required" });
    }

    const newRelationship = await db.query(
      "INSERT INTO clinic_roles (clinic_id, role_id) VALUES ($1, $2) RETURNING *",
      [clinicId, roleId]
    );

    res.status(201).json(keysToCamel(newRelationship));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE: remove a role from a clinic
// /clinics/{clinicId}/roles/{roleId}
clinicsRouter.delete("/:clinicId/roles/:roleId", async (req, res) => {
  try {
    const { clinicId, roleId } = req.params;

    const deletedRelationship = await db.query(
      "DELETE FROM clinic_roles WHERE clinic_id = $1 AND role_id = $2 RETURNING *",
      [clinicId, roleId]
    );

    if (deletedRelationship.length === 0) {
      return res
        .status(404)
        .json({ message: "Role not assigned to this clinic" });
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

// Clinic Tags Routes
// POST: assign a tag to a clinic
// /clinics/{clinicId}/tags
clinicsRouter.post("/:clinicId/tags", async (req, res) => {
  try {
    const { tagId } = req.body; // get JSON body
    const { clinicId } = req.params; // get URL parameters

    if (!tagId) {
      return res.status(400).json({ message: "Tag ID is required" });
    }

    const newRelationship = await db.query(
      "INSERT INTO clinic_tags (clinic_id, tag_id) VALUES ($1, $2) RETURNING *",
      [clinicId, tagId]
    );

    res.status(201).json(keysToCamel(newRelationship));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE: remove a tag from a clinic
// /clinics/{clinicId}/tags/{tagId}
clinicsRouter.delete("/:clinicId/tags/:tagId", async (req, res) => {
  try {
    const { clinicId, tagId } = req.params;

    const deletedRelationship = await db.query(
      "DELETE FROM clinic_tags WHERE clinic_id = $1 AND tag_id = $2 RETURNING *",
      [clinicId, tagId]
    );

    if (deletedRelationship.length === 0) {
      return res
        .status(404)
        .json({ message: "Tag not assigned to this clinic" });
    }

    res.status(200).json(keysToCamel(deletedRelationship));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET: list all tags for a clinic, including tag IDs and text
// /clinics/{clinicId}/tags
clinicsRouter.get("/:clinicId/tags", async (req, res) => {
  try {
    const { clinicId } = req.params;

    const listAll = await db.query(
      `SELECT t.id, t.tag FROM clinic_tags ct
       JOIN tags t ON ct.tag_id = t.id
       WHERE ct.clinic_id = $1`,
      [clinicId]
    );

    res.status(200).json(keysToCamel(listAll));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
