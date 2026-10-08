$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

$pythonCmd = "python"
if (Get-Command py -ErrorAction SilentlyContinue) {
    try {
        & py -3.13 -c "import sklearn" 2>$null
        if ($LASTEXITCODE -eq 0) {
            $pythonCmd = "py -3.13"
        } else {
            $pythonCmd = "py"
        }
    } catch {
        $pythonCmd = "py"
    }
}

Write-Host "Starting PlaceIQ backend with $pythonCmd..." -ForegroundColor Cyan
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; $pythonCmd -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

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
