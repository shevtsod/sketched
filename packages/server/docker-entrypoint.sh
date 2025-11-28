#!/bin/sh
set -euo pipefail

echo "Waiting for services ..."

CACHE_URL="${CACHE_HOST:-127.0.0.1}:${CACHE_PORT:-6379}"
echo "Waiting for cache at \"${CACHE_URL}\" ..."
./wait-for "${CACHE_URL}"

DB_URL="${DB_HOST:-127.0.0.1}:${DB_PORT:-5432}"
echo "Waiting for database at \"${DB_URL}\" ..."
./wait-for "${DB_URL}"

echo "Running database migrations ..."
npm run drizzle:migrate

# Seed database only in development and test environments
if [ "$NODE_ENV" = "development" ] || [ "$NODE_ENV" = "test" ]; then
  echo "NODE_ENV=\"$NODE_ENV\", seeding database ..."
  npm run drizzle:seed
fi

# Start the app
exec "$@"
