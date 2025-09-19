# Rebisco Bug Tracker Monorepo

This monorepo contains a fullstack web application for tracking defects. It includes an Express.js backend (`api`) and a React frontend (`web`).

## Prerequisites

- Node.js (v18 or higher recommended)
- Yarn (v1.x or v2+/berry recommended)
- Docker
- Docker Compose

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd rebisco-bugtracker
    ```

2.  **Install dependencies:**
    ```bash
    yarn install:all
    # or if you prefer npm
    # npm install
    ```

3.  **Set up environment variables:**
    Create `.env.api.dev` in the `api` directory and `.env.web.dev` in the `web` directory based on the `env.api.dev.example` and `env.web.dev.example` files respectively. For production, create `.env.api.prod` and `.env.web.prod` based on `env.api.prod.example` and `env.web.prod.example`.

4.  **Run in development mode:**
    ```bash
    yarn dev:all
    # This will concurrently start both the backend and frontend.
    ```
    - Backend will typically run on `http://localhost:4000` (configurable).
    - Frontend will typically run on `http://localhost:3000` (configurable).

## Docker Setup

1.  **Build and run containers:**
    ```bash
    docker-compose up --build
    ```
    This will bring up the MongoDB database, the backend, and the frontend.

## Project Structure

-   `api/`: Express.js backend for handling defect management and user authentication.
-   `web/`: React frontend application built with Vite, TailwindCSS, and Material UI.
-   `docker-compose.yml`: Defines the Docker services for the application.

yolanon738@dotxan.com
