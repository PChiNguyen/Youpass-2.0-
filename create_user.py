import os
from dotenv import load_dotenv

# 1. Load .env file BEFORE importing database modules
load_dotenv()

from db.session import Sessionlocal  
from services.user_service import UserService    
from db.base import Base 
from core.config import settings

# Import all models to ensure SQLAlchemy registers relationships correctly
from db.models.user import User
from db.models.test import Test
from db.models.submission import Submission 

from schemas.user_schemas import UserCreate 

def create_first_user():
    # 2. Instantiate database session using SessionLocal
    db = Sessionlocal()
    
    try:
        target_email = "thaonguyen8@abc.com"
        
        # 3. Check if the user already exists
        existing_user = db.query(User).filter(User.email == target_email).first()
        if existing_user:
            print("⚠️ User already exists! Go log in.")
            return

        # 4. Create the User using the correct fields present in your user.py model
        user_data = UserCreate(
            email=target_email,
            password="123456789",
            full_name="Thảo Nguyên"
        ) 
        
        user = UserService(db).create_user(user_data)
        print("✅ User created successfully!")
        
    except Exception as e:
    # Safely rollback if an error occurs
        db.rollback()
        print(f"❌ Error creating user: {e}")
    finally:
        # 5. Always close the session to free database connections
        db.close()

if __name__ == "__main__":
    create_first_user()