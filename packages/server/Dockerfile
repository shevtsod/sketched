# syntax=docker/dockerfile:1

# STAGE 1 - base image
FROM node:24-alpine AS base

LABEL org.opencontainers.image.authors="Daniel Shevtsov"

# Set working directory
WORKDIR /app

# Copy NPM files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# STAGE 2 - development
FROM base AS development

EXPOSE 3000 9229

CMD ["npm", "run", "start:debug"]

# STAGE 3 - build
FROM base AS build

# Build app
RUN npm run build

# STAGE 4 - run
FROM node:24-alpine AS run

WORKDIR /app

# Copy files from build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
