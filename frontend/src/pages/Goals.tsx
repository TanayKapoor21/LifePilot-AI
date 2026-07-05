import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { Plus, Target, Calendar, Award, Compass, Sparkles } from 'lucide-react';

export const Goals: React.FC = () => {
  const { goals, fetchGoals, addGoal } = useLifePilotStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'short_term' | 'long_term'>('short_term');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal(title, type, targetDate || undefined);
    setTitle('');
    setTargetDate('');
  };

  // Mock Vision Board data representing user dream boards
  const visionBoard = [
    { id: 'v1', title: 'Silicon Valley Headquarters', type: 'Office', image: '🏢', unlocked: false },
    { id: 'v2', title: 'Sub-12% Body Fat Composition', type: 'Physique', image: '💪', unlocked: true },
    { id: 'v3', title: 'Tesla Model S Plaid Carbon Edition', type: 'Automobile', image: '🏎️', unlocked: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Milestone Vector</h1>
        <p className="text-zinc-500 text-xs mt-1">Short term targets, annual roadmaps, and vision board forecasts</p>
      </div>

      {/* Grid: Goals lists & Add goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goals lists */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Roadmaps Summary</h2>
            <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-mono border border-blue-500/10">AI MILestone FORECASTING RUNNING</span>
          </div>

          <div className="space-y-4">
            {goals.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850 hover:border-zinc-800 transition space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{g.title}</h4>
                    <span className="text-[9px] uppercase bg-zinc-850 text-zinc-500 px-1 py-0.5 rounded font-mono">{g.type.replace('_', ' ')}</span>
                  </div>
                  {g.target_date && (
                    <div className="flex items-center space-x-1.5 text-zinc-500 text-[10px] font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{g.target_date}</span>
                    </div>
                  )}
                </div>
                
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono mb-1">
                    <span>PROGRESS INDICATOR</span>
                    <span className="text-blue-400 font-bold">{g.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-1.5" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Goal Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Record Milestone</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('short_term')}
                  className={`py-1.5 rounded-xl text-[10px] font-semibold border ${
                    type === 'short_term' 
                      ? 'bg-blue-600/15 text-blue-400 border-blue-500/30' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Short Term Goal
                </button>
                <button
                  type="button"
                  onClick={() => setType('long_term')}
                  className={`py-1.5 rounded-xl text-[10px] font-semibold border ${
                    type === 'long_term' 
                      ? 'bg-blue-600/15 text-blue-400 border-blue-500/30' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Long Term Goal
                </button>
              </div>

              <input
                type="text"
                placeholder="Goal Target (e.g. Master Linear Algebra)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs"
                required
              />

              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs"
              />

              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Insert Goal Vector
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Vision Board Grid */}
      <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
        <div className="flex items-center space-x-2 mb-6">
          <Compass className="w-5 h-5 text-blue-500 animate-spin-slow" />
          <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Vision Board Deck</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visionBoard.map((item) => (
            <div 
              key={item.id} 
              className={`p-6 rounded-2xl border flex flex-col justify-between h-40 relative overflow-hidden transition ${
                item.unlocked 
                  ? 'bg-blue-600/5 border-blue-500/20' 
                  : 'bg-zinc-900/30 border-zinc-850 opacity-60'
              }`}
            >
              <div className="text-4xl">{item.image}</div>
              <div>
                <span className="text-[8px] font-mono text-zinc-500 block uppercase">{item.type}</span>
                <span className="text-xs font-bold text-zinc-200 mt-1 block">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
