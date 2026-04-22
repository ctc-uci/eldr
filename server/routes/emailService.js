import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const emailDebugEnabled =
  String(process.env.EMAIL_DEBUG || "").toLowerCase() === "true";

const logEmail = (level, message, meta) => {
  const fn = level === "error" ? console.error : console.log;
  if (level === "debug" && !emailDebugEnabled) return;
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  fn(`[email] ${message}${suffix}`);
};

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

// This is safe: it verifies connectivity/auth but doesn't log secrets.
transporter
  .verify()
  .then(() => {
    logEmail("debug", "SMTP transporter verified", {
      host: "smtp.gmail.com",
      port: 587,
      userConfigured: Boolean(process.env.EMAIL),
      passConfigured: Boolean(process.env.EMAIL_PASS),
    });
  })
  .catch((err) => {
    logEmail("error", "SMTP transporter verify failed", {
      code: err?.code,
      message: err?.message,
      response: err?.response,
      responseCode: err?.responseCode,
      command: err?.command,
      userConfigured: Boolean(process.env.EMAIL),
      passConfigured: Boolean(process.env.EMAIL_PASS),
    });
  });

export async function sendEmail({ to, subject, html }) {
  const from = process.env.EMAIL;
  if (!from) {
    throw new Error("EMAIL env is not set (required as SMTP user / From address)");
  }

  logEmail("debug", "sendEmail called", {
    fromConfigured: Boolean(from),
    to: to ? String(to) : "",
    subject: subject ? String(subject) : "",
    htmlLength: html ? String(html).length : 0,
  });

  let info;
  try {
    info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (err) {
    logEmail("error", "sendMail failed", {
      code: err?.code,
      message: err?.message,
      response: err?.response,
      responseCode: err?.responseCode,
      command: err?.command,
      to: to ? String(to) : "",
      subject: subject ? String(subject) : "",
    });
    throw err;
  }

  logEmail("debug", "sendMail ok", {
    messageId: info?.messageId,
    accepted: info?.accepted,
    rejected: info?.rejected,
    response: info?.response,
  });

  return info;
}
