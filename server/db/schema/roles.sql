CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL
)

CREATE TABLE volunteer_roles (
    volunteer_id INT REFERENCES public.volunteers(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, role_id)
);