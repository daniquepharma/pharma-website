#!/bin/sh

# Railway mounts external volumes as root. We must claim ownership dynamically.
echo "Fixing volume permissions..."
chown -R nextjs:nodejs /app/public
chmod -R 755 /app/public

echo "Running Prisma migrations..."
npx prisma migrate deploy

# Switch from root to nextjs user to run the server securely
# Explicitly pass the PORT variable so nextjs standalone binds to Railway's expected port
echo "Starting Next.js on port ${PORT:-3000}..."
exec su-exec nextjs env PORT="${PORT:-3000}" node server.js
