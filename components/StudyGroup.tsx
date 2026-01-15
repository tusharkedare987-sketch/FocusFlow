
import React, { useState } from 'react';
import { Group, User, JoinRequest, Friend } from '../types';
import { ALL_MOCK_GROUPS, MOCK_CURRENT_USER, MOCK_FRIENDS } from '../constants';

interface StudyGroupProps {
  currentUserStatus: 'idle' | 'studying' | 'resting';
  currentUserSubject?: string;
}

const UserAvatar: React.FC<{ user: Partial<User>; isMe?: boolean }> = ({ user, isMe }) => {
  const isStudying = user.status === 'studying';
  
  return (
    <div className={`flex flex-col items-center transition-all duration-500 transform ${isStudying ? 'scale-105' : 'scale-95 opacity-60'}`}>
      <div className="relative group">
        <div className={`relative w-20 h-20 rounded-full overflow-hidden transition-all duration-500 border-2 ${
          isStudying 
            ? 'fire-border border-orange-500 ring-4 ring-orange-500/10' 
            : 'grayscale border-slate-700'
        }`}>
          <img 
            src={user.avatar} 
            className={`w-full h-full object-cover transition-transform duration-700 ${isStudying ? 'scale-110' : 'scale-100'}`} 
            alt={user.name} 
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2 transition-opacity ${isStudying ? 'opacity-100' : 'opacity-0'}`}>
             <span className="text-[8px] font-black text-white uppercase tracking-tighter">Focusing</span>
          </div>
        </div>
        {isStudying && (
          <div className="absolute -inset-1 bg-orange-500/20 blur-xl rounded-full -z-10 animate-pulse" />
        )}
        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg transition-colors duration-500 ${
          isStudying ? 'bg-orange-500' : 'bg-slate-600'
        }`}>
          {isStudying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.187-.234-2.315-.657-3.34a1 1 0 00-1.639-.321m-4.676 4.109a3.945 3.945 0 00-.653 2.019c0 .97.404 1.842 1.056 2.455a4.017 4.017 0 01-.396-1.517c.052-.814.282-1.554.593-2.103a9.856 9.856 0 01.817-1.286c.285-.393.593-.747.882-1.021a3.937 3.937 0 01-.584 1.453l-.01.016z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
          )}
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className={`text-xs font-bold truncate w-24 transition-colors ${isStudying ? 'text-white' : 'text-slate-500'}`}>
          {isMe ? 'Me' : user.name}
        </p>
        <p className={`text-[9px] uppercase font-black tracking-widest mt-0.5 ${isStudying ? 'text-orange-400' : 'text-slate-600'}`}>
          {isStudying ? (user.currentSubject || 'Focus') : 'Resting'}
        </p>
      </div>
    </div>
  );
};

const GroupSearch: React.FC<{ onJoin: (group: Group) => void }> = ({ onJoin }) => {
  const [search, setSearch] = useState('');
  const [requestSent, setRequestSent] = useState<string | null>(null);

  const filteredGroups = ALL_MOCK_GROUPS.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoinClick = (g: Group) => {
    if (g.isPrivate) {
      setRequestSent(g.id);
      setTimeout(() => setRequestSent(null), 3000);
    } else {
      onJoin(g);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search study rooms (e.g. Physics, Coding...)"
          className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map(g => (
          <div key={g.id} className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 hover:border-indigo-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{g.name}</h4>
                {g.isPrivate ? (
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded border border-rose-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Private
                  </span>
                ) : (
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Public</span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{g.description}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  {g.members.slice(0, 3).map((m, i) => (
                    <img key={i} src={m.avatar} className="w-6 h-6 rounded-full border-2 border-slate-800" alt="member" />
                  ))}
                  {g.members.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white border-2 border-slate-800">
                      +{g.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{g.members.length} members</span>
              </div>
            </div>
            <button 
              onClick={() => handleJoinClick(g)}
              className={`w-full py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                requestSent === g.id 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                  : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/10'
              }`}
            >
              {requestSent === g.id ? 'Request Sent' : (g.isPrivate ? 'Request to Join' : 'Join Room')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const InviteFriendsModal: React.FC<{ onClose: () => void; activeGroupName: string }> = ({ onClose, activeGroupName }) => {
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleInvite = (id: string) => {
    setInvitedIds(prev => new Set(prev).add(id));
    // Simulated notification: Friend invited to "activeGroupName"
  };

  const filteredFriends = MOCK_FRIENDS.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Invite Friends</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">to {activeGroupName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {filteredFriends.map(friend => (
            <div key={friend.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={friend.avatar} className="w-10 h-10 rounded-full border border-slate-700" alt={friend.name} />
                  {friend.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{friend.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {friend.status}
                  </p>
                </div>
              </div>
              <button
                disabled={invitedIds.has(friend.id)}
                onClick={() => handleInvite(friend.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  invitedIds.has(friend.id)
                    ? 'bg-slate-700 text-slate-500'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/10'
                }`}
              >
                {invitedIds.has(friend.id) ? 'Invited' : 'Invite'}
              </button>
            </div>
          ))}
          {/* Fix: replaced filteredGroups with filteredFriends to fix the 'Cannot find name' error on line 218 */}
          {filteredFriends.length === 0 && (
             <p className="text-center text-slate-600 text-[10px] font-bold uppercase py-4">No friends found</p>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};

const StudyGroup: React.FC<StudyGroupProps> = ({ currentUserStatus, currentUserSubject }) => {
  const [activeGroup, setActiveGroup] = useState<Group | null>(ALL_MOCK_GROUPS[0]);
  const [view, setView] = useState<'room' | 'search'>('room');
  const [activeRequests, setActiveRequests] = useState<JoinRequest[]>(activeGroup?.joinRequests || []);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const isMeAdmin = activeGroup?.adminId === MOCK_CURRENT_USER.id;

  const handleApprove = (userId: string) => {
    setActiveRequests(prev => prev.filter(r => r.userId !== userId));
  };

  const handleReject = (userId: string) => {
    setActiveRequests(prev => prev.filter(r => r.userId !== userId));
  };

  return (
    <div className="bg-slate-800/40 rounded-3xl p-4 md:p-8 border border-slate-700/50 h-full overflow-hidden flex flex-col backdrop-blur-sm relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          {view === 'room' && activeGroup ? (
            <>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                {activeGroup.name}
                {activeGroup.isPrivate && (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">{activeGroup.description}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-white tracking-tight">Discover Rooms</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Join thousands of students studying live right now.</p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('search')}
            className={`p-2 rounded-xl border transition-all ${view === 'search' ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:text-white'}`}
            title="Browse Rooms"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {activeGroup && (
            <button 
              onClick={() => setView('room')}
              className={`p-2 rounded-xl border transition-all ${view === 'room' ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:text-white'}`}
              title="Active Room"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {view === 'room' && activeGroup ? (
          <div className="space-y-10">
            {isMeAdmin && activeRequests.length > 0 && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Join Requests ({activeRequests.length})</h4>
                </div>
                <div className="space-y-3">
                  {activeRequests.map((req) => (
                    <div key={req.userId} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-indigo-500/20">
                      <div className="flex items-center gap-3">
                        <img src={req.userAvatar} className="w-8 h-8 rounded-full border border-slate-700" alt={req.userName} />
                        <div>
                          <p className="text-xs font-bold text-white">{req.userName}</p>
                          <p className="text-[8px] text-slate-500 uppercase font-black">Requested just now</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(req.userId)} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button onClick={() => handleReject(req.userId)} className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-10 gap-x-6 pb-6">
              <UserAvatar 
                user={{
                  name: 'Me',
                  avatar: MOCK_CURRENT_USER.avatar,
                  status: currentUserStatus,
                  currentSubject: currentUserSubject
                }}
                isMe={true}
              />
              {activeGroup.members.map((member) => (
                <UserAvatar key={member.id} user={member} />
              ))}
            </div>
          </div>
        ) : (
          <GroupSearch onJoin={(g) => { setActiveGroup(g); setView('room'); }} />
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between items-center text-slate-500">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Live Presence Active</span>
        </div>
        <div className="flex items-center gap-4">
          {activeGroup && view === 'room' && (
            <button 
              onClick={() => setShowInviteModal(true)}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Invite Friends
            </button>
          )}
          {activeGroup && view === 'room' && (
            <button 
              onClick={() => { setActiveGroup(null); setView('search'); }}
              className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors"
            >
              Leave Room
            </button>
          )}
        </div>
      </div>

      {showInviteModal && activeGroup && (
        <InviteFriendsModal 
          activeGroupName={activeGroup.name}
          onClose={() => setShowInviteModal(false)} 
        />
      )}
    </div>
  );
};

export default StudyGroup;
