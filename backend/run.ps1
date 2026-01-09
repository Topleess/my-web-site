# PowerShell скрипт для быстрого запуска бэкенда
# Использование: .\run.ps1

Write-Host "🚀 Запуск Portfolio Backend API..." -ForegroundColor Cyan

# Проверка наличия .env файла
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Файл .env не найден!" -ForegroundColor Yellow
    Write-Host "Создайте файл .env на основе .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Создан файл .env из .env.example" -ForegroundColor Green
    Write-Host "Отредактируйте .env с вашими настройками и запустите скрипт снова" -ForegroundColor Yellow
    pause
    exit 1
}

# Запуск сервера
Write-Host "Запуск uvicorn сервера..." -ForegroundColor Green
uv run python -m app.main

# Если произошла ошибка
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка запуска сервера" -ForegroundColor Red
    Write-Host "Проверьте:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL запущен" -ForegroundColor Yellow
    Write-Host "  2. Настройки в .env корректны" -ForegroundColor Yellow
    Write-Host "  3. База данных создана (см. README.md)" -ForegroundColor Yellow
    pause
}
