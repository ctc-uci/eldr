-- Table: public.volunteer_archived

CREATE TABLE IF NOT EXISTS public.volunteer_archived
(
    id             SERIAL PRIMARY KEY,
    volunteer_id   INTEGER NOT NULL UNIQUE,
    archived_date  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reactivation   TEXT,
    archived_notes TEXT,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
);
