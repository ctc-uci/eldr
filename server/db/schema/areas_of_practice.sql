CREATE TABLE areas_of_practice (
    id SERIAL PRIMARY KEY,
    areas_of_practice TEXT
);

CREATE TABLE case_areas_of_practice (
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    area_of_practice_id INTEGER REFERENCES areas_of_practice(id) ON DELETE CASCADE,
    PRIMARY KEY (case_id, area_of_practice_id)
);

CREATE TABLE clinic_areas_of_practice (
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    area_of_practice_id INTEGER REFERENCES areas_of_practice(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, area_of_practice_id)
);

CREATE TABLE volunteer_specializations (
  volunteer_id INT,
  area_of_practice_id INT,
  experience_level experience_level NOT NULL,
  PRIMARY KEY (volunteer_id, area_of_practice_id),
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
  FOREIGN KEY (area_of_practice_id) REFERENCES areas_of_practice(id) ON DELETE CASCADE
)

