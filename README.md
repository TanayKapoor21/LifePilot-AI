# 🌌 LifePilot AI — Personal Operating System & Digital Twin

An elegant, dark-first, premium glassmorphic personal operating system and predictive life simulation engine.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-443322?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

---

## 🌟 Overview & Vision

**LifePilot AI** is a production-grade, AI-driven **Personal Operating System** designed to bridge every aspect of your life—Productivity, Finance, Health, Learning, Career, Relationships, Journaling, Habits, Goals, and Brain Training—into a single unified dashboard. 

Built with a high-end glassmorphic aesthetic inspired by Apple, Linear, Notion, and Arc, LifePilot AI features an advanced **Life Digital Twin** simulation engine and personalized AI feedback loops to keep you optimized, engaged, and motivated.

---

## 📐 System Architecture & Data Flow

Below is the technical representation of how the React Frontend, FastAPI Backend, database, and LLMs interact to form the Life Twin engine.

### 1. Overall System Architecture
```mermaid
graph TD
    User([User Browser]) <-->|HTTPS / WebSockets| FE[React Frontend SPA]
    FE <-->|API Requests / JWT Auth| BE[FastAPI Backend Server]
    BE <-->|SQLAlchemy ORM| DB[(PostgreSQL Database)]
    BE <-->|HTTP Requests| AI[Google Gemini / OpenAI APIs]
    
    subgraph Frontend [Vite React Client]
        FE -->|State Management| ZS[Zustand Store]
        FE -->|Visual Rendering| RC[Recharts & React Flow]
    end
    
    subgraph Backend [FastAPI Application]
        BE -->|Auth Router| AR[User Session & Password Hashing]
        BE -->|Twin Router| TR[Predictive Simulation Engine]
        BE -->|Games Router| GR[Cognitive Game Evaluator]
        BE -->|Modules Router| MR[18 Lifestyle Modules Router]
    end
```

### 2. Digital Twin Simulation Engine Flow
```mermaid
graph TD
    A[Adjust Habit Sliders on UI] -->|Sends Habit Deltas| B[Vite Client Store]
    B -->|POST /twin/simulate| C[FastAPI Twin Router]
    C -->|Constructs Prompt Context| D[LLM Diagnostics Client]
    D -->|Calls LLM API| E[AI Generation Model]
    E -->|Returns Recommendations| D
    D -->|Runs Mathematical Projections| F[Generate Timeline Data]
    F -->|Returns Simulation JSON| B
    B -->|Updates Local State| G[Re-render Radar Charts & Insights]
```

---

## 🎮 Core Technical Pillars

### 🧠 Playable Brain Training
Keep your mind sharp with 4 interactive mini-games directly embedded within the interface:
*   **Memory Matrix**: Test spatial memory by remembering active grid sequences.
*   **Reaction Test**: Challenge your visual reaction speeds down to the millisecond.
*   **Color Stroop**: Verify word-color combinations under intense time pressure.
*   **Mental Math**: Solve rapid arithmetic questions to score bonus XP.
*   *Metrics tracked: Accuracy rates, average reaction speed, and cognitive level history.*

### 👥 Life Digital Twin
A sandbox simulation dashboard that behaves like a dashboard forecast.
*   **Slider Adjustments**: Modify daily variables (e.g. Sleep +1.5h, Deep Work +2h, Spending -$20).
*   **Predictive Outputs**: Instant analytics showing burnout risk metrics, projected monthly savings, focus score improvements, and stress indicators.
*   **AI Diagnostics**: Personalized advisory panels detailing recommendations based on current habit-to-outcome projections.

### 🏆 Gamification Mechanics & Missions
*   **XP & Leveling System**: Earn experience points for performing health activities, finishing tasks, or playing brain training mini-games.
*   **Daily, Weekly, & Monthly Missions**: Challenge cards that yield in-game coins and special badges.
*   **Rewards Shop**: Spend accumulated coins to unlock layout customization themes, focus music tracks, and system features.

---

## 📦 The 18-Module Suite

The system is organized into **18 fully-featured modules** designed to replace fragmented tools:

| Category | Module | Key Features & Capabilities |
| :--- | :--- | :--- |
| **Core Control** | **Command Center** | Centralized dashboard tracking active stats, Level, and Radar Chart scores. |
| | **AI Life Analytics** | Correlates health metrics vs productivity vectors (e.g., Sleep vs. Task output). |
| | **AI Life Score** | Radar chart rendering real-time lifestyle metrics across 6 core disciplines. |
| | **Missions & Quests** | Time-sensitive challenge cards that drive routine habit building. |
| | **Gamification Hub** | Level up progression, XP milestones, unlockable customization features. |
| | **Admin Panel** | Tracks system metrics, API token limits, database loads, and feature flags. |
| **Daily Tasks** | **Productivity** | Interactive Kanban board, custom calendar views, and Pomodoro focus timers. |
| | **Habit Tracker** | Streaks tracker, visual consistency calendars, and completion metrics. |
| | **Goals Roadmap** | Long-term milestone planning, roadmaps, and progress track bars. |
| | **Second Brain** | Notes networking, markdown parsing, and quick bookmarks catalog. |
| **Mind & Body** | **Health & Wellness** | Sleep logs, water tracker, calorie tracker, and workout checklists. |
| | **Mood & Journal** | Personal journal editor with AI sentiment analysis and mood tracking. |
| | **Brain Training** | Cognitive mini-games with comprehensive history metrics dashboards. |
| **Career & Finance** | **Finance Manager** | Expense/income trackers, cash flow charts, and AI-powered savings goals. |
| | **Learning Graph** | Book progress tracker, coding streak counters, and React-Flow knowledge graph nodes. |
| | **Career Dashboard** | Job application pipeline Kanban, Resume reviewer, and AI mock interviews. |
| | **Relationships CRM** | Birthday tracking, call log scheduling, and relationship quality index. |
| | **Smart Automations** | Burnout warnings, auto-rescheduling tasks, and budget caps warnings. |

---

## 📂 Project Structure

```text
LifePilot-AI/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── db/            # Database config, SQLite, and base classes
│   │   ├── models/        # SQLAlchemy Models (User, Task, Habit, GameScore, etc.)
│   │   ├── routers/       # Endpoints (Auth, Dashboard, Twin, Games, Modules, etc.)
│   │   ├── utils/         # Helper functions (AI client wrapper, auth helpers)
│   │   └── main.py        # App Entrypoint & FastAPI setup
│   ├── tests/              # Pytest Suite
│   └── requirements.txt   # Python Dependencies
├── frontend/               # React Web Application
│   ├── src/
│   │   ├── assets/        # System icons & static images
│   │   ├── components/    # Layout wrapper, navigation, glassmorphism shells
│   │   ├── pages/         # Page containers (Productivity, Twin, BrainTraining, etc.)
│   │   ├── store/         # Global Zustand slices (authStore, lifeStore, gameStore)
│   │   ├── App.tsx        # Routing configurations & app shell
│   │   └── index.css      # Core styles, animations, CSS variables
│   ├── public/             # Static public assets
│   ├── tailwind.config.js # Custom configurations (extend glow-shadows, animations)
│   └── package.json       # Node.js Dependencies
└── README.md               # Visual Documentation
```

---

## ⚙️ Running Locally

### Prerequisites
*   Node.js (v18+)
*   Python (v3.11+)

### 1. Backend Setup
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will run on `http://127.0.0.1:8000`. You can access interactive Swagger documentation at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Setup
1. Open a new terminal window/tab and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client application will spin up at `http://localhost:5173`. Open this URL in your browser to interact with LifePilot AI.*

---

## ☁️ Free Cloud Deployment Guide

Follow these steps to deploy **LifePilot AI** 100% for free across Neon (PostgreSQL database), Render (FastAPI Backend), and Vercel (React Frontend).

### Step 1: Create a Free PostgreSQL Database
1. Go to [Neon.tech](https://neon.tech/) and sign up for a free account.
2. Create a new project (e.g., `lifepilot-db`).
3. Copy the **Connection String** provided on your dashboard. It should look like this:
   ```text
   postgresql://alex:password@ep-glorious-snowflake-12345.us-east-2.neon.tech/neondb?sslmode=require
   ```
4. Keep this connection string ready for Step 2.

### Step 2: Deploy the Backend on Render
1. Go to [Render](https://render.com/) and sign up.
2. Create a new **Web Service** and link your GitHub repository.
3. Configure the following parameters:
   * **Root Directory**: `backend`
   * **Language**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Expand **Advanced** and add these **Environment Variables**:
   * `PYTHON_VERSION`: `3.11.9` *(Ensures stable execution and fast pre-compiled package builds)*
   * `DATABASE_URL`: *[Your connection string from Neon.tech]*
   * `SECRET_KEY`: *[Any secure text string for JWT token generation]*
   * `GEMINI_API_KEY` (or `OPENAI_API_KEY`): *[Your API key to power AI features]*
5. Click **Deploy Web Service** and copy your live service URL when ready (e.g. `https://lifepilot-backend.onrender.com`).

### Step 3: Deploy the Frontend on Vercel
1. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Configure these parameters:
   * **Root Directory**: `frontend`
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Expand **Environment Variables** and add:
   * **Key**: `VITE_API_URL`
   * **Value**: *[Your Render backend URL from Step 2]* (e.g., `https://lifepilot-backend.onrender.com`)
4. Click **Deploy**. Vercel will build your static assets and host your frontend on a free sub-domain!
