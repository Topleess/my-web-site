# Portfolio Backend API

Backend API для портфолио-сайта, построенный на FastAPI + PostgreSQL + Tortoise-ORM.

## 🚀 Технологический стек

- **FastAPI** - современный веб-фреймворк для создания API
- **Tortoise-ORM** - async ORM для Python
- **PostgreSQL** - реляционная база данных
- **asyncpg** - асинхронный драйвер PostgreSQL
- **uv** - быстрый менеджер пакетов Python

## 📋 Требования

- Python 3.11+
- PostgreSQL 13+
- uv (для управления зависимостями)

## 🛠 Установка

### 1. Установка uv (если еще не установлен)

**Windows (PowerShell):**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Linux/macOS:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Клонирование и настройка проекта

```bash
cd backend

# Создание виртуального окружения и установка зависимостей
uv sync
```

### 3. Настройка базы данных PostgreSQL

Создайте базу данных PostgreSQL:

```sql
CREATE DATABASE portfolio;
CREATE USER portfolio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
```

### 4. Конфигурация окружения

Скопируйте `.env.example` в `.env` и настройте:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
DATABASE_URL=postgres://portfolio_user:your_password@localhost:5432/portfolio
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=portfolio_user
DB_PASSWORD=your_password

HOST=0.0.0.0
PORT=8000

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

ENV=development
```

### 5. Инициализация базы данных

Запустите скрипт для создания таблиц и заполнения начальными данными:

```bash
uv run python -m app.seed_data
```

## 🚀 Запуск сервера

### Режим разработки (с auto-reload):

```bash
uv run python -m app.main
```

Или с помощью uvicorn напрямую:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Продакшн режим:

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

API будет доступен по адресу: `http://localhost:8000`

## 📚 API Endpoints

### Основные endpoints:

- `GET /` - Корневой endpoint
- `GET /api/health` - Проверка здоровья сервера

### Проекты:

- `GET /api/projects` - Получить все проекты
  - Query параметры:
    - `category` - фильтр по категории
    - `status` - фильтр по статусу
    - `limit` - ограничение количества результатов
- `GET /api/projects/{id}` - Получить конкретный проект
- `POST /api/projects` - Создать новый проект
- `GET /api/categories` - Получить список категорий с количеством проектов

### Интерактивная документация:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📊 Модель данных

### Project

```python
{
    "id": int,
    "title": str,
    "category": str,  # "Дизайн" | "Разработка" | "Стартапы" | "Другое"
    "status": str,    # "В работе" | "Завершен"
    "year": str,
    "image": str,     # URL главного изображения
    "description": str,
    "client": str | null,
    "role": str | null,
    "images": list[str],  # Массив URL дополнительных изображений
    "created_at": datetime,
    "updated_at": datetime
}
```

## 🔧 Дополнительные команды

### Пересоздать базу данных:

```bash
# Удалить все таблицы
psql -U portfolio_user -d portfolio -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Заново заполнить данными
uv run python -m app.seed_data
```

### Добавить новый проект через API:

```bash
curl -X POST "http://localhost:8000/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Новый проект",
    "category": "Разработка",
    "status": "В работе",
    "year": "2024",
    "image": "https://example.com/image.jpg",
    "description": "Описание проекта",
    "client": "Клиент",
    "role": "Разработчик",
    "images": ["https://example.com/image1.jpg"]
  }'
```

## 🚀 Деплой

### На хостинге с поддержкой Python:

1. Установите все зависимости:
```bash
uv sync --frozen
```

2. Настройте переменные окружения в `.env`

3. Запустите миграции:
```bash
uv run python -m app.seed_data
```

4. Запустите сервер:
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Systemd service (для Linux серверов):

Создайте файл `/etc/systemd/system/portfolio-api.service`:

```ini
[Unit]
Description=Portfolio Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/backend/.venv/bin"
ExecStart=/path/to/.local/bin/uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

Запустите сервис:
```bash
sudo systemctl enable portfolio-api
sudo systemctl start portfolio-api
sudo systemctl status portfolio-api
```

## 📝 Примечания

- Убедитесь, что PostgreSQL запущен перед стартом API
- В продакшн режиме используйте переменную `ENV=production`
- Настройте `ALLOWED_ORIGINS` для безопасности CORS
- Для продакшна рекомендуется использовать nginx как reverse proxy

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Убедитесь, что PostgreSQL доступен
3. Проверьте правильность настроек в `.env`
