import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Target, Zap, Activity, Users, FileText, Check } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-blue-600/30">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[180px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-12 right-1/4 w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            LIFEPILOT AI
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/login')} className="text-zinc-400 hover:text-white transition text-sm font-medium">
            Sign In
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-white text-black hover:bg-zinc-200 transition rounded-xl text-sm font-semibold shadow-lg shadow-white/5"
          >
            Launch Command Center
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center relative z-10 flex flex-col items-center">
        {/* Tagline Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 animate-fade-in">
          <span>✨</span>
          <span>Your Life, Completely Integrated.</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8">
          The Personal Operating System <br />
          <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
            Powered by Your Digital Twin
          </span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 font-light">
          Not a chatbot. Not a simple task manager. LifePilot AI connects your productivity, finances, health, journal, and habits into a single predictive life simulation dashboard.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 transition rounded-2xl font-bold shadow-xl shadow-blue-500/20"
          >
            <span>Launch LifePilot Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 transition rounded-2xl font-bold border border-zinc-800"
          >
            Explore Sandbox Mode
          </button>
        </div>

        {/* Modern Interactive Dashboard Mockup */}
        <div className="w-full max-w-5xl rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <div className="flex items-center space-x-2 pb-4 border-b border-zinc-900/60">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-zinc-500 pl-4 font-mono">dashboard.lifepilot.ai</span>
          </div>
          <div className="p-8 grid grid-cols-3 gap-4 text-left">
            <div className="col-span-2 rounded-xl bg-zinc-900/50 border border-white/5 p-6 h-64 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-zinc-200">Life Score Dashboard</h3>
                <p className="text-xs text-zinc-500 mt-1">Real-time indicators across 7 life pillars</p>
              </div>
              {/* Mock Bar Chart */}
              <div className="flex items-end justify-between h-28 pt-4">
                <div className="w-8 bg-blue-600/60 rounded-t h-[60%] flex items-center justify-center text-[10px] font-mono">60</div>
                <div className="w-8 bg-blue-600/80 rounded-t h-[80%] flex items-center justify-center text-[10px] font-mono">80</div>
                <div className="w-8 bg-blue-500 rounded-t h-[95%] flex items-center justify-center text-[10px] font-mono">95</div>
                <div className="w-8 bg-blue-600/40 rounded-t h-[40%] flex items-center justify-center text-[10px] font-mono">40</div>
                <div className="w-8 bg-blue-600/70 rounded-t h-[70%] flex items-center justify-center text-[10px] font-mono">70</div>
                <div className="w-8 bg-blue-600/90 rounded-t h-[90%] flex items-center justify-center text-[10px] font-mono">90</div>
              </div>
            </div>
            <div className="rounded-xl bg-zinc-900/50 border border-white/5 p-6 h-64 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-zinc-200">Digital Twin</h3>
                <p className="text-xs text-zinc-500 mt-1">Lifestyle Adjustments</p>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between"><span>Sleep:</span><span className="text-emerald-400">+1.5 hrs</span></div>
                <div className="flex justify-between"><span>Work:</span><span className="text-red-400">-1.0 hr</span></div>
                <div className="flex justify-between"><span>Spend:</span><span className="text-emerald-400">-₹500</span></div>
              </div>
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg text-[10px] text-blue-400">
                ⚡ Focus gains +14% / Burnout risk drops to 12%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-zinc-900">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          A Fully Connected Ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-zinc-800 transition">
            <Target className="w-8 h-8 text-blue-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">Intelligent Command Center</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Track your level, daily missions, mood analytics, and real-time scores on an integrated Apple-style radar graph.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-zinc-800 transition">
            <Zap className="w-8 h-8 text-teal-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Life Digital Twin Simulator</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tweak lifestyle variables to predict outcomes. Test burnout thresholds, savings dates, and study efficiencies.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-zinc-800 transition">
            <Activity className="w-8 h-8 text-purple-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">Cognitive Game Training</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Play 4 interactive mini-games (Memory Matrix, Reaction, Stroop Test, Arithmetic) that track reaction latency and reward XP.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-zinc-400">Unlock your digital twin with our premium subscription tiers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 flex flex-col justify-between h-[450px]">
            <div>
              <h3 className="text-xl font-bold">Standard Pilot</h3>
              <p className="text-zinc-500 text-sm mt-1">Perfect for tracking core activities</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold">₹0</span>
                <span className="text-zinc-500 text-sm ml-2">/ month</span>
              </div>
              <ul className="mt-8 space-y-3.5 text-sm text-zinc-300">
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-500" /><span>Basic Dashboard Metrics</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-500" /><span>Productivity, Finance & Habit Trackers</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-500" /><span>Playable Cognitive Games</span></li>
              </ul>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition rounded-xl font-semibold mt-8">
              Get Started Free
            </button>
          </div>

          {/* Premium Tier */}
          <div className="p-8 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex flex-col justify-between h-[450px] relative">
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Recommended
            </div>
            <div>
              <h3 className="text-xl font-bold">Digital Twin Pro</h3>
              <p className="text-blue-300/80 text-sm mt-1">Full predictive simulation & AI COO access</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold">₹699</span>
                <span className="text-zinc-500 text-sm ml-2">/ month</span>
              </div>
              <ul className="mt-8 space-y-3.5 text-sm text-zinc-300">
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-500" /><span>Everything in Standard</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-500" /><span>Intelligent Life Digital Twin Simulator</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-500" /><span>24/7 AI COO Personal Assistant</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-500" /><span>Second Brain Semantic Note Linking</span></li>
              </ul>
            </div>
            <button onClick={() => navigate('/login')} className="w-full py-3 bg-blue-600 hover:bg-blue-500 transition text-white rounded-xl font-semibold mt-8 shadow-lg shadow-blue-500/20">
              Upgrade to Twin Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-20 border-t border-zinc-900 flex items-center justify-between max-w-7xl mx-auto px-6 relative z-10 text-xs text-zinc-500">
        <span>© 2026 LifePilot AI. All rights reserved.</span>
        <span>Built for absolute lifestyle efficiency.</span>
      </footer>
    </div>
  );
};
