import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const casesRouter = Router();

//GET /cases - Get all cases
casesRouter.get("/", async (req, res) => {
  try {
    const cases = await db.query(`SELECT * FROM cases ORDER BY id ASC`);

    res.status(200).json(keysToCamel(cases));
  } catch (err) {
    res.status(400).send(err.message);
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
  } catch (err) {
    res.status(400).send(err.message);
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
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//POST /cases - Create case
casesRouter.post("/create", async (req, res) => {
  try {
    const { id, title, description, email_contact } = req.body;

    const createdCase = await db.query(
      "INSERT INTO cases (id, title, description, email_contact) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, title, description, email_contact]
    );

    res.status(200).json(keysToCamel(createdCase));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//PUT /cases/{id} -  Update a single case by id
casesRouter.put("/update", async (req, res) => {
  try {
    const { id, title, description, email_contact } = req.body;

    const updatedCase = await db.query(
      `UPDATE users SET title = $1,
            description = $2,
            email_contact = $3,
        WHERE id = $4 RETURNING *`,
      [id, title, description, email_contact]
    );

    res.status(200).json(keysToCamel(updatedCase));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

