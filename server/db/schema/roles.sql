CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL
)

CREATE TABLE volunter_roles (
    volunteer_id INT REFERENCES public.volunteers(id),
    role_id INT REFERENCES roles(id),
    PRIMARY KEY (volunteer_id, role_id)
);