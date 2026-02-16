import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { Router } from "express";

export const emailTemplatesRouter = Router();

// GET: list all email templates
// /email-templates
emailTemplatesRouter.get("/", async (req, res) => {
  try {
    const templates = await db.query(
      "SELECT * FROM email_templates ORDER BY id ASC"
    );
    res.status(200).json(keysToCamel(templates));
  } catch (error) {
    console.error("Error fetching email templates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: create a new email template
// /email-templates
emailTemplatesRouter.post("/", async (req, res) => {
  try {
    const { name, template_text, subject } = req.body;

    if (!name || template_text === undefined) {
      return res
        .status(400)
        .json({ message: "name and template_text are required" });
    }

    const newTemplate = await db.query(
      `INSERT INTO email_templates (name, template_text, subject)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, template_text, subject ?? null]
    );

    res.status(201).json(keysToCamel(newTemplate[0]));
  } catch (error) {
    console.error("Error creating email template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Nested routes for folders (must be before /:id to match first)
// GET: list all folders for an email template
// /email-templates/:emailTemplateId/folders
emailTemplatesRouter.get("/:emailTemplateId/folders", async (req, res) => {
  try {
    const { emailTemplateId } = req.params;

    const folders = await db.query(
      `SELECT f.id, f.name
       FROM email_template_folders etf
       JOIN folders f ON etf.folder_id = f.id
       WHERE etf.email_template_id = $1`,
      [emailTemplateId]
    );

    res.status(200).json(keysToCamel(folders));
  } catch (error) {
    console.error("Error fetching folders for email template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: add a folder to an email template
// /email-templates/:emailTemplateId/folders
emailTemplatesRouter.post("/:emailTemplateId/folders", async (req, res) => {
  try {
    const { emailTemplateId } = req.params;
    const { folderId } = req.body;

    if (!folderId) {
      return res.status(400).json({ message: "folderId is required" });
    }

    const newLink = await db.query(
      `INSERT INTO email_template_folders (email_template_id, folder_id)
       VALUES ($1, $2) RETURNING *`,
      [emailTemplateId, folderId]
    );

    res.status(201).json(keysToCamel(newLink[0]));
  } catch (error) {
    console.error("Error adding folder to email template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: remove a folder from an email template
// /email-templates/:emailTemplateId/folders/:folderId
emailTemplatesRouter.delete(
  "/:emailTemplateId/folders/:folderId",
  async (req, res) => {
    try {
      const { emailTemplateId, folderId } = req.params;

      const deleted = await db.query(
        `DELETE FROM email_template_folders
         WHERE email_template_id = $1 AND folder_id = $2 RETURNING *`,
        [emailTemplateId, folderId]
      );

      if (deleted.length === 0) {
        return res.status(404).json({ message: "Relationship not found" });
      }

      res.status(200).json(keysToCamel(deleted[0]));
    } catch (error) {
      console.error("Error removing folder from email template:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// GET: get one email template by id
// /email-templates/:id
emailTemplatesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const template = await db.query(
      "SELECT * FROM email_templates WHERE id = $1",
      [id]
    );

    if (template.length === 0) {
      return res.status(404).json({ message: "Email template not found" });
    }

    res.status(200).json(keysToCamel(template[0]));
  } catch (error) {
    console.error("Error fetching email template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT: update an email template
// /email-templates/:id
emailTemplatesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, template_text, subject } = req.body;

    if (!name || template_text === undefined) {
      return res
        .status(400)
        .json({ message: "name and template_text are required" });
    }

    const updated = await db.query(
      `UPDATE email_templates
       SET name = $1, template_text = $2, subject = $3
       WHERE id = $4 RETURNING *`,
      [name, template_text, subject ?? null, id]
    );

    if (updated.length === 0) {
      return res.status(404).json({ message: "Email template not found" });
    }

    res.status(200).json(keysToCamel(updated[0]));
  } catch (error) {
    console.error("Error updating email template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: delete an email template
// /email-templates/:id
emailTemplatesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.query(
      "DELETE FROM email_templates WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Email template not found" });
    }

    res.status(200).json(keysToCamel(deleted[0]));
  } catch (error) {
    console.error("Error deleting email template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
