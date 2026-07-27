-- Add ON DELETE CASCADE to volunteers -> users foreign key
-- This allows deleting from users to cascade-delete the volunteers row

ALTER TABLE volunteers DROP CONSTRAINT IF EXISTS volunteers_id_fkey;
ALTER TABLE volunteers ADD CONSTRAINT volunteers_id_fkey
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE;
