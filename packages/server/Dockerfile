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
COPY packages/server/package*.json packages/server/prisma ./packages/server/

# Install dependencies
RUN npm ci

# Copy remaining files
COPY packages/server packages/server

# STAGE 2 - development
FROM base AS development

EXPOSE 3000 9229

# Pre-run script
ENTRYPOINT ["./packages/server/docker-entrypoint.sh"]

CMD ["npm", "run", "dev:server"]

# STAGE 3 - build
FROM base AS build

# Build app
RUN npm run build:server

# STAGE 4 - run
FROM node:24-alpine AS run

WORKDIR /app

# Copy files from build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/server ./packages/server

# Expose app port
EXPOSE 3000

# Pre-run script
ENTRYPOINT ["./docker-entrypoint.sh"]

# Start the app
CMD ["npm", "run", "start:server"]
