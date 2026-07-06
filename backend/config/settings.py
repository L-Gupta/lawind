import os

from pydantic_settings import BaseSettings, SettingsConfigDict


def _parse_cors_origins(value: str) -> list[str]:
    return [origin.strip() for origin in value.split(",") if origin.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8500
    cors_origins: str = "http://localhost:8600,https://lawind.ai,https://www.lawind.ai"

    resend_api_key: str = ""
    email_from: str = "LawInd <hello@lawind.ai>"
    founder_notify_email: str = "hello@lawind.ai"

    @property
    def cors_origins_list(self) -> list[str]:
        return _parse_cors_origins(self.cors_origins)


settings = Settings()

# Railway/Render inject PORT at runtime
settings.api_port = int(os.environ.get("PORT", settings.api_port))
