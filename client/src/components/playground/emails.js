import express from "express";
import { sendEmail } from "./emailService.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    await sendEmail(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;




