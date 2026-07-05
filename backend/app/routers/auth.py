from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.db.database import get_db
from app.models.models import User, UserProfile
from app.utils.security import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

# Pydantic Schemas
class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserProfileSchema(BaseModel):
    sleep_target_hours: float
    water_target_ml: int
    calorie_target: int
    savings_target_monthly: float
    study_target_hours: float
    workout_target_weekly: int

class UserResponseSchema(BaseModel):
    id: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    level: int
    xp: int
    coins: int
    profile: Optional[UserProfileSchema] = None

    class Config:
        from_attributes = True

# JWT User Retrieval Dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id, User.deleted_at.is_(None)).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=TokenSchema, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegisterSchema, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email is already registered."
        )
    
    # Hash password and create user
    hashed = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        level=1,
        xp=0,
        coins=100
    )
    db.add(new_user)
    db.flush() # flush to get new_user.id
    
    # Create default user profile
    default_profile = UserProfile(
        user_id=new_user.id,
        sleep_target_hours=8.00,
        water_target_ml=3000,
        calorie_target=2500,
        savings_target_monthly=10000.00,
        study_target_hours=2.00,
        workout_target_weekly=4
    )
    db.add(default_profile)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    token = create_access_token(new_user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=TokenSchema)
def login(user_data: UserLoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email, User.deleted_at.is_(None)).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponseSchema)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
