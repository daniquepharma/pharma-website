#!/bin/bash
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema ./prisma/schema.prisma || true

echo "Prisma client generation..."
npx prisma generate --schema ./prisma/schema.prisma || true

echo "Starting Next.js server..."
exec node server.js
