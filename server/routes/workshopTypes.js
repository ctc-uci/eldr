import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const workshopTypesRouter = Router();

workshopTypesRouter.post("/", verifyRole("staff"), async (req, res) => {
  try {
    const workshopType = req.body.workshopType?.trim();
    if (!workshopType) {
      return res.status(400).json({ message: "Workshop type is required" });
    }

    const result = await db.query(
      "INSERT INTO workshop_types (workshop_type) VALUES ($1) RETURNING *",
      [workshopType]
    );

    res.status(201).json(keysToCamel(result[0]));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

workshopTypesRouter.get("/", verifyRole("volunteer"), async (_req, res) => {
  try {
    const workshopTypes = await db.query(`
      SELECT
        wt.*,
        (
          SELECT COUNT(DISTINCT cwt.clinic_id)::int
          FROM clinic_workshop_types cwt
          WHERE cwt.workshop_type_id = wt.id
        ) AS clinic_count,
        (
          SELECT COUNT(DISTINCT vwt.volunteer_id)::int
          FROM volunteer_workshop_types vwt
          WHERE vwt.workshop_type_id = wt.id
        ) AS volunteer_count
      FROM workshop_types wt
      ORDER BY LOWER(wt.workshop_type) ASC
    `);
    res.status(200).json(keysToCamel(workshopTypes));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

workshopTypesRouter.get("/:id", verifyRole("volunteer"), async (req, res) => {
  try {
    const workshopTypes = await db.query(
      "SELECT * FROM workshop_types WHERE id = $1",
      [req.params.id]
    );
    if (workshopTypes.length === 0) {
      return res.status(404).json({ message: "Workshop type not found" });
    }

    res.status(200).json(keysToCamel(workshopTypes[0]));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

workshopTypesRouter.put("/:id", verifyRole("staff"), async (req, res) => {
  try {
    const workshopType = req.body.workshopType?.trim();
    if (!workshopType) {
      return res.status(400).json({ message: "Workshop type is required" });
    }

    const result = await db.query(
      "UPDATE workshop_types SET workshop_type = $1 WHERE id = $2 RETURNING *",
      [workshopType, req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Workshop type not found" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

workshopTypesRouter.delete("/:id", verifyRole("staff"), async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM workshop_types WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Workshop type not found" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (error) {
    res.status(500).send(error.message);
  }
});
