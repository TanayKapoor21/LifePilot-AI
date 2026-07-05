import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.db.database import Base, get_db

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database session for testing
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Setup database
    Base.metadata.create_all(bind=engine)
    yield
    # Teardown database
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if os.path.exists("./test.db"):
        os.remove("./test.db")

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "active"

def test_auth_flow():
    # 1. Register User
    payload = {
        "email": "pilot@lifepilot.ai",
        "password": "securepassword123",
        "first_name": "Test",
        "last_name": "Pilot"
    }
    res = client.post("/auth/register", json=payload)
    assert res.status_code == 201
    assert "access_token" in res.json()
    token = res.json()["access_token"]
    
    # 2. Login User
    payload_login = {
        "email": "pilot@lifepilot.ai",
        "password": "securepassword123"
    }
    res_login = client.post("/auth/login", json=payload_login)
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()
    
    # 3. Retrieve User Info
    headers = {"Authorization": f"Bearer {token}"}
    res_me = client.get("/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "pilot@lifepilot.ai"
    assert res_me.json()["first_name"] == "Test"
    assert res_me.json()["level"] == 1

def test_dashboard_summary():
    # Register and get token
    payload = {
        "email": "dash@lifepilot.ai",
        "password": "password",
        "first_name": "Dash"
    }
    reg = client.post("/auth/register", json=payload)
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch summary
    res = client.get("/dashboard/summary", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "greeting" in data
    assert "life_scores" in data
    assert "missions" in data
    assert len(data["missions"]) > 0

def test_digital_twin_simulation():
    # Register and get token
    payload = {
        "email": "twin@lifepilot.ai",
        "password": "password",
        "first_name": "Twin"
    }
    reg = client.post("/auth/register", json=payload)
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Run simulation request
    sim_payload = {
        "sleep_delta": 1.0,
        "workout_delta": 2,
        "study_delta": 1.5,
        "spending_delta": -500.0,
        "work_delta": -1.0
    }
    res = client.post("/twin/simulate", json=sim_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "life_scores" in data
    assert "metrics" in data
    assert "predictions" in data
    assert len(data["predictions"]) > 0
    assert data["life_scores"]["health"] > 65.0 # Health should increase due to sleep & workouts

def test_brain_game_score():
    # Register and get token
    payload = {
        "email": "game@lifepilot.ai",
        "password": "password",
        "first_name": "Gamer"
    }
    reg = client.post("/auth/register", json=payload)
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Submit score
    score_payload = {
        "game_name": "reaction_test",
        "accuracy": 100.0,
        "reaction_time_ms": 195,
        "score": 500
    }
    res = client.post("/games/score", json=score_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["xp_earned"] > 0
    assert data["coins_earned"] > 0
    assert "new_level" in data
    
    # Check leaderboard
    res_lb = client.get("/games/leaderboard/reaction_test", headers=headers)
    assert res_lb.status_code == 200
    assert len(res_lb.json()) > 0
