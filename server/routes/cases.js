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

//POST /cases - Create case
casesRouter.post("/create", async (req, res) => {
  try {
    const { id, title, description, email_contact } = req.body;

    const createdCase = await db.query(
      `INSERT INTO cases (id, title, description, email_contact) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, title, description, email_contact]
    );

    res.status(200).json(keysToCamel(createdCase));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//PUT /cases/{id} -  Update a single case by id
casesRouter.put("/update", async (req, res) => {
  try {
    const { id, title, description } = req.body;

    const emailContact =
      req.body.emailContact ?? req.body.email_contact;

    const updatedCase = await db.query(
      `UPDATE cases
       SET title = $1,
           description = $2,
           email_contact = $3
       WHERE id = $4
       RETURNING *`,
      [title, description ?? null, emailContact, id]
    );

    res.status(200).json(keysToCamel(updatedCase));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Areas of Interest Routes
// POST: assign an area to a case
// /cases/{caseId}/areas-of-interest
casesRouter.post("/:caseId/areas-of-interest", async (req, res) => {
    try {
        const {areaOfInterestID} = req.body; // get JSON body
        const { caseId } = req.params; // get URL parameters

        if (!areaOfInterestID){
            return res.status(400).json({ message: "Area of interest is required" });
        }

        const newRelationship = await db.query(
            "INSERT INTO case_areas_of_interest (case_id, area_of_interest_id) VALUES ($1, $2) RETURNING *",
            [caseId, areaOfInterestID]
        );

        res.status(200).json(keysToCamel(newRelationship));
    } catch (e){
        res.status(500).send(e.message);
    }
});

// DELETE: remove an area from a case
// /cases/{caseId}/areas-of-interest/{areaId}
casesRouter.delete("/:caseId/areas-of-interest/:areaId", async(req, res) => {
    try {
        const { caseId, areaId } = req.params;

        const deletedRelationship = await db.query(
            "DELETE FROM case_areas_of_interest WHERE case_id = $1 AND area_of_interest_id = $2 RETURNING *",
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
// /cases/{caseId}/areas-of-interest
casesRouter.get("/:caseId/areas-of-interest", async(req, res) => {
    try {
        const { caseId } = req.params;

        const listAll = await db.query(
            `SELECT ai.id, ai.areas_of_interest 
             FROM case_areas_of_interest cai
             JOIN areas_of_interest ai ON cai.area_of_interest_id = ai.id
             WHERE cai.case_id = $1`,
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