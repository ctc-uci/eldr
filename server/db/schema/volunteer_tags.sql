-- Table: public.volunteer_tags

CREATE TABLE IF NOT EXISTS public.volunteer_tags
(
    volunteer_id INT REFERENCES public.volunteers(id) ON DELETE CASCADE,
    tag_id INT REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (volunteer_id, tag_id)
);
