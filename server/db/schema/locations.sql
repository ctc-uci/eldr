-- Locations is seeded and never directly edited in-app
CREATE TABLE IF NOT EXISTS public.locations
(
    id SERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.volunteer_locations
(
    volunteer_id INT REFERENCES public.volunteers(id) ON DELETE CASCADE,
    location_id INT REFERENCES public.locations(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, location_id)
);