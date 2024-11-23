import asyncio

from django.core.management import BaseCommand

from apps.tgbot.bot.main import start_bot


class Command(BaseCommand):
    help = 'Запуск бота connect'

    def handle(self, *args, **kwargs) -> None:
        asyncio.run(start_bot())
