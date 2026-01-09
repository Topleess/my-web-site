# PowerShell скрипт для инициализации базы данных
# Использование: .\init-db.ps1

Write-Host "📊 Инициализация базы данных..." -ForegroundColor Cyan

# Проверка наличия .env файла
if (-not (Test-Path ".env")) {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    Write-Host "Создайте файл .env на основе .env.example" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Запуск скрипта заполнения данными..." -ForegroundColor Green
uv run python -m app.seed_data

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ База данных успешно инициализирована!" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка инициализации базы данных" -ForegroundColor Red
    Write-Host "Проверьте:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL запущен" -ForegroundColor Yellow
    Write-Host "  2. База данных создана" -ForegroundColor Yellow
    Write-Host "  3. Настройки в .env корректны" -ForegroundColor Yellow
}

pause
