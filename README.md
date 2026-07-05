# LifePilot AI — Personal Operating System

LifePilot AI is a production-grade, AI-driven Personal Operating System where every aspect of a user's life (Productivity, Finance, Health, Learning, Career, Relationships, Journal, Habits, Goals, Brain Training) is interconnected through a personalized AI feedback loop and a **Life Digital Twin** simulation engine.

The design features a dark-first, premium glassmorphism user interface inspired by Apple, Linear, Notion, and Arc.

---

## 🚀 Key Features

*   **Command Center**: Unified dashboard tracking real-time status, XP, Level, Mood, and critical Life Scores (Health, Finance, Productivity, Learning, etc.) on an interactive Radar Chart.
*   **Life Digital Twin**: A predictive simulation panel where you can preview changes to your habits (e.g. sleep +1hr, study +2hr, spend less) and forecast outcomes (burnout risk, savings timelines, productivity gains).
*   **Playable Brain Training**: 4 interactive mini-games built directly into the UI (Memory Matrix, Reaction Test, Color Stroop, Mental Math) that reward Brain XP, track accuracy, and log reaction times.
*   **18 Fully-Featured Modules**:
    1.  **Productivity**: Kanban board, custom calendar, Pomodoro focus tracker.
    2.  **Finance**: Expenses, income tracking, cash flow charts, AI savings estimates.
    3.  **Health**: Daily water trackers, calories log, custom workouts, sleep cycle logs.
    4.  **Learning**: Reading checklists, Coding Streaks, and an interactive React Flow Knowledge Graph.
    5.  **Career**: Job application kanban, mock AI interview simulator, Resume Reviewer.
    6.  **Relationships**: Call schedule reminders, birthdays, Relationship strength metrics.
    7.  **Journal**: Sentiment tracking and mood analytics.
    8.  **Habits**: Visual completion chains and streaking mechanics.
    9.  **Goals**: Roadmaps, progress bars, vision boards.
    10. **AI Life Analytics**: Analysis of correlation vectors (e.g. sleep vs. focus metrics).
    11. **Brain Training**: Active cognitive mini-games logging statistics.
    12. **AI Life Score**: Radar-chart representation of core life indicators.
    13. **Missions**: Automated Daily, Weekly, and Monthly challenge cards yielding coins/XP.
    14. **Gamification**: Visual leveling badges, shop unlockables, Season Pass dashboard.
    15. **Second Brain**: Document logs, bookmarks, and semantic notes networking.
    16. **Smart Automations**: Auto-rescheduling, overspending warnings, burnout forecasts.
    17. **AI Reports**: Summary panels with PDF/Excel exportation.
    18. **Admin Panel**: Feature toggles, API token rates, database metrics.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion (for smooth transitions & animations)
- **State Management**: Zustand
- **Charting & Graphs**: Recharts, React Flow (for Knowledge Graph nodes)
- **Routing**: React Router DOM

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL (with local SQLite fallback for testing)
- **Authentication**: JWT-based Secure Auth
- **AI Core**: Google Gemini / OpenAI (API routes with smart fallbacks)

---

## 📂 Project Structure

```text
LifePilot-AI/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── db/            # Database configurations & schema definitions
│   │   ├── models/        # SQLAlchemy Models
│   │   ├── routers/       # API Routes (Auth, Tasks, Twin, Games, etc.)
│   │   └── main.py        # App Entrypoint
│   └── requirements.txt   # Python Dependencies
├── frontend/               # React Application (Vite + TS)
│   ├── src/
│   │   ├── components/    # Reusable glassmorphic UI components
│   │   ├── pages/         # Core Module pages
│   │   ├── store/         # Zustand global states
│   │   ├── App.tsx        # Router & App Shell
│   │   └── index.css      # Custom styling variables and keyframes
│   ├── tailwind.config.js # Tailwind spacing and themes
│   └── package.json       # JS dependencies
└── README.md
```

---

## ⚙️ Running Locally

### Backend Setup
1. Navigate to the `backend/` directory.
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate   # On Windows
   pip install -r requirements.txt
   ```
3. Run the FastAPI dev server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
