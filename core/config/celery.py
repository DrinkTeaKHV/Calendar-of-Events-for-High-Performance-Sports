import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()


app.conf.beat_schedule = {
    'send-event-reminders-every-minute': {
        'task': 'apps.events.tasks.send_event_reminders',
        'schedule': crontab(),  # По умолчанию запускается каждую минуту
    },
}