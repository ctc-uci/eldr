import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";
import { Router } from "express";

export const volunteersRouter = Router();

// Assign a language to a volunteer
volunteersRouter.post("/:volunteerId/languages", async (req, res) => {
    try {
        const { volunteerId } = req.params;
        const { languageId } = req.body;

        const result = await db.query(
            `INSERT INTO volunteer_language (volunteer_id, language_id)
             VALUES($1, $2)
             RETURNING *`,
             [volunteerId, languageId]
        );
        res.status(201).json(keysToCamel(result[0]));
    } catch (err) {
        if (err.code === '23505') { // PostgreSQL unique violation
            return res.status(409).json({ message: "Language already assigned to this volunteer" });
        }
        res.status(500).send(err.message);
    }
});

// Remove a language from a volunteer
volunteersRouter.delete("/:volunteerId/languages/:languageId", async (req, res) => {
  try {
    const { volunteerId, languageId } = req.params;

    const result = await db.query(
      `DELETE FROM volunteer_language
       WHERE volunteer_id = $1 AND language_id = $2
       RETURNING *`,
      [volunteerId, languageId]
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Language not assigned to this volunteer" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// List all languages for a volunteer
volunteersRouter.get("/:volunteerId/languages", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const languages = await db.query(
      `SELECT l.*
       FROM languages l
       JOIN volunteer_language vl ON vl.language_id = l.id
       WHERE vl.volunteer_id = $1`,
      [volunteerId]
    );

    res.status(200).json(keysToCamel(languages));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Create a new volunteer
volunteersRouter.post("/", async(req, res) => {
    try {
        const { 
            first_name, 
            last_name, 
            email, 
            phone_number, 
            is_notary, 
            role, 
            experience_level, 
            form_completed, 
            form_link, 
            is_signed_confidentiality 
        } = req.body;
        const volunteerResult = await db.query(
            `
            INSERT INTO volunteers (first_name, last_name, email, phone_number, is_notary, role, experience_level, form_completed, form_link, is_signed_confidentiality)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *;
            `, 
            [
                first_name, 
                last_name, 
                email, 
                phone_number, 
                is_notary, 
                role, 
                experience_level, 
                form_completed, 
                form_link, 
                is_signed_confidentiality
            ]
        );

        res.status(201).json(keysToCamel(volunteerResult));
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Get all volunteers
volunteersRouter.get("/", async(req, res) => {
    try {
        const volunteersQuery = await db.query(
            `
            SELECT *
            FROM volunteers;
            `
        )
        res.status(201).json(keysToCamel(volunteersQuery));

    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Get a single volunteer via ID
volunteersRouter.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const volunteerQuery = await db.query(
            `
            SELECT *
            FROM volunteers
            WHERE id = $1;
            `,
            [id]
        )

        res.status(201).json(keysToCamel(volunteerQuery));
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Update a volunteer's information via ID
volunteersRouter.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { 
            first_name, 
            last_name, 
            email, 
            phone_number, 
            is_notary, 
            role, 
            experience_level, 
            form_completed, 
            form_link, 
            is_signed_confidentiality 
        } = req.body;
        await db.query(
            `
            UPDATE volunteers
            SET first_name = $2,
                last_name = $3,
                email = $4,
                phone_number = $5,
                is_notary = $6,
                role = $7,
                experience_level = $8,
                form_completed = $9,
                form_link = $10,
                is_signed_confidentiality = $11
            WHERE id = $1;
            `,
            [
                id, 
                first_name, 
                last_name, 
                email, 
                phone_number, 
                is_notary, 
                role, 
                experience_level, 
                form_completed, 
                form_link, 
                is_signed_confidentiality
            ]
        )

        res.status(200).send(`Volunteer ${id} updated successfully`);
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Delete a single volunteer via ID
volunteersRouter.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            `
            DELETE
            FROM volunteers
            WHERE id = $1;
            `,
            [id]
        )

        res.status(200).send(`Volunteer ${id} deleted successfully`);
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Assign volunteer a tag
volunteersRouter.post("/:volunteerId/tags", async(req, res) => {
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
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Delete a tag from a volunteer
volunteersRouter.delete("/:volunteerId/tags/:tagId", async(req, res) => {
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
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Gets all tags assigned to a volunteer
volunteersRouter.get("/:volunteerId/tags", async(req, res) => {
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
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});
