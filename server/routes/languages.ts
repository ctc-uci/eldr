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
languagesRouter.get("/", async (req, res) => {
    try {
        const languages = await db.query(`SELECT * FROM languages ORDER BY id ASC`);

        res.status(200).json(keysToCamel(languages));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

