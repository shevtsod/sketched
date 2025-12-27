# syntax=docker/dockerfile:1

# STAGE 1 - base image
FROM node:24-alpine AS base

LABEL org.opencontainers.image.authors="Daniel Shevtsov"

# Set app version
ARG VERSION
ENV VERSION=${VERSION:-0.0.0}

# Set working directory
WORKDIR /app

# Copy NPM files
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/

# Install dependencies
RUN npm ci

# Copy remaining files
COPY packages/client packages/client

# STAGE 2 - development
FROM base AS development

EXPOSE 5173

CMD ["npm", "run", "dev:client"]

# STAGE 3 - build
FROM base AS build

# Build app
RUN npm run build:client

# STAGE 4 - run
FROM caddy:2-alpine AS run

# Copy files from build
COPY --from=build /app/packages/client/dist /usr/share/caddy

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile
