from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime
import random

from app.db.database import get_db
from app.routers.auth import get_current_user
from app.models.models import (
    User, Task, FinanceTransaction, HealthLog, LearningItem, 
    JobApplication, RelationshipContact, Journal, Habit, Goal
)

router = APIRouter(prefix="/modules", tags=["life-modules"])

# ==================== SCHEMAS ====================
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    priority: Optional[str] = "medium"
    due_date: Optional[datetime] = None
    estimated_pomodoros: Optional[int] = 1

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[datetime]
    pomodoros_spent: int
    estimated_pomodoros: int

    class Config:
        from_attributes = True

class FinanceCreate(BaseModel):
    amount: float
    type: str # 'income', 'expense'
    category: str
    description: Optional[str] = None
    date: Optional[date] = None

class FinanceResponse(BaseModel):
    id: str
    amount: float
    type: str
    category: str
    description: Optional[str]
    date: date

    class Config:
        from_attributes = True

class HealthCreate(BaseModel):
    type: str # 'water', 'calories', 'weight', 'sleep', 'steps'
    value: float
    log_date: Optional[date] = None

class HealthResponse(BaseModel):
    id: str
    type: str
    value: float
    log_date: date

    class Config:
        from_attributes = True

class HabitCreate(BaseModel):
    name: str
    frequency: Optional[str] = "daily"

class HabitResponse(BaseModel):
    id: str
    name: str
    frequency: str
    streak: int
    last_completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class JournalCreate(BaseModel):
    content: str
    mood_score: int # 1-10

class JournalResponse(BaseModel):
    id: str
    content: str
    mood_score: int
    sentiment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class LearningCreate(BaseModel):
    title: str
    type: str # 'course', 'book', 'article', 'skill'
    status: Optional[str] = "planning"
    progress: Optional[int] = 0
    url: Optional[str] = None

class LearningResponse(BaseModel):
    id: str
    title: str
    type: str
    status: str
    progress: int
    streak: int
    url: Optional[str]

    class Config:
        from_attributes = True

class CareerCreate(BaseModel):
    company: str
    role: str
    status: Optional[str] = "applied" # 'applied', 'interviewing', 'offer', 'rejected'
    salary: Optional[float] = None
    notes: Optional[str] = None

class CareerResponse(BaseModel):
    id: str
    company: str
    role: str
    status: str
    salary: Optional[float]
    notes: Optional[str]
    applied_date: date

    class Config:
        from_attributes = True

class RelationshipCreate(BaseModel):
    name: str
    relation: Optional[str] = "friend"
    birthday: Optional[date] = None
    frequency_days: Optional[int] = 7
    notes: Optional[str] = None

class RelationshipResponse(BaseModel):
    id: str
    name: str
    relation: Optional[str]
    birthday: Optional[date]
    frequency_days: int
    last_contacted_date: Optional[date]
    notes: Optional[str]

    class Config:
        from_attributes = True

class GoalCreate(BaseModel):
    title: str
    type: Optional[str] = "short_term" # 'short_term', 'long_term'
    target_date: Optional[date] = None
    progress: Optional[int] = 0

class GoalResponse(BaseModel):
    id: str
    title: str
    type: str
    target_date: Optional[date]
    progress: int
    status: str

    class Config:
        from_attributes = True

# ==================== PRODUCTIVITY (TASKS) ====================
@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.user_id == current_user.id, Task.deleted_at.is_(None)).all()

@router.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = Task(**task.model_dump(), user_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, task_update: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id, Task.deleted_at.is_(None)).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Track completion for reward
    just_completed = task_update.status == "done" and db_task.status != "done"
    
    for key, value in task_update.model_dump().items():
        setattr(db_task, key, value)
    
    if just_completed:
        # Give user XP for finishing task
        current_user.xp += 15
        current_user.coins += 2
        # Check level up
        xp_needed = current_user.level * 150
        if current_user.xp >= xp_needed:
            current_user.xp -= xp_needed
            current_user.level += 1
            
    db.commit()
    db.refresh(db_task)
    db.refresh(current_user)
    return db_task

@router.post("/tasks/{task_id}/pomodoro")
def log_pomodoro(task_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id, Task.deleted_at.is_(None)).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db_task.pomodoros_spent += 1
    
    # Award XP for focus interval
    current_user.xp += 25
    current_user.coins += 5
    
    # Check level up
    xp_needed = current_user.level * 150
    if current_user.xp >= xp_needed:
        current_user.xp -= xp_needed
        current_user.level += 1
        
    db.commit()
    db.refresh(db_task)
    db.refresh(current_user)
    return {
        "status": "success",
        "pomodoros_spent": db_task.pomodoros_spent,
        "xp_gained": 25,
        "coins_gained": 5
    }

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id, Task.deleted_at.is_(None)).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.deleted_at = datetime.utcnow()
    db.commit()
    return {"status": "success"}


# ==================== FINANCE ====================
@router.get("/finance", response_model=List[FinanceResponse])
def get_finance(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(FinanceTransaction).filter(FinanceTransaction.user_id == current_user.id, FinanceTransaction.deleted_at.is_(None)).all()

@router.post("/finance", response_model=FinanceResponse)
def create_finance(tx: FinanceCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log_date = tx.date or date.today()
    db_tx = FinanceTransaction(
        amount=tx.amount,
        type=tx.type,
        category=tx.category,
        description=tx.description,
        date=log_date,
        user_id=current_user.id
    )
    db.add(db_tx)
    
    # Track as habit/mission XP rewards if logging finances
    current_user.xp += 5
    db.commit()
    db.refresh(db_tx)
    return db_tx

@router.delete("/finance/{tx_id}")
def delete_finance(tx_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_tx = db.query(FinanceTransaction).filter(FinanceTransaction.id == tx_id, FinanceTransaction.user_id == current_user.id, FinanceTransaction.deleted_at.is_(None)).first()
    if not db_tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db_tx.deleted_at = datetime.utcnow()
    db.commit()
    return {"status": "success"}


# ==================== HEALTH ====================
@router.get("/health", response_model=List[HealthResponse])
def get_health(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(HealthLog).filter(HealthLog.user_id == current_user.id).order_by(HealthLog.created_at.desc()).all()

@router.post("/health", response_model=HealthResponse)
def create_health(log: HealthCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log_date = log.log_date or date.today()
    db_log = HealthLog(
        type=log.type,
        value=log.value,
        log_date=log_date,
        user_id=current_user.id
    )
    db.add(db_log)
    
    # Award health track coins/XP
    current_user.xp += 5
    db.commit()
    db.refresh(db_log)
    return db_log


# ==================== HABITS ====================
@router.get("/habits", response_model=List[HabitResponse])
def get_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Habit).filter(Habit.user_id == current_user.id, Habit.deleted_at.is_(None)).all()

@router.post("/habits", response_model=HabitResponse)
def create_habit(habit: HabitCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_habit = Habit(name=habit.name, frequency=habit.frequency, user_id=current_user.id, streak=0)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@router.post("/habits/{habit_id}/complete", response_model=HabitResponse)
def complete_habit(habit_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id, Habit.deleted_at.is_(None)).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    # Prevent multi completion in same day if daily
    today_check = datetime.utcnow().date()
    if db_habit.last_completed_at and db_habit.last_completed_at.date() == today_check:
        return db_habit # Already completed today
        
    db_habit.streak += 1
    db_habit.last_completed_at = datetime.utcnow()
    
    # Award gamification reward
    current_user.xp += 10
    current_user.coins += 1
    
    # Level up checks
    xp_needed = current_user.level * 150
    if current_user.xp >= xp_needed:
        current_user.xp -= xp_needed
        current_user.level += 1
        
    db.commit()
    db.refresh(db_habit)
    db.refresh(current_user)
    return db_habit

@router.delete("/habits/{habit_id}")
def delete_habit(habit_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id, Habit.deleted_at.is_(None)).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db_habit.deleted_at = datetime.utcnow()
    db.commit()
    return {"status": "success"}


# ==================== JOURNAL ====================
@router.get("/journal", response_model=List[JournalResponse])
def get_journals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Journal).filter(Journal.user_id == current_user.id).order_by(Journal.created_at.desc()).all()

@router.post("/journal", response_model=JournalResponse)
def create_journal(j: JournalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Simple rule sentiment analysis
    sentiment = "neutral"
    pos_words = ["happy", "great", "good", "love", "excel", "success", "accomplish", "proud", "motivated"]
    neg_words = ["sad", "tired", "anxious", "fail", "stress", "bad", "angry", "worry", "burnout"]
    
    content_lower = j.content.lower()
    pos_count = sum(1 for w in pos_words if w in content_lower)
    neg_count = sum(1 for w in neg_words if w in content_lower)
    
    if pos_count > neg_count:
        sentiment = "positive"
    elif neg_count > pos_count:
        sentiment = "negative"
        
    db_j = Journal(
        content=j.content,
        mood_score=j.mood_score,
        sentiment=sentiment,
        user_id=current_user.id
    )
    db.add(db_j)
    
    # Award coins & XP for logging self-reflection
    current_user.xp += 15
    current_user.coins += 2
    db.commit()
    db.refresh(db_j)
    return db_j


# ==================== LEARNING & KNOWLEDGE GRAPH ====================
@router.get("/learning", response_model=List[LearningResponse])
def get_learning(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(LearningItem).filter(LearningItem.user_id == current_user.id, LearningItem.deleted_at.is_(None)).all()
    
    # Default visual items for the Knowledge Graph if list is empty
    if not items:
        i1 = LearningItem(title="Algorithms & Data Structures", type="course", progress=45, user_id=current_user.id)
        i2 = LearningItem(title="Cracking the Coding Interview", type="book", progress=20, user_id=current_user.id)
        i3 = LearningItem(title="Designing Data-Intensive Applications", type="book", progress=75, user_id=current_user.id)
        db.add_all([i1, i2, i3])
        db.commit()
        items = [i1, i2, i3]
        
    return items

@router.post("/learning", response_model=LearningResponse)
def create_learning(learn: LearningCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_learn = LearningItem(**learn.model_dump(), user_id=current_user.id, streak=1)
    db.add(db_learn)
    db.commit()
    db.refresh(db_learn)
    return db_learn

@router.put("/learning/{learn_id}", response_model=LearningResponse)
def update_learning(learn_id: str, learn_update: LearningCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_learn = db.query(LearningItem).filter(LearningItem.id == learn_id, LearningItem.user_id == current_user.id, LearningItem.deleted_at.is_(None)).first()
    if not db_learn:
        raise HTTPException(status_code=404, detail="Learning node not found")
        
    for key, value in learn_update.model_dump().items():
        setattr(db_learn, key, value)
        
    db.commit()
    db.refresh(db_learn)
    return db_learn


# ==================== CAREER ====================
@router.get("/career", response_model=List[CareerResponse])
def get_career(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(JobApplication).filter(JobApplication.user_id == current_user.id).all()
    if not items:
        # Create default tracker templates
        app1 = JobApplication(company="Google", role="Software Engineer II", status="interviewing", salary=140000.00, user_id=current_user.id)
        app2 = JobApplication(company="Stripe", role="Frontend Developer", status="applied", salary=125000.00, user_id=current_user.id)
        db.add_all([app1, app2])
        db.commit()
        items = [app1, app2]
    return items

@router.post("/career", response_model=CareerResponse)
def create_career(app: CareerCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_app = JobApplication(**app.model_dump(), user_id=current_user.id)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app


# ==================== RELATIONSHIPS ====================
@router.get("/relationships", response_model=List[RelationshipResponse])
def get_relationships(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(RelationshipContact).filter(RelationshipContact.user_id == current_user.id).all()
    if not items:
        c1 = RelationshipContact(name="Mom & Dad", relation="family", frequency_days=2, user_id=current_user.id)
        c2 = RelationshipContact(name="Sarah", relation="friend", frequency_days=14, user_id=current_user.id)
        db.add_all([c1, c2])
        db.commit()
        items = [c1, c2]
    return items

@router.post("/relationships", response_model=RelationshipResponse)
def create_relationship(c: RelationshipCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_c = RelationshipContact(**c.model_dump(), user_id=current_user.id)
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    return db_c


# ==================== GOALS ====================
@router.get("/goals", response_model=List[GoalResponse])
def get_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    if not items:
        g1 = Goal(title="Launch LifePilot MVP", type="short_term", progress=60, user_id=current_user.id)
        g2 = Goal(title="Build ₹5,00,000 Emergency Fund", type="long_term", progress=30, user_id=current_user.id)
        db.add_all([g1, g2])
        db.commit()
        items = [g1, g2]
    return items

@router.post("/goals", response_model=GoalResponse)
def create_goal(g: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_g = Goal(**g.model_dump(), user_id=current_user.id, status="active")
    db.add(db_g)
    db.commit()
    db.refresh(db_g)
    return db_g
