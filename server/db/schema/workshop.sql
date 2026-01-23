CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TABLE workshops (
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    time TIMESTAMPTZ NOT NULL,
    date DATE NOT NULL,
    attendees INT NOT NULL DEFAULT 0 CHECK (attendees >= 0),
    language TEXT,
    experience_level experience_level NOT NULL,
    parking TEXT
);

CREATE TABLE workshop_attendance (
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    workshop_id INTEGER REFERENCES workshops(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, workshop_id)
);