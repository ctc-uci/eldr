import { db } from "@/db/db-pgp";
import cron from "node-cron";

import { sendEmail } from "./emailService.js";

// This cron expression '* * * * *' means "Run every 1 minute"
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking for scheduled emails...");

  try {
    // Claim rows atomically so overlapping cron ticks (or multiple workers) cannot
    // process the same pending rows before any UPDATE commits.
    const pendingEmails = await db.query(`
      UPDATE scheduled_emails
      SET status = 'sending'
      WHERE status = 'pending'
        AND send_at <= NOW()
      RETURNING *;
    `);

    if (pendingEmails.length === 0) {
      return;
    }

    console.log(`Found ${pendingEmails.length} emails to send.`);

    for (const email of pendingEmails) {
      try {
        await sendEmail({
          to: email.to_email,
          subject: email.subject,
          html: email.body,
        });

        // Mark as sent
        await db.query(
          `UPDATE scheduled_emails
           SET status = 'sent'
           WHERE id = $1`,
          [email.id]
        );

        console.log(`✅ Sent scheduled email ID: ${email.id}`);
      } catch (sendError) {
        console.error(`❌ Failed to send email ID: ${email.id}`, sendError);

        await db.query(
          `UPDATE scheduled_emails SET status = 'pending' WHERE id = $1`,
          [email.id]
        );
      }
    }
  } catch (dbError) {
    console.error("Database error while checking scheduled emails:", dbError);
  }
});
