DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  calendar_email TEXT,
  is_supervisor BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (id) REFERENCES users(id)
);
