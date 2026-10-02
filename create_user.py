import os
from dotenv import load_dotenv

# 🟢 1. Load .env file BEFORE importing database modules
load_dotenv()

from db.session import Sessionlocal
from services.user_service import UserService    
from db.models.user import User
from db.base import Base 
from core.config import settings
from db.models.user import User, UserRole
from db.models.classroom import Classroom
from db.models.student import Student, OverallAim
from db.models.skill import SkillModel 
from db.models.student_score import StudentScore, BandScore 

from schemas.user_schemas import UserCreate 

def create_first_teacher():
    # 2. Instantiate database session
    db = Sessionlocal()
    
    try:
        # 3. Check if the teacher already exists
        existing_user = db.query(User).filter(User.email == "thaonguyen8@abc.com").first()
        if existing_user:
            print("Teacher already exists! Go log in.")
            return

        # 4. Create the Teacher using the repository instance
        user_data = UserCreate(
            email="thaonguyen8@abc.com",
            password="123456789",
            role=UserRole.TEACHER) 
        user=  UserService(db).create_user(user_data)
        print("✅ Teacher created successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating teacher: {e}")
    finally:
        # 5. Always close the session to free database connections
        db.close()

if __name__ == "__main__":
    create_first_teacher()