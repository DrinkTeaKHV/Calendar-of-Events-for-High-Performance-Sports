from django.db import models

from apps.users.models import UserExtended

GENDER_CHOICES = [
    ('male', 'Мужской'),
    ('female', 'Женский'),
    ('other', 'Другой'),
]


class Sport(models.Model):
    name = models.CharField(
        unique=True,
        verbose_name='Название вида спорта'
    )

    class Meta:
        verbose_name = 'Вид спорта'
        verbose_name_plural = 'Виды спорта'

    def __str__(self):
        return self.name


class CompetitionType(models.Model):
    name = models.CharField(
        unique=True,
        verbose_name='Тип соревнования'
    )

    class Meta:
        verbose_name = 'Тип соревнования'
        verbose_name_plural = 'Типы соревнований'

    def __str__(self):
        return self.name


class Event(models.Model):
    sm_number = models.CharField(
        unique=True,
        verbose_name='№ СМ в ЕКП'
    )
    name = models.CharField(
        verbose_name='Наименование мероприятия'
    )
    participants = models.CharField(
        verbose_name='Участники'
    )
    gender = models.CharField(
        choices=GENDER_CHOICES,
        default='male',
        verbose_name='Пол'
    )
    competition_type = models.ForeignKey(
        CompetitionType,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Тип соревнования'
    )
    start_date = models.DateField(
        verbose_name='Дата начала'
    )
    end_date = models.DateField(
        verbose_name='Дата окончания'
    )
    location = models.CharField(
        verbose_name='Место проведения',
        default=None
    )
    participants_count = models.IntegerField(
        verbose_name='Количество участников',
        null=True,
        blank=True,
    )
    reserve = models.BooleanField(
        default=False,
        verbose_name='Резерв'
    )
    sport = models.ForeignKey(
        Sport,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Вид спорта'
    )
    month = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name='Месяц проведения'
    )
    year = models.IntegerField(
        verbose_name='Год проведения',
        null=True,
        blank=True,
    )
    min_age = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='Минимальный возраст'
    )
    max_age = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='Максимальный возраст'
    )

    class Meta:
        verbose_name = 'Мероприятие'
        verbose_name_plural = 'Мероприятия'

    def __str__(self):
        return f"{self.name} ({self.start_date})"


class FavoriteEvent(models.Model):
    user = models.ForeignKey(
        to=UserExtended,
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        verbose_name='Мероприятие'
    )
    added_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата добавления'
    )

    class Meta:
        unique_together = ('user', 'event')
        verbose_name = 'Избранное мероприятие'
        verbose_name_plural = 'Избранные мероприятия'

    def __str__(self):
        return f"{self.user.username} - {self.event.name}"
