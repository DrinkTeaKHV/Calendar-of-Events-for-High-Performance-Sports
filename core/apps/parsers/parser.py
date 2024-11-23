import re
import pandas as pd
from PyPDF2 import PdfReader


def extract_last_number(text):
    # Удаляем строку "Стр. x из y", если она есть
    cleaned_text = re.sub(r'Стр\.\s*\d+\s*из\s*\d+', '', text)
    # Извлекаем все числа из очищенного текста
    numbers = re.findall(r'\d+', cleaned_text)
    # Преобразуем найденные числа из строк в целые числа
    numbers = [int(num) for num in numbers]
    # Возвращаем последнее число, если список не пустой
    return numbers[-1] if numbers else None


def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page_num, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text()
        text += page_text + "\n"  # Добавляем перенос строки между страницами
    return text


def clean_category(category):
    # Удаляем даты в формате DD.MM.YYYY
    category = re.sub(r'\d{2}\.\d{2}\.\d{4}', '', category)
    # Удаляем коды стран (например, 'ФР')
    category = re.sub(r'\b[A-Z]{1,3}\b', '', category)
    # Оставляем 'ФЕДЕРАЛЬНЫЙ ОКРУГ)' для сохранения в названии мероприятия
    # Удаляем лишние пробелы и дефисы, оставляя возрастные рамки
    category = re.sub(r'\s+', ' ', category)
    category = re.sub(r'\s*-\s*', ' - ', category)  # Обеспечиваем пробелы вокруг дефиса
    category = category.strip()
    return category


# Список известных стран
country_list = [
    "РОССИЯ", "ФРАНЦИЯ", "США", "КИТАЙ", "ГЕРМАНИЯ", "ИТАЛИЯ", "ЯПОНИЯ",
    "КАНАДА", "БЕЛАРУСЬ", "УКРАИНА", "ТУРЦИЯ", "ИСПАНИЯ", "РУМЫНИЯ",
    "ПОЛЬША", "РОССИЙСКАЯ ФЕДЕРАЦИЯ", "ИЗРАИЛЬ", "БРАЗИЛИЯ", "ИНДИЯ",
    "ЮЖНАЯ КОРЕЯ", "ИНДОНЕЗИЯ", "ЕГИПЕТ", "НОВАЯ ЗЕЛАНДИЯ", "ТАЙВАНЬ",
    "ТАДЖИКИСТАН", "КАЗАХСТАН", "ФИНЛЯНДИЯ", "ШВЕЙЦАРИЯ", "ГРУЗИЯ",
    "БОЛГАРИЯ", "ЧЕШСКАЯ РЕСПУБЛИКА", "НЕДЕРЛАНДЫ", "БЕЛЬГИЯ", "ВЕНГРИЯ",
    "СТРАНА НЕ УКАЗАНА"
]

# Обработка списка видов спорта
sports_text = """
... (твоя строка с видами спорта) ...
"""

# Создаем список видов спорта
sports_list = list(set([sport.strip().upper() for sport in sports_text.split(',')
                        if sport.strip() and sport.strip().upper() != 'МОЛОДЕЖНЫЙ (РЕЗЕРВНЫЙ) СОСТАВ']))


def split_text_into_records_with_sport_and_reserve(text, sports_list):
    lines = text.split('\n')
    records = []
    current_sport = None
    current_reserve = False
    current_record_lines = []

    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue

        if line_stripped.upper() == 'МОЛОДЕЖНЫЙ (РЕЗЕРВНЫЙ) СОСТАВ':
            current_reserve = True
            continue

        # Проверяем, является ли строка названием вида спорта
        if line_stripped.upper() in sports_list:
            # Перед обновлением текущего вида спорта сохраняем предыдущие записи
            if current_record_lines:
                record_text = '\n'.join(current_record_lines)
                records.append({'text': record_text, 'sport': current_sport, 'reserve': current_reserve})
                current_record_lines = []
            current_sport = line_stripped.strip()
            current_reserve = False  # Сбрасываем флаг "Резерв" при новом виде спорта
            continue

        # Проверяем, является ли строка началом новой записи
        if re.match(r'^\d{13,}', line_stripped):
            # Начало новой записи
            if current_record_lines:
                # Сохраняем предыдущую запись
                record_text = '\n'.join(current_record_lines)
                records.append({'text': record_text, 'sport': current_sport, 'reserve': current_reserve})
                current_record_lines = []

        current_record_lines.append(line)

    # Добавляем последнюю запись
    if current_record_lines:
        record_text = '\n'.join(current_record_lines)
        records.append({'text': record_text, 'sport': current_sport, 'reserve': current_reserve})

    return records


def parse_record(record_text):
    lines = record_text.strip().split("\n")
    if len(lines) < 2:
        return None

    # Шаг 1: Извлечение ID и Названия мероприятия
    header = lines[0]
    match_header = re.match(r'^(\d+)\s+(.+)', header)
    if not match_header:
        return None
    id_sm = match_header.group(1)
    event_name_parts = [match_header.group(2)]

    # Собираем название мероприятия, которое может занимать несколько строк
    category_keywords = ['женщины', 'мужчины', 'юниоры', 'юниорки', 'девушки', 'юноши', 'мальчики', 'девочки']
    date_pattern = r'\d{2}\.\d{2}\.\d{4}'

    # Начинаем со второй строки
    idx = 1
    while idx < len(lines):
        line = lines[idx].strip()
        # Если строка содержит дату или категорию, прерываем сбор названия мероприятия
        if re.search(date_pattern, line) or any(kw in line.lower() for kw in category_keywords):
            break
        else:
            event_name_parts.append(line)
            idx += 1

    event_name = ' '.join(event_name_parts).strip()

    # Шаг 2: Найти строку с Категорией участников
    category = None
    while idx < len(lines):
        line = lines[idx].strip()
        if any(keyword.lower() in line.lower() for keyword in category_keywords):
            category = line.strip()
            idx += 1
            break
        idx += 1

    if category:
        category = clean_category(category)

    # Шаг 3: Ищем даты
    dates = re.findall(r'\d{2}\.\d{2}\.\d{4}', record_text)
    start_date = dates[0] if len(dates) > 0 else None
    end_date = dates[1] if len(dates) > 1 else None

    participants = extract_last_number(record_text)

    # Шаг 4: Извлекаем адрес
    address = None
    country_found = None
    for country in country_list:
        country_pattern = rf'\b{country}\b'
        match = re.search(country_pattern, record_text, re.IGNORECASE)
        if match:
            country_found = country
            pos = match.end()
            # Извлекаем текст после названия страны
            address_part = record_text[pos:]
            # Заменяем '\n' на ', '
            address_part = address_part.replace('\n', ', ')
            # Удаляем даты и число участников из адреса
            address_part = re.sub(r'\d{2}\.\d{2}\.\d{4}', '', address_part)  # Удаляем даты
            address_part = re.sub(r'\d+$', '', address_part).strip()  # Удаляем число участников
            # Удаляем лишние пробелы
            address_part = re.sub(r'\s+', ' ', address_part).strip()
            # Формируем полный адрес
            address = f"{country_found}, {address_part}" if address_part else country_found
            break

    if not address and len(dates) >= 2:
        # Попытка извлечь адрес по-другому
        second_date = dates[1]
        parts = record_text.split(second_date)
        if len(parts) > 1:
            address_part = parts[1].strip()
            address_part = re.sub(r'\d+$', '', address_part).strip()
            address_part = address_part.replace('\n', ', ')
            address = address_part if address_part else None

    # Очистка адреса от префиксов, таких как "г.", "поселок"
    if address:
        address = re.sub(r'\bг\.\s*', '', address, flags=re.IGNORECASE)
        address = re.sub(r'\bпоселок\s*', '', address, flags=re.IGNORECASE).strip()

    return {
        "№ СМ в ЕКП": id_sm,
        "Наименование мероприятия": event_name,
        "Участники": category,
        "Пол": None,  # Будет определено позже
        "Начало": start_date,
        "Окончание": end_date,
        "Место проведения": address,
        "Кол-во участников": participants
    }


def parse_text_to_dataframe(text):
    records = split_text_into_records_with_sport_and_reserve(text, sports_list)

    data = []
    for record in records:
        record_text = record['text']
        sport = record['sport']
        reserve = record['reserve']
        parsed = parse_record(record_text)
        if parsed:
            parsed['Вид спорта'] = sport
            parsed['Резерв'] = reserve
            data.append(parsed)

    df = pd.DataFrame(data)
    return df
