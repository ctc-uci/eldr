CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL
)

CREATE TABLE volunteer_roles (
    volunteer_id INT NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, role_id)
);

CREATE TABLE clinic_roles (
    clinic_id INT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, role_id)
);