// TODO: delete sample router file

import { keysToCamel } from "@/common/utils";
import express from "express";
import { db } from "@/db/db-pgp";

const clinicsRouter = express.Router();
clinicsRouter.use(express.json());

clinicsRouter.get("/:clinicId/attendees", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const data = await db.query(
        `
        SELECT 
            v.*
        FROM clinics c
        JOIN clinic_attendance ca ON ca.clinic_id = c.id
        JOIN volunteers v ON v.id = ca.volunteer_id
        WHERE c.id = $1;
        `, [clinicId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.post("/:clinicId/attendees", async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { volunteerId } = req.body;
    const data = await db.query(
        `
        INSERT INTO clinic_attendance (volunteer_id, clinic_id)
        VALUES ($1, $2)
        RETURNING *;
        `, [volunteerId, clinicId]
    )
    await db.query(
        `
        UPDATE clinics
        SET attendees = attendees + 1
        WHERE id = $1;
        `, [clinicId]
    )

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

clinicsRouter.delete("/:clinicId/attendees/:volunteerId", async (req, res) => {
    try{
        const { clinicId, volunteerId } = req.params;
        const data = await db.query(
            `
            DELETE FROM clinic_attendance
            WHERE clinic_id = $1 AND volunteer_id = $2
            RETURNING *
            `, [clinicId, volunteerId]
        )
        await db.query(
            `
            UPDATE clinics
            SET attendees = attendees - 1
            WHERE id = $1;
            `, [clinicId]
        )

        res.status(200).json(keysToCamel(data));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export { clinicsRouter };
