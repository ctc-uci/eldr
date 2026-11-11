-- Migration 006: Convert email_template_folders to composite primary key
-- Drops the synthetic identity/serial `id` column and replaces the UNIQUE constraint
-- with a composite PRIMARY KEY (email_template_id, folder_id).

DO $$
DECLARE
    r RECORD;
BEGIN
    -- 1. Drop existing primary key on `id` and the `id` column if present
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'email_template_folders'
          AND column_name = 'id'
    ) THEN
        FOR r IN (
            SELECT c.conname
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
            WHERE t.relname = 'email_template_folders'
              AND c.contype = 'p'
              AND a.attname = 'id'
        ) LOOP
            EXECUTE format('ALTER TABLE public.email_template_folders DROP CONSTRAINT %I', r.conname);
        END LOOP;

        ALTER TABLE public.email_template_folders DROP COLUMN IF EXISTS id;
    END IF;

    -- 2. Drop any legacy unique constraint on (email_template_id, folder_id)
    FOR r IN (
        SELECT c.conname
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'email_template_folders'
          AND c.contype = 'u'
    ) LOOP
        EXECUTE format('ALTER TABLE public.email_template_folders DROP CONSTRAINT %I', r.conname);
    END LOOP;

    -- 3. Add composite PRIMARY KEY if table doesn't already have one
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'email_template_folders'
          AND c.contype = 'p'
    ) THEN
        ALTER TABLE public.email_template_folders
            ADD CONSTRAINT email_template_folders_pkey PRIMARY KEY (email_template_id, folder_id);
    END IF;
END $$;
