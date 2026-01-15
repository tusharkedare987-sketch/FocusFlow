
import React, { useState, useEffect, useRef } from 'react';
import { Subject } from '../types';
import { getStudyMotivation } from '../services/geminiService';

interface TimerProps {
  activeSubject: Subject;
  onSessionComplete: (duration: number) => void;
  onStatusChange: (status: 'studying' | 'resting') => void;
}

const STORAGE_KEY = 'zensu_session_start';
const SUBJECT_KEY = 'zensu_session_subject';

const Timer: React.FC<TimerProps> = ({ activeSubject, onSessionComplete, onStatusChange }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFocusAlert, setIsFocusAlert] = useState(false);
  const [motivation, setMotivation] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize: Check for existing session in localStorage
  useEffect(() => {
    const savedStartTime = localStorage.getItem(STORAGE_KEY);
    const savedSubjectId = localStorage.getItem(SUBJECT_KEY);

    if (savedStartTime && savedSubjectId === activeSubject.id) {
      setIsActive(true);
      onStatusChange('studying');
      
      const elapsed = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
      setSeconds(elapsed > 0 ? elapsed : 0);
    }
  }, [activeSubject.id]);

  const toggleTimer = () => {
    if (!isActive) {
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY, now.toString());
      localStorage.setItem(SUBJECT_KEY, activeSubject.id);
      setIsActive(true);
      onStatusChange('studying');
      fetchMotivation();
    } else {
      const finalDuration = seconds;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SUBJECT_KEY);
      setIsActive(false);
      onStatusChange('resting');
      onSessionComplete(finalDuration);
      setSeconds(0);
      setMotivation("");
    }
  };

  const fetchMotivation = async () => {
    const msg = await getStudyMotivation(activeSubject.name, Math.floor(seconds / 60));
    setMotivation(msg);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        const startTime = localStorage.getItem(STORAGE_KEY);
        if (startTime) {
          const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
          setSeconds(elapsed > 0 ? elapsed : 0);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Focus Detection Logic (Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setIsFocusAlert(true);
      } else {
        setIsFocusAlert(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`transition-all duration-700 bg-slate-800/50 p-10 rounded-[2.5rem] border shadow-2xl backdrop-blur-md flex flex-col items-center relative overflow-hidden ${
      isFocusAlert 
        ? 'focus-warning-active border-red-500/50' 
        : 'border-slate-700/50 shadow-black/40'
    }`}>
      {/* Background Glow Effect */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] transition-all duration-1000 ${
        isActive ? 'bg-indigo-500/10' : 'bg-transparent'
      }`} />
      
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-4">
        {isActive ? 'Session in Progress' : 'Deep Focus Timer'}
      </div>

      <div 
        className="px-6 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-10 transition-all shadow-sm border"
        style={{ 
          backgroundColor: `${activeSubject.color}15`, 
          color: activeSubject.color,
          borderColor: `${activeSubject.color}30`
        }}
      >
        {activeSubject.name}
      </div>

      <div className={`relative transition-all duration-500 tabular-nums ${
        isFocusAlert ? 'text-red-500 scale-105' : 'text-white'
      }`}>
        <span className="text-8xl font-black tracking-tight drop-shadow-2xl">
          {formatTime(seconds)}
        </span>
        {isFocusAlert && (
          <div className="absolute inset-0 blur-xl bg-red-500/20 -z-10 animate-pulse" />
        )}
      </div>

      <div className="mt-12 flex gap-4 w-full">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 overflow-hidden group ${
            isActive 
              ? 'bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/20 text-white' 
              : 'bg-indigo-500 hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 text-white'
          }`}
        >
          {isActive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Complete Session
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              Start Focus
            </>
          )}
        </button>
      </div>

      <div className="min-h-[60px] flex items-center justify-center w-full">
        {motivation && !isFocusAlert ? (
          <div className="mt-8 p-4 bg-slate-900/30 rounded-2xl border border-slate-700/30 w-full text-center animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-slate-400 text-[11px] font-medium italic leading-relaxed">
              <span className="text-indigo-400 font-black not-italic mr-1">“</span>
              {motivation}
              <span className="text-indigo-400 font-black not-italic ml-1">”</span>
            </p>
          </div>
        ) : isFocusAlert ? (
          <div className="mt-8 flex items-center justify-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black animate-bounce uppercase tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            App Out of Focus: Stay on task!
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-2 text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Deep Focus Shield Active
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
