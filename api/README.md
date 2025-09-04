# API (Express.js Backend)

This directory contains the Express.js backend for the Rebisco Bug Tracker application.

## Setup

1.  **Install dependencies:**
    ```bash
    yarn install
    ```

2.  **Environment Variables:**
    Create a `.env.api.dev` file in this directory based on `env.api.dev.example`. For production, create `.env.api.prod` based on `env.api.prod.example`.
    ```
    MONGO_URI=mongodb://localhost:27017/bugtracker
    AUTH0_AUDIENCE=https://bugtracker.ioak.io
    AUTH0_ISSUER_BASE_URL=https://your_auth0_domain/
    AUTH0_MGMT_CLIENT_ID=your_auth0_mgmt_client_id
    AUTH0_MGMT_CLIENT_SECRET=your_auth0_mgmt_client_secret
    ```

## Running the application

-   **Development Mode:**
    ```bash
    yarn dev
    ```
    The API will run on `http://localhost:4000`.

-   **Production Mode (Containerized):**
    Refer to the root `docker-compose.yml` for running with Docker.
