# 🚀 Развертывание в продакшн (uv + FastAPI + Tortoise-ORM + PostgreSQL)

Руководство по развертыванию бэкенда на вашем хостинге.

## 📋 Предварительные требования на сервере

- Python 3.11+
- PostgreSQL 13+
- uv
- Доступ к серверу по SSH

## 🔧 Шаг 1: Подготовка сервера

### 1.1. Подключитесь к серверу

```bash
ssh user@your-server.com
```

### 1.2. Установите uv (если еще не установлен)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

После установки перезагрузите shell или выполните:
```bash
source ~/.bashrc
# или
source ~/.zshrc
```

### 1.3. Установите PostgreSQL (если еще не установлен)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🗄️ Шаг 2: Настройка базы данных

### 2.1. Создайте пользователя и базу данных

```bash
sudo -u postgres psql
```

В psql консоли:
```sql
CREATE DATABASE portfolio_prod;
CREATE USER portfolio_user WITH PASSWORD 'super_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE portfolio_prod TO portfolio_user;

-- Для PostgreSQL 15+
\c portfolio_prod
GRANT ALL ON SCHEMA public TO portfolio_user;

\q
```

### 2.2. Настройте доступ к PostgreSQL

Отредактируйте `pg_hba.conf`:
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Добавьте строку (для локального доступа):
```
local   portfolio_prod   portfolio_user   md5
```

Перезапустите PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## 📦 Шаг 3: Развертывание приложения

### 3.1. Создайте директорию для приложения

```bash
sudo mkdir -p /var/www/portfolio-backend
sudo chown $USER:$USER /var/www/portfolio-backend
cd /var/www/portfolio-backend
```

### 3.2. Загрузите код на сервер

**Вариант A: Через Git**
```bash
git clone <your-repo-url> .
```

**Вариант B: Через rsync/scp**
```bash
# На локальной машине:
rsync -avz backend/ user@your-server.com:/var/www/portfolio-backend/
```

**Вариант C: Через FTP/SFTP**
Используйте FileZilla или другой FTP клиент

### 3.3. Установите зависимости

```bash
cd /var/www/portfolio-backend
uv sync --frozen
```

### 3.4. Создайте .env файл

```bash
nano .env
```

Добавьте (замените значения на свои):
```env
DATABASE_URL=postgres://portfolio_user:super_secure_password_here@localhost:5432/portfolio_prod
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_prod
DB_USER=portfolio_user
DB_PASSWORD=super_secure_password_here

HOST=0.0.0.0
PORT=8000

# ВАЖНО: Укажите домен вашего фронтенда!
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

ENV=production
```

### 3.5. Инициализируйте базу данных

```bash
uv run python -m app.seed_data
```

### 3.6. Проверьте, что приложение запускается

```bash
uv run python -m app.main
```

Если все работает, остановите (Ctrl+C) и настройте автозапуск.

## 🔄 Шаг 4: Настройка автозапуска (systemd)

### 4.1. Создайте systemd service файл

```bash
sudo nano /etc/systemd/system/portfolio-api.service
```

Вставьте:
```ini
[Unit]
Description=Portfolio Backend API
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/portfolio-backend
Environment="PATH=/var/www/portfolio-backend/.venv/bin:/usr/local/bin:/usr/bin:/bin"

# Запуск через uv
ExecStart=/home/YOUR_USER/.local/bin/uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Автоматический перезапуск при сбое
Restart=always
RestartSec=10

# Логирование
StandardOutput=journal
StandardError=journal
SyslogIdentifier=portfolio-api

[Install]
WantedBy=multi-user.target
```

**⚠️ Замените:**
- `YOUR_USER` на ваше имя пользователя (где установлен uv)
- Или укажите полный путь к uv: `/home/username/.local/bin/uv`

### 4.2. Настройте права доступа

```bash
sudo chown -R www-data:www-data /var/www/portfolio-backend
sudo chmod -R 755 /var/www/portfolio-backend
```

### 4.3. Запустите и включите автозапуск

```bash
# Перезагрузите конфигурацию systemd
sudo systemctl daemon-reload

# Запустите сервис
sudo systemctl start portfolio-api

# Проверьте статус
sudo systemctl status portfolio-api

# Включите автозапуск при загрузке системы
sudo systemctl enable portfolio-api
```

### 4.4. Проверьте логи

```bash
# Просмотр логов в реальном времени
sudo journalctl -u portfolio-api -f

# Последние 100 строк
sudo journalctl -u portfolio-api -n 100

# Логи за сегодня
sudo journalctl -u portfolio-api --since today
```

## 🌐 Шаг 5: Настройка Nginx (Reverse Proxy)

### 5.1. Установите Nginx

```bash
sudo apt install nginx  # Ubuntu/Debian
sudo yum install nginx  # CentOS/RHEL
```

### 5.2. Создайте конфигурацию для API

```bash
sudo nano /etc/nginx/sites-available/portfolio-api
```

Вставьте:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Логи
    access_log /var/log/nginx/portfolio-api-access.log;
    error_log /var/log/nginx/portfolio-api-error.log;

    # Reverse proxy к FastAPI
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket поддержка (если понадобится)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Ограничение размера загружаемых файлов (если будет загрузка изображений)
    client_max_body_size 10M;
}
```

### 5.3. Активируйте конфигурацию

```bash
# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезапустите Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 🔒 Шаг 6: Настройка SSL (HTTPS)

### 6.1. Установите Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### 6.2. Получите SSL сертификат

```bash
sudo certbot --nginx -d api.yourdomain.com
```

Следуйте инструкциям. Certbot автоматически обновит конфигурацию Nginx.

### 6.3. Проверьте автообновление сертификата

```bash
sudo certbot renew --dry-run
```

## 🔥 Шаг 7: Настройка Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## ✅ Шаг 8: Проверка

### 8.1. Проверьте доступность API

```bash
curl http://api.yourdomain.com/api/health
# Должно вернуть: {"message":"OK"}
```

Или откройте в браузере:
- `https://api.yourdomain.com/` - корневой endpoint
- `https://api.yourdomain.com/docs` - Swagger документация
- `https://api.yourdomain.com/api/projects` - список проектов

### 8.2. Обновите CORS на бэкенде

Отредактируйте `.env` и добавьте ваш фронтенд домен:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Перезапустите сервис:
```bash
sudo systemctl restart portfolio-api
```

## 🔄 Обновление приложения

Когда нужно обновить код:

```bash
cd /var/www/portfolio-backend

# Загрузите новый код (через git, rsync, etc)
git pull origin main

# Обновите зависимости (если изменились)
uv sync --frozen

# Перезапустите сервис
sudo systemctl restart portfolio-api

# Проверьте статус
sudo systemctl status portfolio-api
```

## 📊 Мониторинг

### Просмотр статуса сервиса
```bash
sudo systemctl status portfolio-api
```

### Просмотр логов
```bash
# Реального времени
sudo journalctl -u portfolio-api -f

# Последние ошибки
sudo journalctl -u portfolio-api -p err
```

### Проверка использования ресурсов
```bash
htop
# Найдите процесс uvicorn
```

## 🐛 Troubleshooting

### Сервис не запускается

1. **Проверьте логи:**
   ```bash
   sudo journalctl -u portfolio-api -n 50
   ```

2. **Проверьте права:**
   ```bash
   ls -la /var/www/portfolio-backend
   ```

3. **Проверьте PostgreSQL:**
   ```bash
   sudo systemctl status postgresql
   psql -U portfolio_user -d portfolio_prod -h localhost
   ```

4. **Проверьте .env:**
   ```bash
   cat /var/www/portfolio-backend/.env
   ```

### Ошибки подключения к БД

```bash
# Проверьте подключение
psql -U portfolio_user -d portfolio_prod -h localhost

# Проверьте pg_hba.conf
sudo cat /etc/postgresql/*/main/pg_hba.conf | grep portfolio

# Перезапустите PostgreSQL
sudo systemctl restart postgresql
```

### Nginx ошибки

```bash
# Проверьте конфигурацию
sudo nginx -t

# Просмотрите логи ошибок
sudo tail -f /var/log/nginx/portfolio-api-error.log
```

## 🎯 Оптимизация для продакшна

### 1. Увеличение количества workers

В systemd service файле измените:
```ini
ExecStart=/path/to/uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 8
```

Рекомендуется: `(2 × количество_ядер) + 1`

### 2. Настройка лимитов в systemd

Добавьте в секцию `[Service]`:
```ini
LimitNOFILE=65536
LimitNPROC=4096
```

### 3. Настройка PostgreSQL connection pool

В `app/database.py` можно настроить пул соединений:
```python
TORTOISE_ORM = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "host": settings.DB_HOST,
                "port": settings.DB_PORT,
                "user": settings.DB_USER,
                "password": settings.DB_PASSWORD,
                "database": settings.DB_NAME,
                "minsize": 10,  # мин. количество соединений
                "maxsize": 20,  # макс. количество соединений
            }
        }
    },
    # ...
}
```

## 📝 Чек-лист развертывания

- [ ] PostgreSQL установлен и настроен
- [ ] База данных создана
- [ ] uv установлен
- [ ] Код загружен на сервер
- [ ] Зависимости установлены (`uv sync`)
- [ ] .env файл настроен (правильные данные БД)
- [ ] База данных заполнена (`uv run python -m app.seed_data`)
- [ ] systemd service создан и настроен
- [ ] Сервис запущен и работает
- [ ] Nginx установлен и настроен
- [ ] SSL сертификат получен (HTTPS)
- [ ] Firewall настроен
- [ ] CORS настроен (домен фронтенда в ALLOWED_ORIGINS)
- [ ] API доступен и отвечает
- [ ] Фронтенд может подключиться к API

---

**Готово!** 🎉 Ваш бэкенд развернут и готов к работе!
