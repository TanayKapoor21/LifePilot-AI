import React, { useState } from 'react';
import { useLifePilotStore } from '../store/store';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { Sliders, Activity, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const { twinData, runSimulation, loading, summary } = useLifePilotStore();

  // Slider local variables
  const [sleep, setSleep] = useState(0);
  const [workout, setWorkout] = useState(0);
  const [study, setStudy] = useState(0);
  const [spending, setSpending] = useState(0);
  const [work, setWork] = useState(0);

  const handleSimulate = () => {
    runSimulation(sleep, workout, study, spending, work);
  };

  // Dual Radar data (Comparing Current vs Projected)
  const radarData = [
    { subject: 'Productivity', Current: summary?.life_scores?.productivity || 78, Projected: twinData?.life_scores?.productivity || 78 },
    { subject: 'Health', Current: summary?.life_scores?.health || 68, Projected: twinData?.life_scores?.health || 68 },
    { subject: 'Finance', Current: summary?.life_scores?.finance || 85, Projected: twinData?.life_scores?.finance || 85 },
    { subject: 'Learning', Current: summary?.life_scores?.learning || 60, Projected: twinData?.life_scores?.learning || 60 },
    { subject: 'Mind', Current: summary?.life_scores?.mind || 75, Projected: twinData?.life_scores?.mind || 75 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Life Digital Twin</h1>
        <p className="text-zinc-500 text-xs mt-1">Predictive AI lifestyle modeling and scenarios forecasting simulator</p>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Sliders control deck */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 space-y-6">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span>Lifestyle Parameters</span>
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Tweak variables to model your simulated twin</p>
          </div>

          <div className="space-y-4">
            
            {/* Sleep Slider */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-mono mb-1.5">
                <span>Sleep Adjustment</span>
                <span className={sleep > 0 ? 'text-emerald-400 font-bold' : sleep < 0 ? 'text-red-400 font-bold' : 'text-zinc-500'}>
                  {sleep > 0 ? '+' : ''}{sleep} hrs/day
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Work Slider */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-mono mb-1.5">
                <span>Working Hours</span>
                <span className={work > 0 ? 'text-red-400 font-bold' : work < 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                  {work > 0 ? '+' : ''}{work} hrs/day
                </span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={work}
                onChange={(e) => setWork(parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Workout Slider */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-mono mb-1.5">
                <span>Workouts Count</span>
                <span className={workout > 0 ? 'text-emerald-400 font-bold' : workout < 0 ? 'text-red-400 font-bold' : 'text-zinc-500'}>
                  {workout > 0 ? '+' : ''}{workout} /week
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={workout}
                onChange={(e) => setWorkout(parseInt(e.target.value))}
                className="w-full accent-blue-600 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Study Slider */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-mono mb-1.5">
                <span>Study Blocking</span>
                <span className={study > 0 ? 'text-emerald-400 font-bold' : study < 0 ? 'text-red-400 font-bold' : 'text-zinc-500'}>
                  {study > 0 ? '+' : ''}{study} hrs/day
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.5"
                value={study}
                onChange={(e) => setStudy(parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Spend Slider */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 font-mono mb-1.5">
                <span>Daily Spending Delta</span>
                <span className={spending < 0 ? 'text-emerald-400 font-bold' : spending > 0 ? 'text-red-400 font-bold' : 'text-zinc-500'}>
                  {spending > 0 ? '+' : ''}₹{spending}
                </span>
              </div>
              <input
                type="range"
                min="-1000"
                max="1000"
                step="100"
                value={spending}
                onChange={(e) => setSpending(parseInt(e.target.value))}
                className="w-full accent-blue-600 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Execute Life Simulation</span>
            )}
          </button>
        </div>

        {/* Right Column: Comparative Radar chart and forecasts */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Comparative Projections</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Stacked radar comparing baseline values vs simulated outcome</p>
          </div>

          <div className="h-64 w-full my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#71717a' }} axisLine={false} />
                <Radar 
                  name="Baseline Self" 
                  dataKey="Current" 
                  stroke="#71717a" 
                  fill="#71717a" 
                  fillOpacity={0.1} 
                />
                <Radar 
                  name="Projected Self" 
                  dataKey="Projected" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.25} 
                />
                <Legend tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-zinc-800/60 pt-4 text-zinc-500">
            <span className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Double stacked simulation active</span>
            </span>
          </div>
        </div>

      </div>

      {/* Simulation outcome metrics & warnings */}
      {twinData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          
          {/* Detailed outcomes */}
          <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 space-y-4">
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Lifestyle Predictions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <span className="text-[9px] text-zinc-500 font-mono block">BURNOUT INDEX</span>
                <span className="text-sm font-bold text-zinc-200 mt-1 block">{twinData.metrics.burnout_risk}</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <span className="text-[9px] text-zinc-500 font-mono block">SAVINGS MILESTONE</span>
                <span className="text-xs text-zinc-300 mt-1 block">{twinData.metrics.savings_timeline}</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <span className="text-[9px] text-zinc-500 font-mono block">LEARNING EFFICIENCY</span>
                <span className="text-xs text-zinc-300 mt-1 block">{twinData.metrics.dsa_efficiency}</span>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <span className="text-[9px] text-zinc-500 font-mono block">COGNITIVE FOCUS PEAKS</span>
                <span className="text-xs text-zinc-300 mt-1 block">{twinData.metrics.peak_productivity}</span>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-4 space-y-2">
              {twinData.predictions.map((p: string, i: number) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-zinc-400">
                  <span className="text-blue-500 font-bold">•</span>
                  <p className="leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projected Timeline Chart */}
          <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
            <div>
              <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">6-Month Trend</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Projected trajectory of Life Score index</p>
            </div>

            <div className="h-56 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={twinData.timeline_projection}>
                  <defs>
                    <linearGradient id="colorTwin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#27272a', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="life_score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTwin)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
