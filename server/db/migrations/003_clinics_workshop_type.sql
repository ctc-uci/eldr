-- Migration: Support flexible workshop types and one-offs on clinics
-- Only convert when the column is not already TEXT (makes the migration
-- re-runnable). Any other failure is intentionally NOT swallowed so a broken
-- conversion can't be reported as success while leaving the enum in place.
DO $$ BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'clinics'
          AND column_name = 'type'
          AND data_type <> 'text'
    ) THEN
        ALTER TABLE public.clinics ALTER COLUMN type TYPE TEXT USING type::text;
    END IF;
END $$;
