DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  calendar_email TEXT,
  is_supervisor BOOLEAN NOT NULL DEFAULT FALSE,
  phone_number TEXT,
  secondary_phone_number TEXT,
  is_primary_mobile BOOLEAN DEFAULT FALSE,
  is_secondary_mobile BOOLEAN DEFAULT FALSE,
  can_text BOOLEAN DEFAULT FALSE,
  start_date DATE,
  FOREIGN KEY (id) REFERENCES users(id)
);
