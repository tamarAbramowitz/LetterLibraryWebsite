"""Start the Letter Library API on an available port."""

import socket
import subprocess
import sys

PORT = 8080


def port_is_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
            return True
        except OSError:
            return False


def main() -> None:
    port = PORT
    if not port_is_free(port):
        print(f"ERROR: Port {port} is already in use.")
        print("Run .\\start.ps1 to stop leftover servers, or close the other process.")
        print(f"  netstat -ano | findstr :{port}")
        raise SystemExit(1)
    print(f"Starting Letter Library API at http://127.0.0.1:{port}")
    print(f"API docs: http://127.0.0.1:{port}/docs")
    print("Press Ctrl+C to stop.\n")

    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--reload",
        "--host",
        "127.0.0.1",
        "--port",
        str(port),
    ]
    raise SystemExit(subprocess.call(cmd))


if __name__ == "__main__":
    main()
