# 🚀 Руководство по развертыванию

## Локальная разработка

### Бэкенд

1. **Установите PostgreSQL** (если еще не установлен)
   - Windows: [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - Или используйте Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Создайте базу данных:**
   ```sql
   CREATE DATABASE portfolio;
   CREATE USER portfolio_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
   ```

3. **Установите uv** (если еще не установлен):
   ```powershell
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

4. **Настройте бэкенд:**
   ```bash
   cd backend
   
   # Скопируйте .env.example в .env
   copy .env.example .env
   
   # Отредактируйте .env файл с вашими настройками БД
   notepad .env
   
   # Установите зависимости
   uv sync
   
   # Запустите миграции и заполните БД
   uv run python -m app.seed_data
   
   # Запустите сервер
   uv run python -m app.main
   ```

   Бэкенд будет доступен на `http://localhost:8000`

### Фронтенд

1. **Настройте фронтенд:**
   ```bash
   # В корне проекта
   
   # Скопируйте .env.example в .env
   copy .env.example .env
   
   # Установите зависимости
   npm install
   
   # Запустите dev сервер
   npm run dev
   ```

   Фронтенд будет доступен на `http://localhost:5173`

## 🌐 Развертывание на продакшн

### Вариант 1: Shared Hosting с поддержкой Python + PostgreSQL

#### Бэкенд

1. **Загрузите файлы бэкенда на сервер:**
   ```bash
   # Через FTP, SFTP или Git
   rsync -avz backend/ user@yourserver.com:/path/to/backend/
   ```

2. **На сервере установите зависимости:**
   ```bash
   cd /path/to/backend
   
   # Если есть uv
   uv sync --frozen
   
   # Если нет uv, используйте pip
   python -m venv venv
   source venv/bin/activate  # На Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Настройте .env файл:**
   ```bash
   nano .env
   ```
   
   Измените настройки на продакшн:
   ```env
   DATABASE_URL=postgres://prod_user:prod_password@localhost:5432/portfolio_prod
   ENV=production
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

4. **Запустите миграции:**
   ```bash
   uv run python -m app.seed_data
   # или
   python -m app.seed_data
   ```

5. **Запустите приложение:**
   
   **Через systemd (Linux):**
   ```bash
   sudo nano /etc/systemd/system/portfolio-api.service
   ```
   
   ```ini
   [Unit]
   Description=Portfolio Backend API
   After=network.target postgresql.service
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/backend
   Environment="PATH=/path/to/backend/.venv/bin"
   ExecStart=/path/to/backend/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   ```bash
   sudo systemctl enable portfolio-api
   sudo systemctl start portfolio-api
   ```
   
   **Через Gunicorn:**
   ```bash
   pip install gunicorn
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
   ```

6. **Настройте Nginx как reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

#### Фронтенд

1. **Обновите .env для продакшна:**
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

2. **Соберите фронтенд:**
   ```bash
   npm run build
   ```

3. **Загрузите dist/ на хостинг:**
   ```bash
   # Через FTP или rsync
   rsync -avz dist/ user@yourserver.com:/var/www/yourdomain.com/
   ```

4. **Настройте Nginx для фронтенда:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/yourdomain.com;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Вариант 2: Vercel (фронтенд) + Railway/Render (бэкенд)

#### Бэкенд на Railway/Render

1. **Создайте `Procfile` в папке backend:**
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

2. **Добавьте `railway.toml` или `render.yaml`:**
   
   **railway.toml:**
   ```toml
   [build]
   builder = "nixpacks"
   buildCommand = "uv sync --frozen"
   
   [deploy]
   startCommand = "uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT"
   ```

3. **Загрузите на Railway/Render через Git**

4. **Добавьте переменные окружения в панели управления**

#### Фронтенд на Vercel

1. **Установите Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Настройте переменные окружения в Vercel:**
   - Перейдите в настройки проекта
   - Добавьте `VITE_API_URL` с URL вашего бэкенда

3. **Разверните:**
   ```bash
   vercel --prod
   ```

### Вариант 3: Docker (полная изоляция)

1. **Создайте `docker-compose.yml` в корне:**
   ```yaml
   version: '3.8'
   
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: portfolio
         POSTGRES_USER: portfolio_user
         POSTGRES_PASSWORD: secure_password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
     
     backend:
       build: ./backend
       environment:
         DATABASE_URL: postgres://portfolio_user:secure_password@postgres:5432/portfolio
         ALLOWED_ORIGINS: http://localhost:5173,https://yourdomain.com
       ports:
         - "8000:8000"
       depends_on:
         - postgres
     
     frontend:
       build: .
       environment:
         VITE_API_URL: http://localhost:8000
       ports:
         - "5173:5173"
       depends_on:
         - backend
   
   volumes:
     postgres_data:
   ```

2. **Создайте Dockerfile для бэкенда (backend/Dockerfile):**
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   # Install uv
   RUN pip install uv
   
   # Copy dependency files
   COPY pyproject.toml .
   
   # Install dependencies
   RUN uv sync --frozen
   
   # Copy application code
   COPY app ./app
   
   EXPOSE 8000
   
   CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Запустите:**
   ```bash
   docker-compose up -d
   ```

## 📊 Мониторинг и логи

### Проверка статуса бэкенда:
```bash
curl http://localhost:8000/api/health
```

### Просмотр логов:
```bash
# systemd
sudo journalctl -u portfolio-api -f

# Docker
docker-compose logs -f backend

# Обычный процесс
tail -f /var/log/portfolio-api.log
```

## 🔒 Безопасность

1. **Всегда используйте HTTPS в продакшне**
2. **Настройте firewall для ограничения доступа к портам**
3. **Регулярно обновляйте зависимости**
4. **Используйте сильные пароли для БД**
5. **Ограничьте CORS только необходимыми доменами**

## 🐛 Troubleshooting

### Бэкенд не запускается:
- Проверьте доступность PostgreSQL: `psql -U portfolio_user -d portfolio`
- Проверьте .env файл
- Посмотрите логи: `sudo journalctl -u portfolio-api`

### Фронтенд не может подключиться к API:
- Проверьте CORS настройки в бэкенде
- Проверьте переменную `VITE_API_URL`
- Откройте DevTools → Network для просмотра ошибок

### База данных пустая:
```bash
cd backend
uv run python -m app.seed_data
```
