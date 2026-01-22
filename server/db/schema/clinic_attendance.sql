CREATE TABLE clinic_attendance(
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES volunteers(id) ON DELETE CASCADE,
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE
);