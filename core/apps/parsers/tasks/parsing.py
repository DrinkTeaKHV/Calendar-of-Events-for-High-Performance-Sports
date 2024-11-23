
import os
import logging
from celery import shared_task

from apps.events.models import Sport, CompetitionType, Event
from apps.parsers.models import ParsingLog
from apps.parsers.parser import extract_text_from_pdf, parse_text_to_dataframe

logger = logging.getLogger(__name__)

@shared_task
def parse_events_pdf(file_path):
    """
    Задача Celery для парсинга PDF-файла с мероприятиями.
    """
    file_name = os.path.basename(file_path)
    try:
        # Извлечение текста из PDF
        text = extract_text_from_pdf(file_path)

        # Парсинг текста в DataFrame
        df = parse_text_to_dataframe(text)

        # Обработка DataFrame и сохранение данных в базу
        for _, row in df.iterrows():
            # Получение или создание вида спорта
            sport, _ = Sport.objects.get_or_create(name=row['Вид спорта'])

            # Получение или создание типа соревнования
            competition_type, _ = CompetitionType.objects.get_or_create(name=row['Тип соревнования'])

            # Создание или обновление события
            event, created = Event.objects.update_or_create(
                sm_number=row['№ СМ в ЕКП'],
                defaults={
                    'name': row['Наименование мероприятия'],
                    'participants': row['Участники'],
                    'gender': row['Пол'],
                    'competition_type': competition_type,
                    'start_date': row['Начало'],
                    'end_date': row['Окончание'],
                    'location': row['Место проведения'],
                    'participants_count': row['Кол-во участников'],
                    'reserve': row['Резерв'],
                    'sport': sport,
                    'month': row['Месяц'],
                    'year': row['Год'],
                    'min_age': row['Минимальный возраст'],
                    'max_age': row['Максимальный возраст'],
                }
            )

        # Создание записи логов парсинга
        ParsingLog.objects.create(
            file_name=file_name,
            status='SUCCESS',
            message='PDF успешно распарсен и данные сохранены.'
        )

        logger.info(f"Файл {file_name} успешно распарсен и данные сохранены.")
    except Exception as e:
        # Создание записи логов парсинга с ошибкой
        ParsingLog.objects.create(
            file_name=file_name,
            status='FAILURE',
            message=str(e)
        )
        logger.error(f"Ошибка при парсинге файла {file_name}: {e}")
