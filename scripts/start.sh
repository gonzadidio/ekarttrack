#!/bin/sh

echo "Running database migrations..."
npx prisma db push --skip-generate 2>&1 || echo "DB push failed, continuing..."

echo "Running seed (will skip if data exists)..."
npx tsx prisma/seed.ts 2>&1 || echo "Seed failed, continuing..."

echo "Starting Next.js..."
npm run start
