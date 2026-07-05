import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { Users, Plus, Phone, Calendar, Heart, Gift, BarChart } from 'lucide-react';

export const Relationships: React.FC = () => {
  const { relationships, fetchRelationships, addRelationship } = useLifePilotStore();
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('friend');

  useEffect(() => {
    fetchRelationships();
  }, [fetchRelationships]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addRelationship(name, relation);
    setName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Social Connections</h1>
        <p className="text-zinc-500 text-xs mt-1">Relationships timelines, gift plans, and call frequency targets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Relationship Analytics gauge */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[80px]" />
          <div>
            <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Ecosystem Strength</h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">Interaction frequencies compared to target limits</p>
          </div>

          <div className="space-y-4 my-2">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Family Contacts</span>
                <span className="text-blue-400">90% frequency</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-1.5" style={{ width: '90%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Friend Circles</span>
                <span className="text-purple-400">65% frequency</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-1.5" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Professional Mentors</span>
                <span className="text-teal-400">40% frequency</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-1.5" style={{ width: '40%' }} />
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-3 text-[10px] text-zinc-500 font-mono">
            ⚡ RECOMMENDATION: Initiate call with professional circles to boost career opportunities.
          </div>
        </div>

        {/* Add Connection Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Queue Connection</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">RELATION TYPE</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full glass-input py-2 px-3 text-xs"
                >
                  <option value="family">Family member</option>
                  <option value="friend">Friend</option>
                  <option value="partner">Partner</option>
                  <option value="mentor">Professional Mentor</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">NAME</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
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
                Insert Contact
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Grid: Relationship logs & Gift planner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contact lists */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Connection Matrix</h3>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {relationships.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-semibold text-zinc-200">{c.name}</h4>
                  <span className="text-[9px] uppercase bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded font-mono">{c.relation}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] text-zinc-500">Contact every {c.frequency_days} days</span>
                  <button className="p-1 text-blue-400 bg-blue-600/10 border border-blue-500/20 hover:border-blue-500 rounded transition">
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gift planner cards */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 mb-4">
            <Gift className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Gift Planner</h3>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <span className="font-bold block mb-1">Mom's Birthday</span>
              <p className="text-[10px] text-zinc-500 mb-2">Target: September 14</p>
              <span className="text-[9px] text-purple-400 font-semibold bg-purple-600/10 border border-purple-500/25 px-2 py-0.5 rounded-full">Custom Painting Kit</span>
            </div>
            
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <span className="font-bold block mb-1">Anniversary</span>
              <p className="text-[10px] text-zinc-500 mb-2">Target: November 25</p>
              <span className="text-[9px] text-blue-400 font-semibold bg-blue-600/10 border border-blue-500/25 px-2 py-0.5 rounded-full">Weekend Spa reservation</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
