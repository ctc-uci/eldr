CREATE TABLE workshop_attendance (
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    workshop_id INTEGER REFERENCES workshops(id) ON DELETE CASCADE
);