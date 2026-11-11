DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.areas_of_practice (
    id SERIAL PRIMARY KEY,
    areas_of_practice TEXT
);

CREATE TABLE IF NOT EXISTS public.case_areas_of_practice (
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    area_of_practice_id INTEGER REFERENCES areas_of_practice(id) ON DELETE CASCADE,
    PRIMARY KEY (case_id, area_of_practice_id)
);

CREATE TABLE IF NOT EXISTS public.clinic_areas_of_practice (
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    area_of_practice_id INTEGER REFERENCES areas_of_practice(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, area_of_practice_id)
);

CREATE TABLE IF NOT EXISTS public.volunteer_areas_of_practice (
    volunteer_id INT REFERENCES volunteers(id) ON DELETE CASCADE,
    area_of_practice_id INT REFERENCES areas_of_practice(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, area_of_practice_id)
);

CREATE TABLE IF NOT EXISTS public.volunteer_specializations (
    volunteer_id INT REFERENCES volunteers(id) ON DELETE CASCADE,
    area_of_practice_id INT REFERENCES areas_of_practice(id) ON DELETE CASCADE,
    experience_level experience_level NOT NULL,
    PRIMARY KEY (volunteer_id, area_of_practice_id)
);
