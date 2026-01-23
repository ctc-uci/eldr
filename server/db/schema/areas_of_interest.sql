CREATE TABLE areas_of_interest (
    id SERIAL PRIMARY KEY,
    areas_of_interest TEXT
);

CREATE TABLE case_areas_of_interest (
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    area_of_interest_id INTEGER REFERENCES areas_of_interest(id) ON DELETE CASCADE,
    PRIMARY KEY (case_id, area_of_interest_id)
);

CREATE TABLE clinic_areas_of_interest (
    clinic_id INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
    area_of_interest_id INTEGER REFERENCES areas_of_interest(id) ON DELETE CASCADE,
    PRIMARY KEY (clinic_id, area_of_interest_id)
);

CREATE TABLE event_areas_of_interest (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    area_of_interest_id INTEGER REFERENCES areas_of_interest(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, area_of_interest_id)
);