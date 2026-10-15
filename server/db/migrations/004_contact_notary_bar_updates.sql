-- Migration 004: Contact, Notary, and Bar Admission Updates for Volunteers and Admins

-- Update volunteers table
ALTER TABLE public.volunteers
    ADD COLUMN IF NOT EXISTS secondary_phone_number TEXT,
    ADD COLUMN IF NOT EXISTS is_primary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_secondary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS can_text BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS notary_status TEXT DEFAULT 'no',
    ADD COLUMN IF NOT EXISTS is_california_licensed BOOLEAN DEFAULT FALSE;

-- Migrate existing is_notary boolean data to notary_status if not already set
UPDATE public.volunteers
SET notary_status = CASE
    WHEN is_notary = TRUE THEN 'active'
    WHEN is_notary = FALSE THEN 'inactive'
    ELSE 'no'
END
WHERE notary_status IS NULL OR notary_status = 'no';

-- Update admins table
ALTER TABLE public.admins
    ADD COLUMN IF NOT EXISTS secondary_phone_number TEXT,
    ADD COLUMN IF NOT EXISTS is_primary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_secondary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS can_text BOOLEAN DEFAULT FALSE;
