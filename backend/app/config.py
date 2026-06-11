import os
import shutil
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = APP_DIR / "data"
BUNDLED_LETTERS = DEFAULT_DATA_DIR / "letters.json"


def get_data_dir() -> Path:
    """Production: set DATA_DIR to a Render persistent disk mount (e.g. /var/data)."""
    custom = os.getenv("DATA_DIR")
    if custom:
        path = Path(custom)
        path.mkdir(parents=True, exist_ok=True)
        return path
    return DEFAULT_DATA_DIR


def get_letters_path() -> Path:
    return get_data_dir() / "letters.json"


def get_admin_config_path() -> Path:
    return get_data_dir() / "admin_config.json"


def ensure_data_files() -> None:
    """Seed letters.json on first run when using an empty persistent disk."""
    data_dir = get_data_dir()
    data_dir.mkdir(parents=True, exist_ok=True)

    letters_path = data_dir / "letters.json"
    if not letters_path.exists() and BUNDLED_LETTERS.exists():
        shutil.copy(BUNDLED_LETTERS, letters_path)


def get_cors_origins() -> list[str]:
    defaults = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://tamarabramowitz.github.io",
        "https://tamarAbramowitz.github.io",
    ]
    extra = os.getenv("CORS_ORIGINS", "")
    if extra.strip():
        return [*defaults, *(origin.strip() for origin in extra.split(",") if origin.strip())]
    return defaults
