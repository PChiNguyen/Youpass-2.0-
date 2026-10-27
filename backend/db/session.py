# db/session.py
import logging
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import settings

load_dotenv()

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL") or getattr(settings, "SQLALCHEMY_DATABASE_URL", None)
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
Sessionlocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()


try:
    with engine.connect() as connection:
        logger.info("Database connection successful")
except Exception as e:
    logger.exception("Database connection failed: %s", e)


try:
    test_db = Sessionlocal()
    logger.info("Session created successfully")
    test_db.close()
except Exception as e:
    logger.exception("Session creation failed: %s", e)