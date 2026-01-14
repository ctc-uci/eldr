import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const clinicsRouter = Router();

// Assign a language to a clinic
clinicsRouter.post("/:clinicId/languages", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { languageId } = req.body;

    const clinicLanguage = await db.query(
      "INSERT INTO clinic_languages (clinic_id, language_id) VALUES ($1, $2) RETURNING *",
      [clinicId, languageId]
    );

    res.status(201).json(keysToCamel(clinicLanguage));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a language from a clinic
clinicsRouter.delete("/:clinicId/languages/:languageId", async (req, res) => {
  try {
    const { clinicId, languageId } = req.params;

    await db.query(
      "DELETE FROM clinic_languages WHERE clinic_id = $1 AND language_id = $2",
      [clinicId, languageId]
    );

    res.status(200).send(`Language ${languageId} deleted from clinic ${clinicId} successfully`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all languages for a clinic
clinicsRouter.get("/:clinicId/languages", async (req, res) => {
  try {
    const { clinicId } = req.params;

    const clinicLanguages = await db.query(
      "SELECT * FROM clinic_languages WHERE clinic_id = $1",
      [clinicId]
    );

    res.status(200).json(keysToCamel(clinicLanguages));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
