from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user") # 'admin', 'user', 'guest'

    dashboard_data = relationship("DashboardData", back_populates="owner")

class DashboardData(Base):
    __tablename__ = "dashboard_data"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    severity = Column(String)
    prob_mild = Column(Float)
    prob_moderate = Column(Float)
    prob_severe = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="dashboard_data")
