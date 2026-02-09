import { db } from "@/db/db-pgp";
import { Router } from "express";
import { keysToCamel } from "@/common/utils";

export const rolesRouter = Router();

// Create a new role
rolesRouter.post("/", async (req, res) => {
  try {
    const { roleName } = req.body;

    const roleResult = await db.query(
      `
        INSERT INTO roles (role_name)
        VALUES ($1)
        RETURNING *;
      `,
      [roleName]
    );

    res.status(201).json(keysToCamel(roleResult));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all roles
rolesRouter.get("/", async (req, res) => {
  try {
    const roles = await db.query(
      `
        SELECT *
        FROM roles;
      `
    );

    res.status(200).json(keysToCamel(roles));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get a single role by ID
rolesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const roles = await db.query(
      `
        SELECT *
        FROM roles
        WHERE id = $1;
      `,
      [id]
    );

    res.status(200).json(keysToCamel(roles));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Delete a role by ID
rolesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
        DELETE
        FROM roles
        WHERE id = $1 
        RETURNING *;
      `,
      [id]
    );

    res.status(200).json(keysToCamel(result));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

