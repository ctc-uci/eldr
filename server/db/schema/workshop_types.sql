CREATE TABLE IF NOT EXISTS public.workshop_types
(
    id SERIAL PRIMARY KEY,
    workshop_type TEXT UNIQUE NOT NULL
);