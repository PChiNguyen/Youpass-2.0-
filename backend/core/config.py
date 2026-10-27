from typing import List
import os 
from pydantic import AnyHttpUrl, Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict 


class Settings(BaseSettings): 
    PROJECT_NAME: str = 'SCHOOL SYSTEM FROM SCRATCH'
    API_V1_STR: str = '/api/v1'


    SECRET_KEY: str = 'Frieren so cute'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./sql_app.db"
    GEMINI_API_KEY: str = '' 

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    model_config = SettingsConfigDict(
        env_file = '.env' if not os.getenv('TESTING') else '.env.test',
        env_file_encoding = 'utf-8',
        case_sensitive = True,
        extra = 'allow'
    )

settings= Settings() 