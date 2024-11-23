import json
import logging

import requests
from django.conf import settings

TELEGRAM_API = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_API_TOKEN}/"
logger = logging.getLogger(__name__)


def sync_send_message(chat_id: int, text: str, reply_markup: dict = None):
    url = f"{TELEGRAM_API}sendMessage"
    data = {
        'chat_id': chat_id,
        'text': text,
        'reply_markup': json.dumps(reply_markup) if reply_markup else None
    }
    response = requests.post(url, data=data)
    response.raise_for_status()  # Проверка на успешность запроса
    return response.status_code == 200
