import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "142.251.181.109",
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
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.response);
  return info;
}



