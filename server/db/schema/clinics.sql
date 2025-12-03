CREATE TYPE experience_level_enum AS ENUM('beginner', 'intermediate', 'expert');

CREATE TABLE clinics (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    location TEXT,
    time TIMESTAMP,
    date DATE,
    attendees INTEGER,
    experience_level experience_level_enum,
    parking TEXT
);
