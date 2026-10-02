from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text

from api.deps import get_current_user
from db.session import get_db
from core import security
from core.config import settings
from services.user_service import UserService 
from schemas.auth_schemas import Token
from schemas.user_schemas import UserRead 
from db.models.user import User 

router = APIRouter()    

@router.get("/debug-neon-connection")
def debug_neon_connection(db: Session = Depends(get_db)):
    try: 
        current_db = db.execute(text("SELECT current_database()")).scalar()  
        user_count = db.execute(text("SELECT COUNT(*) FROM users")).scalar()  
        return {
            "database_name": current_db,
            "total_users_in_database": user_count,
            "message": "Connection is active!"
        }
    except Exception as e:
        return {"error": str(e), "message": "Database connection failed completely!"}


@router.post('/login', response_model=Token)
async def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
): 
    user: User = UserService(db).get_user_by_email(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 🟢 SỬA LỖI: Trả về 401 UNAUTHORIZED thay vì 201 CREATED khi sai mật khẩu
    if not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            subject=str(user.id), expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.get('/me', response_model=UserRead)
def read_users_me(current_user: UserRead = Depends(get_current_user)):
    return current_user