# Web (React Frontend)

This directory contains the React frontend application for the Rebisco Bug Tracker.

## Setup

1.  **Install dependencies:**
    ```bash
    yarn install
    ```

2.  **Environment Variables:**
    Create a `.env.development` file in this directory based on `env.web.dev.example`. For production, create `.env.web.prod` based on `env.web.prod.example`.
    ```
    VITE_API_URL=http://localhost:4000/api
    VITE_AUTH0_DOMAIN=your_auth0_domain
    VITE_AUTH0_CLIENT_ID=your_auth0_client_id
    VITE_AUTH0_AUDIENCE=https://bugtracker.ioak.io
    ```

## Running the application

-   **Development Mode:**
    ```bash
    yarn dev
    ```
    The frontend will run on `http://localhost:3000`.

-   **Production Mode (Containerized):**
    Refer to the root `docker-compose.yml` for running with Docker.
