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

EXPOSE 5173

CMD ["npm", "run", "dev"]

# STAGE 3 - build
FROM base AS build

# Build app
RUN npm run build

# STAGE 4 - run
FROM caddy:2-alpine AS run

# Copy files from build
COPY --from=build /app/dist /usr/share/caddy

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile
