#!/usr/bin/env bash
set -e
echo "==> Installing dependencies..."
pip install -r requirements.txt
echo "==> Collecting static files..."
python manage.py collectstatic --no-input --settings=config.settings.production
echo "==> Running migrations..."
python manage.py migrate --no-input --settings=config.settings.production
echo "==> Build complete!"