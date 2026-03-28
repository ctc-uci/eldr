CREATE TYPE location_type AS ENUM ('in-person', 'hybrid', 'online');
CREATE TYPE clinic_type AS ENUM (
    'Estate Planning',
    'Limited Conservatorship',
    'Probate Note Clearing'
); -- Can add more types as needed

CREATE TABLE clinics (
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    date DATE NOT NULL,
    attendees INT NOT NULL DEFAULT 0 CHECK (attendees >= 0),
    min_attendees INT NOT NULL CHECK (min_attendees > 0),
    capacity INT NOT NULL CHECK (capacity > 0),
    max_target_roles INT,
    parking TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    meeting_link TEXT,
    location_type location_type,
    type clinic_type
);

CREATE TABLE clinic_registration (
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    has_attended BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (volunteer_id, clinic_id)
);