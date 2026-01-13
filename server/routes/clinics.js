import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const clinicsRouter = Router();

// GET: list all areas for a clinic
// {port}/clinics/{clinicId}/areas-of-interest
clinicsRouter.get("/:id/areas-of-interest", async (req, res) => {
    try {
        const { id } = req.params;
        const areasOfInterest = await db.query("SELECT * FROM clinic_areas_of_interest WHERE clinic_id = $1", [id]);

        res.status(200).json(keysToCamel(areasOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: assign an area to a clinic
// {port}/clinics/{clinicId}/areas-of-interest
clinicsRouter.post("/:id/areas-of-interest", async (req, res) => {
    try {
        const { id } = req.params;
        const { areaOfInterestId } = req.body;

        // make sure area of interest id is not null or empty
        if (!areaOfInterestId) {
            return res.status(400).json({ message: "Area of interest id is required" });
        }

        const areaOfInterest = await db.query(
            "INSERT INTO clinic_areas_of_interest (clinic_id, area_of_interest_id) VALUES ($1, $2) RETURNING *",
            [id, areaOfInterestId]
        );

        // check to see if area of interest was created and returned
        if (areaOfInterest.length === 0) {
            return res.status(404).json({ message: "Area of interest not created" });
        }

        res.status(200).json(keysToCamel(areaOfInterest));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: remove an area from a clinic
// {port}/clinics/{clinicId}/areas-of-interest/{areaId}
clinicsRouter.delete("/:id/areas-of-interest/:areaId", async (req, res) => {
    try {
        const { id, areaId } = req.params;
        const deletedArea = await db.query(
            "DELETE FROM clinic_areas_of_interest WHERE clinic_id = $1 AND area_of_interest_id = $2 RETURNING *",
            [id, areaId]
        );

        // check to see if area was deleted and returned
        if (deletedArea.length === 0) {
            return res.status(404).json({ message: "Area of interest not found" });
        }

        res.status(200).json(keysToCamel(deletedArea));
    } catch (err) {
        res.status(500).send(err.message);
    }
})