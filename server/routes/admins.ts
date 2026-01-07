import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const adminsRouter = Router();

// GET /admins - get all admins
adminsRouter.get("/", async (req, res) => {
  try {
    const admins = await db.query("SELECT * FROM admins ORDER BY id ASC");
    res.status(200).json(keysToCamel(admins));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
