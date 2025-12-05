CREATE TABLE IF NOT EXISTS public.languages
(
    id serial,
    language TEXT NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.case_languages
(
    case_id INT NOT NULL,
    language_id INT NOT NULL,
    PRIMARY KEY (case_id, language_id),
    FOREIGN KEY (case_id) REFERENCES public.cases(id),
    FOREIGN KEY (language_id) REFERENCES public.languages(id)
);

CREATE TABLE IF NOT EXISTS public.clinic_languages
(
    clinic_id INT NOT NULL,
    language_id INT NOT NULL,
    PRIMARY KEY (clinic_id, language_id),
    FOREIGN KEY (clinic_id) REFERENCES public.clinics(id),
    FOREIGN KEY (language_id) REFERENCES public.languages(id)
);

CREATE TABLE IF NOT EXISTS public.workshop_languages
(
    workshop_id INT NOT NULL,
    language_id INT NOT NULL,
    PRIMARY KEY (workshop_id, language_id),
    FOREIGN KEY (workshop_id) REFERENCES public.workshops(id),
    FOREIGN KEY (language_id) REFERENCES public.languages(id)
);

CREATE TABLE IF NOT EXISTS public.volunteer_language
(
    volunteer_id INT NOT NULL,
    language_id INT NOT NULL,
    PRIMARY KEY (volunteer_id, language_id),
    FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id),
    FOREIGN KEY (language_id) REFERENCES public.languages(id)
);