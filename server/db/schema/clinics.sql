CREATE TABLE clinics (
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    date DATE NOT NULL,
    attendees INT NOT NULL DEFAULT 0 CHECK (attendees >= 0),
    min_attendees INT NOT NULL CHECK (min_attendees > 0),
    capacity INT NOT NULL CHECK (capacity > 0),
    max_target_roles INT NOT NULL,
    parking TEXT
);

CREATE TABLE clinic_attendance (
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, clinic_id)
);