import { db } from "@/db/db-pgp";
import { Router } from "express";
import { keysToCamel } from "@/common/utils";
import { verifyRole } from "@/middleware";

export const languagesRouter = Router();

// Post a language
languagesRouter.post("/", verifyRole("staff"), async (req, res) => {
    try {
        const { language } = req.body;
        const languageResult = await db.query(
            "INSERT INTO languages (language) VALUES ($1) RETURNING *",
            [language]
        );

        res.status(201).json(keysToCamel(languageResult));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get all langauges
languagesRouter.get("/", verifyRole("volunteer"), async (_, res) => {
    try {
        const languages = await db.query(`SELECT * FROM languages ORDER BY id ASC`);

        res.status(200).json(keysToCamel(languages));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get all languages with 1+ volunteers tied to them
languagesRouter.get("/with-volunteers", verifyRole("volunteer"), async (_, res) => {
    try {
        const languages = await db.query(`
            SELECT languages.* FROM languages
            INNER JOIN volunteer_language ON languages.id = volunteer_language.language_id
            GROUP BY languages.id
            HAVING COUNT(volunteer_language.volunteer_id) > 0
            ORDER BY languages.id ASC
        `);

        res.status(200).json(keysToCamel(languages));
    } catch (err) {
        res.status(400).send(err.message);
    }
});



// Get a language by ID
languagesRouter.get("/:id", verifyRole("volunteer"), async (req, res) => {
    try {
        const { id } = req.params;
        const language = await db.query(`SELECT * FROM languages WHERE id = $1`, [id]);

        res.status(200).json(keysToCamel(language));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update a language by ID
languagesRouter.put("/:id", verifyRole("staff"), async (req, res) => {
    try {
        const { id } = req.params;
        const { language } = req.body;
        const updatedLanguage = await db.query(
            `UPDATE languages SET language = $1 WHERE id = $2 RETURNING *`,
            [language, id]
        );

        res.status(200).json(keysToCamel(updatedLanguage));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete a language by ID
languagesRouter.delete("/:id", verifyRole("staff"), async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM languages WHERE id = $1`, [id]);

        res.status(200).send(`Language ${id} deleted successfully`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});