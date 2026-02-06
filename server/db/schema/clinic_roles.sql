CREATE TABLE IF NOT EXISTS clinic_roles (
    clinic_id INTEGER NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, role_id)
);