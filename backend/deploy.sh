#!/bin/bash
# Run this on the DigitalOcean droplet after cloning the repo
# Usage: cd /var/www/modavance/backend && bash deploy.sh

set -e

echo "==> Installing dependencies..."
npm install --ignore-scripts --omit=dev

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Running database push..."
npx prisma db push

echo "==> Running seed..."
npx ts-node prisma/seed.ts

echo "==> Building..."
npm run build

echo "==> Starting/reloading PM2..."
pm2 reload ecosystem.config.js --update-env 2>/dev/null || pm2 start ecosystem.config.js

echo "==> Saving PM2 process list..."
pm2 save

echo "Done! API running on port 3001"
