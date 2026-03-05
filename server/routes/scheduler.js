import cron from "node-cron";
import { db } from "@/db/db-pgp";
import { sendEmail } from "./emailService.js";

// This cron expression '* * * * *' means "Run every 1 minute"
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking for scheduled emails...");

  try {
    // 1. Find all PENDING emails where the send_at time has passed
    const findQuery = `
      SELECT * FROM scheduled_emails 
      WHERE status = 'PENDING' AND send_at <= NOW();
    `;
    const pendingEmails = await db.query(findQuery);

    if (pendingEmails.length === 0) {
      return; // Nothing to send right now
    }

    console.log(`Found ${pendingEmails.length} emails to send. Processing...`);

    // 2. Loop through each email and send it
    for (const email of pendingEmails) {
      try {
        await sendEmail({
          to: email.to_email,
          subject: email.subject,
          html: email.body,
        });

        // 3. If successful, update the status to 'SENT'
        await db.query(
          `UPDATE scheduled_emails SET status = 'SENT' WHERE id = $1`,
          [email.id]
        );
        console.log(`✅ Successfully sent scheduled email ID: ${email.id}`);

      } catch (sendError) {
        console.error(`❌ Failed to send email ID: ${email.id}`, sendError);
        
        // Optional: Mark as 'FAILED' so it doesn't keep retrying forever and crashing
        await db.query(
          `UPDATE scheduled_emails SET status = 'FAILED' WHERE id = $1`,
          [email.id]
        );
      }
    }
  } catch (dbError) {
    console.error("Database error while checking scheduled emails:", dbError);
  }
});