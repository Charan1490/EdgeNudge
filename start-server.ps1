# EdgeNudge Local Server Launcher
# Starts a simple HTTP server on port 8000

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "   EdgeNudge - Starting Local Server" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

Write-Host "📍 Server will run on: http://localhost:8000" -ForegroundColor Green
Write-Host "🌐 Opening browser in 3 seconds..." -ForegroundColor Yellow
Write-Host "⏹️  Press Ctrl+C to stop the server`n" -ForegroundColor Yellow
Write-Host "===============================================`n" -ForegroundColor Cyan

# Change to frontend directory
Set-Location -Path "$PSScriptRoot\frontend"

# Wait 3 seconds then open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:8000"

# Start Python HTTP server
Write-Host "✅ Server started! Check your browser." -ForegroundColor Green
Write-Host "   (If browser didn't open, go to: http://localhost:8000)`n" -ForegroundColor White

python -m http.server 8000
