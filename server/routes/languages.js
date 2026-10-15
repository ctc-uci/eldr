import { db } from "@/db/db-pgp";
import { Router } from "express";
import { keysToCamel } from "@/common/utils";
import { verifyRole } from "@/middleware";

export const languagesRouter = Router();

// Post a language (accessible by staff and volunteers)
languagesRouter.post("/", verifyRole(["staff", "volunteer"]), async (req, res) => {
    try {
        const { language } = req.body;
        const trimmed = typeof language === "string" ? language.trim() : "";
        if (!trimmed) {
            return res.status(400).json({ message: "Language is required" });
        }

        const existing = await db.query(
            "SELECT * FROM languages WHERE LOWER(language) = LOWER($1)",
            [trimmed]
        );
        if (existing.length > 0) {
            return res.status(200).json(keysToCamel(existing[0]));
        }

        const languageResult = await db.query(
            "INSERT INTO languages (language) VALUES ($1) RETURNING *",
            [trimmed]
        );

        res.status(201).json(keysToCamel(languageResult[0] ?? languageResult));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get all languages (prioritizing the ~10 most-used languages)
languagesRouter.get("/", verifyRole("volunteer"), async (_, res) => {
    try {
        const languages = await db.query(`
            SELECT
                l.*,
                (
                    SELECT COUNT(DISTINCT cl.clinic_id)::int
                    FROM clinic_languages cl
                    WHERE cl.language_id = l.id
                ) AS clinic_count,
                (
                    SELECT COUNT(DISTINCT vl.volunteer_id)::int
                    FROM volunteer_language vl
                    WHERE vl.language_id = l.id
                ) AS volunteer_count
            FROM languages l
            ORDER BY
                CASE
                    WHEN LOWER(l.language) = 'english' THEN 1
                    WHEN LOWER(l.language) = 'spanish' THEN 2
                    WHEN LOWER(l.language) = 'mandarin' THEN 3
                    WHEN LOWER(l.language) = 'cantonese' THEN 4
                    WHEN LOWER(l.language) = 'vietnamese' THEN 5
                    WHEN LOWER(l.language) = 'tagalog' THEN 6
                    WHEN LOWER(l.language) = 'korean' THEN 7
                    WHEN LOWER(l.language) = 'arabic' THEN 8
                    WHEN LOWER(l.language) = 'armenian' THEN 9
                    WHEN LOWER(l.language) = 'farsi' THEN 10
                    ELSE 100
                END ASC,
                clinic_count DESC,
                LOWER(l.language) ASC
        `);

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

// Detach a language from all events and delete it
languagesRouter.post("/:id/detach-and-delete", verifyRole("staff"), async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM clinic_languages WHERE language_id = $1`, [id]);
        await db.query(`DELETE FROM languages WHERE id = $1`, [id]);

        res.status(200).send(`Language ${id} detached and deleted successfully`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete a language by ID (blocks deletion if tied to events unless detachFromEvents=true)
languagesRouter.delete("/:id", verifyRole("staff"), async (req, res) => {
    try {
        const { id } = req.params;
        const { detachFromEvents } = req.query;

        const tiedClinics = await db.query(
            `SELECT clinic_id FROM clinic_languages WHERE language_id = $1`,
            [id]
        );

        if (tiedClinics.length > 0) {
            if (detachFromEvents === "true") {
                await db.query(`DELETE FROM clinic_languages WHERE language_id = $1`, [id]);
            } else {
                return res.status(400).json({
                    message: `Cannot delete language: it is currently tied to ${tiedClinics.length} event(s). Detach it from past events first.`,
                    clinicCount: tiedClinics.length,
                });
            }
        }

        await db.query(`DELETE FROM languages WHERE id = $1`, [id]);

        res.status(200).send(`Language ${id} deleted successfully`);
    } catch (err) {
        res.status(400).send(err.message);
    }
});