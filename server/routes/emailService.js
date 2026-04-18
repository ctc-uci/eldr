import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail({ to, subject, html }) {
  const from = process.env.EMAIL;
  if (!from) {
    throw new Error("EMAIL env is not set (required as SMTP user / From address)");
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return info;
}
