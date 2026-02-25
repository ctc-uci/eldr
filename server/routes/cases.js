import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const casesRouter = Router();

//GET /cases - Get all cases
casesRouter.get("/", async (req, res) => {
  try {
    const cases = await db.query(`SELECT * FROM cases ORDER BY id ASC`);

    res.status(200).json(keysToCamel(cases));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//GET /cases/{id} - Get one case based on id
casesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const oneCase = await db.query("SELECT * FROM cases WHERE id = $1", [
      id,
    ]);

    res.status(200).json(keysToCamel(oneCase));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//DELETE /cases/{id} - Delete a case by id
casesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCase = await db.query("DELETE FROM cases WHERE id = $1 RETURNING *", [
      id,
    ]);

    res.status(200).json(keysToCamel(deletedCase));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// POST /cases - Create case
casesRouter.post("/", async (req, res) => {
  try {
    const { title, description, emailContact } = req.body;

    if (!title || !emailContact) {
      return res
        .status(400)
        .json({ message: "title and emailContact are required" });
    }

    const createdCase = await db.query(
      `INSERT INTO cases (title, description, email_contact)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description ?? null, emailContact]
    );

    res.status(201).json(keysToCamel(createdCase));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// PUT /cases/:id - Update a single case by id
casesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, emailContact } = req.body;

    const updatedCase = await db.query(
      `UPDATE cases
       SET title = $1,
           description = $2,
           email_contact = $3
       WHERE id = $4
       RETURNING *`,
      [title, description ?? null, emailContact, id]
    );

    if (!updatedCase.length) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(keysToCamel(updatedCase));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Areas of Practice Routes
// POST: assign an area to a case
// /cases/{caseId}/areas-of-practice
casesRouter.post("/:caseId/areas-of-practice", async (req, res) => {
  try {
    const { areaOfPracticeId } = req.body;
    const { caseId } = req.params;

    if (!areaOfPracticeId) {
      return res.status(400).json({ message: "Area of practice is required" });
    }

    const newRelationship = await db.query(
      "INSERT INTO case_areas_of_practice (case_id, area_of_practice_id) VALUES ($1, $2) RETURNING *",
      [caseId, areaOfPracticeId]
    );

    res.status(200).json(keysToCamel(newRelationship));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// DELETE: remove an area from a case
// /cases/{caseId}/areas-of-practice/{areaId}
casesRouter.delete("/:caseId/areas-of-practice/:areaId", async (req, res) => {
  try {
    const { caseId, areaId } = req.params;

    const deletedRelationship = await db.query(
      "DELETE FROM case_areas_of_practice WHERE case_id = $1 AND area_of_practice_id = $2 RETURNING *",
      [caseId, areaId]
    );

    if (deletedRelationship.length === 0) {
      return res.status(404).json({ message: "Relationship not found" });
    }

    res.status(200).json(keysToCamel(deletedRelationship));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// GET: list all areas for a case
// /cases/{caseId}/areas-of-practice
casesRouter.get("/:caseId/areas-of-practice", async (req, res) => {
  try {
    const { caseId } = req.params;

    const listAll = await db.query(
      `SELECT aop.id, aop.areas_of_practice 
       FROM case_areas_of_practice caop
       JOIN areas_of_practice aop ON caop.area_of_practice_id = aop.id
       WHERE caop.case_id = $1`,
      [caseId]
    );

    res.status(200).json(keysToCamel(listAll));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Case Languages Routes
// Assign a language to a case
casesRouter.post("/:caseId/languages", async (req, res) => {
  try {
    const { caseId } = req.params;
    const { languageId, proficiency } = req.body;

    const caseLanguage = await db.query(
      "INSERT INTO case_languages (case_id, language_id, proficiency) VALUES ($1, $2, $3) RETURNING *",
      [caseId, languageId, proficiency]
    );

    res.status(201).json(keysToCamel(caseLanguage));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Delete a language from a case
casesRouter.delete("/:caseId/languages/:languageId", async (req, res) => {
  try {
    const { caseId, languageId } = req.params;

    const deletedLanguage = await db.query(
      "DELETE FROM case_languages WHERE case_id = $1 AND language_id = $2 RETURNING *",
      [caseId, languageId]
    );

    if (!deletedLanguage.length) {
      return res
        .status(404)
        .json({ message: "Language not assigned to this case" });
    }

    res.status(200).json(keysToCamel(deletedLanguage[0]));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all languages for a case
casesRouter.get("/:caseId/languages", async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseLanguages = await db.query(
      `SELECT l.*, cl.proficiency
       FROM languages l 
        JOIN case_languages cl ON cl.language_id = l.id 
      WHERE cl.case_id = $1`,
      [caseId]
    );

    res.status(200).json(keysToCamel(caseLanguages));
  } catch (e) {
    res.status(500).send(e.message);
  }
});