-- Migration: create admin_archived table

CREATE TABLE IF NOT EXISTS public.admin_archived
(
    id             SERIAL PRIMARY KEY,
    admin_id       INTEGER NOT NULL UNIQUE,
    archived_date  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reactivation   TEXT,
    archived_notes TEXT,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
