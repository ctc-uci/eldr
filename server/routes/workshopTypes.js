import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const workshopTypesRouter = Router();

workshopTypesRouter.post("/", verifyRole("staff"), async (req, res) => {
  try {
    const workshopTypeInput = req.body?.workshopType;
    if (typeof workshopTypeInput !== "string" || !workshopTypeInput.trim()) {
      return res.status(400).json({ message: "Workshop type is required" });
    }
    const workshopType = workshopTypeInput.trim();

    const result = await db.query(
      "INSERT INTO workshop_types (workshop_type) VALUES ($1) RETURNING *",
      [workshopType]
    );

    res.status(201).json(keysToCamel(result[0]));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Workshop type already exists" });
    }

    console.error("Error creating workshop type:", error);
    res.status(500).json({ message: "Internal server error" });
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
    console.error("Error fetching workshop types:", error);
    res.status(500).json({ message: "Internal server error" });
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
    console.error("Error fetching workshop type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

workshopTypesRouter.put("/:id", verifyRole("staff"), async (req, res) => {
  try {
    const workshopTypeInput = req.body?.workshopType;
    if (typeof workshopTypeInput !== "string" || !workshopTypeInput.trim()) {
      return res.status(400).json({ message: "Workshop type is required" });
    }
    const workshopType = workshopTypeInput.trim();

    const result = await db.query(
      "UPDATE workshop_types SET workshop_type = $1 WHERE id = $2 RETURNING *",
      [workshopType, req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Workshop type not found" });
    }

    res.status(200).json(keysToCamel(result[0]));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Workshop type already exists" });
    }

    console.error("Error updating workshop type:", error);
    res.status(500).json({ message: "Internal server error" });
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
    console.error("Error deleting workshop type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
