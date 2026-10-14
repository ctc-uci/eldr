// TODO: keep file only if using postgresql

import dotenv from "dotenv";
import pgPromise from "pg-promise";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const host = isDev
  ? process.env.DEV_DB_HOSTNAME
  : process.env.PROD_DB_HOSTNAME;
const user = isDev
  ? process.env.DEV_DB_USERNAME
  : process.env.PROD_DB_USERNAME;
const password = isDev
  ? process.env.DEV_DB_PASSWORD
  : process.env.PROD_DB_PASSWORD;
const database = isDev
  ? process.env.DEV_DB_NAME
  : process.env.PROD_DB_NAME;
const port = isDev
  ? process.env.DEV_DB_PORT
  : process.env.PROD_DB_PORT;

export const pgp = pgPromise({});

export const db = pgp({
  host,
  user,
  password,
  database,
  port: Number(port),
  ssl: {
    rejectUnauthorized: false,
  },
});

// Auto-run migration 002 if needed so verbal_proficiency and written_proficiency exist
(async () => {
  try {
    await db.none(`
      DO $$ BEGIN
          CREATE TYPE verbal_proficiency AS ENUM (
              'Native/Bilingual',
              'Professional',
              'Limited Working',
              'Elementary'
          );
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
          CREATE TYPE written_proficiency AS ENUM (
              'Native/Bilingual',
              'Professional',
              'Limited Working',
              'Elementary'
          );
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;

      ALTER TABLE public.case_languages 
          ADD COLUMN IF NOT EXISTS verbal_proficiency verbal_proficiency,
          ADD COLUMN IF NOT EXISTS written_proficiency written_proficiency;

      ALTER TABLE public.clinic_languages 
          ADD COLUMN IF NOT EXISTS verbal_proficiency verbal_proficiency,
          ADD COLUMN IF NOT EXISTS written_proficiency written_proficiency;

      ALTER TABLE public.volunteer_language 
          ADD COLUMN IF NOT EXISTS verbal_proficiency verbal_proficiency,
          ADD COLUMN IF NOT EXISTS written_proficiency written_proficiency;
    `);
  } catch (err) {
    console.error("Auto-migration check error:", err?.message);
  }
})();

