"""
Config module for the WiseTech API application.
Contains settings and configurations loaded from environment variables.
"""

import secrets
from typing import List, Optional, Union

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "WiseTech API"
    API_V1_STR: str = "/api"
    
    # Secret key for JWT token generation and verification
    SECRET_KEY: str = secrets.token_urlsafe(32)
    
    # JWT token settings
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database settings
    # MySQL configuration (comment out if using SQLite)
    # MYSQL_SERVER: str = "localhost"
    # MYSQL_USER: str = "root"
    # MYSQL_PASSWORD: str = ""
    # MYSQL_DB: str = "wisetech_db"
    # MYSQL_PORT: int = 3306
    
    # SQLite configuration (default for development)
    DATABASE_URL: str = "sqlite:///./wisetech.db"
    
    # MySQL URL (uncomment if using MySQL)
    # DATABASE_URL: str = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_SERVER}:{MYSQL_PORT}/{MYSQL_DB}"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
