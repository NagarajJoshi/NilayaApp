CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gpa NUMERIC(3,2) NOT NULL,
    major VARCHAR(100) NOT NULL
);

ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS document_path VARCHAR(512);

