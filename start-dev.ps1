# Скрипт для запуска frontend и backend одновременно
# Использование: .\start-dev.ps1

Write-Host "🚀 Запуск портфолио-сайта..." -ForegroundColor Cyan
Write-Host ""

# Проверка наличия backend/.env
if (!(Test-Path "backend\.env")) {
    Write-Host "⚠️  Файл backend\.env не найден!" -ForegroundColor Yellow
    Write-Host "Скопируйте backend\.env.example в backend\.env и настройте его" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Команда:" -ForegroundColor Green
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  copy .env.example .env" -ForegroundColor White
    Write-Host "  notepad .env" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

# Проверка наличия .env
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Файл .env не найден!" -ForegroundColor Yellow
    Write-Host "Создаю .env файл..." -ForegroundColor Green
    copy .env.example .env
    Write-Host "✅ Файл .env создан!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "📊 Проверка базы данных..." -ForegroundColor Cyan
Write-Host ""

# Запуск backend в фоне
Write-Host "🔧 Запуск Backend (FastAPI)..." -ForegroundColor Green
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    cd backend
    uv run python -m app.main
} -ArgumentList $PWD

Start-Sleep -Seconds 3

# Запуск frontend
Write-Host "🎨 Запуск Frontend (Vite)..." -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Серверы запущены!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend:  " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:8000" -ForegroundColor White
Write-Host "📚 API Docs: " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Для остановки нажмите Ctrl+C" -ForegroundColor Gray
Write-Host ""

# Запуск frontend (в основном процессе)
npm run dev

# Cleanup при завершении
Stop-Job $backendJob
Remove-Job $backendJob
