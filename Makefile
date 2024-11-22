# Переменная для выбора docker-compose файла
COMPOSE_FILE ?= deploy/docker-compose.yml

# Команды для управления сервисами
up:
	@docker-compose -f $(COMPOSE_FILE) up --build -d
	@echo "Сервисы из $(COMPOSE_FILE) запущены"

down:
	@docker-compose -f $(COMPOSE_FILE) down
	@echo "Сервисы из $(COMPOSE_FILE) остановлены"

restart:
	@docker-compose -f $(COMPOSE_FILE) down
	@docker-compose -f $(COMPOSE_FILE) up --build -d
	@echo "Сервисы из $(COMPOSE_FILE) перезапущены"

logs:
	@docker-compose -f $(COMPOSE_FILE) logs -f

ps:
	@docker-compose -f $(COMPOSE_FILE) ps

clean:
	@docker-compose -f $(COMPOSE_FILE) down -v
	@docker system prune -f --volumes
	@echo "Сервисы из $(COMPOSE_FILE), неиспользуемые образы и тома очищены"

clean-unused:
	@docker image prune -f
	@docker container prune -f
	@docker volume prune -f
	@docker network prune -f
	@echo "Неиспользуемые ресурсы Docker очищены"

full-clean:
	@docker-compose -f $(COMPOSE_FILE) down -v
	@docker system prune -af --volumes
	@echo "Полная очистка Docker завершена"

# Специфичные команды для бэкенда
migrate:
	@docker-compose -f $(COMPOSE_FILE) exec core python manage.py migrate
	@echo "Миграции применены"

createsuperuser:
	@docker-compose -f $(COMPOSE_FILE) exec core python manage.py createsuperuser

collectstatic:
	@docker-compose -f $(COMPOSE_FILE) exec core python manage.py collectstatic --noinput
	@echo "Статические файлы собраны"

exec-core:
	@docker-compose -f $(COMPOSE_FILE) exec core sh

# Команды для базы данных и Redis
db-shell:
	@docker-compose -f $(COMPOSE_FILE) exec postgres_db psql -U postgres

redis-shell:
	@docker-compose -f $(COMPOSE_FILE) exec redis redis-cli

# Помощь
help:
	@echo "Использование: make <команда> [COMPOSE_FILE=<путь к файлу>]"
	@echo ""
	@echo "Доступные команды:"
	@echo "  up                - Запустить сервисы"
	@echo "  down              - Остановить сервисы"
	@echo "  restart           - Перезапустить сервисы"
	@echo "  logs              - Просмотреть логи"
	@echo "  ps                - Просмотреть статус контейнеров"
	@echo "  clean             - Остановить и очистить все контейнеры, образы и тома"
	@echo "  clean-unused      - Очистить только неиспользуемые контейнеры, тома, сети и образы"
	@echo "  full-clean        - Полная очистка Docker со всеми томами и образами"
	@echo "  migrate           - Применить миграции Django"
	@echo "  createsuperuser   - Создать суперпользователя Django"
	@echo "  collectstatic     - Собрать статические файлы Django"
	@echo "  exec-core         - Войти в shell контейнера core"
	@echo "  db-shell          - Подключиться к PostgreSQL"
	@echo "  redis-shell       - Подключиться к Redis"
	@echo ""
	@echo "Пример:"
	@echo "  make up COMPOSE_FILE=docker-compose.backend.yml"
