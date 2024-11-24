from datetime import timedelta

from django.utils.timezone import now

from apps.notifications.tasks.utils import send_notification
from apps.events.models import Event, FavoriteEvent
from apps.users.models import UserExtended
from config.celery import app


@app.task
def notify_about_new_event(event_id):
    """
    Уведомляет пользователей о новом мероприятии, если его вид спорта
    совпадает с их избранными видами спорта.
    """

    try:
        event = Event.objects.get(id=event_id)
        # Пользователи, у которых вид спорта мероприятия в избранном
        users = UserExtended.objects.filter(
            receive_new_event_notifications=True,
            favorite_sports=event.sport
        ).distinct()

        message = (
            f"Новое мероприятие добавлено: {event.name}\n"
            f"Дата начала: {event.start_date}\n"
            f"Место проведения: {event.location}\n"
            f"Вид спорта: {event.sport.name}"
        )

        for user in users:
            send_notification(
                user=user,
                event=event,
                notification_type="NEW_EVENT",
                message=message,
            )
    except Event.DoesNotExist:
        pass


@app.task
def notify_about_favorite_event_changes(event_id):
    """
    Отправляет уведомления об изменении мероприятия пользователям, у которых
    оно в избранном.
    """
    try:
        event = Event.objects.get(id=event_id)
        favorites = event.favoriteevent_set.all()

        message = (
            f"Изменения в мероприятии: {event.name}\n"
            f"Дата начала: {event.start_date}\n"
            f"Место проведения: {event.location}\n"
            f"Статус: {event.get_status_display()}"
        )

        for favorite in favorites:
            user = favorite.user
            send_notification(
                user=user,
                event=event,
                notification_type="EVENT_UPDATE",
                message=message,
            )
    except Event.DoesNotExist:
        pass


@app.task
def send_daily_event_reminders():
    """
    Отправляет напоминания о мероприятиях, которые начнутся через 1 день.
    """
    today = now().date()
    tomorrow = today + timedelta(days=1)
    favorites = FavoriteEvent.objects.filter(
        event__start_date=tomorrow,
    )
    for favorite in favorites:
        message = (
            f"Напоминаем о мероприятии: {favorite.event.name}\n"
            f"Дата начала: {favorite.event.start_date}\n"
            f"Место проведения: {favorite.event.location}"
        )
        user = favorite.user
        send_notification(
            user=user,
            event=favorite.favoriteevent,
            notification_type="REMINDER",
            message=message,
        )
