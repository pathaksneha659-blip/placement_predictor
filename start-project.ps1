$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

Write-Host "Starting PlaceIQ backend..." -ForegroundColor Cyan
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; C:/Python314/python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000" -PassThru

Start-Sleep -Seconds 2

Write-Host "Starting PlaceIQ frontend..." -ForegroundColor Cyan
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontend'; npm run dev -- --host 0.0.0.0" -PassThru

Write-Host "" 
Write-Host "PlaceIQ is running:" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "- Backend:  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "- Docs:     http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "" 
Write-Host "Backend PID: $($backendJob.Id)" -ForegroundColor DarkGray
Write-Host "Frontend PID: $($frontendJob.Id)" -ForegroundColor DarkGray
