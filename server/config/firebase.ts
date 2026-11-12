import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import firebaseAdmin, { type ServiceAccount } from "firebase-admin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
// Use FIREBASE_SERVICE_ACCOUNT_JSON (full JSON string) from .env when set; otherwise use firebase-adminsdk.json / eldr-firebase-sdk.json
function getServiceAccount(): ServiceAccount | null {
  const fromEnv =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT;
  if (fromEnv) {
    try {
      const trimmed = fromEnv.trim();
      if (trimmed.startsWith("{")) {
        return JSON.parse(trimmed) as ServiceAccount;
      }
      const decoded = Buffer.from(trimmed, "base64").toString("utf-8");
      return JSON.parse(decoded) as ServiceAccount;
    } catch (e) {
      console.error("Failed to parse Firebase service account from environment:", e);
    }
  }

  const candidateFiles = ["eldr-firebase-sdk.json", "firebase-adminsdk.json"];
  for (const file of candidateFiles) {
    const jsonPath = path.resolve(__dirname, file);
    if (fs.existsSync(jsonPath)) {
      try {
        const raw = fs.readFileSync(jsonPath, "utf-8");
        return JSON.parse(raw) as ServiceAccount;
      } catch (e) {
        console.error(`Failed to parse ${file}:`, e);
      }
    }
  }
  return null;
}

const serviceAccount = getServiceAccount();

export const admin = firebaseAdmin.apps.length
  ? firebaseAdmin.app()
  : firebaseAdmin.initializeApp(
      serviceAccount
        ? { credential: firebaseAdmin.credential.cert(serviceAccount) }
        : {}
    );
