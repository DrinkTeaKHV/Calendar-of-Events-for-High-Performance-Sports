from django.db import models


class ParsingLog(models.Model):
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Время парсинга'
    )
    file_name = models.CharField(
        max_length=255,
        verbose_name='Имя файла'
    )
    status = models.CharField(
        max_length=20,
        choices=(
            ('SUCCESS', 'Успешно'),
            ('FAILURE', 'Ошибка'),
        ),
        verbose_name='Статус парсинга'
    )
    message = models.TextField(
        blank=True,
        null=True,
        verbose_name='Сообщение'
    )

    class Meta:
        verbose_name = 'Лог парсинга'
        verbose_name_plural = 'Логи парсинга'

    def __str__(self):
        return f"{self.file_name} - {self.status} at {self.timestamp}"


class PDFUpload(models.Model):
    file = models.FileField(
        upload_to='pdf_uploads/',
        verbose_name='PDF-файл'
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата загрузки'
    )
    parsed = models.BooleanField(
        default=False,
        verbose_name='Распарсен'
    )
    parsing_log = models.ForeignKey(
        ParsingLog,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Лог парсинга'
    )

    class Meta:
        verbose_name = 'Загрузка PDF'
        verbose_name_plural = 'Загрузки PDF'

    def __str__(self):
        return self.file.name
