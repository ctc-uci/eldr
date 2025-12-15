DROP TABLE IF EXISTS cases CASCADE;

CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  email_contact TEXT NOT NULL
);
