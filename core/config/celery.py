import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()


app.conf.beat_schedule = {
    "send_event_reminders_every_5_minutes": {
        "task": "apps.notifications.tasks.send_daily_event_reminders",
        "schedule": crontab(minute="*/5"),  # Каждые 5 минут
    },
}

app.conf.timezone = "UTC"  # Установите вашу временную зону (например, "Europe/Moscow" для Москвы)