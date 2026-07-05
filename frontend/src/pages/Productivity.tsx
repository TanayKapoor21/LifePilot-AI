import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { 
  Play, Pause, RotateCcw, Plus, Trash2, Calendar, 
  AlertCircle, CheckSquare, Clock, ArrowRight, Zap 
} from 'lucide-react';

export const Productivity: React.FC = () => {
  const { tasks, fetchTasks, addTask, updateTaskStatus, logPomodoro, deleteTask } = useLifePilotStore();
  
  // Pomodoro Timer States
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  // Task Creation States
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Pomodoro Interval Logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            // Timer finished
            handleTimerComplete();
          } else {
            setTimerMinutes(timerMinutes - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(timerSeconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  const handleTimerComplete = () => {
    setTimerActive(false);
    if (timerMode === 'focus') {
      if (selectedTaskId) {
        logPomodoro(selectedTaskId);
      }
      alert('Focus block complete! XP & Coins awarded.');
      setTimerMode('break');
      setTimerMinutes(5);
    } else {
      alert('Break complete. Let\'s get back to work!');
      setTimerMode('focus');
      setTimerMinutes(25);
    }
    setTimerSeconds(0);
  };

  const startPauseTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerMinutes(timerMode === 'focus' ? 25 : 5);
    setTimerSeconds(0);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle, taskDesc, taskPriority);
    setTaskTitle('');
    setTaskDesc('');
  };

  // Helper to filter tasks by status
  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Productivity Command</h1>
        <p className="text-zinc-500 text-xs mt-1">Sprints, time blocking, and cognitive focus matrix</p>
      </div>

      {/* Grid: Pomodoro Focus Clock & Add Task Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pomodoro Timer widget */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col items-center justify-center relative overflow-hidden h-[340px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[100px]" />
          
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full uppercase">
              {timerMode === 'focus' ? 'Focus Interval' : 'Rest Break'}
            </span>
          </div>

          <div className="my-6">
            <h2 className="text-7xl font-extrabold tracking-tighter text-zinc-100 tabular-nums">
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </h2>
          </div>

          {/* Task selector for focus reward */}
          <div className="w-full max-w-xs mb-6">
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full glass-input text-xs py-2 px-3 focus:border-blue-500"
            >
              <option value="">-- Associate with Task --</option>
              {tasks.filter(t => t.status !== 'done').map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={resetTimer}
              className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 rounded-2xl transition"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={startPauseTimer}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition flex items-center space-x-2"
            >
              {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{timerActive ? 'Pause' : 'Start'}</span>
            </button>
          </div>
        </div>

        {/* Create Task Widget */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Queue Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 mt-4">
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs"
                required
              />
              <textarea
                placeholder="Description / Context..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs h-16 resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-mono">PRIORITY</span>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="glass-input py-1.5 px-3 text-xs"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Add to Backlog
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Backlog Column */}
        <div className="rounded-3xl bg-zinc-900/10 border border-zinc-900 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Backlog</span>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              {getTasksByStatus('todo').length}
            </span>
          </div>

          <div className="space-y-3 h-[400px] overflow-y-auto pr-1">
            {getTasksByStatus('todo').map((task) => (
              <div key={task.id} className="p-4 rounded-2xl glass-panel border-zinc-800/80 space-y-2 hover:border-zinc-700 transition">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-zinc-200 leading-snug">{task.title}</h4>
                  <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded-md font-semibold border ${
                    task.priority === 'urgent' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    task.priority === 'high' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center pt-2 text-[10px] text-zinc-500">
                  <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /> <span>{task.pomodoros_spent} Pomos</span></span>
                  <div className="flex space-x-2">
                    <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => updateTaskStatus(task.id, 'in_progress')} className="text-blue-400 hover:text-blue-300 font-bold">Start &rarr;</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Column */}
        <div className="rounded-3xl bg-zinc-900/10 border border-zinc-900 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active</span>
            <span className="text-[10px] bg-blue-600/15 text-blue-400 px-2 py-0.5 rounded-full font-mono">
              {getTasksByStatus('in_progress').length}
            </span>
          </div>

          <div className="space-y-3 h-[400px] overflow-y-auto pr-1">
            {getTasksByStatus('in_progress').map((task) => (
              <div key={task.id} className="p-4 rounded-2xl glass-panel border-blue-500/20 glow-blue space-y-2 hover:border-zinc-700 transition">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-zinc-200 leading-snug">{task.title}</h4>
                  <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded-md font-semibold border ${
                    task.priority === 'urgent' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    task.priority === 'high' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center pt-2 text-[10px] text-zinc-500">
                  <span className="flex items-center space-x-1"><Clock className="w-3 h-3 text-blue-500" /> <span>{task.pomodoros_spent} Pomos</span></span>
                  <div className="flex space-x-2">
                    <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => updateTaskStatus(task.id, 'done')} className="text-emerald-400 hover:text-emerald-300 font-bold">Complete &check;</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="rounded-3xl bg-zinc-900/10 border border-zinc-900 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Completed</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
              {getTasksByStatus('done').length}
            </span>
          </div>

          <div className="space-y-3 h-[400px] overflow-y-auto pr-1">
            {getTasksByStatus('done').map((task) => (
              <div key={task.id} className="p-4 rounded-2xl glass-panel border-zinc-900 space-y-2 opacity-60">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-zinc-400 line-through leading-snug">{task.title}</h4>
                  <span className="text-[8px] bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 uppercase px-1.5 py-0.5 rounded-md font-semibold">
                    Done
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center pt-2 text-[10px] text-zinc-500">
                  <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /> <span>{task.pomodoros_spent} Pomos</span></span>
                  <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
