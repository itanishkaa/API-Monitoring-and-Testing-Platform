from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "API Monitoring and Testing Platform"
    database_url: str = "sqlite:///./api_monitor.db"
    cors_origins: str = "http://localhost:5173"
    request_timeout_seconds: float = 10.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
