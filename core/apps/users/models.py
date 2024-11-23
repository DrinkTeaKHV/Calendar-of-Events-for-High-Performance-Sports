from django.contrib.auth.models import AbstractUser
from django.db import models


class UserExtended(AbstractUser):
    """ Пользователь (расширенная модель) """
    telegram_id = models.CharField(max_length=64, unique=True)

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["-id", ]
