from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import List, Dict, Any

from app.db.database import get_db
from app.routers.auth import get_current_user
from app.models.models import User, Task, FinanceTransaction, HealthLog, LearningItem, Journal, Mission

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
def get_dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Fetch Productivity Stats (Done/Total)
    total_tasks = db.query(Task).filter(Task.user_id == current_user.id, Task.deleted_at.is_(None)).count()
    done_tasks = db.query(Task).filter(Task.user_id == current_user.id, Task.status == "done", Task.deleted_at.is_(None)).count()
    prod_score = 65.0
    if total_tasks > 0:
        prod_score = (done_tasks / total_tasks) * 100.0
        
    # 2. Fetch Finance Stats (Budget status)
    # Average expense vs budget targets
    transactions = db.query(FinanceTransaction).filter(
        FinanceTransaction.user_id == current_user.id,
        FinanceTransaction.deleted_at.is_(None)
    ).all()
    
    total_income = sum(float(tx.amount) for tx in transactions if tx.type == "income")
    total_expense = sum(float(tx.amount) for tx in transactions if tx.type == "expense")
    
    finance_score = 75.0
    if total_income > 0:
        finance_score = max(20.0, min(100.0, 100.0 - (total_expense / total_income * 50.0)))
    elif total_expense > 0:
        finance_score = 40.0 # No income but spending
        
    # 3. Fetch Health Stats (Sleep/Water)
    # Average sleep in last 7 days compared to target
    health_logs = db.query(HealthLog).filter(
        HealthLog.user_id == current_user.id,
        HealthLog.log_date >= date.today() - timedelta(days=7)
    ).all()
    
    sleep_logs = [float(h.value) for h in health_logs if h.type == "sleep"]
    water_logs = [float(h.value) for h in health_logs if h.type == "water"]
    
    sleep_avg = sum(sleep_logs) / len(sleep_logs) if sleep_logs else 7.0
    water_avg = sum(water_logs) / len(water_logs) if water_logs else 1500.0
    
    sleep_target = float(current_user.profile.sleep_target_hours) if current_user.profile else 8.0
    water_target = float(current_user.profile.water_target_ml) if current_user.profile else 3000.0
    
    sleep_ratio = min(1.0, sleep_avg / sleep_target)
    water_ratio = min(1.0, water_avg / water_target)
    health_score = (sleep_ratio * 50.0) + (water_ratio * 50.0)
    
    # 4. Fetch Learning Stats (Streaks, items)
    learn_items = db.query(LearningItem).filter(LearningItem.user_id == current_user.id, LearningItem.deleted_at.is_(None)).all()
    learning_score = 50.0 + min(50.0, len(learn_items) * 10.0)
    
    # 5. Fetch Mind Stats (Mood Journaling)
    journals = db.query(Journal).filter(Journal.user_id == current_user.id).order_by(Journal.created_at.desc()).limit(7).all()
    mood_avg = sum(j.mood_score for j in journals) / len(journals) if journals else 6.5
    mind_score = mood_avg * 10.0
    
    # Career Score
    career_score = 65.0 + (current_user.level * 1.5)
    
    # Relationships Score
    relations_score = 70.0
    
    # Overall AI Life Score
    overall_score = (prod_score + health_score + finance_score + learning_score + mind_score + career_score + relations_score) / 7.0
    
    # Generate default missions if none exist
    user_missions = db.query(Mission).filter(Mission.user_id == current_user.id).all()
    if not user_missions:
        m1 = Mission(user_id=current_user.id, title="Drink 3L Water today", type="daily", reward_xp=15, reward_coins=5)
        m2 = Mission(user_id=current_user.id, title="Complete 1 study pomodoro", type="daily", reward_xp=20, reward_coins=8)
        m3 = Mission(user_id=current_user.id, title="Log your mood in Journal", type="daily", reward_xp=10, reward_coins=3)
        m4 = Mission(user_id=current_user.id, title="Complete 3 DSA problems", type="weekly", reward_xp=50, reward_coins=20)
        db.add_all([m1, m2, m3, m4])
        db.commit()
        user_missions = [m1, m2, m3, m4]

    # Convert missions to JSON serializable objects
    missions_list = []
    for m in user_missions:
        missions_list.append({
            "id": m.id,
            "title": m.title,
            "type": m.type,
            "reward_xp": m.reward_xp,
            "reward_coins": m.reward_coins,
            "is_completed": m.is_completed
        })

    # AI Insights list
    ai_insights = [
        "Your coding productivity peaks between 9PM - 11PM. Schedule study blocking here.",
        "Water consumption is 18% below your daily target this week. Hydration boosts memory tests.",
        "Spending on eating out increases 45% during weekends. Budget alerts active."
    ]
    if mood_avg > 8.0:
        ai_insights.append("Your mood score shows an upward trend! Keep up the workout habit chains.")
    
    # Recent Activities list
    activities = []
    # Fetch top 5 recent tasks completed or created
    recent_tasks = db.query(Task).filter(Task.user_id == current_user.id, Task.deleted_at.is_(None)).order_by(Task.updated_at.desc()).limit(3).all()
    for t in recent_tasks:
        activities.append({
            "type": "task",
            "message": f"Task '{t.title}' set to {t.status}",
            "time": t.updated_at.strftime("%I:%M %p")
        })
        
    recent_tx = db.query(FinanceTransaction).filter(FinanceTransaction.user_id == current_user.id, FinanceTransaction.deleted_at.is_(None)).order_by(FinanceTransaction.created_at.desc()).limit(2).all()
    for tx in recent_tx:
        activities.append({
            "type": "finance",
            "message": f"Recorded {tx.type}: {tx.category} - ₹{tx.amount:.2f}",
            "time": tx.created_at.strftime("%I:%M %p")
        })

    if not activities:
        activities = [
            {"type": "system", "message": "Welcome to LifePilot Command Center!", "time": "Just now"},
            {"type": "mission", "message": "Daily Missions refreshed", "time": "1 hour ago"}
        ]

    return {
        "status": "success",
        "greeting": f"Hello, {current_user.first_name or 'Pilot'}",
        "time": datetime.now().strftime("%I:%M %p"),
        "weather": {"temp": "24°C", "condition": "Partly Cloudy", "icon": "cloud-sun"},
        "gamification": {
            "level": current_user.level,
            "xp": current_user.xp,
            "xp_max": current_user.level * 150,
            "coins": current_user.coins
        },
        "life_scores": {
            "productivity": round(prod_score, 1),
            "health": round(health_score, 1),
            "finance": round(finance_score, 1),
            "learning": round(learning_score, 1),
            "mind": round(mind_score, 1),
            "career": round(career_score, 1),
            "relationships": round(relations_score, 1),
            "overall": round(overall_score, 1)
        },
        "missions": missions_list,
        "ai_insights": ai_insights,
        "recent_activity": activities[:5]
    }

@router.post("/mission/complete/{mission_id}")
def complete_mission(mission_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mission = db.query(Mission).filter(Mission.id == mission_id, Mission.user_id == current_user.id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
        
    if mission.is_completed:
        return {"status": "already_completed", "current_user": {
            "xp": current_user.xp,
            "level": current_user.level,
            "coins": current_user.coins
        }}
        
    mission.is_completed = True
    mission.completed_at = datetime.utcnow()
    
    # Award XP and Coins
    current_user.xp += mission.reward_xp
    current_user.coins += mission.reward_coins
    
    # Check level up
    xp_needed = current_user.level * 150
    level_up = False
    while current_user.xp >= xp_needed:
        current_user.xp -= xp_needed
        current_user.level += 1
        xp_needed = current_user.level * 150
        level_up = True
        
    db.commit()
    db.refresh(current_user)
    
    return {
        "status": "success",
        "level_up": level_up,
        "reward_xp": mission.reward_xp,
        "reward_coins": mission.reward_coins,
        "current_user": {
            "xp": current_user.xp,
            "level": current_user.level,
            "coins": current_user.coins
        }
    }
