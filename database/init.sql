CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gpa NUMERIC(3,2) NOT NULL,
    major VARCHAR(100) NOT NULL
);

ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS document_path VARCHAR(512);

-- Create User Accounts
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT'
);

-- Re-link Profile to user account securely
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE CASCADE;
