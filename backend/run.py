"""Start the Letter Library API on an available port."""

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
    port = find_port()
    print(f"Starting Letter Library API at http://127.0.0.1:{port}")
    print(f"API docs: http://127.0.0.1:{port}/docs")
    if port != 8081:
        print(f"\nNote: Update frontend/.env → VITE_API_URL=http://localhost:{port}")
    print("Press Ctrl+C to stop.\n")

    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=False)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
