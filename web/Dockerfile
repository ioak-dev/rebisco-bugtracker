FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Copy yarn.lock if it exists, otherwise skip
COPY yarn.lock* ./

# Install dependencies (including devDependencies for build)
RUN yarn install

# Install TypeScript and Vite globally to ensure they're available
RUN yarn global add typescript vite

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE

# Set environment variables for the build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE

# Build the React app
RUN tsc -b && vite build

# Serve the built app with a simple static server like `serve`
# Install `serve` globally if not already present
RUN yarn global add serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
