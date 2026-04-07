-- Table: public.volunteers

CREATE TABLE IF NOT EXISTS public.volunteers
(
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    is_notary BOOLEAN,
    is_attorney BOOLEAN,
    form_completed BOOLEAN,
    form_link TEXT,
    is_signed_confidentiality TIMESTAMP,
    affiliated_employer TEXT,
    law_school_year TEXT,
    state_bar_certificate TEXT,
    state_bar_number TEXT,
    FOREIGN KEY (id) REFERENCES users(id)
);
