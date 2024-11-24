from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.notifications.tasks import notify_about_favorite_event_changes, notify_about_new_event

from .models import Event


@receiver(pre_save, sender=Event)
def track_changes(sender, instance, **kwargs):
    """
    Отслеживает изменения объекта до сохранения.
    """
    if instance.pk:
        instance.original = Event.objects.get(pk=instance.pk)


@receiver(post_save, sender=Event)
def handle_event_save(sender, instance, created, **kwargs):
    """
    Отправляет уведомления при создании или изменении объекта.
    """
    if created:
        # Уведомление о новом мероприятии
        notify_about_new_event.delay(instance.id)
    else:
        # Определяем, какие поля изменились
        changed_fields = instance.get_changed_fields()
        significant_changes = {'name', 'start_date', 'end_date', 'location', 'status'}
        if any(field in significant_changes for field in changed_fields):
            # Уведомление о значимых изменениях
            notify_about_favorite_event_changes.delay(instance.id)

