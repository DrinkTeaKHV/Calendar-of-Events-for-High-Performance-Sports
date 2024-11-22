import os
import sentry_sdk

from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')
SITE_URL = os.getenv('SITE_URL')
DEBUG = os.getenv('DEBUG', True)
SENTRY_DSN = os.getenv('SENTRY_DSN')

ALLOWED_HOSTS = ["*"]
CSRF_TRUSTED_ORIGINS = ['http://localhost:4200', 'http://localhost:3000', SITE_URL]
CORS_ALLOWED_ORIGINS = ['http://localhost:4200', 'http://localhost:3000', SITE_URL]
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_filters',
    'rest_framework',
    'drf_yasg',
    'corsheaders',

    'apps.users',
    'apps.events'

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.getenv('POSTGRES_DB'),
        "USER": os.getenv('POSTGRES_USER'),
        "PASSWORD": os.getenv('POSTGRES_PASSWORD'),
        "HOST": os.getenv('POSTGRES_HOST'),
        "PORT": os.getenv('POSTGRES_PORT'),
        "TEST": {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'mydatabase'
        }
    }
}

AUTH_PASSWORD_VALIDATORS = [
]

LANGUAGE_CODE = 'ru-RU'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = '/staticfiles/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = "users.UserExtended"

if not DEBUG:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for tracing.
        traces_sample_rate=1.0,
        # Set profiles_sample_rate to 1.0 to profile 100%
        # of sampled transactions.
        # We recommend adjusting this value in production.
        profiles_sample_rate=1.0,
    )

CELERY_BROKER_URL = 'redis://{}:{}/0'.format(os.getenv('REDIS_HOST', "localhost"), os.getenv('REDIS_PORT', 6379))
CELERY_RESULT_BACKEND = 'redis://{}:{}/0'.format(os.getenv('REDIS_HOST', "localhost"), os.getenv('REDIS_PORT', 6379))
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

# Устанавливаем временную зону
TIME_ZONE = 'Asia/Vladivostok'  # Устанавливаем временную зону Владивостока

# Убедитесь, что USE_TZ включен
USE_TZ = True  # Включаем поддержку временных зон


ELASTICSEARCH_DSL = {
    'default': {
        'hosts': os.environ.get('ELASTICSEARCH_HOST', 'localhost') + ':9200'
    },
}