from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class DashboardDataCreate(BaseModel):
    filename: str
    severity: str
    prob_mild: float
    prob_moderate: float
    prob_severe: float

class DashboardDataResponse(DashboardDataCreate):
    id: int
    created_at: datetime
    owner_id: int
    
    model_config = ConfigDict(from_attributes=True)
