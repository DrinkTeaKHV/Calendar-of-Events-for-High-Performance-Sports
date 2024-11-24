from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.notifications.tasks import notify_about_favorite_event_changes, notify_about_new_event

from .models import Event


@receiver(post_save, sender=Event)
def handle_event_save(sender, instance, created, **kwargs):
    if created:
        # Если мероприятие создано, отправляем уведомления о новом мероприятии. Ну
        notify_about_new_event.delay(instance.id)
    else:
        notify_about_favorite_event_changes.delay(instance.id)
