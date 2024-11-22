from django.db import models


class Event(models.Model):
    number = models.PositiveIntegerField("№", unique=True)
    sm_in_ekp = models.CharField("СМ в ЕКП", max_length=255)
    name = models.CharField("Наименование спортивного мероприятия", max_length=255)
    gender_age_group = models.CharField("Пол, возрастная группа", max_length=255)
    discipline_program = models.CharField("Дисциплина, программа", max_length=255)
    start_date = models.DateField("Дата начала")
    end_date = models.DateField("Дата окончания")
    country = models.CharField("Страна", max_length=255)
    region = models.CharField("Субъект РФ", max_length=255, null=True, blank=True)
    city = models.CharField("Город", max_length=255)
    venue = models.CharField("Спортивная база, центр", max_length=255)
    participants = models.PositiveIntegerField("Количество участников (чел.)")
    sport_type = models.CharField("Вид спорта", max_length=255)
    event_type = models.CharField("Тип соревнования", max_length=255)

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"
