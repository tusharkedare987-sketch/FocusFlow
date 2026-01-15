
import React, { useState, useEffect } from 'react';
import { getStudyNudge } from '../services/geminiService';

const AIInsights: React.FC = () => {
  const [nudge, setNudge] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNudge = async () => {
      // Mock pattern analysis that would normally come from a backend data job
      const patternData = "User studied Math for 4 hours between 10 PM and 2 AM. Focus score dropped by 40% after midnight with 12 app-switch interruptions.";
      const msg = await getStudyNudge(patternData);
      setNudge(msg);
      setLoading(false);
    };
    fetchNudge();
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-500/20 p-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM16.464 16.464a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" />
          </svg>
        </div>
        <h3 className="text-sm font-black text-indigo-200 uppercase tracking-widest">Personalized Focus Nudge</h3>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-indigo-500/10 rounded w-full"></div>
          <div className="h-3 bg-indigo-500/10 rounded w-4/5"></div>
        </div>
      ) : (
        <div className="relative">
          <p className="text-slate-100 text-sm font-medium leading-relaxed italic">
            "{nudge}"
          </p>
          <div className="mt-4 flex justify-end">
            <span className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-tighter">Powered by FocusFlow Intelligence</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
