import logging
import string
import random
from aiogram import Bot, Dispatcher, types
from aiogram.types import BotCommand
from aiogram.filters import Command
from django.conf import settings

from apps.users.models import UserExtended

# Инициализация бота и диспетчера
TOKEN = settings.TELEGRAM_BOT_API_TOKEN
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Логирование
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Функция для генерации случайного пароля
def generate_password(length=12):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))


# Установка команд бота
async def set_commands(bot: Bot):
    commands = [
        BotCommand(command="/start", description="Регистрация"),
        BotCommand(command="/reset_password", description="Сброс пароля"),
    ]
    await bot.set_my_commands(commands)


# Утилита для обновления пароля пользователя
async def update_user_password(user: UserExtended, password: str):
    user.set_password(password)
    await user.asave()


# Команда /start
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    telegram_id = message.from_user.id

    try:
        user, created = await UserExtended.objects.aget_or_create(telegram_id=telegram_id, username=telegram_id)
        password = generate_password()
        await update_user_password(user, password)
        await message.reply(f"Вы успешно зарегистрированы.\nВаш логин: {telegram_id}\nВаш пароль: {password}")
    except Exception as e:
        logger.error(f"Ошибка регистрации: {e}")
        await message.reply("Произошла ошибка при регистрации. Попробуйте позже.")


# Главная функция для запуска бота
async def start_bot():
    await set_commands(bot)
    await bot.delete_webhook()
    await dp.start_polling(bot)
