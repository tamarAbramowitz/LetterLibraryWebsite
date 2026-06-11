"""Start the Letter Library API (local dev or production)."""

import os
import socket
import sys

FALLBACK_PORTS = (8081, 8082, 8083, 8080, 8001)


def port_is_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        return sock.connect_ex(("127.0.0.1", port)) == 0


def find_port() -> int:
    for port in FALLBACK_PORTS:
        if not port_is_in_use(port):
            return port
    raise RuntimeError(
        "No available port found. Close other servers (Ctrl+C in backend terminals) and try again."
    )


def main() -> None:
    import uvicorn

    # Render and other PaaS hosts set PORT — bind to 0.0.0.0
    if os.getenv("PORT"):
        host = os.getenv("HOST", "0.0.0.0")
        port = int(os.getenv("PORT"))
        print(f"Starting Letter Library API (production) at {host}:{port}")
    else:
        host = os.getenv("HOST", "127.0.0.1")
        port = int(os.getenv("PORT", str(find_port())))
        print(f"Starting Letter Library API at http://{host}:{port}")
        print(f"API docs: http://{host}:{port}/docs")
        if port != 8081:
            print(f"\nNote: Update frontend/.env → VITE_API_URL=http://localhost:{port}")
        print("Press Ctrl+C to stop.\n")

    uvicorn.run("app.main:app", host=host, port=port, reload=False)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
