CREATE TYPE verbal_proficiency AS ENUM ('Native/Bilingual', 'Professional', 'Limited Working', 'Elementary');
CREATE TYPE written_proficiency AS ENUM ('Native/Bilingual', 'Professional', 'Limited Working', 'Elementary');

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
    verbal_proficiency verbal_proficiency NOT NULL,
    written_proficiency written_proficiency NOT NULL,
    PRIMARY KEY (case_id, language_id),
    FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.clinic_languages
(
    clinic_id INT NOT NULL,
    language_id INT NOT NULL,
    verbal_proficiency verbal_proficiency NOT NULL,
    written_proficiency written_proficiency NOT NULL,
    PRIMARY KEY (clinic_id, language_id),
    FOREIGN KEY (clinic_id) REFERENCES public.clinics(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.volunteer_language
(
    volunteer_id INT NOT NULL,
    language_id INT NOT NULL,
    verbal_proficiency verbal_proficiency NOT NULL,
    written_proficiency written_proficiency NOT NULL,
    PRIMARY KEY (volunteer_id, language_id),
    FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE
);

