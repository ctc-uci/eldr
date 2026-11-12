-- Table: public.tags

CREATE TABLE IF NOT EXISTS public.tags
(
    id SERIAL PRIMARY KEY,
    tag TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.volunteer_tags
(
    volunteer_id INT REFERENCES public.volunteers(id) ON DELETE CASCADE,
    tag_id INT REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.case_tags
(
    case_id INT REFERENCES public.cases(id) ON DELETE CASCADE,
    tag_id INT REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (case_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.clinic_tags
(
    clinic_id INT REFERENCES public.clinics(id) ON DELETE CASCADE,
    tag_id INT REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, tag_id)
);
