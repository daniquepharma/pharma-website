#!/bin/sh

# Railway mounts external volumes as root. We must claim ownership dynamically.
echo "Fixing volume permissions..."
chown -R nextjs:nodejs /app/public
chmod -R 755 /app/public

echo "Running Prisma migrations..."
npx prisma migrate deploy

# Switch from root to nextjs user to run the server securely
echo "Starting Next.js..."
exec su-exec nextjs node server.js
