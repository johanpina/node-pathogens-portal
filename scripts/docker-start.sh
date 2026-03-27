#!/bin/sh
set -e

echo "Generating Prisma client for current runtime..."
npx prisma generate

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database (if needed)..."
npx prisma db seed || true

echo "Starting Next.js..."
exec node server.js
