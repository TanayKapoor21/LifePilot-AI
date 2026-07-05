import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { Plus, Trash2, Award, Zap, Check, Calendar, ArrowRight } from 'lucide-react';

export const Habits: React.FC = () => {
  const { habits, fetchHabits, addHabit, completeHabit, deleteHabit } = useLifePilotStore();
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name, frequency);
    setName('');
  };

  // Mock unlockable badges list
  const achievements = [
    { id: 'a1', title: 'Iron Will', desc: 'Achieve a 10-day streak in any habit', unlocked: true, icon: '🔥' },
    { id: 'a2', title: 'Deep Work Master', desc: 'Log 50 Pomodoro sessions', unlocked: false, icon: '⏱️' },
    { id: 'a3', title: 'Solvent Captain', desc: 'Save money 15 days in a month', unlocked: true, icon: '🪙' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Habits Loop</h1>
        <p className="text-zinc-500 text-xs mt-1">Completion chains, streak multipliers, and XP rewards</p>
      </div>

      {/* Grid: Habit List & Add Habit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Habit List */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Consistency Matrix</h2>
            <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-mono border border-blue-500/10">STREAKS MULTIPLIERS ACTIVE</span>
          </div>

          <div className="space-y-4">
            {habits.map((h) => {
              const isCompletedToday = h.last_completed_at && 
                new Date(h.last_completed_at).toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={h.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    isCompletedToday 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-400' 
                      : 'bg-zinc-900/30 border-zinc-850 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => !isCompletedToday && completeHabit(h.id)}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                        isCompletedToday 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                          : 'border-zinc-700 hover:border-zinc-500 text-transparent hover:text-zinc-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <div>
                      <h4 className={`text-xs font-semibold ${isCompletedToday ? 'line-through' : 'text-zinc-200'}`}>
                        {h.name}
                      </h4>
                      <div className="flex items-center space-x-2.5 mt-1 text-[10px] text-zinc-500">
                        <span className="capitalize">{h.frequency}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">🔥 {h.streak} day streak</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Mock Habit History Grid squares (30 days indicator) */}
                    <div className="hidden sm:flex items-center space-x-0.5">
                      {[1, 1, 0, 1, 1, 1, 1].map((val, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-sm ${val === 1 ? 'bg-emerald-500/60' : 'bg-zinc-800'}`} 
                        />
                      ))}
                    </div>
                    <button onClick={() => deleteHabit(h.id)} className="text-zinc-600 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Habit Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[320px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Queue Habit</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">FREQUENCY</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full glass-input py-2 px-3 text-xs"
                >
                  <option value="daily">Daily Loop</option>
                  <option value="weekly">Weekly Cycle</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">HABIT DESIGNATOR</label>
                <input
                  type="text"
                  placeholder="e.g. Meditate for 10 minutes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input py-2.5 px-3 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Launch Habit Loop
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Gamification Achievements / Badges Section */}
      <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
        <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Unlockable Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center space-x-4 transition ${
                ach.unlocked 
                  ? 'bg-blue-600/5 border-blue-500/20' 
                  : 'bg-zinc-900/10 border-zinc-900 opacity-50'
              }`}
            >
              <div className="text-3xl">{ach.icon}</div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">{ach.title}</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">{ach.desc}</p>
                <span className={`text-[8px] font-bold uppercase mt-1.5 inline-block font-mono ${
                  ach.unlocked ? 'text-blue-400' : 'text-zinc-600'
                }`}>
                  {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
