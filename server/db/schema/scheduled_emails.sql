-- Table: public.scheduled_emails

CREATE TABLE scheduled_emails (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name scheduled_emails_id_seq),
  clinic_id integer REFERENCES clinics(id) ON DELETE CASCADE,
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  send_at timestamp NOT NULL
);

-- Helps optimizing queries that fetch scheduled emails for a clinic ordered by send time
CREATE INDEX scheduled_emails_clinic_id_send_at_idx
  ON scheduled_emails (clinic_id, send_at);

