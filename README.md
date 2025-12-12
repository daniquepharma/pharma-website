# Danique Pharma Website

Welcome to the Danique Pharma repository! This is a modern pharmaceutical website built with Next.js, Postgres, and Docker.

This guide is designed to be **beginner-friendly**. Follow the steps below to get the project up and running on your machine.

---

## 📋 Prerequisites

Before you start, make sure you have the following installed:

1.  **Git**: To clone the repository. [Download Git](https://git-scm.com/downloads)
2.  **Docker Desktop**: To run the project easily in containers. [Download Docker](https://www.docker.com/products/docker-desktop/)
3.  **Node.js** (Optional, for local dev): If you want to run without Docker. [Download Node.js](https://nodejs.org/)

---

## 🚀 Quick Start (Using Docker) - Recommended

The easiest way to run the project is using Docker. It sets up the database and the website for you automatically.

1.  **Clone the Repository**
    Open your terminal or command prompt and run:
    ```bash
    git clone <repository-url>
    cd pharma
    ```

2.  **Start the Application**
    Run the following command to build and start the services:
    ```bash
    docker compose up --build
    ```
    *Note: The first time you run this, it might take a few minutes to download images and build the app.*
    
    > **Good to know**: 
    > 1. You do **NOT** need to install PostgreSQL or Node.js on your computer when using Docker.
    > 2. You do **NOT** need to create a `.env` file for Docker. The settings are pre-configured in `docker-compose.yml`.

3.  **Access the Website**
    Once the command finishes and you see logs indicating the server is running, open your browser and go to:
    [http://localhost:3000](http://localhost:3000)

4.  **Stopping the App**
    To stop the application, press `Ctrl + C` in the terminal, or run:
    ```bash
    docker compose down
    ```

---

## 🛠️ Local Development Setup (Manual)

If you prefer to run the application manually on your machine (e.g., for development), follow these steps.

### 1. Install Dependencies
Run this command to install all the necessary libraries:
```bash
cd web
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `web` folder with the following content. This tells the app how to connect to the database.

**File:** `web/.env`
```env
# Database connection string
# Note: Port 5433 is used because Docker exposes the DB on this port locally
DATABASE_URL="postgresql://pharma_user:pharma_password@localhost:5433/pharma_db"
```

### 3. Start the Database
You still need a database. You can start *just* the database using Docker:
```bash
docker compose up db -d
```
*This starts the Postgres database on port 5433.*

### 4. Setup Database Schema
Run these commands to verify the database connection and create tables:
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for prototyping) or migrate (for production)
npx prisma db push
```

### 5. Run the Application
Finally, start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📂 Project Structure

Here is a quick overview of the important folders:

*   **`web/`**: The main folder containing the Next.js application.
    *   **`src/app/`**: Contains the pages and routes of the website.
    *   **`src/components/`**: Reusable UI components (buttons, navbars, etc.).
    *   **`prisma/schema.prisma`**: Defines the database models (structure).
    *   **`public/`**: Static assets like images and fonts.
*   **`docker-compose.yml`**: Configuration for running the app and database together.

---

## ❓ Troubleshooting

**Issue: "Port 3000 is already in use"**
*   **Solution**: Stop any other node processes or docker containers running on port 3000.

**Issue: Database connection error**
*   **Solution**: Ensure the Docker database is running (`docker compose ps`). If running locally, make sure your `.env` file points to `localhost:5433`.

**Issue: Prisma Client error**
*   **Solution**: Run `npx prisma generate` to refresh the database client.
