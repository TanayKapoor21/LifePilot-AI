import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { 
  BookOpen, Plus, Award, Zap, RefreshCw, CheckCircle, HelpCircle, GraduationCap
} from 'lucide-react';

export const Learning: React.FC = () => {
  const { learningItems, fetchLearning, addLearning, updateLearningProgress } = useLifePilotStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('course');
  const [selectedNode, setSelectedNode] = useState<string | null>('ds');
  
  // Quiz Mock States
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  useEffect(() => {
    fetchLearning();
  }, [fetchLearning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addLearning(title, type);
    setTitle('');
  };

  const handleProgressChange = (id: string, progress: number) => {
    const status = progress === 100 ? 'completed' : 'active';
    updateLearningProgress(id, progress, status);
  };

  // SVG Knowledge Graph node definitions
  const graphNodes = [
    { id: 'logic', name: 'Logical Reasoning', x: 200, y: 50, progress: 90, desc: 'Critical logic pipelines and cognitive games correlation.' },
    { id: 'ds', name: 'Data Structures', x: 100, y: 150, progress: 65, desc: 'Trees, Graphs, and Hash Tables. Highly correlated with memory matrices.' },
    { id: 'algo', name: 'Algorithms', x: 300, y: 150, progress: 40, desc: 'Dynamic Programming, Binary search, and recursion trees.' },
    { id: 'sys', name: 'System Architecture', x: 200, y: 250, progress: 75, desc: 'Load balancers, sharding, and database replication vectors.' },
  ];

  // SVG Connections definitions
  const graphLinks = [
    { from: 'logic', to: 'ds' },
    { from: 'logic', to: 'algo' },
    { from: 'ds', to: 'sys' },
    { from: 'algo', to: 'sys' },
  ];

  // Fetch description of current node
  const activeNode = graphNodes.find(n => n.id === selectedNode);

  const handleQuizSubmit = (option: string) => {
    setQuizAnswer(option);
    if (option === 'O(N)') {
      setQuizScore(1);
    } else {
      setQuizScore(0);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Learning & Cognition</h1>
        <p className="text-zinc-500 text-xs mt-1">Streaks, syllabus pipelines, and semantic knowledge networking</p>
      </div>

      {/* Grid: SVG Knowledge Graph & Syllabus Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive SVG Knowledge Graph */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[380px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[100px]" />
          <div>
            <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Knowledge Node Network</h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">Click a node to query semantic connections and AI tutoring stats</p>
          </div>

          {/* SVG Map */}
          <div className="h-52 w-full flex items-center justify-center my-2 relative">
            <svg width="400" height="300" className="max-w-full h-full">
              {/* Draw Link Lines */}
              {graphLinks.map((link, idx) => {
                const start = graphNodes.find(n => n.id === link.from)!;
                const end = graphNodes.find(n => n.id === link.to)!;
                const isHighlighted = selectedNode === link.from || selectedNode === link.to;
                return (
                  <line
                    key={idx}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={isHighlighted ? '#2563eb' : '#27272a'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeDasharray={isHighlighted ? '0' : '4'}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Draw Nodes */}
              {graphNodes.map((node) => {
                const isActive = selectedNode === node.id;
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node.id)}
                  >
                    {/* Ring glow */}
                    <circle
                      r="16"
                      fill="none"
                      stroke={isActive ? '#3b82f6' : '#27272a'}
                      strokeWidth="2"
                      className="group-hover:stroke-blue-400 transition-all duration-200"
                    />
                    {/* Core circle */}
                    <circle
                      r="12"
                      fill="#0a0a0c"
                      stroke={node.progress >= 75 ? '#10b981' : node.progress >= 50 ? '#3b82f6' : '#f59e0b'}
                      strokeWidth="3.5"
                    />
                    {/* Label */}
                    <text
                      y="26"
                      textAnchor="middle"
                      fill={isActive ? '#ffffff' : '#a1a1aa'}
                      fontSize="9"
                      fontWeight={isActive ? 'bold' : 'normal'}
                      className="font-sans group-hover:fill-white transition-colors"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node detailed summary bar */}
          <div className="border-t border-zinc-800/60 pt-3 flex items-center justify-between text-xs text-zinc-400">
            {activeNode ? (
              <div className="flex-1 min-w-0 pr-4">
                <span className="font-bold text-zinc-200">{activeNode.name}</span>
                <span className="text-[10px] bg-blue-600/10 text-blue-400 ml-2 px-1.5 py-0.5 rounded border border-blue-500/10">
                  {activeNode.progress}% Mastered
                </span>
                <p className="text-[10px] text-zinc-500 truncate mt-1">{activeNode.desc}</p>
              </div>
            ) : (
              <span>Select a node for details</span>
            )}
            <button className="text-blue-400 hover:text-blue-300 font-semibold transition shrink-0">
              Revision Schedule
            </button>
          </div>
        </div>

        {/* Add Learning Item Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[380px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Queue Syllabus</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">NODE CATEGORY</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full glass-input py-2 px-3 text-xs"
                >
                  <option value="course">Online Course</option>
                  <option value="book">Reference Book</option>
                  <option value="article">Research Paper</option>
                  <option value="skill">Practical Skill</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-mono block mb-1">TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. MIT 6.006 Intro to Algorithms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input py-2.5 px-3 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Insert Node
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Streaks & Daily Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course progress checklists */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Syllabus Progress</h3>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {learningItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3.5 last:border-0 last:pb-0">
                <div className="flex-1 pr-6">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-zinc-200">{item.title}</span>
                    <span className="text-[9px] uppercase px-1 bg-zinc-800 text-zinc-400 rounded font-mono">{item.type}</span>
                  </div>
                  {/* Slider or progress bar */}
                  <div className="flex items-center space-x-4 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.progress}
                      onChange={(e) => handleProgressChange(item.id, parseInt(e.target.value))}
                      className="flex-1 accent-blue-600 bg-zinc-800 h-1 rounded"
                    />
                    <span className="text-[10px] font-mono text-zinc-400">{item.progress}%</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-zinc-500">
                  <span className="text-[9px] font-mono">Streak: {item.streak || 1}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Daily Quiz */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[60px]" />
          <div className="flex items-center space-x-2 text-blue-500 mb-4">
            <GraduationCap className="w-5 h-5" />
            <h3 className="font-bold text-sm tracking-wide uppercase">AI Tutor Quiz</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
              <span className="text-zinc-400 block mb-3 font-medium">What is the average time complexity to search an element in a Balanced Binary Search Tree (BST)?</span>
              
              <div className="space-y-2">
                {['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'].map((opt) => (
                  <button
                    key={opt}
                    disabled={quizAnswer !== null}
                    onClick={() => handleQuizSubmit(opt)}
                    className={`w-full text-left p-2.5 rounded-xl border text-zinc-300 font-mono transition-all ${
                      quizAnswer === opt 
                        ? opt === 'O(log N)' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                        : opt === 'O(log N)' && quizAnswer !== null
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            
            {quizScore !== null && (
              <div className={`p-3 rounded-2xl text-[10px] text-center font-mono ${
                quizAnswer === 'O(log N)' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {quizAnswer === 'O(log N)' 
                  ? '⚡ CORRECT! BST splits operations in half at each level, resulting in logarithmic complexity. +20 XP'
                  : '❌ INCORRECT. BST uses Log N heights. Try revision blocks.'}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
