import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { 
  Briefcase, Plus, Terminal, Award, FileText, Send, HelpCircle, Star, Play
} from 'lucide-react';

export const Career: React.FC = () => {
  const { careerItems, fetchCareer, addJobApplication } = useLifePilotStore();
  
  // Job App Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('applied');

  // Resume Reviewer State
  const [resumeText, setResumeText] = useState('');
  const [resumeReview, setResumeReview] = useState<string[] | null>(null);

  // Mock Interview State
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewTopic, setInterviewTopic] = useState('React Hooks');
  const [interviewLog, setInterviewLog] = useState<{ role: 'interviewer' | 'candidate', content: string }[]>([
    { role: 'interviewer', content: 'Welcome. Let\'s begin. Can you explain the difference between useEffect and useLayoutEffect?' }
  ]);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchCareer();
  }, [fetchCareer]);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    addJobApplication(company, role, status, parseFloat(salary) || undefined);
    setCompany('');
    setRole('');
    setSalary('');
  };

  const handleResumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    
    // Simulate AI resume review points
    setResumeReview([
      "CRITICAL: Replace passive verbs ('helped build') with action metrics ('engineered database schemas reducing query latency by 45%').",
      "STYLE: The skills section is cluttered. Group them cleanly (Frontend, Backend, Infrastructure).",
      "IMPROVEMENT: Highlight your LeetCode problem count or Qdrant/vector embeddings implementation under projects to match AI/Data engineering targets."
    ]);
  };

  const handleSendAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateResponse.trim()) return;

    const userAns = candidateResponse;
    const newLog = [...interviewLog, { role: 'candidate' as const, content: userAns }];
    setInterviewLog(newLog);
    setCandidateResponse('');

    // Generate AI Interviewer feedback
    setTimeout(() => {
      let rating = "8/10";
      let nextQuestion = "Excellent answer. Moving on: how does index lookup optimization work in PostgreSQL databases?";
      
      if (interviewTopic === 'Database Indexes') {
        rating = "7.5/10";
        nextQuestion = "Understood. Next question: What is the primary difference between a clustered and non-clustered index?";
      }

      setFeedback(`COO Interview Assessment: Rating ${rating}. Feedback: Good articulation of hooks dependencies, but mention closure traps for complete accuracy.`);
      setInterviewLog([...newLog, { role: 'interviewer', content: nextQuestion }]);
    }, 1000);
  };

  const getJobsByStatus = (status: string) => {
    return careerItems.filter(item => item.status === status);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Career Vector</h1>
        <p className="text-zinc-500 text-xs mt-1">Interviews sprints, mock consoles, resume reviewers, and job boards</p>
      </div>

      {/* Grid: Resume Reviewer & Job Application board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mock Interview Shell Console */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[380px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[80px]" />
          
          <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <h2 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Mock Interview Terminal</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <select 
                value={interviewTopic}
                onChange={(e) => setInterviewTopic(e.target.value)}
                className="glass-input py-1 px-2 text-[10px] focus:border-blue-500"
              >
                <option value="React Hooks">React Hooks</option>
                <option value="Database Indexes">Database Indexes</option>
                <option value="System Design">System Design</option>
              </select>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto my-4 space-y-3 font-mono text-[11px] p-2 bg-black/40 rounded-xl">
            {interviewLog.map((log, idx) => (
              <div key={idx} className={log.role === 'interviewer' ? 'text-zinc-400' : 'text-blue-400'}>
                <span>{log.role === 'interviewer' ? 'interviewer@lifepilot:~# ' : 'candidate@lifepilot:~# '}</span>
                <span>{log.content}</span>
              </div>
            ))}
          </div>

          {feedback && (
            <div className="p-2 mb-3 bg-blue-600/10 border border-blue-500/20 text-[10px] text-blue-400 font-mono rounded-lg">
              {feedback}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendAnswer} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your response here..."
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              className="flex-1 glass-input py-2 px-3 text-xs font-mono"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* AI Resume Reviewer */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[380px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">AI Resume Reviewer</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Paste resume text to audit formatting and descriptors</p>
            
            <form onSubmit={handleResumeSubmit} className="space-y-3 mt-4">
              <textarea
                placeholder="Paste resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs h-32 resize-none"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Analyze Descriptors
              </button>
            </form>
          </div>

          {resumeReview && (
            <div className="border-t border-zinc-800/60 pt-3 max-h-24 overflow-y-auto text-[9px] text-zinc-400 space-y-1">
              {resumeReview.map((pt, i) => (
                <p key={i} className="leading-snug">• {pt}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban Pipeline Applications */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['applied', 'interviewing', 'offer', 'rejected'].map((col) => (
          <div key={col} className="rounded-3xl bg-zinc-900/10 border border-zinc-900 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{col}</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
                {getJobsByStatus(col).length}
              </span>
            </div>

            <div className="space-y-3 h-[300px] overflow-y-auto pr-1">
              {getJobsByStatus(col).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl glass-panel border-zinc-800/80 space-y-1.5">
                  <h4 className="text-xs font-bold text-zinc-200">{item.role}</h4>
                  <p className="text-[10px] text-zinc-500">{item.company}</p>
                  {item.salary && <span className="text-[9px] font-mono text-zinc-400">₹{parseFloat(item.salary).toLocaleString()}/yr</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Application Queue */}
      <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80">
        <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Queue Job Application</h3>
        <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="glass-input py-2 px-3 text-xs"
            required
          />
          <input
            type="text"
            placeholder="Role / Title"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="glass-input py-2 px-3 text-xs"
            required
          />
          <input
            type="number"
            placeholder="Expected Salary (Optional)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="glass-input py-2 px-3 text-xs"
          />
          <button
            type="submit"
            className="py-2 bg-blue-600 hover:bg-blue-500 transition text-white rounded-xl text-xs font-semibold"
          >
            Add to Pipeline
          </button>
        </form>
      </div>

    </div>
  );
};
