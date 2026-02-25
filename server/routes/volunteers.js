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

    if (!email) {
      return res.status(400).send("email are required");
    }

    // Create the base user first (or reuse if email already exists)
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

    // Prevent duplicate volunteer insert
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
    res.status(200).json(keysToCamel(volunteersQuery));
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

    res.status(200).json(keysToCamel(volunteerQuery));
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
        SET first_name = COALESCE($2, first_name),
            last_name = COALESCE($3, last_name),
            email = COALESCE($4, email),
            phone_number = COALESCE($5, phone_number),
            form_completed = COALESCE($6, form_completed),
            form_link = COALESCE($7, form_link),
            is_signed_confidentiality = COALESCE($8, is_signed_confidentiality),
            is_attorney = COALESCE($9, is_attorney),
            is_notary = COALESCE($10, is_notary)
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

// -----------------------------
// Volunteer Areas of Practice Routes
// -----------------------------

// Assign an area of practice to a volunteer
// POST /volunteers/:volunteerId/areas-of-practice
// body: { areaOfPracticeId }
volunteersRouter.post("/:volunteerId/areas-of-practice", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { areaOfPracticeId } = req.body;

    if (!areaOfPracticeId) {
      return res.status(400).json({ message: "areaOfPracticeId is required" });
    }

    const areaAssignment = await db.query(
      `
        INSERT INTO volunteer_areas_of_practice (
          volunteer_id,
          area_of_practice_id
        )
        VALUES ($1, $2)
        ON CONFLICT (volunteer_id, area_of_practice_id)
        DO NOTHING
        RETURNING *;
      `,
      [volunteerId, areaOfPracticeId]
    );

    if (!areaAssignment.length) {
      return res.status(200).json({ message: "Area of practice already assigned" });
    }

    res.status(201).json(keysToCamel(areaAssignment[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// List all areas of practice for a volunteer
// GET /volunteers/:volunteerId/areas-of-practice
volunteersRouter.get("/:volunteerId/areas-of-practice", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const areasOfPractice = await db.query(
      `
        SELECT
          aop.id AS area_of_practice_id,
          aop.areas_of_practice
        FROM volunteer_areas_of_practice vs
        JOIN areas_of_practice aop ON aop.id = vs.area_of_practice_id
        WHERE vs.volunteer_id = $1
        ORDER BY aop.areas_of_practice ASC;
      `,
      [volunteerId]
    );

    res.status(200).json(keysToCamel(areasOfPractice));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Remove an area of practice from a volunteer
// DELETE /volunteers/:volunteerId/areas-of-practice/:areaOfPracticeId
volunteersRouter.delete(
  "/:volunteerId/areas-of-practice/:areaOfPracticeId",
  async (req, res) => {
    try {
      const { volunteerId, areaOfPracticeId } = req.params;

      const deleted = await db.query(
        `
          DELETE FROM volunteer_areas_of_practice
          WHERE volunteer_id = $1 AND area_of_practice_id = $2
          RETURNING *;
        `,
        [volunteerId, areaOfPracticeId]
      );

      if (!deleted.length) {
        return res.status(404).json({
          message: "Area of practice not found for this volunteer",
        });
      }

      res.status(200).json(keysToCamel(deleted[0]));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

// -----------------------------
// Volunteer Tags Routes
// -----------------------------

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
    res.status(500).send(e.message);
  }
});

// -----------------------------
// Volunteer Languages Routes (join table + is_literate)
// -----------------------------

// Batch upsert languages for a volunteer
// POST /volunteers/:volunteerId/languages
// body: { languages: [{ languageId, isLiterate }] }
volunteersRouter.post("/:volunteerId/languages", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { languages } = req.body;

    if (!Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({ message: "languages array is required" });
    }

    for (const entry of languages) {
      if (!entry?.languageId || typeof entry?.isLiterate !== "boolean") {
        return res.status(400).json({
          message: "Each language must include languageId and isLiterate (boolean)",
        });
      }
    }

    const valuesSql = languages
      .map((_, idx) => `($1, $${idx * 3 + 2}, $${idx * 3 + 3}, $${idx * 3 + 4})`)
      .join(", ");

    const params = [volunteerId];
    for (const entry of languages) {
      const proficiency = entry.isLiterate ? "proficient" : "proficient";
      params.push(entry.languageId, entry.isLiterate, proficiency);
    }

    const result = await db.query(
      `
        INSERT INTO volunteer_language (volunteer_id, language_id, is_literate, proficiency)
        VALUES ${valuesSql}
        ON CONFLICT (volunteer_id, language_id)
        DO UPDATE SET
          is_literate = EXCLUDED.is_literate,
          proficiency = CASE
            WHEN EXCLUDED.is_literate THEN 'proficient'::proficiency_level
            ELSE 'proficient'::proficiency_level
          END
        RETURNING *;
      `,
      params
    );

    res.status(201).json(keysToCamel(result));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// List all languages for a volunteer (joins to languages.language)
volunteersRouter.get("/:volunteerId/languages", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const languages = await db.query(
      `
        SELECT l.id, l.language, vl.proficiency
        FROM volunteer_language vl
        JOIN languages l ON l.id = vl.language_id
        WHERE vl.volunteer_id = $1
        ORDER BY l.language ASC;
      `,
      [volunteerId]
    );

    res.status(200).json(keysToCamel(languages));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Remove a language from a volunteer
volunteersRouter.delete(
  "/:volunteerId/languages/:languageId",
  async (req, res) => {
    try {
      const { volunteerId, languageId } = req.params;

      const result = await db.query(
        `
          DELETE FROM volunteer_language
          WHERE volunteer_id = $1 AND language_id = $2
          RETURNING *;
        `,
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

// -----------------------------
// Volunteer Roles Routes
// -----------------------------

volunteersRouter.post("/:volunteerId/roles", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "roleId is required" });
    }

    const newRelationship = await db.query(
      `
        INSERT INTO volunteer_roles (volunteer_id, role_id)
        VALUES ($1, $2)
        RETURNING *;
      `,
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
      `
        DELETE FROM volunteer_roles
        WHERE volunteer_id = $1 AND role_id = $2
        RETURNING *;
      `,
      [volunteerId, roleId]
    );

    if (deletedRelationship.length === 0) {
      return res.status(404).json({ message: "Role not assigned to this volunteer" });
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
      `
        SELECT r.id, r.role_name
        FROM volunteer_roles vr
        JOIN roles r ON vr.role_id = r.id
        WHERE vr.volunteer_id = $1;
      `,
      [volunteerId]
    );

    res.status(200).json(keysToCamel(listAll));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// -----------------------------
// Volunteer Locations Routes
// -----------------------------

volunteersRouter.post("/:volunteerId/locations", async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { locationId } = req.body;

    if (!locationId) {
      return res.status(400).json({ message: "locationId is required" });
    }

    const newRelationship = await db.query(
      `
        INSERT INTO volunteer_locations (volunteer_id, location_id)
        VALUES ($1, $2)
        RETURNING *;
      `,
      [volunteerId, locationId]
    );

    res.status(201).json(keysToCamel(newRelationship));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.delete("/:volunteerId/locations/:locationId", async (req, res) => {
  try {
    const { volunteerId, locationId } = req.params;

    const deletedRelationship = await db.query(
      `
        DELETE FROM volunteer_locations
        WHERE volunteer_id = $1 AND location_id = $2
        RETURNING *;
      `,
      [volunteerId, locationId]
    );

    if (deletedRelationship.length === 0) {
      return res.status(404).json({ message: "Location not assigned to this volunteer" });
    }

    res.status(200).json(keysToCamel(deletedRelationship));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

volunteersRouter.get("/:volunteerId/locations", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const listAll = await db.query(
      `
        SELECT l.id, l.location_name
        FROM volunteer_locations vl
        JOIN locations l ON vl.location_id = l.id
        WHERE vl.volunteer_id = $1;
      `,
      [volunteerId]
    );

    res.status(200).json(keysToCamel(listAll));
  } catch (e) {
    res.status(500).send(e.message);
  }
});