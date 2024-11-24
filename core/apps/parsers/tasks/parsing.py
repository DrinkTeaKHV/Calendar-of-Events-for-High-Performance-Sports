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
    changes_log = {"created": [], "updated": [], "unchanged": [], "status_changed": [], "canceled": []}

    try:
        # Парсинг текста в DataFrame
        df = parse_file(file_path=file_path)

        # Получение всех текущих мероприятий для возможного изменения статуса
        existing_events = {event.sm_number: event for event in Event.objects.all()}
        processed_sm_numbers = set()

        # Обработка DataFrame и сохранение данных в базу
        for index, row in df.iterrows():
            try:
                # Получение или создание вида спорта
                sport, _ = Sport.objects.get_or_create(name=row['Вид спорта'])

                # Получение или создание типа соревнования
                competition_type, _ = CompetitionType.objects.get_or_create(name=row['Тип соревнования'])

                # Проверяем, существует ли событие
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
                        'status': 'active',  # Активируем мероприятие, если оно в новом файле
                    }
                )

                # Логируем изменения
                if created:
                    changes_log["created"].append(event.sm_number)
                else:
                    if event_has_changed(event, row):
                        changes_log["updated"].append(event.sm_number)
                    else:
                        changes_log["unchanged"].append(event.sm_number)

                # Отмечаем обработанные номера
                processed_sm_numbers.add(row['№ СМ в ЕКП'])

            except Exception as row_error:
                # Логируем ошибку для конкретной строки
                error_message = f"Ошибка при обработке строки {index}: {row_error}"
                errors.append(error_message)
                logger.error(error_message)

        # Изменение статуса мероприятий, которых нет в новом файле
        for sm_number, event in existing_events.items():
            if sm_number not in processed_sm_numbers and event.status != 'canceled':
                event.status = 'canceled'
                event.save()
                changes_log["canceled"].append(sm_number)

        # Создание записи логов парсинга
        status = 'PARTIAL_SUCCESS' if errors else 'SUCCESS'
        ParsingLog.objects.create(
            file_name=file_name,
            status=status,
            message=f"PDF успешно распарсен с {len(errors)} ошибками." if errors else "PDF успешно распарсен и данные сохранены.",
            errors=errors,  # Список ошибок
            changes=changes_log,  # Изменения
        )

        logger.info(
            f"Файл {file_name} успешно распарсен. Создано: {len(changes_log['created'])}, "
            f"Обновлено: {len(changes_log['updated'])}, Отменено: {len(changes_log['canceled'])}. "
            f"Ошибок: {len(errors)}."
        )
    except Exception as e:
        # Логируем общую ошибку при обработке файла
        ParsingLog.objects.create(
            file_name=file_name,
            status='FAILURE',
            message=str(e)
        )
        logger.error(f"Ошибка при парсинге файла {file_name}: {e}")


def event_has_changed(event, row):
    """
    Проверяет, изменились ли значения мероприятия.
    """
    fields_to_check = [
        ('name', 'Наименование мероприятия'),
        ('participants', 'Участники'),
        ('gender', 'Пол'),
        ('start_date', 'Начало'),
        ('end_date', 'Окончание'),
        ('location', 'Место проведения'),
        ('participants_count', 'Кол-во участников'),
        ('reserve', 'Резерв'),
        ('month', 'Месяц'),
        ('year', 'Год'),
        ('min_age', 'Минимальный возраст'),
        ('max_age', 'Максимальный возраст'),
    ]
    for field, column in fields_to_check:
        if str(getattr(event, field)) != str(row[column]):
            return True
    return False
