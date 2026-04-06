import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import express from "express";

import { sendEmail } from "./emailService.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    await sendEmail(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post("/schedule", async (req, res) => {
  try {
    const { to_email, subject, body, send_at } = req.body;

    const query = `
      INSERT INTO scheduled_emails (to_email, subject, body, send_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [to_email, subject, body, send_at];

    const newEmail = await db.query(query, values);

    res.status(200).json({
      success: true,
      queuedEmail: keysToCamel(newEmail)[0],
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(400).send(err.message);
  }
});

export default router;
