# Asment Task Manager - Backend Server

This directory contains the Node.js backend for the Asment Task Manager application. It uses Express to provide a RESTful API and connects to a PostgreSQL database.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed (v14 or later).
- **PostgreSQL**: You need a running instance of PostgreSQL. You can install it locally or use a cloud service like ElephantSQL or AWS RDS.

## 1. Setup the Database

1.  **Create a database** in PostgreSQL. You can name it `asment_task_manager`.
2.  **Create a user** (role) with a password that has privileges on this database.

## 2. Configure Environment Variables

1.  In the `server` directory, create a new file named `.env`.
2.  Add the following content to the `.env` file, replacing the placeholder values with your actual database credentials:

    ```env
    # The port for the backend server to run on
    PORT=3001

    # Your PostgreSQL connection string
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/asment_task_manager"
    ```

## 3. Install Backend Dependencies

Navigate to the `server` directory and run:

```bash
npm install
```

## 4. Initialize the Database Schema

Run the `init.sql` script to create all the necessary tables and types in your database. You can do this using the `psql` command-line tool:

```bash
psql -U your_db_user -d asment_task_manager -f init.sql
```

You will be prompted for your user's password.

## 5. (Optional) Seed the Database with Initial Data

To populate the database with the initial set of users (so you can log in), you will need to run a seed script.

*First, I will create this seed script for you in the next step.*

Once the script is created, you will run it with:
```bash
node seed.js
```

## 6. Run the Backend Server

You can run the server in two modes:

-   **Development Mode** (with automatic reloading on file changes):

    ```bash
    npm run dev
    ```

-   **Production Mode**:

    ```bash
    npm start
    ```

The server will start on the port specified in your `.env` file (e.g., `http://localhost:3001`).
