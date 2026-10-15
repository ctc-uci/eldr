-- Table: public.volunteers

CREATE TABLE IF NOT EXISTS public.volunteers
(
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    secondary_phone_number TEXT,
    is_primary_mobile BOOLEAN DEFAULT FALSE,
    is_secondary_mobile BOOLEAN DEFAULT FALSE,
    can_text BOOLEAN DEFAULT FALSE,
    form_completed BOOLEAN,
    form_link TEXT,
    is_signed_confidentiality TIMESTAMP,
    is_attorney BOOLEAN,
    is_notary BOOLEAN,
    notary_status TEXT DEFAULT 'no',
    is_california_licensed BOOLEAN DEFAULT FALSE,
    affiliated_employer TEXT,
    law_school_year TEXT,
    state_bar_certificate TEXT,
    state_bar_number TEXT,
    listed_experience TEXT,
    FOREIGN KEY (id) REFERENCES users(id)
);
