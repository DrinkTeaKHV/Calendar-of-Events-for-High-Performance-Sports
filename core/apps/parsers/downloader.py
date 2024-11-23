import json
import os
import re
from datetime import datetime

import requests
from bs4 import BeautifulSoup


class EKPDownloader:
    def __init__(self, save_folder="pdf"):
        self.url = "https://www.minsport.gov.ru/activity/government-regulation/edinyj-kalendarnyj-plan/"
        self.save_folder = save_folder
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36"
            )
        }

    def _extract_date(self, filename):
        """Извлекает дату из имени файла в формате ГГГГ_ДД_ММ."""
        match = re.search(r"(\d{4})_(\d{2})_(\d{2})", filename)
        if match:
            year, day, month = match.groups()
            return datetime.strptime(f"{year}_{month}_{day}", "%Y_%m_%d")
        return None

    def _extract_year(self, filename):
        """Извлекает год из имени файла."""
        match = re.search(r"(\d{4})", filename)
        return int(match.group(1)) if match else None

    def _extract_urls(self, obj, file_links):
        """Рекурсивно извлекает URL из объекта JSON."""
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "url" and isinstance(value, str) and value.startswith("http"):
                    file_links.append(value)
                else:
                    self._extract_urls(value, file_links)
        elif isinstance(obj, list):
            for item in obj:
                self._extract_urls(item, file_links)

    def _get_latest_file_link(self, file_links):
        """Возвращает ссылку на файл с наиболее свежим годом."""
        sorted_links = sorted(
            file_links,
            key=lambda link: self._extract_year(os.path.basename(link)) or 0,
            reverse=True
        )
        return sorted_links[0] if sorted_links else None

    def _download_file(self, file_link):
        """Скачивает файл по указанной ссылке."""
        response = requests.get(file_link, headers=self.headers, verify=False)
        response.raise_for_status()
        filename = os.path.join(self.save_folder, os.path.basename(file_link))
        with open(filename, "wb") as file:
            file.write(response.content)
        return filename

    def _prepare_save_folder(self):
        """Создаёт папку для сохранения, если её не существует."""
        if not os.path.exists(self.save_folder):
            os.makedirs(self.save_folder)

    def _fetch_page_data(self):
        """Получает и парсит HTML-страницу для извлечения JSON-данных."""
        response = requests.get(self.url, headers=self.headers, verify=False)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        script_text = soup.find("script", {"id": "__NEXT_DATA__"}).string
        return json.loads(script_text)

    def download_and_generate_report(self):
        """Основной метод класса, выполняющий весь процесс."""
        self._prepare_save_folder()

        try:
            data = self._fetch_page_data()
        except Exception as e:
            raise Exception(f"Ошибка загрузки страницы или парсинга JSON: {e}")

        file_links = []
        self._extract_urls(data, file_links)
        file_links = list(set(file_links))

        ekp_links = [link for link in file_links if "II_chast_EKP" in link and link.endswith(".pdf") and "izm" not in link]
        if not ekp_links:
            raise Exception("Не найдено подходящих файлов PDF.")

        latest_file_link = self._get_latest_file_link(ekp_links)
        if not latest_file_link:
            raise Exception("Не удалось найти файл с наиболее свежим годом.")

        try:
            saved_file = self._download_file(latest_file_link)
            return [saved_file]
        except Exception as e:
            raise Exception(f"Ошибка при скачивании или переименовании файла: {e}")

