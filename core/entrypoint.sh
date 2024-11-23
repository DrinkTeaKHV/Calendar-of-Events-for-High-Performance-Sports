#!/bin/sh

# Проверка на доступность базы данных
echo "Waiting for PostgreSQL to start..."
while ! nc -z postgres_db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Проверка на доступность Elasticsearch
echo "Waiting for Elasticsearch to start..."
while ! nc -z elasticsearch 9200; do
  sleep 0.1
done
echo "Elasticsearch started"

# Выполнение миграций
python manage.py migrate users
python manage.py migrate --noinput
echo "Migrations completed"

# Пересоздание индекса Elasticsearch
echo "Rebuilding Elasticsearch index..."
python manage.py search_index --rebuild -f
echo "Elasticsearch index rebuilt"

# Запуск start_bott
python manage.py start_bot &
echo "start_bott"

# Сбор статических файлов
python manage.py collectstatic --noinput --clear
echo "Static files collected"

# Запуск Gunicorn
echo "Starting Gunicorn"
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers=4
