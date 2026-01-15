
import React, { useState, useMemo } from 'react';
import { StudySession, Subject } from '../types';

interface AnalyticsProps {
  sessions: StudySession[];
  subjects: Subject[];
}

type TimeRange = 'today' | 'week' | 'month' | 'year';

const Analytics: React.FC<AnalyticsProps> = ({ sessions, subjects }) => {
  const [range, setRange] = useState<TimeRange>('today');

  const filteredData = useMemo(() => {
    const now = new Date();
    const rangeSessions = sessions.filter(s => {
      const start = new Date(s.startTime);
      if (range === 'today') {
        return start.toDateString() === now.toDateString();
      } else if (range === 'week') {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return start >= lastWeek;
      } else if (range === 'month') {
        return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
      } else {
        return start.getFullYear() === now.getFullYear();
      }
    });

    const stats = subjects.map(sub => {
      const total = rangeSessions
        .filter(s => s.subjectId === sub.id)
        .reduce((acc, curr) => acc + curr.duration, 0);
      return { ...sub, totalSeconds: total };
    }).filter(s => s.totalSeconds > 0);

    const totalTime = stats.reduce((acc, curr) => acc + curr.totalSeconds, 0);
    return { stats, totalTime };
  }, [sessions, subjects, range]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // SVG Pie Chart logic
  const renderPie = () => {
    if (filteredData.totalTime === 0) {
      return (
        <div className="w-full h-48 flex items-center justify-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No data for this period</p>
        </div>
      );
    }

    let cumulativePercent = 0;
    const slices = filteredData.stats.map((s, i) => {
      const percent = s.totalSeconds / filteredData.totalTime;
      const startX = Math.cos(2 * Math.PI * cumulativePercent);
      const startY = Math.sin(2 * Math.PI * cumulativePercent);
      cumulativePercent += percent;
      const endX = Math.cos(2 * Math.PI * cumulativePercent);
      const endY = Math.sin(2 * Math.PI * cumulativePercent);

      const largeArcFlag = percent > 0.5 ? 1 : 0;
      const pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `L 0 0`,
      ].join(' ');

      return <path key={i} d={pathData} fill={s.color} className="transition-all hover:opacity-80 cursor-pointer" />;
    });

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="-1 -1 2 2" className="transform -rotate-90">
          {slices}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 bg-slate-900/90 rounded-full border border-slate-800 flex flex-col items-center justify-center shadow-inner">
             <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Total</span>
             <span className="text-xs font-black text-indigo-400">{formatTime(filteredData.totalTime)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-800 backdrop-blur-md flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.001 8.001 0 0117.748 8H12V2.252z" />
          </svg>
          Study Analytics
        </h2>
        <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-800">
          {(['today', 'week', 'month', 'year'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${range === r ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        {renderPie()}
      </div>

      <div className="flex-1 space-y-3">
        {filteredData.stats.length > 0 ? (
          filteredData.stats.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-slate-950/30 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs font-bold text-slate-300">{s.name}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-white">{formatTime(s.totalSeconds)}</p>
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">
                  {((s.totalSeconds / filteredData.totalTime) * 100).toFixed(0)}% of total
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Start a session to see insights</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/50 text-center">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Persistent Storage Enabled
        </p>
      </div>
    </div>
  );
};

export default Analytics;
