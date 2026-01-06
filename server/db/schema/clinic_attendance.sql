CREATE TABLE clinic_attendance(
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES volunteers(id),
    clinic_id INTEGER REFERENCES clinics(id)
);