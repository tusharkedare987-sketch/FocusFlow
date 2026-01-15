
import React, { useState } from 'react';
import { categorizeTasks, AnalyzedTask } from '../services/geminiService';

const getDifficultyLabel = (score: number) => {
  if (score <= 3) return { level: "Low", desc: "Relaxed focus needed. Good for warming up." };
  if (score <= 7) return { level: "Moderate", desc: "Deep concentration required. Minimize distractions." };
  return { level: "High", desc: "High cognitive load. Pomodoro technique recommended." };
};

const TaskCategorizer: React.FC = () => {
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<AnalyzedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const results = await categorizeTasks(input);
    setTasks(results);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500/20 p-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM11 13a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zm1-4a1 1 0 100-2h-3a1 1 0 100 2h3zM10 14a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Smart Task Import</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">AI-Powered Categorization</p>
        </div>
      </div>

      <div className="relative mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your messy to-do list here..."
          className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none custom-scrollbar"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !input}
          className={`absolute bottom-3 right-3 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
            loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {loading ? 'Analyzing...' : 'Scan Tasks'}
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((t, i) => {
          const diffInfo = getDifficultyLabel(t.focus_difficulty);
          return (
            <div 
              key={i} 
              className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-4 hover:border-emerald-500/30 transition-colors group/item relative"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                  {t.subject}
                </span>
                
                {/* Tooltip Target */}
                <div className="flex items-center gap-1 cursor-help relative">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Difficulty</span>
                  <span className={`text-[10px] font-black ${t.focus_difficulty > 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {t.focus_difficulty}/10
                  </span>

                  {/* Enhanced Tooltip */}
                  {hoveredIdx === i && (
                    <div className="absolute bottom-full right-0 mb-3 w-48 bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-2 h-2 rounded-full ${t.focus_difficulty > 7 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">
                          {diffInfo.level} Focus
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        {diffInfo.desc}
                      </p>
                      <div className="absolute top-full right-4 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-200">{t.task}</p>
              
              {/* Difficulty Bar with Tooltip Interaction */}
              <div className="mt-3 w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${t.focus_difficulty > 7 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${t.focus_difficulty * 10}%` }} 
                />
              </div>
            </div>
          );
        })}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-6">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No tasks analyzed yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCategorizer;
