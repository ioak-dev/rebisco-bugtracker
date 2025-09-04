FROM node:18-alpine

WORKDIR /app/api

COPY package.json yarn.lock ./api/

# Install dependencies
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Expose port and start the application
EXPOSE 4000
CMD ["yarn", "start"]
