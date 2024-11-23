from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from apps.events.models import Event, FavoriteEvent


@shared_task
def send_new_event_notification(event_id):
    try:
        event = Event.objects.get(id=event_id)
        favorites = FavoriteEvent.objects.filter(event=event)
        for favorite in favorites:
            user = favorite.user
            if user.email and user.receive_new_event_notifications:
                send_mail(
                    subject='Новое спортивное мероприятие',
                    message=f"Новое мероприятие добавлено: {event.name}\nДата начала: {event.start_date}\nМесто проведения: {event.location}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
    except Event.DoesNotExist:
        pass  # Можно логировать ошибку


@shared_task
def send_event_update_notification(event_id):
    try:
        event = Event.objects.get(id=event_id)
        favorites = FavoriteEvent.objects.filter(event=event)
        for favorite in favorites:
            user = favorite.user
            if user.email and user.receive_event_update_notifications:
                send_mail(
                    subject='Обновление спортивного мероприятия',
                    message=f"Мероприятие обновлено: {event.name}\nНовая дата начала: {event.start_date}\nНовое место проведения: {event.location}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
    except Event.DoesNotExist:
        pass  # Можно логировать ошибку


@shared_task
def send_event_reminders():
    """
    Задача, которая отправляет напоминания за неделю и за два дня до начала мероприятия.
    """
    today = timezone.now().date()
    one_week_later = today + timedelta(days=7)
    two_days_later = today + timedelta(days=2)

    # Напоминания за неделю
    events_upcoming_week = Event.objects.filter(start_date=one_week_later)
    for event in events_upcoming_week:
        favorites = FavoriteEvent.objects.filter(event=event)
        for favorite in favorites:
            user = favorite.user
            if user.email and user.receive_event_reminders:
                send_mail(
                    subject='Напоминание о спортивном мероприятии через неделю',
                    message=f"Напоминаем о мероприятии: {event.name}\nДата начала: {event.start_date}\nМесто проведения: {event.location}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )

    # Напоминания за два дня
    events_upcoming_two_days = Event.objects.filter(start_date=two_days_later)
    for event in events_upcoming_two_days:
        favorites = FavoriteEvent.objects.filter(event=event)
        for favorite in favorites:
            user = favorite.user
            if user.email and user.receive_event_reminders:
                send_mail(
                    subject='Напоминание о спортивном мероприятии через два дня',
                    message=f"Напоминаем о мероприятии: {event.name}\nДата начала: {event.start_date}\nМесто проведения: {event.location}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
