import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const casesRouter = Router();

// Assign a language to a case
casesRouter.post("/:caseId/languages", async (req, res) => {
  try {
    const { caseId } = req.params;
    const { languageId } = req.body;

    const caseLanguage = await db.query(
      "INSERT INTO case_languages (case_id, language_id) VALUES ($1, $2) RETURNING *",
      [caseId, languageId]
    );

    res.status(201).json(keysToCamel(caseLanguage));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a language from a case
casesRouter.delete("/:caseId/languages/:languageId", async (req, res) => {
  try {
    const { caseId, languageId } = req.params;

    await db.query(
      "DELETE FROM case_languages WHERE case_id = $1 AND language_id = $2",
      [caseId, languageId]
    );

    res.status(200).send(`Language ${languageId} deleted from case ${caseId} successfully`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all languages for a case
casesRouter.get("/:caseId/languages", async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseLanguages = await db.query(
      "SELECT * FROM case_languages WHERE case_id = $1",
      [caseId]
    );

    res.status(200).json(keysToCamel(caseLanguages));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
