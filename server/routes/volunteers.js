import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const volunteersRouter = Router();

// Create a new volunteer
volunteersRouter.post("/", async (req, res) => {
  try {
    const {
      firebaseUid,
      first_name,
      last_name,
      email,
      phone_number,
      form_completed,
      form_link,
      is_signed_confidentiality,
      is_attorney,
      is_notary,
    } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).send("firebaseUid and email are required");
    }

    // Create the base user first
    let userId;
    try {
      const userResult = await db.query(
        `
          INSERT INTO users (email, firebase_uid)
          VALUES ($1, $2)
          RETURNING *;
        `,
        [email, firebaseUid]
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

        if (!existingUser.length) throw err;
        userId = existingUser[0].id;
      } else {
        throw err;
      }
    }

    const existingVolunteer = await db.query(
      `
        SELECT *
        FROM volunteers
        WHERE id = $1;
      `,
      [userId]
    );

    if (existingVolunteer.length) {
      return res.status(409).json({
        message: "Volunteer already exists",
        volunteer: keysToCamel(existingVolunteer[0]),
      });
    }

    const volunteerResult = await db.query(
      `
        INSERT INTO volunteers (
          id,
          first_name,
          last_name,
          email,
          phone_number,
          form_completed,
          form_link,
          is_signed_confidentiality,
          is_attorney,
          is_notary
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *;
      `,
      [
        userId,
        first_name,
        last_name,
        email,
        phone_number,
        form_completed,
        form_link,
        is_signed_confidentiality,
        is_attorney,
        is_notary,
      ]
    );

    res.status(201).json(keysToCamel(volunteerResult[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all volunteers
volunteersRouter.get("/", async (req, res) => {
  try {
    const volunteersQuery = await db.query(
      `
        SELECT *
        FROM volunteers;
      `
    );
    res.status(201).json(keysToCamel(volunteersQuery));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get a single volunteer via ID
volunteersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerQuery = await db.query(
      `
        SELECT *
        FROM volunteers
        WHERE id = $1;
      `,
      [id]
    );

    res.status(201).json(keysToCamel(volunteerQuery));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Update a volunteer's information via ID
volunteersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone_number,
      form_completed,
      form_link,
      is_signed_confidentiality,
      is_attorney,
      is_notary,
    } = req.body;

    await db.query(
      `
        UPDATE volunteers
        SET first_name = $2,
            last_name = $3,
            email = $4,
            phone_number = $5,
            form_completed = $6,
            form_link = $7,
            is_signed_confidentiality = $8,
            is_attorney = $9,
            is_notary = $10
        WHERE id = $1;
      `,
      [
        id,
        first_name,
        last_name,
        email,
        phone_number,
        form_completed,
        form_link,
        is_signed_confidentiality,
        is_attorney,
        is_notary,
      ]
    );

    res.status(200).send(`Volunteer ${id} updated successfully`);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Delete a single volunteer via ID
volunteersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      `
        DELETE
        FROM volunteers
        WHERE id = $1;
      `,
      [id]
    );

    res.status(200).send(`Volunteer ${id} deleted successfully`);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//
// Volunteer "Areas of Practice" (actually Areas of Interest) Routes
// Table: volunteer_areas_of_practice(volunteer_id, area_of_interest_id)
//

// Assign an area of interest to a volunteer
// POST /volunteers/:volunteerId/areas-of-interest  body: { areaOfInterestId }
volunteersRouter.post("/:volunteerId/areas-of-interest", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { areaOfInterestId } = req.body;

    if (!areaOfInterestId) {
      return res.status(400).json({ message: "areaOfInterestId is required" });
    }

    const result = await db.query(
      `
        INSERT INTO volunteer_areas_of_practice (volunteer_id, area_of_interest_id)
        VALUES ($1, $2)
        RETURNING *;
      `,
      [volunteerId, areaOfInterestId]
    );

    res.status(201).json(keysToCamel(result[0]));
  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(409)
        .json({ message: "Area of interest already assigned" });
    }
    res.status(500).send(e.message);
  }
});

// List all areas of interest for a volunteer
// GET /volunteers/:volunteerId/areas-of-interest
volunteersRouter.get("/:volunteerId/areas-of-interest", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const result = await db.query(
      `
        SELECT aoi.id, aoi.areas_of_interest
        FROM volunteer_areas_of_practice vaop
        JOIN areas_of_interest aoi ON aoi.id = vaop.area_of_interest_id
        WHERE vaop.volunteer_id = $1;
      `,
      [volunteerId]
    );

    res.status(200).json(keysToCamel(result));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Remove an area of interest from a volunteer
// DELETE /volunteers/:volunteerId/areas-of-interest/:areaOfInterestId
volunteersRouter.delete(
  "/:volunteerId/areas-of-interest/:areaOfInterestId",
  async (req, res) => {
    try {
      const { volunteerId, areaOfInterestId } = req.params;

      const result = await db.query(
        `
          DELETE FROM volunteer_areas_of_practice
          WHERE volunteer_id = $1 AND area_of_interest_id = $2
          RETURNING *;
        `,
        [volunteerId, areaOfInterestId]
      );

      if (!result.length) {
        return res
          .status(404)
          .json({ message: "Area of interest not assigned to this volunteer" });
      }

      res.status(200).json(keysToCamel(result[0]));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// Volunteer Tags Routes
volunteersRouter.post("/:volunteerId/tags", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { tagId } = req.body;

    const volunteerResult = await db.query(
      `
        INSERT INTO volunteer_tags (volunteer_id, tag_id)
        VALUES ($1, $2) 
        RETURNING *;
      `,
      [volunteerId, tagId]
    );

    res.status(201).json(keysToCamel(volunteerResult));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.delete("/:volunteerId/tags/:tagId", async (req, res) => {
  try {
    const { volunteerId, tagId } = req.params;

    await db.query(
      `
        DELETE
        FROM volunteer_tags
        WHERE volunteer_id = $1 AND tag_id = $2;
      `,
      [volunteerId, tagId]
    );

    res.status(200).send(`Tag ${tagId} deleted from volunteer ${volunteerId}`);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.get("/:volunteerId/tags", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const volunteerResult = await db.query(
      `
        SELECT t.id, t.tag
        FROM volunteer_tags vt
        JOIN tags t ON t.id = vt.tag_id 
        WHERE vt.volunteer_id = $1;
      `,
      [volunteerId]
    );

    res.status(200).json(keysToCamel(volunteerResult));
  } catch (e) {
    if (e.code === "23505") {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    res.status(500).send(e.message);
  }
});

// Volunteer Languages Routes
volunteersRouter.post("/:volunteerId/languages", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { languageId, proficiency } = req.body;

    const result = await db.query(
      `INSERT INTO volunteer_language (volunteer_id, language_id, proficiency)
       VALUES($1, $2, $3)
       RETURNING *`,
      [volunteerId, languageId, proficiency]
    );
    res.status(201).json(keysToCamel(result[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.delete(
  "/:volunteerId/languages/:languageId",
  async (req, res) => {
    try {
      const { volunteerId, languageId } = req.params;

      const result = await db.query(
        `DELETE FROM volunteer_language
         WHERE volunteer_id = $1 AND language_id = $2
         RETURNING *`,
        [volunteerId, languageId]
      );

      if (!result.length) {
        return res
          .status(404)
          .json({ message: "Language not assigned to this volunteer" });
      }

      res.status(200).json(keysToCamel(result[0]));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.get("/:volunteerId/languages", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const languages = await db.query(
      `SELECT l.*, vl.proficiency
       FROM languages l
       JOIN volunteer_language vl ON vl.language_id = l.id
       WHERE vl.volunteer_id = $1`,
      [volunteerId]
    );
    res.status(200).json(keysToCamel(languages));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Volunteer Roles Routes
volunteersRouter.post("/:volunteerId/roles", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "roleId is required" });
    }

    const newRelationship = await db.query(
      "INSERT INTO volunteer_roles (volunteer_id, role_id) VALUES ($1, $2) RETURNING *",
      [volunteerId, roleId]
    );

    res.status(201).json(keysToCamel(newRelationship));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.delete("/:volunteerId/roles/:roleId", async (req, res) => {
  try {
    const { volunteerId, roleId } = req.params;

    const deletedRelationship = await db.query(
      "DELETE FROM volunteer_roles WHERE volunteer_id = $1 AND role_id = $2 RETURNING *",
      [volunteerId, roleId]
    );

    if (deletedRelationship.length === 0) {
      return res
        .status(404)
        .json({ message: "Role not assigned to this volunteer" });
    }

    res.status(200).json(keysToCamel(deletedRelationship));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.get("/:volunteerId/roles", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const listAll = await db.query(
      `SELECT r.id, r.role_name
       FROM volunteer_roles vr
       JOIN roles r ON vr.role_id = r.id
       WHERE vr.volunteer_id = $1`,
      [volunteerId]
    );
    res.status(200).json(keysToCamel(listAll));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Volunteer Locations Routes
volunteersRouter.post("/:volunteerId/locations", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { locationId } = req.body;

    if (!locationId) {
      return res.status(400).json({ message: "locationId is required" });
    }

    const newRelationship = await db.query(
      "INSERT INTO volunteer_locations (volunteer_id, location_id) VALUES ($1, $2) RETURNING *",
      [volunteerId, locationId]
    );

    res.status(201).json(keysToCamel(newRelationship));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.delete(
  "/:volunteerId/locations/:locationId",
  async (req, res) => {
    try {
      const { volunteerId, locationId } = req.params;

      const deletedRelationship = await db.query(
        "DELETE FROM volunteer_locations WHERE volunteer_id = $1 AND location_id = $2 RETURNING *",
        [volunteerId, locationId]
      );

      if (deletedRelationship.length === 0) {
        return res.status(404).json({
          message: "Location not assigned to this volunteer",
        });
      }

      res.status(200).json(keysToCamel(deletedRelationship));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

volunteersRouter.get("/:volunteerId/locations", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const listAll = await db.query(
      `SELECT l.id, l.location_name
       FROM volunteer_locations vl
       JOIN locations l ON vl.location_id = l.id
       WHERE vl.volunteer_id = $1`,
      [volunteerId]
    );
    res.status(200).json(keysToCamel(listAll));
  } catch (e) {
    res.status(500).send(e.message);
  }
});
