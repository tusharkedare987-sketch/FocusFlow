
import React, { useEffect, useState } from 'react';
import { getArchitectureInsights } from '../services/geminiService';

const ArchitecturePanel: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileLogic, setShowMobileLogic] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getArchitectureInsights();
      setInsights(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 animate-pulse">
        <div className="h-4 w-32 bg-slate-700 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-800 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-indigo-950/20 rounded-3xl border border-indigo-500/20 backdrop-blur-xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 7H7v6h6V7z" />
              <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-indigo-300">Technical Roadmap</h2>
        </div>
        <button 
          onClick={() => setShowMobileLogic(!showMobileLogic)}
          className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
        >
          {showMobileLogic ? 'Close Code' : 'View Ranking Logic'}
        </button>
      </div>

      {!showMobileLogic ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Stack</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{insights?.stack}</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Scalability</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{insights?.scalability}</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-widest">DB Schema</h3>
            <div className="bg-black/40 p-3 rounded-xl">
               <pre className="text-slate-400 text-[10px] font-mono whitespace-pre-wrap">{insights?.databaseSchema}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black/40 rounded-2xl overflow-hidden border border-slate-800">
          <div className="px-4 py-2 bg-slate-800/50 flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400">LeaderboardReset.ts</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre max-h-[300px]">
{`// Logic: Real-time update & local reset
// 1. Send heartbeat to increment total minutes
const onStudyTick = (userId, minutes) => {
  redis.zincrby(\`lb:global:\${userDate}\`, minutes, userId);
};

// 2. Identify user's local day for "Today" ranking
const userDate = formatInTimeZone(new Date(), user.tz, 'yyyy-MM-dd');

// 3. Automated Midnight Reset (Conceptual)
// We don't "reset" a single key. We shard by date.
// Old data is cleaned via Redis EXPIRE (TTL) set to 48h.
redis.expire(\`lb:global:\${userDate}\`, 172800);

// Result: User always sees "Today" ranking starting at 0:00
// according to their specific local timezone.`}
          </pre>
          <div className="p-3 bg-indigo-500/5 text-center border-t border-slate-800">
            <p className="text-[10px] text-indigo-400 font-medium">Localized Sharding prevents the "Global Reset Lag" common in high-scale apps.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitecturePanel;
