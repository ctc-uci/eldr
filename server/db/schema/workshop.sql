CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TABLE workshops (
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    time TIMESTAMPZ NOT NULL,
    date DATE NOT NULL,
    attendees INT NOT NULL DEFAULT 0 CHECK (attendees >= 0),
    language TEXT,
    experience_level experience_level NOT NULL,
    parking TEXT
);
