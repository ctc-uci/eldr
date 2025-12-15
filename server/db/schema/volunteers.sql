-- Table: public.volunteers

CREATE TABLE IF NOT EXISTS public.volunteers
(
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    is_notary BOOLEAN,
    role TEXT,
    experience_level experience_level NOT NULL,
    form_completed BOOLEAN,
    form_link TEXT,
    is_signed_confidentiality TIMESTAMP
);
