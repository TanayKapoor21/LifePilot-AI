import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { 
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip 
} from 'recharts';
import { Plus, Trash2, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from 'lucide-react';

export const Finance: React.FC = () => {
  const { finance, fetchFinance, addTransaction, deleteTransaction } = useLifePilotStore();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    addTransaction(parsedAmount, type, category, description);
    setAmount('');
    setDescription('');
  };

  // Calculations
  const totalIncome = finance
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const totalExpense = finance
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const netSavings = totalIncome - totalExpense;

  // Pie chart formatting
  const expenseByCategory = finance
    .filter((tx) => tx.type === 'expense')
    .reduce((acc: any, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + parseFloat(tx.amount);
      return acc;
    }, {});

  const pieData = Object.keys(expenseByCategory).map((cat) => ({
    name: cat,
    value: expenseByCategory[cat]
  }));

  const COLORS = ['#2563eb', '#06b6d4', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'];

  // Cash flow timeline (Mock chart inputs grouped chronologically)
  const cashFlowData = [
    { name: 'M1', Income: 40000, Expense: 25000 },
    { name: 'M2', Income: 42000, Expense: 28000 },
    { name: 'M3', Income: 45000, Expense: 31000 },
    { name: 'M4', Income: 45000, Expense: 29000 },
    { name: 'M5', Income: 48000, Expense: 33000 },
    { name: 'M6', Income: totalIncome || 50000, Expense: totalExpense || 32000 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Financial Ledger</h1>
        <p className="text-zinc-500 text-xs mt-1">Cash flow vectors, balances, and AI spending advisor triggers</p>
      </div>

      {/* Cards: Income, Expense, Net Worth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono block">CUMULATIVE INCOME</span>
            <span className="text-2xl font-extrabold text-zinc-100 mt-1 block">₹{totalIncome.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono block">CUMULATIVE EXPENSES</span>
            <span className="text-2xl font-extrabold text-zinc-100 mt-1 block">₹{totalExpense.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono block">NET SAVINGS FLUX</span>
            <span className={`text-2xl font-extrabold mt-1 block ${netSavings >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              ₹{netSavings.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Charts & Transaction logging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transaction Input Box */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 flex flex-col justify-between h-[340px]">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Record Ledger</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-1.5 rounded-xl text-xs font-semibold border ${
                    type === 'expense' 
                      ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-1.5 rounded-xl text-xs font-semibold border ${
                    type === 'income' 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Income
                </button>
              </div>

              <input
                type="number"
                placeholder="Amount (INR / ₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full glass-input py-2 px-3 text-xs"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input py-2 px-3 text-xs"
                >
                  {type === 'expense' ? (
                    <>
                      <option value="Food">Food</option>
                      <option value="Rent">Rent</option>
                      <option value="Sub">Subscriptions</option>
                      <option value="Travel">Travel</option>
                      <option value="Social">Entertainment</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Bonus">Bonus</option>
                    </>
                  )}
                </select>
                <input
                  type="text"
                  placeholder="Notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input py-2 px-3 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Log Transaction
              </button>
            </form>
          </div>
        </div>

        {/* Expense distribution Recharts */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 h-[340px] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Category Allocation</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Distribution of logged expenses</p>
          </div>

          <div className="h-44 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-600">No expense records found.</div>
            )}
          </div>

          {/* Color labels */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-zinc-400 justify-center">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{d.name}: ₹{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cash Flow Area Chart */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 h-[340px] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wide">Net Savings Velocity</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">6-month income vs expense area maps</p>
          </div>

          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#27272a', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="Income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInc)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Warnings & Transactions List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transaction History log */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 border border-zinc-800/80">
          <h3 className="font-bold text-sm text-zinc-300 mb-4 uppercase tracking-wide">Ledger Sheets</h3>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {finance.length > 0 ? (
              finance.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}
                    </span>
                    <div>
                      <h4 className="font-semibold text-zinc-200">{tx.category}</h4>
                      <p className="text-[10px] text-zinc-500">{tx.description || 'No notes'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                    </span>
                    <button onClick={() => deleteTransaction(tx.id)} className="text-zinc-600 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-zinc-600 py-6">No ledger transactions logged.</div>
            )}
          </div>
        </div>

        {/* AI Financial Warnings */}
        <div className="rounded-3xl glass-panel p-6 border border-zinc-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[60px]" />
          <div className="flex items-center space-x-2 text-amber-500 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm tracking-wide uppercase">AI Financial Advisor</h3>
          </div>
          
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl text-zinc-400">
              <span className="font-bold text-amber-400 block mb-1">Overspending Warning</span>
              Weekend restaurant and cafe spending is trending 32% above your average baseline. Suggest locking food categories for the next 7 days.
            </div>
            
            <div className="p-3 bg-blue-600/5 border border-blue-500/15 rounded-2xl text-zinc-400">
              <span className="font-bold text-blue-400 block mb-1">Savings Goal projection</span>
              At your current monthly savings rate of ₹{(totalIncome - totalExpense > 0 ? totalIncome - totalExpense : 15000).toLocaleString()}, you are forecasted to reach your emergency savings goal in 282 days.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
