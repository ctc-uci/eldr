import cron from "node-cron";
import { db } from "@/db/db-pgp";
import { sendEmail } from "./emailService.js";

// This cron expression '* * * * *' means "Run every 1 minute"
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking for scheduled emails...");

  try {
    // Find emails ready to send
    const pendingEmails = await db.query(`
      SELECT * 
      FROM scheduled_emails
      WHERE status = 'pending'
      AND send_at <= NOW();
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
           SET status = 'sent', send_at = NOW()
           WHERE id = $1`,
          [email.id]
        );

        console.log(`✅ Sent scheduled email ID: ${email.id}`);

      } catch (sendError) {
        console.error(`❌ Failed to send email ID: ${email.id}`, sendError);

        // Leave status as 'pending' so it retries next cron cycle
      }
    }

  } catch (dbError) {
    console.error("Database error while checking scheduled emails:", dbError);
  }
});