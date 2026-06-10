# Stop any leftover Letter Library servers on common ports
$ports = 8080, 8000, 8001
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -match 'python|uvicorn') {
            Write-Host "Stopping $($proc.ProcessName) (PID $($proc.Id)) on port $port..."
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

Set-Location $PSScriptRoot
python run.py
