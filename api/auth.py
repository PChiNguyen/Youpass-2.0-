# api/auth.py

import httpx
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from db.session import get_db
from core import security
from core.config import settings
from schemas.user_schemas import UserRegister, UserResponse  # 🟢 Updated: Use UserRegister schema
from schemas.auth_schemas import GoogleLoginRequest
from services.user_service import UserService
from api.deps import get_current_user
from db.models.user import User

router = APIRouter()

# USER REGISTRATION ENDPOINT
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new user account, handles password hashing, 
    and checks for email conflicts via UserService. Requires a password.
    """
    service = UserService(db)
    return service.create_user(user_in)


# LOGIN AND GOOGLE LOGIN ENDPOINTS 
@router.post("/login")
def login(
    response: Response,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Authenticates user credentials against hashed passwords via UserService,
    generates a JWT access token, and sets a secure HttpOnly cookie.
    """
    service = UserService(db)
    
    user = service.user_repo.get_by_email(form_data.username)
    if not user or not user.password or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token = security.create_access_token(subject=user.id)
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    
    return {"message": "Login successful", "access_token": access_token}


@router.post("/google-login")
def google_login(payload: GoogleLoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Verifies Google ID token and delegates user upsert logic entirely to UserService.
    """
    try:
        google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.token}"
        with httpx.Client() as client:
            google_res = client.get(google_url)
        
        if google_res.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token verification failed."
            )
        
        google_data = google_res.json()
        email = google_data.get("email")
        full_name = google_data.get("name", "")
        avatar_url = google_data.get("picture", "")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google account does not provide an email."
            )

        service = UserService(db)
        user = service.get_or_create_google_user(
            email=email, 
            full_name=full_name, 
            avatar_url=avatar_url
        )

        access_token = security.create_access_token(subject=user.id)

        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            samesite="lax",
            secure=False,
        )

        return {"message": "Google login successful", "access_token": access_token}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google authentication error: {str(e)}"
        )


# GET CURRENT USER ENDPOINT
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Returns the profile of the currently authenticated user."""
    return current_user