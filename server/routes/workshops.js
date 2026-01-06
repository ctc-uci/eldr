// TODO: delete sample router file

import { keysToCamel } from "@/common/utils";
import express from "express";
import { db } from "@/db/db-pgp";

const workshopsRouter = express.Router();
workshopsRouter.use(express.json());

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

        res.status(200).json(keysToCamel(data));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export { workshopsRouter };
