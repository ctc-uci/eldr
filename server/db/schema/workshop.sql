CREATE TABLE workshop (
    id serial PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    date DATE NOT NULL,
    attendees INT,
    language TEXT NOT NULL,
    experience_level TEXT CHECK (experience_level IN ('experienced', 'new')),
    parking TEXT
);