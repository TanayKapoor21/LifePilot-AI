import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLifePilotStore } from '../store/store';
import { Sparkles, Terminal, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, loading, error } = useLifePilotStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(email, password);
      if (success) navigate('/dashboard');
    } else {
      const success = await register(email, password, firstName, lastName);
      if (success) navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center font-sans">
      {/* Background Radial Glow */}
      <div className="absolute w-[80%] h-[80%] rounded-full bg-blue-600/5 blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Main Glassmorphic Panel */}
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl relative z-10 shadow-2xl animate-fade-in border border-zinc-800/80">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-wider">
            {isLogin ? 'WELCOME BACK PILOT' : 'JOIN THE ECOSYSTEM'}
          </h2>
          <p className="text-zinc-500 text-xs mt-1.5 font-mono">
            {isLogin ? 'INITIALIZE FLIGHT DECK OPERATIONS' : 'CREATE CORE PILOT PROFILE'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-center mb-6 font-mono">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full glass-input py-2.5 pl-3 text-xs"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full glass-input py-2.5 pl-3 text-xs"
                  required
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input py-2.5 pl-11 pr-4 text-xs"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="password"
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input py-2.5 pl-11 pr-4 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-500 transition rounded-xl font-semibold shadow-lg shadow-blue-500/20 text-sm mt-6 text-white"
          >
            <span>{isLogin ? 'Login to Command Center' : 'Register Profile'}</span>
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-zinc-400 hover:text-white transition"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already registered? Sign In"}
          </button>
        </div>
      </div>
      
      {/* Absolute Bottom decoration */}
      <div className="absolute bottom-6 flex items-center space-x-2 text-zinc-600 text-[10px] font-mono select-none">
        <Terminal className="w-3.5 h-3.5" />
        <span>SECURE SHIELD ACTIVE • SHA-256 JWT AUTHENTICATED</span>
      </div>
    </div>
  );
};
