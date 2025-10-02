
-- Drop tables if they exist to start with a clean slate
DROP TABLE IF EXISTS task_assignments CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS task_history CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types for consistency with the frontend
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Admin', 'Chef de Département', 'Ingénieur', 'Technicien');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'department_name') THEN
        CREATE TYPE department_name AS ENUM ('Production', 'Maintenance', 'Qualité & Contrôle', 'Technologies Opérationnelles', 'Administration & RH');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM ('Haute', 'Normale', 'Basse');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('À faire', 'En cours', 'En attente de validation', 'Terminée', 'En retard');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_category') THEN
        CREATE TYPE task_category AS ENUM ('Maintenance', 'Production', 'Qualité', 'Sécurité', 'Autre');
    END IF;
END
$$;

-- Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    "role" user_role NOT NULL,
    department department_name NOT NULL,
    avatar_url VARCHAR(255),
    phone VARCHAR(255),
    -- For a real application, you would store a hashed password
    password_hash VARCHAR(255) NOT NULL
);

-- Tasks Table
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority NOT NULL,
    status task_status NOT NULL,
    category task_category NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    department department_name NOT NULL,
    created_by VARCHAR(255) REFERENCES users(id),
    before_image_url VARCHAR(255),
    after_image_url VARCHAR(255),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Task Assignments (Many-to-Many relationship between Tasks and Users)
CREATE TABLE task_assignments (
    task_id VARCHAR(255) REFERENCES tasks(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, user_id)
);

-- Task History Table
CREATE TABLE task_history (
    id VARCHAR(255) PRIMARY KEY,
    task_id VARCHAR(255) REFERENCES tasks(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    action TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
    id VARCHAR(255) PRIMARY KEY,
    task_id VARCHAR(255) REFERENCES tasks(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    "text" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Note: In a real-world scenario, you would want to add indexes for performance
-- on frequently queried columns like foreign keys (e.g., user_id, task_id).
