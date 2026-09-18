CREATE TABLE IF NOT EXISTS public.workshop_types
(
    id SERIAL PRIMARY KEY,
    workshop_type TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clinic_workshop_types
(
    clinic_id INT NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    workshop_type_id INT NOT NULL REFERENCES public.workshop_types(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, workshop_type_id)
);

CREATE TABLE IF NOT EXISTS public.volunteer_workshop_types
(
    volunteer_id INT NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
    workshop_type_id INT NOT NULL REFERENCES public.workshop_types(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, workshop_type_id)
);