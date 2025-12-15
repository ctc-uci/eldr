DROP TABLE IF EXISTS clinics CASCADE;
DROP TYPE IF EXISTS experience_level_enum;

CREATE TYPE experience_level AS ENUM('beginner', 'intermediate', 'advanced');

CREATE TABLE clinics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    time TIMESTAMPTZ NOT NULL,
    date DATE NOT NULL,
    attendees INTEGER NOT NULL DEFAULT 0 CHECK (attendees >= 0),
    experience_level experience_level NOT NULL,
    parking TEXT
);
