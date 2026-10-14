-- Migration: Support flexible workshop types and one-offs on clinics
DO $$ BEGIN
    ALTER TABLE public.clinics ALTER COLUMN type TYPE TEXT;
EXCEPTION
    WHEN others THEN null;
END $$;
