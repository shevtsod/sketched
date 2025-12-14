#!/bin/sh
set -euo pipefail

# Set environment variable defaults based on .env.example
NODE_ENV="${NODE_ENV:-development}"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"

CACHE_HOST="${CACHE_HOST:-127.0.0.1}"
CACHE_PORT="${CACHE_PORT:-6379}"

echo "Waiting for database at \"$DB_HOST:$DB_PORT\" ..."
./wait-for "$DB_HOST:$DB_PORT"

echo "Waiting for cache at \"$CACHE_HOST:$CACHE_PORT\" ..."
./wait-for "$CACHE_HOST:$CACHE_PORT"

npm run cli db migrate
npm run cli db seed

# Start the app
exec "$@"
