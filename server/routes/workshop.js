import { db } from "@/db/db-pgp";
import { keysToCamel } from "@/common/utils";
import { Router } from "express";

export const workshopRouter = Router();

// Create a workshop
workshopRouter.post("/", async (req, res) => {
  try {
    const { name, description, location, time, date, attendees, language, experience_level, parking } = req.body;
    const workshop = await db.query(
      `INSERT INTO workshops (name, description, location, time, date, attendees, language, experience_level, parking) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, description, location, time, date, attendees, language, experience_level, parking]
    );
    res.status(201).json(keysToCamel(workshop[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all workshops
workshopRouter.get('/', async (req, res) => {
  try {
    const workshops = await db.query("SELECT * FROM workshops");
    res.status(200).json(keysToCamel(workshops));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a workshop by id
// Get a single workshop
workshopRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await db.query("SELECT * FROM workshops WHERE id = $1", [id]);
    res.status(200).json(keysToCamel(workshop[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a workshop
workshopRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, time, date, attendees, language, experience_level, parking } = req.body;
    const workshop = await db.query("UPDATE workshops SET name = $1, description = $2, location = $3, time = $4, date = $5, attendees = $6, language = $7, experience_level = $8, parking = $9 WHERE id = $10", [name, description, location, time, date, attendees, language, experience_level, parking, id]);
    res.status(200).json({ message: "Workshop updated successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a workshop
workshopRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await db.query("DELETE FROM workshops WHERE id = $1", [id]);
    res.status(200).json({ message: "Workshop deleted successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});