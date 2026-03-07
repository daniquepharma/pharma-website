#!/bin/sh

# Railway mounts external volumes as root. We must claim ownership dynamically.
echo "Fixing volume permissions and restoring defaults..."
if [ -d "/app/uploads_backup/license" ]; then
    echo "Restoring default licenses to volume..."
    cp -rn /app/uploads_backup/* /app/public/uploads/ 2>/dev/null || true
fi

chown -R nextjs:nodejs /app/public
chmod -R 755 /app/public

echo "Running Prisma migrations..."
npx prisma migrate deploy

# Switch from root to nextjs user to run the server securely
echo "Starting Next.js..."

# Use Railway public domain if available and NEXTAUTH_URL is not set
if [ -n "$RAILWAY_PUBLIC_DOMAIN" ] && [ -z "$NEXTAUTH_URL" ]; then
    export NEXTAUTH_URL="https://$RAILWAY_PUBLIC_DOMAIN"
fi

exec su-exec nextjs env PORT="${PORT:-3000}" \
  NEXTAUTH_URL="${NEXTAUTH_URL:-https://www.daniquepharma.in}" \
  NEXTAUTH_URL_INTERNAL="${NEXTAUTH_URL_INTERNAL:-http://localhost:${PORT:-3000}}" \
  node server.js
