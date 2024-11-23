from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.notifications.tasks import send_event_update_notification

from .models import Event


@receiver(post_save, sender=Event)
def handle_event_save(sender, instance, created, **kwargs):
    if created:
        # Если мероприятие создано, отправляем уведомления о новом мероприятии. Ну
        pass
    else:
        # Если мероприятие обновлено, отправляем уведомления об обновлении мероприятия
        send_event_update_notification.delay(instance.id)
