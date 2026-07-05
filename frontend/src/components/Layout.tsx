import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CheckSquare, DollarSign, Heart, BookOpen, 
  Briefcase, Users, FileText, Activity, Brain, Sliders, 
  Award, LogOut, Sun, Bell, MessageSquare, Send, X, Terminal, Sparkles
} from 'lucide-react';
import { useLifePilotStore } from '../store/store';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, summary, logout, assistantHistory, sendMessage, loading } = useLifePilotStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Productivity', icon: CheckSquare, path: '/productivity' },
    { name: 'Finance', icon: DollarSign, path: '/finance' },
    { name: 'Health', icon: Heart, path: '/health' },
    { name: 'Learning', icon: BookOpen, path: '/learning' },
    { name: 'Career', icon: Briefcase, path: '/career' },
    { name: 'Relationships', icon: Users, path: '/relationships' },
    { name: 'Journal', icon: FileText, path: '/journal' },
    { name: 'Brain Training', icon: Brain, path: '/brain-training' },
    { name: 'Digital Twin', icon: Sliders, path: '/digital-twin' },
    { name: 'Second Brain', icon: Activity, path: '/second-brain' },
    { name: 'Admin', icon: Award, path: '/admin' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-zinc-800/80 flex flex-col justify-between z-10">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800/50 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              LIFEPILOT AI
            </span>
          </div>

          {/* User Status Card */}
          {user && (
            <div className="p-4 mx-4 mt-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-sm text-white">
                  {user.first_name ? user.first_name[0] : 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{user.first_name || 'Pilot'}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded-md font-medium border border-blue-500/10">
                      LVL {user.level}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      XP {user.xp}/{user.level * 150}
                    </span>
                  </div>
                </div>
              </div>
              {/* XP Progress bar */}
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(user.xp / (user.level * 150)) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active 
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-zinc-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
        {/* Header */}
        <header className="h-16 border-b border-zinc-900/60 flex items-center justify-between px-8 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-6">
            <span className="text-zinc-500 text-sm">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-zinc-400 text-sm font-medium">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {summary?.weather && (
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>{summary.weather.temp} • {summary.weather.condition}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Gamified Coin count */}
            {user && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <span>🪙</span>
                <span>{user.coins} GP</span>
              </div>
            )}
            
            {/* Notifications */}
            <button className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-zinc-800">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Bubble */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 hover:scale-105 hover:bg-blue-500 transition-all duration-300 z-40 animate-pulse-glow"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Persistent AI Drawer Chat */}
      {chatOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-96 glass-panel border-l border-zinc-800/80 shadow-2xl flex flex-col z-50 animate-slide-up">
          {/* Drawer Header */}
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm tracking-wider">COO CHIEF PILOT</h3>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {assistantHistory.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div 
                  key={index}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    isAssistant 
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-200' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {msg.content.split('\n').map((line: string, i: number) => (
                      <p key={i} className={line ? 'mb-1' : 'mb-3'}>{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-3 rounded-2xl text-xs flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150" />
                  <span>Processing metrics...</span>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Form input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800/80 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask Chief Operating Officer..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 glass-input py-2 px-3 text-xs"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
