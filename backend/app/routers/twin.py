from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.db.database import get_db
from app.routers.auth import get_current_user
from app.models.models import User

router = APIRouter(prefix="/twin", tags=["digital-twin"])

class SimulationRequest(BaseModel):
    sleep_delta: float  # hours relative to current (e.g., +1.0, -0.5)
    workout_delta: int  # count relative to current (e.g., +2, -1)
    study_delta: float  # hours relative to current (e.g., +1.5, -0.5)
    spending_delta: float  # money saved/spent relative to daily average (e.g., -500.00, +200.00)
    work_delta: float  # hours relative to current (e.g., +1.0, -2.0)

class SimulationResponse(BaseModel):
    life_scores: Dict[str, float]
    metrics: Dict[str, str]
    predictions: List[str]
    timeline_projection: List[Dict[str, float]]

@router.post("/simulate", response_model=SimulationResponse)
def simulate_lifestyle_changes(req: SimulationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Base user metrics from Level/XP and defaults
    user_level = current_user.level
    
    # Baseline Scores (out of 100)
    base_prod = min(100.0, 60.0 + (user_level * 1.5))
    base_health = 65.0
    base_finance = 70.0
    base_learning = 55.0
    base_mind = 60.0
    
    # Calculate Deltas
    # Sleep effect
    sleep_effect = req.sleep_delta * 8.0 # +1 hr sleep -> +8 points to health, mind
    if req.sleep_delta < 0:
        sleep_effect = req.sleep_delta * 12.0 # sleep debt hurts more
        
    # Workout effect
    workout_effect = req.workout_delta * 6.0
    
    # Study effect
    study_effect = req.study_delta * 10.0
    
    # Spending effect (saving more is positive, spending more is negative)
    spending_effect = -(req.spending_delta) * 0.02 # e.g. -500 (saving 500) -> +10 points to finance
    
    # Work effect
    work_effect = req.work_delta * 5.0 # more work -> productivity increases slightly, mind/health drops
    
    # Apply coefficients to Scores
    proj_prod = max(10.0, min(100.0, base_prod + (req.sleep_delta * 4.0) + (req.study_delta * 6.0) + (req.work_delta * 3.0)))
    proj_health = max(10.0, min(100.0, base_health + (req.sleep_delta * 6.0) + (req.workout_delta * 5.0) - (req.work_delta * 2.0)))
    proj_finance = max(10.0, min(100.0, base_finance + spending_effect + (req.work_delta * 1.0)))
    proj_learning = max(10.0, min(100.0, base_learning + (req.study_delta * 8.0) + (req.sleep_delta * 2.0)))
    proj_mind = max(10.0, min(100.0, base_mind + (req.sleep_delta * 7.0) + (req.workout_delta * 3.0) - (req.work_delta * 4.0)))
    
    proj_overall = (proj_prod + proj_health + proj_finance + proj_learning + proj_mind) / 5.0
    
    # Calculate burnout risk
    burnout_factor = (req.work_delta * 15.0) - (req.sleep_delta * 10.0) - (req.workout_delta * 5.0)
    burnout_val = max(5, min(95, 45 + int(burnout_factor)))
    if burnout_val < 30:
        burnout_str = f"{burnout_val}% (Low Risk - Rested)"
    elif burnout_val < 65:
        burnout_str = f"{burnout_val}% (Moderate Risk - Balanced)"
    else:
        burnout_str = f"{burnout_val}% (High Risk - Threat of Exhaustion)"
        
    # Calculate timeline details
    # E.g. savings timeline to hit savings target
    target_savings = 500000.00 # Target 5 Lakh
    current_savings_rate = 15000.00 # Base monthly savings
    adjusted_monthly_savings = max(1000.00, current_savings_rate - (req.spending_delta * 30))
    months_to_target = target_savings / adjusted_monthly_savings
    days_to_target = int(months_to_target * 30)
    target_date = (datetime.now() + timedelta(days=days_to_target)).strftime("%B %d, %Y")
    
    # Study efficiency
    study_hours = max(0.5, 2.0 + req.study_delta)
    dsa_learning_time = int(300 / study_hours) # 300 total study units needed for DSA
    
    metrics = {
        "burnout_risk": burnout_str,
        "savings_timeline": f"You will reach your target of ₹5,00,000 by {target_date} ({days_to_target} days).",
        "dsa_efficiency": f"You can master Core DSA in {dsa_learning_time} days at this study rate.",
        "peak_productivity": f"Your optimal focus peak will shift to {'8:00 AM - 11:00 AM' if req.sleep_delta > 0 else '9:00 PM - 12:00 AM'}."
    }
    
    # Predictions/Insights array
    predictions = []
    if req.sleep_delta >= 1.0:
        predictions.append("Sleeping 1+ extra hour will boost your logical reasoning accuracy in cognitive games by ~8.5%.")
    elif req.sleep_delta < 0:
        predictions.append("Reducing sleep below base levels increases cognitive sluggishness by 22% during afternoon sprints.")
        
    if req.spending_delta < 0:
        predictions.append(f"Saving ₹{-req.spending_delta:.0f} daily prevents overspending trigger points, shifting your target date earlier by {int((target_savings/current_savings_rate - target_savings/adjusted_monthly_savings)*30)} days.")
    elif req.spending_delta > 0:
        predictions.append("Increased weekend spending increases budget strain, introducing a 35% likelihood of dipping into emergency funds.")
        
    if req.workout_delta >= 2:
        predictions.append("Adding 2 weekly workouts accelerates sleep quality index by 14%, directly improving morning focus duration.")
    
    if req.work_delta > 1.5 and req.sleep_delta <= 0:
        predictions.append("WARNING: High working hours coupled with stagnant sleep is highly correlated with a massive 40% focus crash on week-ends.")
    else:
        predictions.append("Your digital twin predicts a stabilized equilibrium with your current lifestyle parameter inputs.")

    # Timeline projections over 6 months
    timeline_projection = []
    for month in range(1, 7):
        decay = 1.0 - (month * 0.02)
        timeline_projection.append({
            "month": f"M{month}",
            "productivity": round(proj_prod * decay, 1),
            "health": round(proj_health * (1.0 + (req.workout_delta * 0.01 * month) if req.workout_delta > 0 else decay), 1),
            "finance": round(min(100.0, proj_finance + (month * (spending_effect * 0.1))), 1),
            "life_score": round(proj_overall * decay, 1)
        })

    return {
        "life_scores": {
            "productivity": proj_prod,
            "health": proj_health,
            "finance": proj_finance,
            "learning": proj_learning,
            "mind": proj_mind,
            "overall": proj_overall
        },
        "metrics": metrics,
        "predictions": predictions,
        "timeline_projection": timeline_projection
    }
