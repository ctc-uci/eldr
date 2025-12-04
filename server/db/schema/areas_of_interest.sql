CREATE TABLE areas_of_interest (
    id SERIAL PRIMARY KEY,
    areas_of_interest TEXT
);

CREATE TABLE case_areas_of_interest (
    case_id INTEGER REFERENCES cases(id),
    area_of_interest_id INTEGER REFERENCES areas_of_interest(id),
    PRIMARY KEY (case_id, area_of_interest_id)
);

CREATE TABLE clinic_areas_of_interest (
    clinic_id INTEGER REFERENCES clinics(id),
    area_of_interest_id INTEGER REFERENCES areas_of_interest(id),
    PRIMARY KEY (clinic_id, area_of_interest_id)
);

CREATE TABLE workshop_areas_of_interest (
    workshop_id INTEGER REFERENCES workshops(id),
    area_of_interest_id INTEGER REFERENCES areas_of_interest(id),
    PRIMARY KEY (workshop_id, area_of_interest_id)
);