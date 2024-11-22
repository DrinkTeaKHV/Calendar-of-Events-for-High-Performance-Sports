# Базовый образ
FROM python:3.12-alpine3.19

# устанавливаем netcat
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.19/main" > /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/v3.19/community" >> /etc/apk/repositories && \
    apk add --no-cache netcat-openbsd build-base libffi-dev


# Установка рабочей директории в контейнере
WORKDIR /app

# Копирование зависимостей отдельно для кэширования
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Копирование файлов зависимостей
COPY . /app


# Делаем entrypoint скрипт исполняемым
RUN chmod +x entrypoint.sh
