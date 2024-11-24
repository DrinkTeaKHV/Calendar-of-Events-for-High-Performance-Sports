from apps.notifications.models import Notification
from apps.tgbot.bot.messages import sync_send_message


def send_notification(user, event, notification_type, message):
    """
    Универсальная функция для отправки уведомлений по Email и Telegram.
    """
    telegram_sent = False

    # Отправка Telegram
    if user.telegram_id and getattr(user, f"receive_{notification_type.lower()}_notifications", False):
        telegram_sent = sync_send_message(user.telegram_id, message)

    # Сохранение уведомления
    Notification.objects.create(
        user=user,
        event=event,
        notification_type=notification_type,
        message=message,
        telegram_sent=telegram_sent,
    )
