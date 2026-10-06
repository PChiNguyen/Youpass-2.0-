import pytest
import os
import logging
from dotenv import load_dotenv

# 🟢 Nạp tệp .env ngay khi pytest khởi chạy
# Tip: If your test db url is in .env.test, you can specify load_dotenv(".env.test")
load_dotenv()

from sqlalchemy import create_engine, event 
from sqlalchemy.orm import sessionmaker, Session 
from sqlalchemy.engine import Engine, Connection
from core.config import settings 

from db.base import Base
# Import ONLY the 3 models for the new MVP
from db.models.user import User
from db.models.test import Test
from db.models.submission import Submission

from main import app 

from fastapi.testclient import TestClient 

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# ---------------------------------------------------------
# NEW FIXTURES FOR MVP MODELS
# ---------------------------------------------------------

@pytest.fixture
def mock_user(db_session: Session):
    """Creates a default mock user for testing."""
    user = User(
        email='test_mvp@example.com', 
        password='hashed_password_123',
        target_overall=7.0
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def mock_test(db_session: Session):
    """Creates a default mock IELTS test with JSONB content."""
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
    """Creates a mock submission connecting the user and the test."""
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

# ---------------------------------------------------------
# CLIENT & DEPENDENCY OVERRIDE FIXTURES
# ---------------------------------------------------------




# ---------------------------------------------------------
# DATABASE SETUP FIXTURES
# ---------------------------------------------------------

@pytest.fixture(scope='session')    
def engine():
    # Conditionally add connect_args based on database type
    connect_args = {}
    if "sqlite" in settings.SQLALCHEMY_DATABASE_URL.lower():
        connect_args = {"check_same_thread": False}
    
    _engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
    
    # 1. Register the listener (DO NOT put yield here)
    @event.listens_for(_engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        # Only execute PRAGMA for SQLite
        if "sqlite" in settings.SQLALCHEMY_DATABASE_URL.lower():
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    # 2. Import models so Base can see them
    from db.models.user import User
    from db.models.test import Test
    from db.models.submission import Submission 

    # 3. Build the structure (This is outside the listener!)
    Base.metadata.create_all(bind=_engine)
    
    # 4. Give the engine to the tests
    yield _engine
    
    # 5. Cleanup
    # 🟢 COMMENTED OUT to prevent SQLite from deleting tables after tests. 
    # This allows you to open the .db file in VS Code and view the tables!
    # Base.metadata.drop_all(bind=_engine)


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