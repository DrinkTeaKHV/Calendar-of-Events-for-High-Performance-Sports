from django.db import models

from apps.events.models import Event
from apps.users.models import UserExtended


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('NEW_EVENT', 'Новое мероприятие'),
        ('EVENT_UPDATE', 'Обновление мероприятия'),
        ('REMINDER', 'Напоминание'),
    )

    user = models.ForeignKey(UserExtended, on_delete=models.CASCADE, related_name='notifications',
                             verbose_name='Пользователь')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='notifications', verbose_name='Мероприятие')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, verbose_name='Тип уведомления')
    message = models.TextField(verbose_name='Сообщение')
    telegram_sent = models.BooleanField(default=False, verbose_name='Отправлено в Telegram')
    email_sent = models.BooleanField(default=False, verbose_name='Отправлено на Email')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время создания')

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'

    def __str__(self):
        return f"{self.get_notification_type_display()} для {self.user.username} по мероприятию {self.event.name}"
