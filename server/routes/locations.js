import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const locationsRouter = Router();

// GET: list all locations
// /locations
locationsRouter.get("/", async (req, res) => {
  try {
    const locations = await db.query("SELECT * FROM locations");
    res.status(200).json(keysToCamel(locations));
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: create a new location
// /locations
locationsRouter.post("/", async (req, res) => {
  try {
    const { street_address, city, state, zip_code } = req.body;

    const newLocation = await db.query(
      `INSERT INTO locations (street_address, city, state, zip_code)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [street_address, city, state, zip_code]
    );

    res.status(201).json(keysToCamel(newLocation[0]));
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: delete a location
// /locations/{locationId}
locationsRouter.delete("/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const deletedLocation = await db.query(
      "DELETE FROM locations WHERE id = $1 RETURNING *",
      [locationId]
    );

    if (deletedLocation.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(keysToCamel(deletedLocation[0]));
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT: update a location
// /locations/{locationId}
locationsRouter.put("/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const { street_address, city, state, zip_code } = req.body;

    if (!street_address || !city || !state || !zip_code) {
      return res.status(400).json({ message: "All location fields are required" });
    }

    const updatedLocation = await db.query(
      "UPDATE locations SET street_address = $1, city = $2, state = $3, zip_code = $4 WHERE id = $5 RETURNING *",
      [street_address, city, state, zip_code, locationId]
    );

    if (updatedLocation.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(keysToCamel(updatedLocation[0]));
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
