import {
  getProfilePictureGetURL,
  getProfilePictureUploadURL,
} from "@/common/s3";
import { keysToCamel } from "@/common/utils";
import { admin } from "@/config/firebase";
import { db } from "@/db/db-pgp"; // TODO: replace this db with
import { verifyRole, verifyToken } from "@/middleware";
import { Router } from "express";

export const usersRouter = Router();

type UserRecord = Record<string, unknown>;

const enrichUserWithProfilePicture = async (user: UserRecord): Promise<UserRecord> => {
  const stored = user.profilePictureUrl;
  const storedValue = typeof stored === "string" ? stored.trim() : "";

  if (!storedValue) {
    return { ...user, profilePictureKey: null, profilePictureUrl: null };
  }

  if (storedValue.startsWith("http://") || storedValue.startsWith("https://")) {
    return { ...user, profilePictureKey: null, profilePictureUrl: storedValue };
  }

  const viewUrl = await getProfilePictureGetURL(storedValue);
  return { ...user, profilePictureKey: storedValue, profilePictureUrl: viewUrl };
};

const enrichUsersWithProfilePicture = async (users: UserRecord[]) =>
  Promise.all(users.map((user) => enrichUserWithProfilePicture(user)));

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

    // If the UID is a temp placeholder (no real Firebase Auth account, or a
    // shell account with no email created by a prior signInWithCustomToken),
    // create a proper Firebase Auth account and update the DB.
    let isTempUid = false;
    let tempUidToDelete: string | null = null;

    try {
      const fbUser = await admin.auth().getUser(resolvedFirebaseUid);
      if (!fbUser.email) {
        // Shell account created by a previous signInWithCustomToken with the fake UUID
        isTempUid = true;
        tempUidToDelete = resolvedFirebaseUid;
      }
    } catch (e: unknown) {
      const fbErr = e as { code?: string };
      if (fbErr.code === "auth/user-not-found") {
        isTempUid = true;
      } else {
        throw e;
      }
    }

    if (isTempUid) {
      const lookupEmail = email?.trim() ?? (
        await db.query("SELECT email FROM users WHERE firebase_uid = $1 LIMIT 1", [resolvedFirebaseUid])
      ).at(0)?.email;

      if (!lookupEmail) {
        return res.status(400).json({ message: "Cannot resolve email for UID" });
      }

      if (tempUidToDelete) {
        await admin.auth().deleteUser(tempUidToDelete).catch(() => {});
      }

      const newFirebaseUser = await admin.auth().createUser({ email: lookupEmail });
      const realUid = newFirebaseUser.uid;

      await db.query(
        "UPDATE users SET firebase_uid = $1 WHERE firebase_uid = $2",
        [realUid, resolvedFirebaseUid]
      );

      resolvedFirebaseUid = realUid;
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

    res.status(200).json(await enrichUsersWithProfilePicture(keysToCamel(users)));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Presigned URL for profile picture upload (must be registered before /:firebaseUid)
usersRouter.get("/profile-picture/upload-url", async (req, res) => {
  try {
    const contentType =
      typeof req.query.contentType === "string" ? req.query.contentType : "";
    const firebaseUid =
      typeof req.query.firebaseUid === "string" ? req.query.firebaseUid.trim() : "";

    if (!firebaseUid) {
      return res.status(400).json({ message: "firebaseUid is required" });
    }

    const { uploadUrl, key } = await getProfilePictureUploadURL(
      contentType,
      firebaseUid,
    );

    return res.status(200).json({ uploadUrl, key });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create upload URL";
    return res.status(400).json({ message });
  }
});

// Presigned URL for profile picture display
usersRouter.get("/profile-picture/view-url", async (req, res) => {
  try {
    const key = typeof req.query.key === "string" ? req.query.key.trim() : "";

    if (!key) {
      return res.status(400).json({ message: "key is required" });
    }

    const viewUrl = await getProfilePictureGetURL(key);
    return res.status(200).json({ viewUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create view URL";
    return res.status(400).json({ message });
  }
});

// Get a user by ID
usersRouter.get("/:firebaseUid", verifyRole("volunteer"), async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const callerUid = res.locals.decodedToken?.uid;

    if (process.env.NODE_ENV === "production" && (!callerUid || callerUid !== firebaseUid)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await db.query("SELECT * FROM users WHERE firebase_uid = $1", [
      firebaseUid,
    ]);

    const enriched = await enrichUsersWithProfilePicture(keysToCamel(user));
    res.status(200).json(enriched);
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
usersRouter.put("/update", verifyToken, async (req, res) => {
  try {
    const { email, profilePictureKey } = req.body as {
      email?: string;
      profilePictureKey?: string | null;
    };

    // Use the authenticated user's UID from the verified token
    const firebaseUid = res.locals.decodedToken?.uid;
    if (!firebaseUid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }

    if (profilePictureKey !== undefined) {
      updates.push(`profile_picture_url = $${paramIndex++}`);
      values.push(profilePictureKey);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(firebaseUid);
    const user = await db.query(
      `UPDATE users SET ${updates.join(", ")} WHERE firebase_uid = $${paramIndex} RETURNING *`,
      values,
    );

    const enriched = await enrichUsersWithProfilePicture(keysToCamel(user));
    res.status(200).json(enriched);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all users (as admin)
usersRouter.get("/admin/all", verifyRole(["staff", "supervisor"]), async (req, res) => {
  try {
    const users = await db.query(`SELECT * FROM users`);

    res.status(200).json(await enrichUsersWithProfilePicture(keysToCamel(users)));
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
