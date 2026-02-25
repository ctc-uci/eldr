import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const areasOfPracticeRouter = Router();

// GET: get all areas of practice
// {port}/areas-of-practice
areasOfPracticeRouter.get("/", async (req, res) => {
    try {
        const areasOfPractice = await db.query("SELECT * FROM areas_of_practice");
        res.status(200).json(keysToCamel(areasOfPractice));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET: get an area of practice by id
// {port}/areas-of-practice/:id
areasOfPracticeRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const areaOfPractice = await db.query("SELECT * FROM areas_of_practice WHERE id = $1", [id]);

        // Check if area of practice was found.
        if (areaOfPractice.length === 0) {
            return res.status(404).json({ message: "Area of practice not found" });
        }

        res.status(200).json(keysToCamel(areaOfPractice));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: create a new area of practice
// {port}/areas-of-practice
areasOfPracticeRouter.post("/", async (req, res) => {
    try {
        const { areaOfPractice } = req.body;

        // Make sure area of practice is not null or empty.
        if (!areaOfPractice) {
            return res.status(400).json({ message: "Area of practice is required" });
        }

        const newAreaOfPractice = await db.query(
            "INSERT INTO areas_of_practice (areas_of_practice) VALUES ($1) RETURNING *",
            [areaOfPractice]
        );

        // Check if area of practice was created.
        if (newAreaOfPractice.length === 0) {
            return res.status(404).json({ message: "Area of practice not created" });
        }

        res.status(200).json(keysToCamel(newAreaOfPractice));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT: update an area of practice by id
// {port}/areas-of-practice/:id
areasOfPracticeRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { areaOfPractice } = req.body;
        const updatedAreaOfPractice = await db.query(
            "UPDATE areas_of_practice SET areas_of_practice = $1 WHERE id = $2 RETURNING *",
            [areaOfPractice, id]
        );

        // Check if area of practice was updated.
        if (updatedAreaOfPractice.length === 0) {
            return res.status(404).json({ message: "Area of practice not found" });
        }

        res.status(200).json(keysToCamel(updatedAreaOfPractice));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: delete an area of practice by id
// {port}/areas-of-practice/:id
areasOfPracticeRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAreaOfPractice = await db.query(
            "DELETE FROM areas_of_practice WHERE id = $1 RETURNING *",
            [id]
        );

        // Check if area of practice was deleted.
        if (deletedAreaOfPractice.length === 0) {
            return res.status(404).json({ message: "Area of practice not found" });
        }

        res.status(200).json(keysToCamel(deletedAreaOfPractice));
    } catch (err) {
        res.status(500).send(err.message);
    }
});
