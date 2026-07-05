import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Zap, Clock, TrendingUp, Sun, Sparkles, Plus, 
  CheckCircle, Play, FileText, Droplet
} from 'lucide-react';
import { useLifePilotStore } from '../store/store';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const { user, summary, fetchSummary, completeMission } = useLifePilotStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (!summary) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-zinc-500 text-xs font-mono">LOADING COMMAND CENTER DATA...</span>
        </div>
      </div>
    );
  }

  // Format radar data
  const radarData = [
    { subject: 'Productivity', value: summary.life_scores?.productivity || 60, fullMark: 100 },
    { subject: 'Health', value: summary.life_scores?.health || 60, fullMark: 100 },
    { subject: 'Finance', value: summary.life_scores?.finance || 60, fullMark: 100 },
    { subject: 'Learning', value: summary.life_scores?.learning || 60, fullMark: 100 },
    { subject: 'Mind', value: summary.life_scores?.mind || 60, fullMark: 100 },
    { subject: 'Career', value: summary.life_scores?.career || 60, fullMark: 100 },
    { subject: 'Relationships', value: summary.life_scores?.relationships || 60, fullMark: 100 },
  ];

  const handleMissionCheck = (missionId: string) => {
    completeMission(missionId);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            {summary.greeting || 'Welcome, Pilot'}
          </h1>
          <p className="text-zinc-500 text-xs mt-1.5 font-mono uppercase tracking-wider">
            System status: Operational • Digital Twin Synced
          </p>
        </div>
        
        {/* Core Scores Overview */}
        {user && (
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <div className="text-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
              <span className="block text-zinc-500 text-[10px] font-mono">LEVEL</span>
              <span className="text-2xl font-bold text-blue-400">{user.level}</span>
            </div>
            <div className="text-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
              <span className="block text-zinc-500 text-[10px] font-mono">COINS</span>
              <span className="text-2xl font-bold text-amber-400">🪙 {user.coins}</span>
            </div>
            <div className="text-center bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
              <span className="block text-zinc-500 text-[10px] font-mono">LIFE SCORE</span>
              <span className="text-2xl font-bold text-teal-400">{summary.life_scores?.overall || 70}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pillar 1: Radar Chart (Life Score Visualization) */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 flex flex-col justify-between border border-zinc-800/80">
          <div>
            <h2 className="font-bold text-lg text-zinc-200">Life Score Wheel</h2>
            <p className="text-zinc-500 text-xs font-light">Interactive assessment of core parameters</p>
          </div>
          
          {/* Recharts Polar Graph */}
          <div className="h-72 w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#71717a' }} axisLine={false} />
                <Radar 
                  name="Pilot" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.25} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-zinc-800/60 pt-4 text-zinc-500">
            <span className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Calculated from active trackers</span>
            </span>
            <button onClick={() => navigate('/digital-twin')} className="text-blue-400 hover:text-blue-300 font-medium transition">
              Simulate adjustments &rarr;
            </button>
          </div>
        </div>

        {/* Pillar 2: Today's Missions */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-zinc-200">Daily Missions</h2>
              <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-500/10">XP GAINS</span>
            </div>
            <p className="text-zinc-500 text-xs font-light">Accomplish challenges to level up</p>
            
            <div className="space-y-3 mt-6">
              {summary.missions?.map((m: any) => (
                <div 
                  key={m.id}
                  onClick={() => !m.is_completed && handleMissionCheck(m.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    m.is_completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-500' 
                      : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      m.is_completed ? 'border-emerald-500 bg-emerald-500/15' : 'border-zinc-700'
                    }`}>
                      {m.is_completed && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </div>
                    <span className={`text-xs ${m.is_completed ? 'line-through' : 'text-zinc-300'}`}>{m.title}</span>
                  </div>
                  <div className="text-[10px] font-mono flex items-center space-x-1">
                    <span className="text-blue-400">+{m.reward_xp}XP</span>
                    <span className="text-amber-500">🪙{m.reward_coins}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-4 text-center">
            <span className="text-zinc-500 text-[10px] font-mono">DAILY RESET IN 6 HOURS</span>
          </div>
        </div>
      </div>

      {/* Ticker Row: AI Insights & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget 1: AI insights */}
        <div className="md:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[80px]" />
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">AI Briefing Insights</h3>
          </div>
          <div className="space-y-3">
            {summary.ai_insights?.map((insight: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-3 text-xs text-zinc-400">
                <span className="text-blue-500 font-bold">•</span>
                <p className="leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Quick actions shortcuts */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Command Shortcuts</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/productivity')}
              className="p-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl text-left transition"
            >
              <Play className="w-4 h-4 text-blue-500 mb-2" />
              <span className="block text-xs font-semibold">Start Focus</span>
              <span className="text-[10px] text-zinc-500">Pomodoro timer</span>
            </button>
            <button 
              onClick={() => navigate('/finance')}
              className="p-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl text-left transition"
            >
              <Plus className="w-4 h-4 text-emerald-500 mb-2" />
              <span className="block text-xs font-semibold">Add Expense</span>
              <span className="text-[10px] text-zinc-500">Track balance</span>
            </button>
            <button 
              onClick={() => navigate('/health')}
              className="p-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl text-left transition"
            >
              <Droplet className="w-4 h-4 text-teal-400 mb-2" />
              <span className="block text-xs font-semibold">Log Water</span>
              <span className="text-[10px] text-zinc-500">Add 250ml water</span>
            </button>
            <button 
              onClick={() => navigate('/journal')}
              className="p-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl text-left transition"
            >
              <FileText className="w-4 h-4 text-purple-500 mb-2" />
              <span className="block text-xs font-semibold">Reflection</span>
              <span className="text-[10px] text-zinc-500">Write journal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row: Recent Activity feed */}
      <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
        <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Telemetry Logs</h3>
        <div className="space-y-4">
          {summary.recent_activity?.map((activity: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center space-x-3">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  activity.type === 'mission' ? 'bg-emerald-500' :
                  activity.type === 'task' ? 'bg-blue-500' :
                  activity.type === 'finance' ? 'bg-amber-500' : 'bg-zinc-600'
                }`} />
                <span className="text-zinc-300">{activity.message}</span>
              </div>
              <span className="text-zinc-500 font-mono text-[10px]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
