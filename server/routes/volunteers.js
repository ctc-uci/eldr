import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";
import { Router } from "express";

export const volunteerRouter = Router();

// Assign a language to a volunteer
volunteerRouter.post("/:volunteerId/languages", async (req, res) => {
    try {
        const { volunteerId } = req.params;
        const { languageId } = req.body;

        const result = await db.query(
            `INSERT INTO volunteer_language (volunteer_id, language_id)
             VALUES($1, $2)
             RETURNING *`,
             [volunteerId, languageId]
        );
    res.status(201).json(result[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Remove a language from a volunteer
volunteerRouter.delete("/:volunteerId/languages/:languageId", async (req, res) => {
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

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// List all languages for a volunteer
volunteerRouter.get("/:volunteerId/languages", async (req, res) => {
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