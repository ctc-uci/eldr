import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole } from "@/middleware";
import { Router } from "express";

export const usersRouter = Router();

// Create a Firebase custom token for an existing user
usersRouter.post("/custom-token", async (req, res) => {
  try {
    const { firebaseUid, email } = req.body as {
      firebaseUid?: string;
      email?: string;
    };

    let resolvedFirebaseUid = firebaseUid?.trim();

    if (!resolvedFirebaseUid && email?.trim()) {
      const userByEmail = await db.query(
        "SELECT firebase_uid FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [email.trim()]
      );

      if (userByEmail.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const row = keysToCamel(userByEmail[0]) as { firebaseUid?: string };
      resolvedFirebaseUid = row.firebaseUid?.trim();
    }

    if (!resolvedFirebaseUid) {
      return res
        .status(400)
        .json({ message: "firebaseUid or email is required" });
    }

    const customToken = await admin.auth().createCustomToken(resolvedFirebaseUid);
    return res.status(200).json({ customToken });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// Get all users
usersRouter.get("/", verifyRole("staff"), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users ORDER BY id ASC`);

    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get a user by ID
usersRouter.get("/:firebaseUid", verifyRole("volunteer"), async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const callerUid = res.locals.decodedToken?.uid;

    if (callerUid && callerUid !== firebaseUid) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await db.query("SELECT * FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a user by ID, both in Firebase and NPO DB
usersRouter.delete("/:firebaseUid", verifyRole("supervisor"), async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    await admin.auth().deleteUser(firebaseUid);
    const user = await db.query("DELETE FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create user
usersRouter.post("/create", async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;

    const user = await db.query(
      "INSERT INTO users (email, firebase_uid) VALUES ($1, $2) RETURNING *",
      [email, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a user by ID
usersRouter.put("/update", verifyRole("volunteer"), async (req, res) => {
  try {
    const { email, firebaseUid } = req.body;
    const callerUid = res.locals.decodedToken?.uid;

    if (callerUid && callerUid !== firebaseUid) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await db.query(
      "UPDATE users SET email = $1 WHERE firebase_uid = $2 RETURNING *",
      [email, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all users (as admin)
usersRouter.get("/admin/all", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users`);

    res.status(200).json(keysToCamel(users));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a user's password via Firebase Admin
usersRouter.put("/update-password", verifyRole("supervisor"), async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const users = await db.query(
      "SELECT firebase_uid FROM users WHERE email = $1",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firebaseUid } = keysToCamel(users[0]) as { firebaseUid: string };
    await admin.auth().updateUser(firebaseUid, { password: newPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a user's role
usersRouter.put("/update/set-role", verifyRole("supervisor"), async (req, res) => {
  try {
    const { role, firebaseUid } = req.body;

    const user = await db.query(
      "UPDATE users SET role = $1 WHERE firebase_uid = $2 RETURNING *",
      [role, firebaseUid]
    );

    res.status(200).json(keysToCamel(user));
  } catch (err) {
    res.status(400).send(err.message);
  }
});
