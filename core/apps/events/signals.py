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
        old_event = sender.objects.filter(id=instance.id).first()
        # Если мероприятие обновлено, отправляем уведомления об обновлении мероприятия
        has_changes = (
                old_event.start_date != instance.start_date or
                old_event.end_date != instance.end_date or
                old_event.location != instance.location or
                old_event.name != instance.name or
                old_event.status != instance.status
        )

        if has_changes:
            # Отправляем уведомления об изменении мероприятия
            notify_about_favorite_event_changes.delay(instance)
