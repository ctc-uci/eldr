import { db } from "@/db/db-pgp";
import cron from "node-cron";

import { sendEmail } from "./emailService.js";
import { parseAndStripScheduledEmailEventMarker } from "./scheduledEmailEventMarker.js";
import { renderClinicEmailTemplate } from "../common/clinicEmailTemplate.js";

async function distinctRegistrantEmails(clinicId) {
  const rows = await db.query(
    `
    SELECT v.first_name, v.last_name, v.email
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
    const first = String(r.first_name ?? "").trim();
    const last = String(r.last_name ?? "").trim();
    const fullName = [first, last].filter(Boolean).join(" ");
    out.push({
      email: raw,
      name: fullName || first || "",
    });
  }
  return out;
}

async function getClinicEmailContext(clinicId) {
  const rows = await db.query(
    `SELECT name, description, start_time, end_time, date, parking, address, city, state, zip, meeting_link
     FROM clinics
     WHERE id = $1
     LIMIT 1`,
    [clinicId]
  );
  return rows?.[0] ?? null;
}

/**
 * Sends due rows from scheduled_emails (id, to_email, subject, body, send_at).
 * Deletes each row before sending.
 * Optional `<!--eldr-event:ID-->` prefix in body fans the same HTML out to registered volunteers.
 */
cron.schedule("* * * * *", async () => {
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
      const parsed = parseAndStripScheduledEmailEventMarker(email.body);
      const clinicId = email.clinic_id ?? parsed.clinicId;
      const bodyHtml = parsed.html;
      const clinic = clinicId != null ? await getClinicEmailContext(clinicId) : null;
      const registrants = clinicId != null ? await distinctRegistrantEmails(clinicId) : [];
      const primaryRegistrant = registrants.find(
        (r) => r.email.toLowerCase() === String(email.to_email ?? "").trim().toLowerCase()
      );
      const renderedSubject = clinic
        ? renderClinicEmailTemplate(email.subject, clinic, { name: primaryRegistrant?.name })
        : email.subject;
      const renderedBody = clinic
        ? renderClinicEmailTemplate(bodyHtml, clinic, { name: primaryRegistrant?.name })
        : bodyHtml;

      try {
        const primaryInfo = await sendEmail({
          to: email.to_email,
          subject: renderedSubject,
          html: renderedBody,
        });
        console.log(
          `✅ Sent scheduled email ID: ${email.id} → to=${email.to_email}${
            primaryInfo?.messageId ? ` messageId=${primaryInfo.messageId}` : ""
          }`
        );

        if (clinicId != null) {
          let ok = 0;
          for (const recipient of registrants) {
            const perRecipientSubject = clinic
              ? renderClinicEmailTemplate(email.subject, clinic, { name: recipient.name })
              : email.subject;
            const perRecipientBody = clinic
              ? renderClinicEmailTemplate(bodyHtml, clinic, { name: recipient.name })
              : bodyHtml;
            try {
              await sendEmail({
                to: recipient.email,
                subject: perRecipientSubject,
                html: perRecipientBody,
              });
              ok += 1;
            } catch (regErr) {
              console.error(
                `❌ Scheduled email ID ${email.id}: failed send to registrant ${recipient.email}`,
                regErr
              );
            }
          }
          console.log(
            `📧 Scheduled email ID ${email.id}: fan-out to ${ok}/${registrants.length} registrants (clinic ${clinicId})`
          );
        }
      } catch (sendError) {
        console.error(`❌ Failed to send scheduled email ID: ${email.id}`, sendError);
        try {
          await db.query(
            `INSERT INTO scheduled_emails (clinic_id, to_email, subject, body, send_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [email.clinic_id ?? null, email.to_email, email.subject, email.body, email.send_at]
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
