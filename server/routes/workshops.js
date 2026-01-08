import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const WorkshopRouter = Router();

// POST: assign an area to a workshop
// /workshops/{workshopId}/areas-of-interest
WorkshopRouter.post("/:workshopId/areas-of-interest", async (req, res) => {
    try {
        const {areaOfInterestID} = req.body; // get JSON body
        const { workshopId } = req.params; // get URL parameters

        if (!areaOfInterestID){
            return res.status(400).json({ message: "Area of interest is required" });
        }

        const newRelationship = await db.query(
            "INSERT INTO workshop_areas_of_interest (workshop_id, area_of_interest_id) VALUES ($1, $2) RETURNING *",
            [workshopId, areaOfInterestID]
        );

        res.status(200).json(keysToCamel(newRelationship));
    } catch (err){
        res.status(500).send(err.message);
    }
});

// DELETE: remove an area from a workshop
// /workshops/{workshopId}/areas-of-interest/{areaId}
WorkshopRouter.delete("/:workshopId/areas-of-interest/:areaId", async(req, res) => {
    try {
        const { workshopId, areaId } = req.params;

        const deletedRelationship = await db.query(
            "DELETE FROM workshop_areas_of_interest WHERE workshop_id = $1 AND area_of_interest_id = $2 RETURNING *",
            [workshopId, areaId]
        );

        if (deletedRelationship.length === 0) {
            return res.status(404).json({ message: "Relationship not found" });
        }

        res.status(200).json(keysToCamel(deletedRelationship));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET: list all areas for a workshop
// /workshops/{workshopId}/areas-of-interest
WorkshopRouter.get("/:workshopId/areas-of-interest", async(req, res) => {
    try {
        const { workshopId } = req.params;

        const listAll = await db.query(
            "SELECT * FROM workshop_areas_of_interest WHERE workshop_id = $1", [workshopId]
        );

        res.status(200).json(keysToCamel(listAll));
    } catch (err) {
        res.status(500).send(err.message);
    }
});