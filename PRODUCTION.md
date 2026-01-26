# Production Deployment Guide

This guide describes how to deploy the Danique Pharma application in a production environment using Docker.

## Prerequisites

- Docker and Docker Compose installed on the host machine.
- Git (to clone the repository).

## Deployment Steps

1.  **Clone the Repository** (if not already done):
    ```bash
    git clone <repository_url>
    cd pharma/web
    ```

2.  **Environment Configuration**:
    Create a `.env` file in the `web` directory (same level as `docker-compose.yml`) with your secure production credentials.

    **File:** `.env`
    ```env
    # Database Configuration
    POSTGRES_PASSWORD=secure_production_password_here
    
    # Next.js Database Connection String
    # Format: postgresql://<user>:<password>@db:5432/<dbname>
    DATABASE_URL=postgresql://pharma_user:secure_production_password_here@db:5432/pharma_db
    
    # NextAuth.js Secret (Generate a new secure string for production)
    # You can generate one using: openssl rand -base64 32
    NEXTAUTH_SECRET=your_generated_secret_here
    NEXTAUTH_URL=https://your-domain.com
    
    # Google OAuth (if used)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

3.  **Build and Run**:
    Run the following command to start the application in detached mode (background):
    ```bash
    docker compose up --build -d
    ```

4.  **Verify Deployment**:
    Check if the containers are running:
    ```bash
    docker compose ps
    ```
    Access the application at `http://localhost:3000` (or your configured domain).

## Maintenance

- **View Logs**:
  ```bash
  docker compose logs -f
  ```
- **Stop Application**:
  ```bash
  docker compose down
  ```
