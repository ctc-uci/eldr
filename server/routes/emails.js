import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import express from "express";

import { sendEmail } from "./emailService.js";
import { embedScheduledEmailEventMarker } from "./scheduledEmailEventMarker.js";

export const emailsRouter = express.Router();

const defaultScheduleRecipient = () =>
  process.env.SCHEDULED_EMAIL_DEFAULT_TO || process.env.EMAIL || "";

/** Same rules as client `eventEmailSchedule.js` — used so send_at matches DB `start_time` + scheduler `NOW()`. */
function timingToMilliseconds(amount, unit) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 1) return 0;
  switch (unit) {
    case "minute":
      return n * 60 * 1000;
    case "hour":
      return n * 60 * 60 * 1000;
    case "day":
      return n * 24 * 60 * 60 * 1000;
    case "week":
      return n * 7 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

emailsRouter.post("/send", async (req, res) => {
  try {
    await sendEmail(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

emailsRouter.post("/schedule", async (req, res) => {
  try {
    const { to_email, subject, body, send_at } = req.body;
    const rawClinicId = req.body.clinic_id ?? req.body.clinicId;
    const clinicId = rawClinicId == null ? null : Number(rawClinicId);

    const recipient = (to_email && String(to_email).trim()) || defaultScheduleRecipient();
    if (!recipient) {
      return res.status(400).json({
        message:
          "Missing to_email. Set SCHEDULED_EMAIL_DEFAULT_TO or EMAIL in env, or pass to_email in the request body.",
      });
    }
    if (!subject || body === undefined || body === null || !send_at) {
      return res.status(400).json({
        message: "subject, body, and send_at are required",
      });
    }
    if (clinicId != null && Number.isNaN(clinicId)) {
      return res.status(400).json({ message: "clinicId (or clinic_id) must be numeric" });
    }

    const query = `
      INSERT INTO scheduled_emails (clinic_id, to_email, subject, body, send_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [clinicId, recipient, subject, body, send_at];

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

/**
 * Queue an email using the clinic's `start_time` from Postgres (same instant the DB uses for NOW()).
 * Avoids browser timezone / ISO parsing drift vs client-side computeSendAtIso.
 */
emailsRouter.post("/schedule-from-clinic", async (req, res) => {
  try {
    const { amount, unit, subject, body, to_email } = req.body;
    const clinicId = Number(req.body.clinic_id ?? req.body.clinicId);

    const recipient = (to_email && String(to_email).trim()) || defaultScheduleRecipient();
    if (!recipient) {
      return res.status(400).json({
        message:
          "Missing to_email. Set SCHEDULED_EMAIL_DEFAULT_TO or EMAIL in env, or pass to_email in the request body.",
      });
    }
    if (!subject || body === undefined || body === null) {
      return res.status(400).json({
        message: "subject and body are required",
      });
    }
    if (Number.isNaN(clinicId)) {
      return res.status(400).json({ message: "clinicId (or clinic_id) is required" });
    }

    const offsetMs = timingToMilliseconds(amount, unit);
    if (offsetMs <= 0) {
      return res.status(400).json({ message: "Invalid amount or unit for timing" });
    }

    const rows = await db.query(`SELECT start_time FROM clinics WHERE id = $1`, [clinicId]);
    if (!rows?.length) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const startRaw = rows[0].start_time;
    const startMs =
      startRaw instanceof Date ? startRaw.getTime() : new Date(startRaw).getTime();
    if (Number.isNaN(startMs)) {
      return res.status(500).json({ message: "Invalid clinic start_time" });
    }

    const sendAt = new Date(startMs - offsetMs);
    const sendAtIso = sendAt.toISOString();

    const bodyForQueue = embedScheduledEmailEventMarker(clinicId, body);

    const newEmail = await db.query(
      `INSERT INTO scheduled_emails (clinic_id, to_email, subject, body, send_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [clinicId, recipient, subject, bodyForQueue, sendAtIso]
    );

    res.status(200).json({
      success: true,
      queuedEmail: keysToCamel(newEmail)[0],
      computedSendAt: sendAtIso,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(400).send(err.message);
  }
});

emailsRouter.delete("/schedule/:id", async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const removed = await db.query(
      `DELETE FROM scheduled_emails WHERE id = $1 RETURNING id`,
      [id]
    );
    if (!removed?.length) {
      return res.status(404).json({ message: "Scheduled email not found" });
    }
    res.status(200).json({ success: true, id: removed[0].id });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send(err.message);
  }
});
