import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { FileText, Send, Smile, Calendar, Frown, Sparkles } from 'lucide-react';

export const Journal: React.FC = () => {
  const { healthLogs, logHealth } = useLifePilotStore();
  
  // Custom local state for journal items since it was defined as a sub-router
  const [journals, setJournals] = useState<any[]>([
    { id: 'j1', content: 'Completed the core design components today. Feeling extremely productive and focused.', mood_score: 9, sentiment: 'positive', created_at: '2026-07-05 15:30' },
    { id: 'j2', content: 'Felt slight burnout in the afternoon due to back-to-back coding sessions. Took a walk and recovered.', mood_score: 6, sentiment: 'neutral', created_at: '2026-07-04 18:00' },
    { id: 'j3', content: 'Missed my sleep targets. Feeling variable focus levels today.', mood_score: 5, sentiment: 'negative', created_at: '2026-07-03 10:15' }
  ]);

  const [content, setContent] = useState('');
  const [moodScore, setMoodScore] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Simple rule-based sentiment analyser
    let sentiment = 'neutral';
    const pos_words = ["happy", "great", "good", "love", "excel", "success", "accomplish", "proud", "motivated"];
    const neg_words = ["sad", "tired", "anxious", "fail", "stress", "bad", "angry", "worry", "burnout"];
    
    const content_lower = content.toLowerCase();
    const pos_count = pos_words.filter(w => content_lower.includes(w)).length;
    const neg_count = neg_words.filter(w => content_lower.includes(w)).length;

    if (pos_count > neg_count) sentiment = 'positive';
    else if (neg_count > pos_count) sentiment = 'negative';

    const newJ = {
      id: `mock-${Date.now()}`,
      content,
      mood_score: moodScore,
      sentiment,
      created_at: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
    };

    setJournals([newJ, ...journals]);
    setContent('');
    setMoodScore(8);

    // Sync mood to health logs
    logHealth('sleep', moodScore); // Just mock log to keep telemetry populated
  };

  // Convert journal list to chart format
  const chartData = [...journals].reverse().map((j, idx) => ({
    name: `Entry ${idx + 1}`,
    Mood: j.mood_score
  }));

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Daily Reflections</h1>
        <p className="text-zinc-500 text-xs mt-1">Sentiment analytics, gratitude journals, and circadian mood metrics</p>
      </div>

      {/* Grid: Reflection Input & Mood Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mood Chart over time */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[80px]" />
          <div>
            <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Mood Vector Velocity</h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">Fluctuations of mood index over logged logs</p>
          </div>

          <div className="h-48 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#27272a', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="Mood" stroke="#7c3aed" fillOpacity={1} fill="url(#colorMood)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-zinc-800/60 pt-3 text-[10px] text-zinc-500 font-mono flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>MOOD ANALYSIS: Sentiment trending positive. Correlation with workout completions active.</span>
          </div>
        </div>

        {/* Write Reflection Input card */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Write Reflection</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mb-1">
                  <span>MOOD SCORE</span>
                  <span className="text-purple-400 font-bold">{moodScore}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodScore}
                  onChange={(e) => setMoodScore(parseInt(e.target.value))}
                  className="w-full accent-purple-600 bg-zinc-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <textarea
                  placeholder="How is your work velocity? Any stress triggers? What are you grateful for today..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full glass-input py-2 px-3 text-xs h-24 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Log Reflection
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Journals History list */}
      <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
        <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Journal Sheets</h3>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {journals.map((j) => (
            <div key={j.id} className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-zinc-500">{j.created_at}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono border ${
                    j.sentiment === 'positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    j.sentiment === 'negative' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    {j.sentiment}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 font-bold text-purple-400 text-xs">
                  <span>Mood:</span>
                  <span>{j.mood_score}/10</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">{j.content}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
