from django.contrib.auth.models import AbstractUser
from django.db import models


class UserExtended(AbstractUser):
    """ Пользователь (расширенная модель) """
    telegram_id = models.CharField(max_length=64, unique=True)

    # Поля для настройки уведомлений
    receive_new_event_notifications = models.BooleanField(
        default=True,
        verbose_name='Получать уведомления о новых мероприятиях'
    )
    receive_event_update_notifications = models.BooleanField(
        default=True,
        verbose_name='Получать уведомления об изменениях в мероприятиях'
    )
    receive_event_reminders = models.BooleanField(
        default=True,
        verbose_name='Получать напоминания о мероприятиях'
    )
    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["-id", ]
