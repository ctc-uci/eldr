CREATE TABLE clinic_attendence(
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES volunteers(id),
    clinic_id INTEGER REFERENCES clinics(id)
);