#!/bin/bash

set -e  # Exit on error

# 1. Periksa apakah file .env ada
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  exit 1
fi

# 2. Periksa apakah APP_KEY ada di file .env
if ! grep -q "APP_KEY=" .env; then
  echo "Error: APP_KEY not set in .env!"
  exit 1
fi

# 3. Jalankan migrasi dan seed (hanya jika file penanda tidak ada)
if [ ! -f .migrated ]; then
  echo "Running migrations..."
  node ace migration:run --force
  echo "Running seeds..."
  node ace db:seed
  touch .migrated  # Buat file penanda agar langkah ini tidak dijalankan lagi
else
  echo "Migrations and seeds already applied."
fi

# 4. Jalankan aplikasi menggunakan pnpm
exec pnpm start
