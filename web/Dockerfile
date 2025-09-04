FROM node:18-alpine

WORKDIR /app/web

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

COPY . .

# Build the React app
RUN yarn build

# Serve the built app with a simple static server like `serve`
# Install `serve` globally if not already present
RUN yarn global add serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
