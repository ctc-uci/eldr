import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";
import { Router } from "express";

export const volunteersRouter = Router();

// Create a new volunteer
volunteersRouter.post("/", async(req, res) => {
    try {
        const { 
            firebaseUid,
            first_name, 
            last_name, 
            email, 
            phone_number,  
            experience_level, 
            form_completed, 
            form_link, 
            is_signed_confidentiality,
            is_attorney,
            is_notary
        } = req.body;

        if (!firebaseUid || !email) {
            return res.status(400).send("firebaseUid and email are required");
        }

        // Create the base user first (volunteer role defaults to 'user')
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
            // If the user already exists (unique violation), reuse their ID
            if (err.code === "23505") {
                const existingUser = await db.query(
                    `
                    SELECT id
                    FROM users
                    WHERE email = $1;
                    `,
                    [email]
                );

                if (!existingUser.length) {
                    throw err;
                }

                userId = existingUser[0].id;
            } else {
                throw err;
            }
        }

        const volunteerResult = await db.query(
            `
            INSERT INTO volunteers (id, first_name, last_name, email, phone_number, experience_level, form_completed, form_link, is_signed_confidentiality, is_attorney, is_notary)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *;
            `, 
            [
                userId,
                first_name, 
                last_name, 
                email, 
                phone_number, 
                experience_level, 
                form_completed, 
                form_link, 
                is_signed_confidentiality,
                is_attorney,
                is_notary
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
            experience_level, 
            form_completed, 
            form_link, 
            is_signed_confidentiality,
            is_attorney,
            is_notary
        } = req.body;
        await db.query(
            `
            UPDATE volunteers
            SET first_name = $2,
                last_name = $3,
                email = $4,
                phone_number = $5,
                experience_level = $6,
                form_completed = $7,
                form_link = $8,
                is_signed_confidentiality = $9,
                is_attorney = $10,
                is_notary = $11
            WHERE id = $1;
            `,
            [
                id, 
                first_name, 
                last_name, 
                email, 
                phone_number, 
                experience_level, 
                form_completed, 
                form_link, 
                is_signed_confidentiality,
                is_attorney,
                is_notary
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

// Volunteer Tags Routes
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

// Volunteer Languages Routes
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
