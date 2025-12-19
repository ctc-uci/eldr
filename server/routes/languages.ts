import { db } from "@/db/db-pgp";
import { Router } from "express";
import { keysToCamel } from "@/common/utils";

export const languagesRouter = Router();

// Post a language
languagesRouter.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const language = await db.query(
            "INSERT INTO languages (name) VALUES ($1) RETURNING *",
            [name]
        );

        res.status(200).json(keysToCamel(language.rows[0]));
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

