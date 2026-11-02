-- Migration 004: Contact, Notary, and Bar Admission Updates for Volunteers and Admins

-- Update volunteers table
ALTER TABLE public.volunteers
    ADD COLUMN IF NOT EXISTS secondary_phone_number TEXT,
    ADD COLUMN IF NOT EXISTS is_primary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_secondary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS can_text BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS notary_status TEXT DEFAULT 'no',
    ADD COLUMN IF NOT EXISTS is_california_licensed BOOLEAN DEFAULT FALSE;

-- Migrate existing is_notary boolean data to notary_status if not already set.
-- Note: Pre-PR admin panel had an explicit "Inactive" option that saved
-- is_notary = FALSE, but legacy FALSE also covered "Not a notary" at signup.
-- Because the legacy schema cannot distinguish between them, only TRUE maps to
-- 'active'; FALSE maps to 'no' (admin-set inactive notaries are not preserved).
UPDATE public.volunteers
SET notary_status = CASE
    WHEN is_notary = TRUE THEN 'active'
    ELSE 'no'
END
WHERE notary_status IS NULL OR notary_status = 'no';

-- Backfill the explicit California-license flag from legacy certificate values
UPDATE public.volunteers
SET is_california_licensed = TRUE
WHERE (is_california_licensed IS NULL OR is_california_licensed = FALSE)
  AND LOWER(TRIM(state_bar_certificate)) IN ('ca', 'california');

-- Update admins table
ALTER TABLE public.admins
    ADD COLUMN IF NOT EXISTS secondary_phone_number TEXT,
    ADD COLUMN IF NOT EXISTS is_primary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_secondary_mobile BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS can_text BOOLEAN DEFAULT FALSE;
