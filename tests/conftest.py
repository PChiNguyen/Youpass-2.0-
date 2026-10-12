import pytest
import os
import logging
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy import create_engine, event 
from sqlalchemy.orm import sessionmaker, Session 
from sqlalchemy.engine import Engine, Connection
from fastapi.testclient import TestClient

from core.config import settings 
from core.security import get_password_hash, create_access_token
from db.base import Base
from db.session import get_db
from db.models.user import User
from db.models.test import Test
from db.models.submission import Submission
from main import app 

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# ---------------------------------------------------------
# DATABASE SETUP FIXTURES
# ---------------------------------------------------------

@pytest.fixture(scope='session')    
def engine():
    connect_args = {}
    if "sqlite" in settings.SQLALCHEMY_DATABASE_URL.lower():
        connect_args = {"check_same_thread": False}
    
    _engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
    
    @event.listens_for(_engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        if "sqlite" in settings.SQLALCHEMY_DATABASE_URL.lower():
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    Base.metadata.create_all(bind=_engine)
    yield _engine


@pytest.fixture(scope='function')
def db_session(engine: Engine):
    connection: Connection = engine.connect() 
    transaction = connection.begin()
    session_factory = sessionmaker(bind=connection)

    session: Session = session_factory()
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


# ---------------------------------------------------------
# TEST CLIENT & OVERRIDE FIXTURES
# ---------------------------------------------------------

@pytest.fixture
def client(db_session: Session):
    """FastAPI TestClient with overridden get_db dependency."""
    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


# ---------------------------------------------------------
# MODEL & AUTH FIXTURES
# ---------------------------------------------------------

@pytest.fixture
def mock_user(db_session: Session):
    """Creates a default mock user with a real hashed password."""
    user = User(
        email='test_mvp@example.com', 
        password=get_password_hash("password123"),  # 🟢 Hashed password for login testing
        target_overall=7.0
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def user_token(mock_user: User) -> str:
    """Generates a valid JWT access token for mock_user."""
    return create_access_token(subject=mock_user.id)


@pytest.fixture
def mock_test(db_session: Session):
    """Creates a default mock IELTS test with JSON content."""
    test_obj = Test(
        title="Cambridge 18 - Reading Test 1",
        skill_type="reading",
        category="Passage 1",
        content={"questions": [{"id": "q1", "text": "What is the main idea?"}]}
    )
    db_session.add(test_obj)
    db_session.commit()
    db_session.refresh(test_obj)
    return test_obj


@pytest.fixture
def mock_submission(db_session: Session, mock_user: User, mock_test: Test):
    """Creates a mock submission connecting the user and test."""
    submission = Submission(
        user_id=mock_user.id,
        test_id=mock_test.id,
        user_answers={"q1": "Climate change"},
        raw_score=35.0,
        achieved_band=8.0
    )
    db_session.add(submission)
    db_session.commit()
    db_session.refresh(submission)
    return submission