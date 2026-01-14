import { db } from "@/db/db-pgp";
import { Router } from "express";
import { keysToCamel } from "@/common/utils";

export const tagsRouter = Router();

// Create a new tag
tagsRouter.post("/", async(req, res) => {
    try {
        const { text } = req.body;
        const tagResult = await db.query(
            `
            INSERT INTO tags (tag)
            VALUES ($1) 
            RETURNING *;
            `, 
            [text]
        );

        res.status(201).json(keysToCamel(tagResult));  
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Get all tags
tagsRouter.get("/", async(req, res) => {
    try {
        const tagsQuery = await db.query(
            `
            SELECT *
            FROM tags;
            `
        )
        res.status(201).json(keysToCamel(tagsQuery));

    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Get a single tag via ID
tagsRouter.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const tagsQuery = await db.query(
            `
            SELECT *
            FROM tags
            WHERE id = $1;
            `,
            [id]
        )

        res.status(201).json(keysToCamel(tagsQuery));

    } catch(e) {
        res.status(500).send(e.message);
    }
});


// Update a tag via ID
tagsRouter.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        await db.query(
            `
            UPDATE tags
            SET tag = $2
            WHERE id = $1;
            `,
            [id, text]
        )

        res.status(200).send(`Tag ${id} updated to '${text}' successfully`);
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});

// Delete a single tag via ID
tagsRouter.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            `
            DELETE
            FROM tags
            WHERE id = $1;
            `,
            [id]
        )

        res.status(200).send(`Tag ${id} deleted successfully`);
        
    } catch(e) {
        res.status(500).send(e.message);
    }
});