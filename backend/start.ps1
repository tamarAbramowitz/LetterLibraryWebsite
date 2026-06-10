# Stop leftover Letter Library Python servers
$ports = 8081, 8082, 8083, 8080, 8000, 8001
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -match 'python') {
            Write-Host "Stopping $($proc.ProcessName) (PID $($proc.Id)) on port $port..."
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

Start-Sleep -Seconds 1
Set-Location $PSScriptRoot
python run.py
