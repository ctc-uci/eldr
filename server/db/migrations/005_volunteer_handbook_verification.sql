-- Migration 005: Volunteer Handbook, Emergency Contact & Confidentiality Verification
-- Adds form_received, handbook_uploaded_at, and the 3 verification check fields

ALTER TABLE public.volunteers
    ADD COLUMN IF NOT EXISTS form_received BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS handbook_uploaded_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS handbook_acknowledged BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS emergency_contact_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS confidentiality_waiver_verified BOOLEAN DEFAULT FALSE;

-- If a volunteer already had is_signed_confidentiality set, backfill confidentiality_waiver_verified.
-- Handbooks and emergency contacts were not collected previously, so handbook_acknowledged,
-- emergency_contact_verified, and form_received remain FALSE until submitted and staff verifies them.
UPDATE public.volunteers
SET form_received = FALSE,
    handbook_acknowledged = FALSE,
    emergency_contact_verified = FALSE,
    confidentiality_waiver_verified = TRUE
WHERE is_signed_confidentiality IS NOT NULL;

