import { db } from "@/db/db-pgp";
import { Router } from "express";
import { keysToCamel } from "@/common/utils";

export const languagesRouter = Router();

// Post a language
languagesRouter.post("/", async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging line
        const { language } = req.body;
        const languageResult = await db.query(
            "INSERT INTO languages (language) VALUES ($1) RETURNING *",
            [language]
        );

        res.status(200).json(keysToCamel(languageResult));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get all langauges
languagesRouter.get("/", async (_, res) => {
    try {
        const languages = await db.query(`SELECT * FROM languages ORDER BY id ASC`);

        res.status(200).json(keysToCamel(languages));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get a language by ID
languagesRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const language = await db.query(`SELECT * FROM languages WHERE id = $1`, [id]);

        res.status(200).json(keysToCamel(language));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update a language by ID
languagesRouter.put("/:id", async (req, res) => {
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
languagesRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM languages WHERE id = $1`, [id]);

        res.status(200).send(`Language ${id} deleted successfully`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});