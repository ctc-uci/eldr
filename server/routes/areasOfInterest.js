import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const areasOfInterestRouter = Router();

// GET: get all areas of interest
// {port}/areas-of-interest
areasOfInterestRouter.get("/", async (req, res) => {
    try {
        const areasOfInterest = await db.query("SELECT * FROM areas_of_interest");
        res.status(200).json(keysToCamel(areasOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET: get an area of interest by id
// {port}/areas-of-interest/:id
areasOfInterestRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const areaOfInterest = await db.query("SELECT * FROM areas_of_interest WHERE id = $1", [id]);

        // check to see if area of interest was found and returned
        if (areaOfInterest.length === 0) {
            return res.status(404).json({ message: "Area of interest not found" });
        }

        res.status(200).json(keysToCamel(areaOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: create a new area of interest
// {port}}/areas-of-interest
areasOfInterestRouter.post("/", async (req, res) => {
    try {
        const { areaOfInterest } = req.body;

        // make sure area of interest is not null or empty
        if (!areaOfInterest) {
            return res.status(400).json({ message: "Area of interest is required" });
        }

        const newAreaOfInterest = await db.query(
            "INSERT INTO areas_of_interest (areas_of_interest) VALUES ($1) RETURNING *",
            [areaOfInterest]
        );

        // check to see if area of interest was created and returned
        if (newAreaOfInterest.length === 0) {
            return res.status(404).json({ message: "Area of interest not created" });
        }

        res.status(200).json(keysToCamel(newAreaOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// PUT: update an area of interest by id
// {port}}/areas-of-interest/:id
areasOfInterestRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { areaOfInterest } = req.body;
        const updatedAreaOfInterest = await db.query(
            "UPDATE areas_of_interest SET areas_of_interest = $1 WHERE id = $2 RETURNING *",
            [areaOfInterest, id]
        );

        // check to see if area of interest was updated and returned
        if (updatedAreaOfInterest.length === 0) {
            return res.status(404).json({ message: "Area of interest not found" });
        }

        res.status(200).json(keysToCamel(updatedAreaOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// DELETE: delete an area of interest by id
// {port}}/areas-of-interest/:id
areasOfInterestRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAreaOfInterest = await db.query("DELETE FROM areas_of_interest WHERE id = $1 RETURNING *", [id]);

        // check to see if area of interest was deleted and returned
        if (deletedAreaOfInterest.length === 0) {
            return res.status(404).json({ message: "Area of interest not found" });
        }

        res.status(200).json(keysToCamel(deletedAreaOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
})