import logging
import os

from apps.events.models import CompetitionType, Event, Sport
from apps.parsers.models import ParsingLog
from apps.parsers.parser import parse_file
from config.celery import app

logger = logging.getLogger(__name__)


@app.task
def parse_events_pdf(file_path):
    """
    Задача Celery для парсинга PDF-файла с мероприятиями.
    """
    file_name = os.path.basename(file_path)
    errors = []  # Список для хранения ошибок

    try:
        # Парсинг текста в DataFrame
        df = parse_file(file_path=file_path)

        # Обработка DataFrame и сохранение данных в базу
        for index, row in df.iterrows():
            try:
                # Получение или создание вида спорта
                sport, _ = Sport.objects.get_or_create(name=row['Вид спорта'])

                # Получение или создание типа соревнования
                competition_type, _ = CompetitionType.objects.get_or_create(name=row['Тип соревнования'])

                # Создание или обновление события
                Event.objects.update_or_create(
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
            except Exception as row_error:
                # Логируем ошибку для конкретной строки
                error_message = f"Ошибка при обработке строки {index}: {row_error}"
                errors.append(error_message)
                logger.error(error_message)

        # Создание записи логов парсинга
        status = 'PARTIAL_SUCCESS' if errors else 'SUCCESS'
        ParsingLog.objects.create(
            file_name=file_name,
            status=status,
            message=f"PDF успешно распарсен с {len(errors)} ошибками." if errors else "PDF успешно распарсен и данные сохранены.",
            errors=errors  # Список ошибок
        )

        logger.info(f"Файл {file_name} успешно распарсен. Ошибок: {len(errors)}.")
    except Exception as e:
        # Логируем общую ошибку при обработке файла
        ParsingLog.objects.create(
            file_name=file_name,
            status='FAILURE',
            message=str(e)
        )
        logger.error(f"Ошибка при парсинге файла {file_name}: {e}")
