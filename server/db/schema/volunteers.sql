-- Table: public.volunteers

CREATE TABLE IF NOT EXISTS public.volunteers
(
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone_number TEXT,
    is_notary BOOLEAN,
    role TEXT,
    experience_level TEXT,
    donor_id INT,
    form_completed BOOLEAN,
    form_link TEXT,
    is_signed_confidentiality TIMESTAMP NULL,

    FOREIGN KEY (donor_id) REFERENCES public.donors(id)
);
