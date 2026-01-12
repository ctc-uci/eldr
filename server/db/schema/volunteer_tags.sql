-- Table: public.volunteer_tags

CREATE TABLE IF NOT EXISTS public.volunteer_tags
(
    id SERIAL PRIMARY KEY,
    volunteer_id INT,
    tag_id INT, 

    FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id),
    FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
