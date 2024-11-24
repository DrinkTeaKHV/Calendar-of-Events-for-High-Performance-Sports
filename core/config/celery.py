import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config',  include=['apps.notifications.tasks'])

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()


app.conf.beat_schedule = {
    "send_event_reminders_every_5_minutes": {
        "task": "apps.notifications.tasks.notifications.send_daily_event_reminders",
        "schedule": crontab(minute="*/5"),  # Каждые 5 минут
    },
}

app.autodiscover_tasks()