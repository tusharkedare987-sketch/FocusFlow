
import React, { useState, useEffect } from 'react';
import { MOCK_GROUP_MEMBERS } from '../constants';

const GroupRanking: React.FC = () => {
  const [members, setMembers] = useState(MOCK_GROUP_MEMBERS);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMembers(prev => prev.map(m => {
        if (m.status === 'studying' && Math.random() > 0.7) {
          return { ...m, totalStudyTime: m.totalStudyTime + 60 };
        }
        return m;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sortedMembers = [...members].sort((a, b) => b.totalStudyTime - a.totalStudyTime);

  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(1);
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="bg-slate-800/30 rounded-3xl p-6 border border-slate-700 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Room Leaderboard
        </h2>
        <div className="flex flex-col items-end">
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded border border-emerald-500/20">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
            Live
          </span>
          <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">TZ: {userTimezone}</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedMembers.map((user, idx) => (
          <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-700/20 border border-slate-700/50 hover:border-indigo-500/50 transition-all transform hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <span className={`text-lg font-black w-6 ${idx < 3 ? 'text-indigo-400' : 'text-slate-500'}`}>
                {idx + 1}
              </span>
              <div className="relative">
                <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-600" alt={user.name} />
                {user.status === 'studying' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-slate-900 animate-pulse" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <div className="flex items-center gap-2">
                  <p className={`text-[9px] uppercase tracking-widest font-black ${user.status === 'studying' ? 'text-orange-400' : 'text-slate-500'}`}>
                    {user.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-indigo-400 font-black text-sm">{formatHours(user.totalStudyTime)}h</p>
              <p className="text-[9px] text-slate-600 font-bold uppercase">Today</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
          Resets at Midnight local time
        </p>
      </div>
    </div>
  );
};

export default GroupRanking;
