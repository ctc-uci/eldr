import { sendEmail } from "./emailService.js";

async function runTest() {
  try {
    await sendEmail({
      to: "dlacuata@uci.edu, jmsulli3@uci.edu, carsonmd@uci.edu, lsiu2@uci.edu, darrenjz@uci.edu, adarsv1@uci.edu, justitt6@uci.edu",
      subject: "ELDR Playground Test",
      html: "<h1>Email works 🎉</h1><p>If you see this, Nodemailer is working.</p>",
    });
    console.log("Success!");
  } catch (err) {
    console.error("Error:", err);
  }
}

runTest();