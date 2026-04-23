import { db } from "@/db/db-pgp";
import schedule from "node-schedule";

import { sendEmail } from "./emailService.js";
import { parseAndStripScheduledEmailEventMarker } from "./scheduledEmailEventMarker.js";

async function distinctRegistrantEmails(clinicId) {
  const rows = await db.query(
    `
    SELECT v.email
    FROM clinic_registration cr
    JOIN volunteers v ON v.id = cr.volunteer_id
    WHERE cr.clinic_id = $1
      AND v.email IS NOT NULL
      AND trim(v.email) <> ''
    `,
    [clinicId]
  );
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const raw = String(r.email ?? "").trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(raw);
  }
  return out;
}

/**
 * Sends due rows from scheduled_emails (id, to_email, subject, body, send_at).
 * Deletes each row before sending so no extra columns are required.
 * Optional `<!--eldr-event:ID-->` prefix in body fans the same HTML out to registered volunteers.
 */
schedule.scheduleJob("* * * * *", async () => {
  try {
    // Process one row per iteration to avoid long locks; loop until none due.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const batch = await db.query(`
        DELETE FROM scheduled_emails
        WHERE id = (
          SELECT id FROM scheduled_emails
          WHERE send_at <= NOW()
          ORDER BY send_at ASC
          LIMIT 1
        )
        RETURNING *;
      `);

      if (!batch?.length) {
        break;
      }

      const email = batch[0];
      const { clinicId, html: bodyHtml } = parseAndStripScheduledEmailEventMarker(email.body);

      try {
        const primaryInfo = await sendEmail({
          to: email.to_email,
          subject: email.subject,
          html: bodyHtml,
        });
        console.log(
          `✅ Sent scheduled email ID: ${email.id} → to=${email.to_email}${
            primaryInfo?.messageId ? ` messageId=${primaryInfo.messageId}` : ""
          }`
        );

        if (clinicId != null) {
          const recipients = await distinctRegistrantEmails(clinicId);
          let ok = 0;
          for (const to of recipients) {
            try {
              await sendEmail({
                to,
                subject: email.subject,
                html: bodyHtml,
              });
              ok += 1;
            } catch (regErr) {
              console.error(
                `❌ Scheduled email ID ${email.id}: failed send to registrant ${to}`,
                regErr
              );
            }
          }
          console.log(
            `📧 Scheduled email ID ${email.id}: fan-out to ${ok}/${recipients.length} registrants (clinic ${clinicId})`
          );
        }
      } catch (sendError) {
        console.error(`❌ Failed to send scheduled email ID: ${email.id}`, sendError);
        try {
          await db.query(
            `INSERT INTO scheduled_emails (to_email, subject, body, send_at)
             VALUES ($1, $2, $3, $4)`,
            [email.to_email, email.subject, email.body, email.send_at]
          );
          console.log(`↩ Re-queued failed email (was ID ${email.id})`);
        } catch (requeueErr) {
          console.error("Failed to re-queue email:", requeueErr);
        }
      }
    }
  } catch (dbError) {
    console.error("Database error while processing scheduled emails:", dbError);
  }
});
