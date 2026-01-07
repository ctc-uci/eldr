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
// {port}}/areas-of-interest/:id
areasOfInterestRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const areaOfInterest = await db.query("SELECT * FROM areas_of_interest WHERE id = $1", [id]);
        res.status(200).json(keysToCamel(areaOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
});