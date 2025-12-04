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