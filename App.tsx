
import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import StudyGroup from './components/StudyGroup';
import GroupRanking from './components/Leaderboard';
import ArchitecturePanel from './components/ArchitecturePanel';
import Analytics from './components/Analytics';
import AIInsights from './components/AIInsights';
import TaskCategorizer from './components/TaskCategorizer';
import WebSearch from './components/WebSearch';
import { Subject, UserStatus, StudySession } from './types';
import { SUBJECTS as INITIAL_SUBJECTS, MOCK_SESSIONS } from './constants';

type TabType = 'focus' | 'community' | 'analyze';

const MAX_SUBJECTS = 8;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('focus');
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState<Subject>(INITIAL_SUBJECTS[0]);
  const [userStatus, setUserStatus] = useState<UserStatus>('idle');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Initialize: Load subjects and sessions from storage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('focusflow_subjects');
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch (e) {
        setSubjects(INITIAL_SUBJECTS);
      }
    }

    const savedSessions = localStorage.getItem('focusflow_session_history');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        const formatted = parsed.map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : undefined
        }));
        setSessions(formatted);
      } catch (e) {
        setSessions(MOCK_SESSIONS);
      }
    } else {
      setSessions(MOCK_SESSIONS);
    }

    const savedSubjectId = localStorage.getItem('focusflow_session_subject');
    if (savedSubjectId) {
      // Find from subjects or default to first if missing
      const found = subjects.find(s => s.id === savedSubjectId);
      if (found) setSelectedSubject(found);
    }
  }, []);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('focusflow_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Sync selectedSubject with subjects state
  useEffect(() => {
    const updatedSelected = subjects.find(s => s.id === selectedSubject.id);
    if (updatedSelected) {
      setSelectedSubject(updatedSelected);
    } else if (subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects, selectedSubject.id]);

  const handleStatusChange = (status: UserStatus) => {
    setUserStatus(status);
  };

  const handleSessionComplete = (duration: number) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      userId: 'user-0',
      subjectId: selectedSubject.id,
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date(),
      duration: duration
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('focusflow_session_history', JSON.stringify(updatedSessions));
    setUserStatus('resting');
  };

  const updateSubjectColor = (id: string, newColor: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, color: newColor } : s));
  };

  const addSubject = () => {
    if (subjects.length >= MAX_SUBJECTS) return;
    const name = `Subject ${subjects.length + 1}`;
    const newSub: Subject = {
      id: Date.now().toString(),
      name,
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    };
    setSubjects([...subjects, newSub]);
    setEditingSubjectId(newSub.id);
  };

  const deleteSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const renameSubject = (id: string, newName: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const isTimerRunning = userStatus === 'studying';

  // Calculate empty slots
  const emptySlotsCount = MAX_SUBJECTS - subjects.length;
  const emptySlots = Array.from({ length: emptySlotsCount }).map((_, i) => ({ id: `empty-${i}` }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <nav className="border-b border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">F</div>
            <h1 className="text-xl font-extrabold tracking-tight">FOCUSFLOW</h1>
          </div>
          <div className="hidden md:flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {['focus', 'community', 'analyze'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <img src="https://picsum.photos/seed/me/200" className="w-8 h-8 rounded-full border border-slate-700" alt="profile" />
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 border-t border-slate-800 backdrop-blur-lg flex justify-around p-3">
        {['focus', 'community', 'analyze'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as TabType)} className={`flex flex-col items-center gap-1 ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase">{tab}</span>
          </button>
        ))}
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 pb-24 animate-in fade-in duration-500">
        {activeTab === 'focus' && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <Timer activeSubject={selectedSubject} onSessionComplete={handleSessionComplete} onStatusChange={handleStatusChange} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 relative h-fit flex flex-col">
                {isTimerRunning && <div className="absolute inset-0 z-20 bg-slate-950/40 backdrop-blur-[1px] rounded-3xl flex items-center justify-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700">Locked While Studying</p>
                </div>}
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Study Subjects</h3>
                    <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-widest">
                      {subjects.length} of {MAX_SUBJECTS} slots filled
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Filled Slots */}
                  {subjects.map((s) => {
                    const isSelected = selectedSubject.id === s.id;
                    const isEditing = editingSubjectId === s.id;
                    return (
                      <div key={s.id} className={`group relative w-full flex items-center p-0.5 rounded-2xl transition-all border ${isSelected ? 'bg-slate-800/80 border-slate-600 shadow-lg' : 'bg-slate-900/20 border-transparent hover:bg-slate-800/40'}`}>
                        <button disabled={isTimerRunning} onClick={() => setSelectedSubject(s)} className="flex-1 flex items-center gap-4 p-3 rounded-xl disabled:cursor-not-allowed overflow-hidden text-left">
                          <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0`} style={{ backgroundColor: s.color, boxShadow: isSelected ? `0 0 10px ${s.color}` : `none` }} />
                          {isEditing ? (
                            <input 
                              autoFocus 
                              className="bg-slate-950/80 border border-indigo-500 rounded px-2 text-sm font-bold text-white w-full outline-none" 
                              value={s.name} 
                              onChange={(e) => renameSubject(s.id, e.target.value)} 
                              onBlur={() => setEditingSubjectId(null)} 
                              onKeyDown={(e) => e.key === 'Enter' && setEditingSubjectId(null)}
                            />
                          ) : (
                            <span className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-400'}`}>{s.name}</span>
                          )}
                        </button>
                        
                        {!isTimerRunning && (
                          <div className="flex items-center pr-3 gap-1">
                            <button onClick={() => setEditingSubjectId(s.id)} className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                            <button onClick={() => deleteSubject(s.id)} className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                            <div className="relative w-5 h-5 rounded-lg border border-slate-700 overflow-hidden ml-1">
                              <input 
                                type="color" 
                                value={s.color} 
                                onChange={(e) => updateSubjectColor(s.id, e.target.value)}
                                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Empty Slots */}
                  {emptySlots.map((slot, idx) => (
                    <div key={slot.id} className="w-full p-0.5 rounded-2xl border border-dashed border-slate-800/50 flex items-center opacity-40 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={addSubject}
                        disabled={isTimerRunning}
                        className="flex-1 flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/20 transition-all text-left"
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-700" />
                        <span className="text-xs font-bold text-slate-600 italic">Empty Slot {subjects.length + idx + 1}</span>
                        <div className="ml-auto">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                           </svg>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <WebSearch />
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <StudyGroup currentUserStatus={userStatus} currentUserSubject={selectedSubject.name} />
            <div className="max-w-2xl mx-auto w-full"><GroupRanking /></div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <AIInsights />
                <TaskCategorizer />
              </div>
              <div className="space-y-8">
                <Analytics sessions={sessions} subjects={subjects} />
                <ArchitecturePanel />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
