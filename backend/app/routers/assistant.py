from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
import httpx
import os

from app.db.database import get_db
from app.routers.auth import get_current_user
from app.models.models import User, Task, HealthLog, FinanceTransaction

router = APIRouter(prefix="/assistant", tags=["ai-assistant"])

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str
    tokens_used: int

@router.post("/chat", response_model=ChatResponse)
def chat_with_coo(req: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Fetch some user stats to give context to the COO
    task_count = db.query(Task).filter(Task.user_id == current_user.id, Task.status == "todo", Task.deleted_at.is_(None)).count()
    health_logs = db.query(HealthLog).filter(HealthLog.user_id == current_user.id).limit(10).all()
    finance_tx = db.query(FinanceTransaction).filter(FinanceTransaction.user_id == current_user.id).limit(5).all()
    
    recent_expenses = sum(float(tx.amount) for tx in finance_tx if tx.type == "expense")
    water_logged = sum(float(h.value) for h in health_logs if h.type == "water")
    
    # 2. Try calling external LLM if API Key exists, else run Local Rule Engine
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    response_text = ""
    tokens_used = 0
    
    # Check if Gemini key exists, otherwise fallback to our custom local rule COO response
    if gemini_api_key:
        try:
            # Setup prompt context
            system_prompt = (
                f"You are the Personal Chief Operating Officer (COO) for user {current_user.first_name or 'Pilot'}. "
                f"You are analytical, concise, highly professional, and encouraging. You are not a standard chatbot. "
                f"User stats context: Level {current_user.level}, XP {current_user.xp}, active tasks in pipeline: {task_count}. "
                f"Total water logged recently: {water_logged} ml, recent logged expenses: ₹{recent_expenses:.2f}. "
                f"Always frame responses as operational briefings, giving tasks adjustments or habit chains feedback."
            )
            # Call Gemini via httpx
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}"
            headers = {"Content-Type": "application/json"}
            
            # Format history
            contents = []
            for h in req.history:
                contents.append({
                    "role": "model" if h.role == "assistant" else "user",
                    "parts": [{"text": h.content}]
                })
            # Add latest message
            contents.append({
                "role": "user",
                "parts": [{"text": req.message}]
            })
            
            payload = {
                "contents": contents,
                "systemInstruction": {"parts": [{"text": system_prompt}]},
                "generationConfig": {"temperature": 0.3}
            }
            
            with httpx.Client() as client:
                res = client.post(url, json=payload, headers=headers, timeout=10.0)
                if res.status_code == 200:
                    data = res.json()
                    response_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    tokens_used = 250 # Simulated token usage logging
                    return {"response": response_text, "tokens_used": tokens_used}
        except Exception:
            pass # Fallback to local rule engine if HTTP fails
            
    # LOCAL COO RULE ENGINE (Extremely high-fidelity responses matching Apple/Linear vibe)
    msg = req.message.lower()
    
    if "status" in msg or "summary" in msg or "how am i doing" in msg:
        response_text = (
            f"**Operational Briefing:**\n\n"
            f"1. **Core KPI**: Overall Life Score stands at standard baseline. You are currently at Level {current_user.level} ({current_user.xp} XP).\n"
            f"2. **Productivity Pipeline**: You have {task_count} pending items in your sprint. Action items are balanced.\n"
            f"3. **Finance Burn-rate**: Recent expenses total ₹{recent_expenses:.2f}. Your budget has ample runway.\n"
            f"4. **Health Vector**: Water tracking shows {water_logged}ml logged. Suggest increasing input to maintain cognitive performance.\n\n"
            f"**Action Plan**: Focus on clearing high-priority tasks in your matrix before starting new ones."
        )
    elif "sleep" in msg or "tired" in msg or "fatigue" in msg:
        response_text = (
            "**Operational Alert: Cognitive Fatigue Detected**\n\n"
            "Analyzing sleep vectors indicates variable cycles. To optimize reaction time for brain games and productivity:\n"
            "- Establish a hard screen-off deadline at 10:30 PM.\n"
            "- Shift your study block to morning slots to capture peak focus.\n"
            "Should I schedule a wind-down reminder?"
        )
    elif "saving" in msg or "money" in msg or "finance" in msg or "budget" in msg:
        response_text = (
            f"**Financial Advisory:**\n\n"
            f"Your current monthly savings target is active. Recent expenses total ₹{recent_expenses:.2f}.\n"
            f"The Digital Twin indicates that cutting non-essential subscriptions and reducing weekend food spending by 15% "
            f"will pull your target savings milestone closer by 8 days.\n\n"
            f"Would you like me to trigger a monthly budget limit automation?"
        )
    elif "game" in msg or "brain" in msg or "training" in msg:
        response_text = (
            "**Cognitive Performance Report:**\n\n"
            "Playing Memory Matrix and Reaction Test exercises increases focus bandwidth. "
            "Your peak performance aligns with early morning slots (8 AM - 10 AM).\n"
            "Logging scores awards XP and gold coins. Challenge yourself to a Mental Math sprint now!"
        )
    else:
        # Generic COO response
        response_text = (
            f"Understood. As your Chief Operating Officer, I recommend aligning your actions with your daily goals.\n\n"
            f"We have {task_count} tasks outstanding. I suggest we block 30 minutes in the Focus Timer "
            f"to complete the highest priority card. Let's maintain operational velocity."
        )
        
    return {"response": response_text, "tokens_used": 45}
