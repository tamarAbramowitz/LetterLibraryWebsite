import hashlib
import json
import os
import secrets
from pathlib import Path

CONFIG_PATH = Path(__file__).resolve().parent.parent / "data" / "admin_config.json"
_PBKDF2_ITERATIONS = 100_000


class AdminConfigService:
    @staticmethod
    def _hash_password(password: str, salt: str) -> str:
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            _PBKDF2_ITERATIONS,
        )
        return digest.hex()

    @classmethod
    def _load_config(cls) -> dict | None:
        if not CONFIG_PATH.exists():
            return None
        with open(CONFIG_PATH, encoding="utf-8") as f:
            return json.load(f)

    @classmethod
    def _save_config(cls, config: dict) -> None:
        CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())

    @classmethod
    def verify_password(cls, password: str | None) -> bool:
        if not password:
            return False

        normalized = password.strip()
        config = cls._load_config()
        if config and "password_hash" in config and "salt" in config:
            expected = cls._hash_password(normalized, config["salt"])
            return secrets.compare_digest(expected, config["password_hash"])

        env_password = os.getenv("ADMIN_PASSWORD")
        if env_password:
            return secrets.compare_digest(normalized, env_password)

        return False

    @classmethod
    def change_password(cls, current_password: str, new_password: str) -> None:
        if not cls.verify_password(current_password):
            raise ValueError("Invalid current password")

        normalized_new = new_password.strip()
        if len(normalized_new) < 4:
            raise ValueError("New password must be at least 4 characters")

        if secrets.compare_digest(current_password.strip(), normalized_new):
            raise ValueError("New password must be different from the current password")

        salt = secrets.token_hex(16)
        cls._save_config(
            {
                "password_hash": cls._hash_password(normalized_new, salt),
                "salt": salt,
            }
        )
