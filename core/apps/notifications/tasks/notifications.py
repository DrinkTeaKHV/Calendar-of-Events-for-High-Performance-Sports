from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from apps.events.models import Event, FavoriteEvent
from apps.notifications.models import Notification
from apps.tgbot.bot.messages import sync_send_message
from config.celery import app


@app.task
def send_event_update_notification(event_id):
    try:
        event = Event.objects.get(id=event_id)
        favorites = FavoriteEvent.objects.filter(event=event)
        for favorite in favorites:
            user = favorite.user
            if user.email or user.telegram_id:
                message = (f"Мероприятие обновлено: {event.name}"
                           f"\nНовая дата начала: {event.start_date}\nНовое место проведения: {event.location}")

                # Отправка Email
                email_sent = False
                if user.email and user.receive_event_update_notifications:
                    send_mail(
                        subject='Обновление спортивного мероприятия',
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )
                    email_sent = True

                # Отправка Telegram
                telegram_sent = False
                if user.telegram_id and user.receive_event_update_notifications:
                    telegram_sent = sync_send_message(user.telegram_id, message)

                # Сохранение уведомления
                Notification.objects.create(
                    user=user,
                    event=event,
                    notification_type='EVENT_UPDATE',
                    message=message,
                    telegram_sent=telegram_sent,
                    email_sent=email_sent
                )
    except Event.DoesNotExist:
        pass  # Можно логировать ошибку


@app.task
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
            if user.email or user.telegram_id:
                message = (f"Напоминаем о мероприятии: {event.name}"
                           f"\nДата начала: {event.start_date}\nМесто проведения: {event.location}")

                # Отправка Email
                email_sent = False
                if user.email and user.receive_event_reminders:
                    send_mail(
                        subject='Напоминание о спортивном мероприятии через неделю',
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )
                    email_sent = True

                # Отправка Telegram
                telegram_sent = False
                if user.telegram_id and user.receive_event_reminders:
                    telegram_sent = sync_send_message(user.telegram_id, message)

                # Сохранение уведомления
                Notification.objects.create(
                    user=user,
                    event=event,
                    notification_type='REMINDER',
                    message=message,
                    telegram_sent=telegram_sent,
                    email_sent=email_sent
                )

    # Напоминания за два дня
    events_upcoming_two_days = Event.objects.filter(start_date=two_days_later)
    for event in events_upcoming_two_days:
        favorites = FavoriteEvent.objects.filter(event=event)
        for favorite in favorites:
            user = favorite.user
            if user.email or user.telegram_id:
                message = (f"Напоминаем о мероприятии: {event.name}"
                           f"\nДата начала: {event.start_date}\nМесто проведения: {event.location}")

                # Отправка Email
                email_sent = False
                if user.email and user.receive_event_reminders:
                    send_mail(
                        subject='Напоминание о спортивном мероприятии через два дня',
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )
                    email_sent = True

                # Отправка Telegram
                telegram_sent = False
                if user.telegram_id and user.receive_event_reminders:
                    telegram_sent = sync_send_message(user.telegram_id, message)

                # Сохранение уведомления
                Notification.objects.create(
                    user=user,
                    event=event,
                    notification_type='REMINDER',
                    message=message,
                    telegram_sent=telegram_sent,
                    email_sent=email_sent
                )
