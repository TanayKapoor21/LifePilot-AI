import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { 
  Droplet, Activity, Heart, Eye, Moon, Flame, Footprints, Plus, Trash2, Award
} from 'lucide-react';

export const Health: React.FC = () => {
  const { healthLogs, fetchHealth, logHealth } = useLifePilotStore();
  const [logValue, setLogValue] = useState('');
  const [logType, setLogType] = useState<'water' | 'calories' | 'sleep' | 'steps'>('water');
  
  // Custom mock workout templates
  const [workouts, setWorkouts] = useState([
    { id: 'w1', name: 'Push Day (Chest, Shoulders, Triceps)', done: true },
    { id: 'w2', name: 'Pull Day (Back, Biceps)', done: false },
    { id: 'w3', name: 'Leg Day (Squats, Hamstrings)', done: false },
    { id: 'w4', name: 'LISS Cardio (30 mins run)', done: false }
  ]);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(logValue);
    if (isNaN(parsed) || parsed <= 0) return;
    logHealth(logType, parsed);
    setLogValue('');
  };

  const toggleWorkout = (id: string) => {
    setWorkouts(workouts.map(w => w.id === id ? { ...w, done: !w.done } : w));
  };

  // Group logs of today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = healthLogs.filter(log => log.log_date === todayStr);

  const getTodaySum = (type: 'water' | 'calories' | 'sleep' | 'steps') => {
    const logs = healthLogs.filter(log => log.type === type);
    if (logs.length === 0) return 0;
    
    // Water and Calories sum up. Sleep and Steps take the latest entry of the day
    if (type === 'water' || type === 'calories') {
      return logs.reduce((sum, log) => sum + parseFloat(log.value), 0);
    } else {
      return parseFloat(logs[0].value); // Latest logged
    }
  };

  const waterDrank = getTodaySum('water');
  const sleepHrs = getTodaySum('sleep') || 7.2;
  const stepsTaken = getTodaySum('steps') || 6000;
  const caloriesEaten = getTodaySum('calories') || 1800;

  // Limits / Goals
  const waterGoal = 3000;
  const sleepGoal = 8.0;
  const stepsGoal = 10000;
  const caloriesGoal = 2500;

  const waterPercent = Math.min(100, Math.round((waterDrank / waterGoal) * 100));

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Biometrics Deck</h1>
        <p className="text-zinc-500 text-xs mt-1">Hydration cycles, heart vectors, steps, and circadian rhythm stats</p>
      </div>

      {/* Grid: Interactive Hydration Wave & Form Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Animated Water Cylinder Card */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col md:flex-row items-center justify-around h-[340px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[100px]" />
          
          {/* Cylinder wave UI */}
          <div className="relative w-36 h-56 rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden flex flex-col justify-end shadow-2xl">
            {/* Liquid level */}
            <div 
              className="bg-blue-600/40 border-t border-blue-500 w-full transition-all duration-1000 relative flex items-center justify-center"
              style={{ height: `${waterPercent}%` }}
            >
              {/* Animated wave overlay using pulse effect */}
              <div className="absolute inset-0 bg-blue-400/10 animate-pulse-glow" />
              <span className="text-xs font-bold text-blue-200 z-10">{waterDrank} / {waterGoal}ml</span>
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left mt-4 md:mt-0">
            <div>
              <h3 className="font-bold text-xl text-zinc-200">Fluid Intake</h3>
              <p className="text-xs text-zinc-500">Hydration levels directly boost cognitive scores.</p>
            </div>
            
            <div className="flex justify-center md:justify-start space-x-3">
              <button 
                onClick={() => logHealth('water', 250)}
                className="px-4 py-2 bg-blue-600/15 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-xs font-semibold rounded-xl transition"
              >
                +250ml Cup
              </button>
              <button 
                onClick={() => logHealth('water', 500)}
                className="px-4 py-2 bg-blue-600/15 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-xs font-semibold rounded-xl transition"
              >
                +500ml Bottle
              </button>
            </div>
            
            <div className="text-[10px] text-zinc-500 font-mono">
              TARGET PROGRESS: {waterPercent}% COMPLETED
            </div>
          </div>
        </div>

        {/* Biometrics Form Logger */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Telemetry Input</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">BIOMETRIC FIELD</label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value as any)}
                  className="w-full glass-input py-2 px-3 text-xs"
                >
                  <option value="water">Water (ml)</option>
                  <option value="calories">Calorie Intake (kcal)</option>
                  <option value="sleep">Sleep Duration (hrs)</option>
                  <option value="steps">Step Counter (steps)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">VALUE</label>
                <input
                  type="number"
                  placeholder={`Enter value (e.g. ${logType === 'water' ? '250' : logType === 'sleep' ? '8' : '3000'})`}
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  className="w-full glass-input py-2 px-3 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Log Biometric
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Grid: Health rings overview & Gym tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric widgets details */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-3xl glass-panel border-zinc-800/80 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-400">
              <Moon className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold">Circadian Sleep</span>
            </div>
            <h4 className="text-2xl font-bold">{sleepHrs} hrs</h4>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-1" style={{ width: `${Math.min(100, (sleepHrs/sleepGoal)*100)}%` }} />
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">TARGET: {sleepGoal} HOURS</span>
          </div>

          <div className="p-5 rounded-3xl glass-panel border-zinc-800/80 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-400">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold">Calorie Buffer</span>
            </div>
            <h4 className="text-2xl font-bold">{caloriesEaten} kcal</h4>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-1" style={{ width: `${Math.min(100, (caloriesEaten/caloriesGoal)*100)}%` }} />
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">CAPACITY: {caloriesGoal} KCAL</span>
          </div>

          <div className="p-5 rounded-3xl glass-panel border-zinc-800/80 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-400">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">Steps Counter</span>
            </div>
            <h4 className="text-2xl font-bold">{stepsTaken.toLocaleString()}</h4>
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-1" style={{ width: `${Math.min(100, (stepsTaken/stepsGoal)*100)}%` }} />
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">TARGET: {stepsGoal} STEPS</span>
          </div>

        </div>

        {/* Workout Tracker Checklist */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Gym Checklists</h3>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/10">STREAK INBOUND</span>
          </div>
          
          <div className="space-y-3">
            {workouts.map(w => (
              <div 
                key={w.id}
                onClick={() => toggleWorkout(w.id)}
                className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                  w.done 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-400' 
                    : 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700'
                }`}
              >
                <span className="text-xs font-medium">{w.name}</span>
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                  w.done ? 'border-emerald-500 bg-emerald-500/15' : 'border-zinc-700'
                }`}>
                  {w.done && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-sm" />}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
