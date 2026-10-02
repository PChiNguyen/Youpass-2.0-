import pytest
from sqlalchemy import create_engine, event 
from sqlalchemy.orm import sessionmaker, Session 
from core.config import settings 
from sqlalchemy.engine import Engine, Connection
import logging 
from db.base import Base
from db.models.classroom import Classroom
from db.models.skill import SkillModel, Skill
from db.models.student_score import StudentScore, BandScore
from db.models.student import OverallAim, Student
from db.models.user import User, UserRole
from main2 import app 
from api.deps import get_db 
from fastapi.testclient import TestClient 
from services.user_service import UserService 
from schemas.user_schemas import UserCreate 
from api.deps import get_current_user 


 # tests/conftest.py
import pytest
import os
from dotenv import load_dotenv

# 🟢 Nạp tệp .env ngay khi pytest khởi chạy
load_dotenv()



logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

@pytest.fixture
def mock_skills(db_session: Session) -> dict[str, SkillModel]:
    """
    Bulk creates all 4 IELTS skills in one database transaction 
    to eliminate duplicate individual skill fixtures.
    """
    skills_map = {}
    for skill_enum in [Skill.SPEAKING, Skill.WRITING, Skill.LISTENING, Skill.READING]:
        skill_obj = SkillModel(name=skill_enum)
        db_session.add(skill_obj)
        skills_map[skill_enum] = skill_obj

    db_session.commit()
    return skills_map


@pytest.fixture
def mock_full_student_scores(
    db_session: Session, 
    mock_student: Student, 
    mock_skills: dict[str, SkillModel]
) -> list[StudentScore]:
    """
    Populates a single student with scores across all 4 skills.
    Total: (7.0 + 6.0 + 6.0 + 6.0) / 4 = 6.25 Overall Band Score.
    """
    score_entries = [
        (BandScore.BAND_7_0, mock_skills[Skill.SPEAKING].id),
        (BandScore.BAND_6_0, mock_skills[Skill.WRITING].id),
        (BandScore.BAND_6_0, mock_skills[Skill.LISTENING].id),
        (BandScore.BAND_6_0, mock_skills[Skill.READING].id),
    ]

    student_scores = [
        StudentScore(student_id=mock_student.id, score=score, skill_id=skill_id)
        for score, skill_id in score_entries
    ]

    db_session.add_all(student_scores)
    db_session.commit()
    
    for item in student_scores:
        db_session.refresh(item)
        
    return student_scores
@pytest.fixture
def mock_user(db_session: Session):
    from db.models.user import User, UserRole
    user = UserService(db_session).create_user(UserCreate(
        email = 'NkYg5@example.com', 
        password = 'password', 
        role = UserRole.TEACHER
    ))
    return user

@pytest.fixture
def mock_classroom(db_session: Session, mock_user: User):
    from db.models.classroom import Classroom
    import uuid
    classroom = Classroom(
        name='haha',
        teacher_id=mock_user.id
    )
    db_session.add(classroom)
    db_session.commit()
    db_session.refresh(classroom)
    return classroom

@pytest.fixture
def mock_student(db_session: Session, mock_classroom: Classroom):
    from db.models.student import Student, OverallAim
    import uuid
    student = Student(
        name="John Doe",
        overall_aim=OverallAim.AIM_6_0,
        classroom_id=mock_classroom.id
    )
    db_session.add(student)
    db_session.commit()
    db_session.refresh(student)
    return student

@pytest.fixture
def mock_skill(db_session: Session):
    from db.models.skill import Skill, SkillModel
    skill = SkillModel(name=Skill.READING)
    db_session.add(skill)
    db_session.commit()
    db_session.refresh(skill)
    return skill


@pytest.fixture
def mock_student_score(db_session: Session, mock_student: Student, mock_skill: SkillModel):
    from db.models.student_score import StudentScore
    student_score = StudentScore(
        student_id=mock_student.id,
        score=BandScore.BAND_7_0,
        skill_id=mock_skill.id
    )
    db_session.add(student_score)
    db_session.commit()
    db_session.refresh(student_score)
    return student_score




@pytest.fixture 
def client(db_session: Session):
    def _get_test_db():
        try: 
            yield db_session
        finally:
            pass 

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as client:
        yield client
    '''Entering with: You turn on the simulator's main power and start all engine diagnostics (FastAPI startup events).

yield c: You hand the steering wheel (c) to the test driver to evaluate the vehicle.

Exiting with: Once the driver finishes, you turn off the main power and safely shut down all simulator components (FastAPI shutdown events).'''
    app.dependency_overrides.clear()


@pytest.fixture(autouse=True)
def setup_dependency_override(mock_user: User):
    """
    autouse=True means this runs automatically for every test in this file.
    It takes the mock_teacher we just saved, and hands it directly to FastAPI.
    """
    def override():
        return mock_user

    app.dependency_overrides[get_current_user] = override
    yield # Let the test run
    app.dependency_overrides.clear() # Clean up afterwards

'''[SETUP]    app.dependency_overrides[get_current_user] = override
   │
[YIELD] ───> ( Pytest runs your test function )
   │
[TEARDOWN] app.dependency_overrides.clear()'''






















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
    from db.models.classroom import Classroom
    from db.models.student import Student
    from db.models.skill import Skill, SkillModel
    from db.models.student_score import StudentScore 

    # 3. Build the structure (This is outside the listener!)
    Base.metadata.create_all(bind=_engine)
    
    # 4. Give the engine to the tests
    yield _engine
    
    # 5. Cleanup
    Base.metadata.drop_all(bind=_engine)




@pytest.fixture(scope='function')
def db_session(engine:Engine):
    connection: Connection= engine.connect() 
    transaction= connection.begin()
    session_factory= sessionmaker(bind=connection)

    session:Session= session_factory()
    yield session
    session.close()
    transaction.rollback()
    connection.close()   