-- Table: public.scheduled_emails

CREATE TABLE "scheduled_emails" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scheduled_emails_id_seq"),
  "to_email" text NOT NULL,
  "subject" text NOT NULL,
  "body" text NOT NULL,
  "send_at" timestamp NOT NULL
);

