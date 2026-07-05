import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Shield, Settings, Activity, Database, AlertCircle, Sparkles } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [flags, setFlags] = useState({
    digitalTwin: true,
    geminiAdvisor: true,
    gamificationShop: false,
    smartAutomations: true,
  });

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags({ ...flags, [key]: !flags[key] });
  };

  // Mock token usage chart data
  const tokenUsageData = [
    { day: 'Mon', Gemini: 12000, OpenAI: 4000 },
    { day: 'Tue', Gemini: 15000, OpenAI: 3000 },
    { day: 'Wed', Gemini: 18000, OpenAI: 5000 },
    { day: 'Thu', Gemini: 14000, OpenAI: 2000 },
    { day: 'Fri', Gemini: 22000, OpenAI: 6000 },
    { day: 'Sat', Gemini: 25000, OpenAI: 7000 },
    { day: 'Sun', Gemini: 28000, OpenAI: 8000 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Control Deck</h1>
        <p className="text-zinc-500 text-xs mt-1">System logs, database metrics, feature toggles, and token usage statistics</p>
      </div>

      {/* Grid: Feature Flags & Token usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Token Usage Chart */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[80px]" />
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>AI Token Consumption</span>
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Total tokens consumed by LLM API endpoints</p>
          </div>

          <div className="h-48 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tokenUsageData}>
                <XAxis dataKey="day" stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#27272a', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="Gemini" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="OpenAI" stroke="#10b981" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono border-t border-zinc-850 pt-2.5">
            <div className="flex space-x-4">
              <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> <span>Gemini: 1,28,000 tot</span></span>
              <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <span>OpenAI: 35,000 tot</span></span>
            </div>
            <span className="text-zinc-600">COST FORCAST: ₹15.80/mo</span>
          </div>
        </div>

        {/* Feature Flags Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-500" />
              <span>Feature Toggles</span>
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Enable or disable core functional parameters</p>

            <div className="space-y-3.5 mt-6 text-xs">
              {Object.keys(flags).map((key) => {
                const isActive = flags[key as keyof typeof flags];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <button
                      type="button"
                      onClick={() => toggleFlag(key as any)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        isActive ? 'bg-blue-600' : 'bg-zinc-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        isActive ? 'transform translate-x-5' : ''
                      }`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Database stats & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mock System Logs */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Security Event Audits</span>
            </h3>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded font-mono">STABLE</span>
          </div>

          <div className="space-y-3.5 font-mono text-[10px] text-zinc-500 max-h-[220px] overflow-y-auto pr-1">
            <div><span className="text-zinc-600">[2026-07-05 18:50:12]</span> <span className="text-blue-400">INFO:</span> Token signature validation success for Pilot.</div>
            <div><span className="text-zinc-600">[2026-07-05 18:49:05]</span> <span className="text-blue-400">INFO:</span> Database migration Base schema check completed (0 changes).</div>
            <div><span className="text-zinc-600">[2026-07-05 18:45:00]</span> <span className="text-blue-400">INFO:</span> Running scheduled habits streak decay audits (0 habits updated).</div>
            <div><span className="text-zinc-600">[2026-07-05 18:30:15]</span> <span className="text-yellow-400">WARN:</span> Redis server connection timed out. Falling back to local cache registry.</div>
          </div>
        </div>

        {/* Database Health Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[60px]" />
          <div className="flex items-center space-x-2 text-zinc-400 mb-4">
            <Database className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Database Telemetry</h3>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Database Engine:</span>
              <span className="font-mono text-zinc-200">SQLite (Dev) / Postgres (Prod)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Active Pool Connections:</span>
              <span className="font-mono text-zinc-200">3 / 20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Allocated Disk size:</span>
              <span className="font-mono text-zinc-200">2.45 MB</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
