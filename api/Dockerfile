FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Copy yarn.lock if it exists, otherwise skip
COPY yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Expose port and start the application
EXPOSE 4000
CMD ["yarn", "start"]
