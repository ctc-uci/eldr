import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const foldersRouter = Router();

// GET: list all folders
// /folders
foldersRouter.get("/", async (req, res) => {
  try {
    const folders = await db.query(
      "SELECT * FROM folders ORDER BY id ASC"
    );
    res.status(200).json(keysToCamel(folders));
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: create a new folder
// /folders
foldersRouter.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const newFolder = await db.query(
      `INSERT INTO folders (name)
       VALUES ($1) RETURNING *`,
      [name ?? null]
    );

    res.status(201).json(keysToCamel(newFolder[0]));
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET: get one folder by id
// /folders/:id
foldersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const folder = await db.query("SELECT * FROM folders WHERE id = $1", [id]);

    if (folder.length === 0) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(keysToCamel(folder[0]));
  } catch (error) {
    console.error("Error fetching folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT: update a folder
// /folders/:id
foldersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await db.query(
      "UPDATE folders SET name = $1 WHERE id = $2 RETURNING *",
      [name ?? null, id]
    );

    if (updated.length === 0) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(keysToCamel(updated[0]));
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: delete a folder
// /folders/:id
foldersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.query(
      "DELETE FROM folders WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(keysToCamel(deleted[0]));
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
