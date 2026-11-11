CREATE TABLE IF NOT EXISTS public.email_templates (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    template_text TEXT NOT NULL,
    subject TEXT
);

CREATE TABLE IF NOT EXISTS public.folders (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT
);

CREATE TABLE IF NOT EXISTS public.email_template_folders (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email_template_id INTEGER NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
    folder_id INTEGER NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
    UNIQUE(email_template_id, folder_id)
);
