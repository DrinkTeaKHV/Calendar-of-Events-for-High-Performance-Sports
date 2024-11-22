from django.contrib.auth.models import AbstractUser


class UserExtended(AbstractUser):
    """ Пользователь (расширенная модель) """
    pass

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["-id", ]
