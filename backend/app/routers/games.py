from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from app.db.database import get_db
from app.routers.auth import get_current_user
from app.models.models import User, BrainGameScore

router = APIRouter(prefix="/games", tags=["brain-games"])

class GameScoreRequest(BaseModel):
    game_name: str # 'memory_matrix', 'reaction_test', 'stroop_test', 'math_challenge'
    accuracy: float
    reaction_time_ms: int
    score: int

class GameScoreResponse(BaseModel):
    score_id: str
    xp_earned: int
    coins_earned: int
    level_up: bool
    new_level: int
    new_xp: int
    new_coins: int

class LeaderboardEntry(BaseModel):
    username: str
    score: int
    accuracy: float
    reaction_time_ms: int
    created_at: str

@router.post("/score", response_model=GameScoreResponse)
def submit_game_score(req: GameScoreRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Calculate XP and Coins
    # E.g. base XP = 10, bonus based on score
    xp_earned = int(10 + (req.score * 0.1))
    coins_earned = int(5 + (req.score * 0.05))
    
    # Cap values
    xp_earned = min(150, max(10, xp_earned))
    coins_earned = min(50, max(2, coins_earned))
    
    # Save score to DB
    new_score = BrainGameScore(
        user_id=current_user.id,
        game_name=req.game_name,
        accuracy=req.accuracy,
        reaction_time_ms=req.reaction_time_ms,
        score=req.score,
        xp_earned=xp_earned
    )
    db.add(new_score)
    
    # Update User XP, Coins, and check Level Up
    old_xp = current_user.xp
    old_level = current_user.level
    
    current_user.xp += xp_earned
    current_user.coins += coins_earned
    
    # Level formula: Level N requires N * 150 XP to level up
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
        "score_id": new_score.id,
        "xp_earned": xp_earned,
        "coins_earned": coins_earned,
        "level_up": level_up,
        "new_level": current_user.level,
        "new_xp": current_user.xp,
        "new_coins": current_user.coins
    }

@router.get("/leaderboard/{game_name}", response_model=List[Dict[str, Any]])
def get_leaderboard(game_name: str, db: Session = Depends(get_db)):
    # Query top scores
    results = db.query(
        BrainGameScore.score,
        BrainGameScore.accuracy,
        BrainGameScore.reaction_time_ms,
        BrainGameScore.created_at,
        User.email,
        User.first_name,
        User.last_name
    ).join(User, User.id == BrainGameScore.user_id)\
     .filter(BrainGameScore.game_name == game_name)\
     .order_by(BrainGameScore.score.desc())\
     .limit(10)\
     .all()
     
    leaderboard = []
    for r in results:
        name = f"{r.first_name} {r.last_name}" if r.first_name else r.email.split('@')[0]
        leaderboard.append({
            "username": name,
            "score": r.score,
            "accuracy": float(r.accuracy),
            "reaction_time_ms": r.reaction_time_ms,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })
        
    # If empty, return some default mock leaderboard values
    if not leaderboard:
        leaderboard = [
            {"username": "CyberTwin", "score": 980, "accuracy": 98.0, "reaction_time_ms": 180, "created_at": "2026-07-05 12:00"},
            {"username": "LinearPilot", "score": 850, "accuracy": 92.5, "reaction_time_ms": 220, "created_at": "2026-07-05 11:30"},
            {"username": "AppleBrain", "score": 720, "accuracy": 88.0, "reaction_time_ms": 250, "created_at": "2026-07-05 10:15"},
        ]
        
    return leaderboard
