from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import asyncio
import json

from app.db.database import engine, Base
from app.routers import auth, dashboard, twin, games, modules, assistant

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LifePilot AI API",
    description="Intelligent personal operating system API server",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(twin.router)
app.include_router(games.router)
app.include_router(modules.router)
app.include_router(assistant.router)

# WebSocket Connection Manager for real-time notifications
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send welcoming payload
        await manager.send_personal_message(
            json.dumps({"type": "system", "message": "WebSocket Connected to LifePilot Engine"}), 
            websocket
        )
        # Spin up a small loops checking and sending periodic metrics or motivational quotes
        while True:
            data = await websocket.receive_text()
            # Respond to client messages if any
            await websocket.send_text(json.dumps({"type": "echo", "message": f"Received: {data}"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def read_root():
    return {"name": "LifePilot AI API", "status": "active", "version": "1.0.0"}
