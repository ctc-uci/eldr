-- Migration: separate verbal and written proficiency enums and table columns

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

-- Alter case_languages
ALTER TABLE public.case_languages 
    ADD COLUMN IF NOT EXISTS verbal_proficiency verbal_proficiency,
    ADD COLUMN IF NOT EXISTS written_proficiency written_proficiency;

-- Alter clinic_languages
ALTER TABLE public.clinic_languages 
    ADD COLUMN IF NOT EXISTS verbal_proficiency verbal_proficiency,
    ADD COLUMN IF NOT EXISTS written_proficiency written_proficiency;

-- Alter volunteer_language
ALTER TABLE public.volunteer_language 
    ADD COLUMN IF NOT EXISTS verbal_proficiency verbal_proficiency,
    ADD COLUMN IF NOT EXISTS written_proficiency written_proficiency;

-- Migrate existing data if proficiency column exists
DO $$ BEGIN
    UPDATE public.case_languages
    SET verbal_proficiency = CASE
            WHEN proficiency::text ILIKE '%native%' THEN 'Native/Bilingual'::verbal_proficiency
            WHEN proficiency::text ILIKE '%professional%' THEN 'Professional'::verbal_proficiency
            ELSE 'Professional'::verbal_proficiency
        END,
        written_proficiency = CASE
            WHEN proficiency::text ILIKE '%native%' THEN 'Native/Bilingual'::written_proficiency
            WHEN proficiency::text ILIKE '%professional%' THEN 'Professional'::written_proficiency
            ELSE 'Professional'::written_proficiency
        END
    WHERE proficiency IS NOT NULL AND (verbal_proficiency IS NULL OR written_proficiency IS NULL);
EXCEPTION
    WHEN undefined_column THEN null;
END $$;

DO $$ BEGIN
    UPDATE public.clinic_languages
    SET verbal_proficiency = CASE
            WHEN proficiency::text ILIKE '%native%' THEN 'Native/Bilingual'::verbal_proficiency
            WHEN proficiency::text ILIKE '%professional%' THEN 'Professional'::verbal_proficiency
            ELSE 'Professional'::verbal_proficiency
        END,
        written_proficiency = CASE
            WHEN proficiency::text ILIKE '%native%' THEN 'Native/Bilingual'::written_proficiency
            WHEN proficiency::text ILIKE '%professional%' THEN 'Professional'::written_proficiency
            ELSE 'Professional'::written_proficiency
        END
    WHERE proficiency IS NOT NULL AND (verbal_proficiency IS NULL OR written_proficiency IS NULL);
EXCEPTION
    WHEN undefined_column THEN null;
END $$;

DO $$ BEGIN
    UPDATE public.volunteer_language
    SET verbal_proficiency = CASE
            WHEN proficiency::text ILIKE '%native%' THEN 'Native/Bilingual'::verbal_proficiency
            WHEN proficiency::text ILIKE '%professional%' THEN 'Professional'::verbal_proficiency
            ELSE 'Professional'::verbal_proficiency
        END,
        written_proficiency = CASE
            WHEN proficiency::text ILIKE '%native%' THEN 'Native/Bilingual'::written_proficiency
            WHEN proficiency::text ILIKE '%professional%' THEN 'Professional'::written_proficiency
            ELSE 'Professional'::written_proficiency
        END
    WHERE proficiency IS NOT NULL AND (verbal_proficiency IS NULL OR written_proficiency IS NULL);
EXCEPTION
    WHEN undefined_column THEN null;
END $$;

-- Set defaults and constraints
UPDATE public.case_languages SET verbal_proficiency = 'Professional'::verbal_proficiency WHERE verbal_proficiency IS NULL;
UPDATE public.case_languages SET written_proficiency = 'Professional'::written_proficiency WHERE written_proficiency IS NULL;
ALTER TABLE public.case_languages ALTER COLUMN verbal_proficiency SET NOT NULL;
ALTER TABLE public.case_languages ALTER COLUMN written_proficiency SET NOT NULL;

UPDATE public.clinic_languages SET verbal_proficiency = 'Professional'::verbal_proficiency WHERE verbal_proficiency IS NULL;
UPDATE public.clinic_languages SET written_proficiency = 'Professional'::written_proficiency WHERE written_proficiency IS NULL;
ALTER TABLE public.clinic_languages ALTER COLUMN verbal_proficiency SET NOT NULL;
ALTER TABLE public.clinic_languages ALTER COLUMN written_proficiency SET NOT NULL;

UPDATE public.volunteer_language SET verbal_proficiency = 'Professional'::verbal_proficiency WHERE verbal_proficiency IS NULL;
UPDATE public.volunteer_language SET written_proficiency = 'Professional'::written_proficiency WHERE written_proficiency IS NULL;
ALTER TABLE public.volunteer_language ALTER COLUMN verbal_proficiency SET NOT NULL;
ALTER TABLE public.volunteer_language ALTER COLUMN written_proficiency SET NOT NULL;

-- Drop old column and type if they exist
ALTER TABLE public.case_languages DROP COLUMN IF EXISTS proficiency;
ALTER TABLE public.clinic_languages DROP COLUMN IF EXISTS proficiency;
ALTER TABLE public.volunteer_language DROP COLUMN IF EXISTS proficiency;
DROP TYPE IF EXISTS PROFICIENCY_LEVEL;
