import React, { useState } from 'react';
import { 
  FileText, Search, Plus, Bookmark, Activity, Sparkles, Network, ArrowRight 
} from 'lucide-react';

export const SecondBrain: React.FC = () => {
  const [notes, setNotes] = useState([
    { id: 'n1', title: 'FastAPI CORS Config', content: 'CORS configuration is mandatory to bind Vite React client requests to local port 8000.', tags: ['Backend', 'Security'] },
    { id: 'n2', title: 'Zustand State Store', content: 'Centralize authentication JWT tokens, local cache backups, and automated telemetry logging in store.ts.', tags: ['Frontend', 'Zustand'] },
    { id: 'n3', title: 'PostgreSQL Indexes', content: 'Create indices on foreign keys (user_id) to accelerate radar averages and twin queries.', tags: ['Database', 'Postgres'] },
  ]);

  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>('n1');

  // Semantic query explanation mock
  const [semanticExplanations, setSemanticExplanations] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newN = {
      id: `note-${Date.now()}`,
      title,
      content,
      tags: ['Custom']
    };
    setNotes([newN, ...notes]);
    setTitle('');
    setContent('');
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (val.trim().length > 3) {
      setSemanticExplanations(
        `AI Semantic Match: Found links connecting "${val}" with "FastAPI CORS Config" and "Zustand State Store" via shared API binding references.`
      );
    } else {
      setSemanticExplanations(null);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Second Brain</h1>
        <p className="text-zinc-500 text-xs mt-1">Semantic note linking, bookmark decks, and vector search networking</p>
      </div>

      {/* Search Input bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Query semantic memory (e.g. state management or database indexes)..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full glass-input py-3 pl-12 pr-4 text-xs font-mono"
        />
      </div>

      {semanticExplanations && (
        <div className="p-3 bg-blue-600/10 border border-blue-500/25 rounded-2xl text-[10px] font-mono text-blue-400 animate-fade-in">
          <span>✨ {semanticExplanations}</span>
        </div>
      )}

      {/* Grid: SVG Connection Map & Add Note */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Notes Link Map */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[360px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[80px]" />
          <div>
            <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide flex items-center space-x-2">
              <Network className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>Semantic Memory Graph</span>
            </h2>
            <p className="text-[10px] text-zinc-500 mt-0.5">Visual network mapping links between documents</p>
          </div>

          {/* Interactive SVG Network */}
          <div className="h-52 w-full flex items-center justify-center my-2">
            <svg width="400" height="240" className="max-w-full h-full">
              {/* Lines */}
              <line x1="100" y1="120" x2="200" y2="60" stroke="#2563eb" strokeWidth={1.5} />
              <line x1="200" y1="60" x2="300" y2="120" stroke="#27272a" strokeWidth={1} strokeDasharray="3" />
              <line x1="100" y1="120" x2="300" y2="120" stroke="#2563eb" strokeWidth={1.5} />
              <line x1="200" y1="180" x2="200" y2="60" stroke="#27272a" strokeWidth={1} strokeDasharray="3" />

              {/* Node 1 */}
              <g className="cursor-pointer" onClick={() => setSelectedNote('n1')}>
                <circle cx="100" cy="120" r="10" fill="#0a0a0c" stroke="#3b82f6" strokeWidth={3} />
                <text x="100" y="145" textAnchor="middle" fill="#a1a1aa" fontSize="8" className="font-mono">FastAPI</text>
              </g>

              {/* Node 2 */}
              <g className="cursor-pointer" onClick={() => setSelectedNote('n2')}>
                <circle cx="200" cy="60" r="12" fill="#0a0a0c" stroke="#7c3aed" strokeWidth={3} />
                <text x="200" y="42" textAnchor="middle" fill="#ffffff" fontSize="8" className="font-mono">Zustand</text>
              </g>

              {/* Node 3 */}
              <g className="cursor-pointer" onClick={() => setSelectedNote('n3')}>
                <circle cx="300" cy="120" r="10" fill="#0a0a0c" stroke="#10b981" strokeWidth={3} />
                <text x="300" y="145" textAnchor="middle" fill="#a1a1aa" fontSize="8" className="font-mono">Database</text>
              </g>

              {/* Node 4 (Current selected placeholder) */}
              <circle cx="200" cy="180" r="8" fill="#0a0a0c" stroke="#71717a" strokeWidth={2} />
              <text x="200" y="202" textAnchor="middle" fill="#71717a" fontSize="8" className="font-mono">Bookmarks</text>
            </svg>
          </div>

          <div className="border-t border-zinc-800/60 pt-3 text-[10px] text-zinc-500 font-mono">
            ⚡ AI LINKER: "Zustand State Store" directly calls endpoints declared in "FastAPI CORS Config".
          </div>
        </div>

        {/* Add Note Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Insert Memory Node</h3>
            <form onSubmit={handleAddNote} className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs"
                required
              />
              <textarea
                placeholder="Note Content / Snippet..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs h-28 resize-none"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Sync with Second Brain
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Notes checklist */}
      <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
        <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Document Sheets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNotes.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-850 hover:border-zinc-800 transition flex flex-col justify-between h-40">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-zinc-200">{n.title}</h4>
                  <div className="flex space-x-1">
                    {n.tags.map((t, i) => (
                      <span key={i} className="text-[8px] bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded font-mono">{t}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 line-clamp-4 leading-relaxed font-light">{n.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
