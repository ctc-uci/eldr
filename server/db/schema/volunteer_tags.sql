-- Table: public.volunteer_tags

CREATE TABLE IF NOT EXISTS public.volunteer_tags
(
    volunteer_id INT REFERENCES public.volunteers(id),
    tag_id INT REFERENCES public.tags(id),
    PRIMARY KEY (volunteer_id, tag_id)
);
