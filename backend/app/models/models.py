import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, Date, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    coins = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    tasks = relationship("Task", back_populates="user")
    transactions = relationship("FinanceTransaction", back_populates="user")
    health_logs = relationship("HealthLog", back_populates="user")
    learning_items = relationship("LearningItem", back_populates="user")
    applications = relationship("JobApplication", back_populates="user")
    contacts = relationship("RelationshipContact", back_populates="user")
    journals = relationship("Journal", back_populates="user")
    habits = relationship("Habit", back_populates="user")
    goals = relationship("Goal", back_populates="user")
    brain_scores = relationship("BrainGameScore", back_populates="user")
    missions = relationship("Mission", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    sleep_target_hours = Column(Numeric(4, 2), default=8.00)
    water_target_ml = Column(Integer, default=3000)
    calorie_target = Column(Integer, default=2500)
    savings_target_monthly = Column(Numeric(12, 2), default=10000.00)
    study_target_hours = Column(Numeric(4, 2), default=2.00)
    workout_target_weekly = Column(Integer, default=4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="todo") # 'todo', 'in_progress', 'done'
    priority = Column(String(50), default="medium") # 'low', 'medium', 'high', 'urgent'
    due_date = Column(DateTime, nullable=True)
    pomodoros_spent = Column(Integer, default=0)
    estimated_pomodoros = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="tasks")


class FinanceTransaction(Base):
    __tablename__ = "finance_transactions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(String(50), nullable=False) # 'income', 'expense'
    category = Column(String(100), nullable=False)
    description = Column(Text)
    date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="transactions")


class HealthLog(Base):
    __tablename__ = "health_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False) # 'water', 'calories', 'weight', 'sleep', 'steps'
    value = Column(Numeric(10, 2), nullable=False)
    log_date = Column(Date, default=date.today, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="health_logs")


class LearningItem(Base):
    __tablename__ = "learning_items"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # 'course', 'book', 'article', 'skill'
    status = Column(String(50), default="planning") # 'planning', 'active', 'completed'
    progress = Column(Integer, default=0) # 0 to 100
    streak = Column(Integer, default=0)
    url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="learning_items")


class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    status = Column(String(100), default="applied") # 'applied', 'interviewing', 'offer', 'rejected'
    salary = Column(Numeric(12, 2), nullable=True)
    notes = Column(Text)
    applied_date = Column(Date, default=date.today)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")


class RelationshipContact(Base):
    __tablename__ = "relationship_contacts"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    relation = Column(String(100)) # 'family', 'friend', 'mentor', 'partner'
    birthday = Column(Date, nullable=True)
    frequency_days = Column(Integer, default=7)
    last_contacted_date = Column(Date, nullable=True)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="contacts")


class Journal(Base):
    __tablename__ = "journals"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    mood_score = Column(Integer, nullable=False) # 1-10
    sentiment = Column(String(50)) # 'positive', 'neutral', 'negative'
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journals")


class Habit(Base):
    __tablename__ = "habits"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    frequency = Column(String(50), default="daily") # 'daily', 'weekly'
    streak = Column(Integer, default=0)
    last_completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="habits")


class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), default="short_term") # 'short_term', 'long_term'
    target_date = Column(Date, nullable=True)
    progress = Column(Integer, default=0)
    status = Column(String(50), default="active") # 'active', 'completed', 'failed'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="goals")


class BrainGameScore(Base):
    __tablename__ = "brain_game_scores"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    game_name = Column(String(100), nullable=False)
    accuracy = Column(Numeric(5, 2), nullable=False)
    reaction_time_ms = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    xp_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="brain_scores")


class Mission(Base):
    __tablename__ = "missions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), default="daily") # 'daily', 'weekly', 'monthly'
    reward_xp = Column(Integer, default=10)
    reward_coins = Column(Integer, default=5)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="missions")


class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    log_level = Column(String(50), default="info")
    message = Column(Text, nullable=False)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AIUsage(Base):
    __tablename__ = "ai_usages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    feature = Column(String(100), nullable=False)
    tokens_used = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
