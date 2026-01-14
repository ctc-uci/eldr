import { keysToCamel } from "@/common/utils";
import express from "express";
import { db } from "@/db/db-pgp";

const workshopsRouter = express.Router();
workshopsRouter.use(express.json());

// WorkshopAttendance (Volunteer ↔ Workshop)
workshopsRouter.get("/:workshopId/attendees", async (req, res) => {
  try {
    const { workshopId } = req.params;
    const data = await db.query(
        `
        SELECT 
            v.*
        FROM workshops w
        JOIN workshop_attendance wa ON wa.workshop_id = w.id
        JOIN volunteers v ON v.id = wa.volunteer_id
        WHERE w.id = $1;
        `, [workshopId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

workshopsRouter.post("/:workshopId/attendees", async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { volunteerId } = req.body;
    const data = await db.query(
        `
        INSERT INTO workshop_attendance (volunteer_id, workshop_id)
        VALUES ($1, $2)
        RETURNING *;
        `, [volunteerId, workshopId]
    )

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

workshopsRouter.delete("/:workshopId/attendees/:volunteerId", async (req, res) => {
    try{
        const { workshopId, volunteerId } = req.params;
        const data = await db.query(
            `
            DELETE FROM workshop_attendance
            WHERE workshop_id = $1 AND volunteer_id = $2
            RETURNING *
            `, [workshopId, volunteerId]
        )

        if (!data.length) {
          return res.status(404).send("Volunteer not found for this workshop")
        }

        res.status(200).json(keysToCamel(data));

// POST: assign an area to a workshop
// /workshops/{workshopId}/areas-of-interest
workshopsRouter.post("/:workshopId/areas-of-interest", async (req, res) => {
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
workshopsRouter.delete("/:workshopId/areas-of-interest/:areaId", async(req, res) => {
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
workshopsRouter.get("/:workshopId/areas-of-interest", async(req, res) => {
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
      
export { workshopsRouter };
