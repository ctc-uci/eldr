import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const caseRouter = Router();

// POST: assign an area to a case
// /cases/{caseId}/areas-of-interest
caseRouter.post("/:caseId/areas-of-interest", async (req, res) => {
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
    } catch (err){
        res.status(500).send(err.message);
    }
});

// DELETE: remove an area from a case
// /cases/{caseId}/areas-of-interest/{areaId}
caseRouter.delete("/:caseId/areas-of-interest/:areaId", async(req, res) => {
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
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET: list all areas for a case
// /cases/{caseId}/areas-of-interest
caseRouter.get("/:caseId/areas-of-interest", async(req, res) => {
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
    } catch (err) {
        res.status(500).send(err.message);
    }
});