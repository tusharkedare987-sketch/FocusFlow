
import React from 'react';
import { Subject, User, Group, StudySession, Friend } from './types';

export const SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', color: '#3b82f6' },
  { id: '2', name: 'Computer Science', color: '#10b981' },
  { id: '3', name: 'Physics', color: '#f59e0b' },
  { id: '4', name: 'Economics', color: '#8b5cf6' },
  { id: '5', name: 'Linguistics', color: '#ef4444' },
];

export const MOCK_CURRENT_USER: User = {
  id: 'user-0',
  name: 'Alex Johnson',
  avatar: 'https://picsum.photos/seed/me/200',
  status: 'idle',
  totalStudyTime: 12450,
  rank: 42,
};

export const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Jamie Doe', avatar: 'https://picsum.photos/seed/jamie/200', status: 'idle', isOnline: true, totalStudyTime: 5000, rank: 101 },
  { id: 'f2', name: 'Sam Smith', avatar: 'https://picsum.photos/seed/sam/200', status: 'resting', isOnline: true, totalStudyTime: 8000, rank: 65 },
  { id: 'f3', name: 'Alex River', avatar: 'https://picsum.photos/seed/river/200', status: 'studying', isOnline: true, currentSubject: 'Chemistry', totalStudyTime: 12000, rank: 30 },
  { id: 'f4', name: 'Jordan Lee', avatar: 'https://picsum.photos/seed/jordan/200', status: 'idle', isOnline: false, totalStudyTime: 3000, rank: 200 },
  { id: 'f5', name: 'Taylor Swift', avatar: 'https://picsum.photos/seed/taylor/200', status: 'idle', isOnline: true, totalStudyTime: 15000, rank: 15 },
];

// Generate sessions for "today"
const today = new Date();
const setTime = (h: number, m: number) => {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return d;
};

export const MOCK_SESSIONS: StudySession[] = [
  { id: 's1', userId: 'user-0', subjectId: '1', startTime: setTime(8, 0), endTime: setTime(9, 45), duration: 6300 },
  { id: 's2', userId: 'user-0', subjectId: '2', startTime: setTime(10, 30), endTime: setTime(12, 0), duration: 5400 },
  { id: 's3', userId: 'user-0', subjectId: '3', startTime: setTime(14, 0), endTime: setTime(15, 30), duration: 5400 },
  { id: 's4', userId: 'user-0', subjectId: '4', startTime: setTime(17, 0), endTime: setTime(18, 15), duration: 4500 },
  { id: 's5', userId: 'user-0', subjectId: '1', startTime: setTime(20, 0), endTime: setTime(21, 30), duration: 5400 },
];

export const MOCK_GROUP_MEMBERS: User[] = [
  { id: 'user-1', name: 'Sarah Wu', avatar: 'https://picsum.photos/seed/sarah/200', status: 'studying', currentSubject: 'Mathematics', totalStudyTime: 18000, rank: 12 },
  { id: 'user-2', name: 'Marc Dupont', avatar: 'https://picsum.photos/seed/marc/200', status: 'resting', totalStudyTime: 15000, rank: 25 },
  { id: 'user-3', name: 'Elena Gilbert', avatar: 'https://picsum.photos/seed/elena/200', status: 'studying', currentSubject: 'Physics', totalStudyTime: 22000, rank: 5 },
  { id: 'user-4', name: 'Kenji Sato', avatar: 'https://picsum.photos/seed/kenji/200', status: 'idle', totalStudyTime: 8000, rank: 89 },
  { id: 'user-5', name: 'Chloe Price', avatar: 'https://picsum.photos/seed/chloe/200', status: 'studying', currentSubject: 'Computer Science', totalStudyTime: 12000, rank: 50 },
];

export const MOCK_GROUP: Group = {
  id: 'group-1',
  name: 'Code & Coffee',
  members: MOCK_GROUP_MEMBERS,
  description: 'A global community of CS students grinding through algorithms.',
  isPrivate: false,
  adminId: 'user-1',
};

export const ALL_MOCK_GROUPS: Group[] = [
  MOCK_GROUP,
  {
    id: 'group-2',
    name: 'Quantum Physics Hub',
    members: MOCK_GROUP_MEMBERS.slice(0, 2),
    description: 'Deep dive into quantum mechanics. Intense focus only.',
    isPrivate: true,
    adminId: 'user-0', // User is admin here
    joinRequests: [
      { userId: 'user-99', userName: 'Jordan Peterson', userAvatar: 'https://picsum.photos/seed/jordan/200', timestamp: new Date() }
    ]
  },
  {
    id: 'group-3',
    name: 'Medical Boards Prep',
    members: MOCK_GROUP_MEMBERS.slice(2, 5),
    description: 'Preparing for USMLE Step 1. Long study blocks.',
    isPrivate: true,
    adminId: 'user-3',
  },
  {
    id: 'group-4',
    name: 'Linguistic Enthusiasts',
    members: [],
    description: 'Exploring the roots of modern languages.',
    isPrivate: false,
    adminId: 'user-4',
  }
];

export const ARCHITECTURE_PLAN = [
  {
    title: 'Frontend Stack',
    content: 'React + TypeScript + Tailwind for a robust, type-safe UI. State management using Zustand for global study status.'
  },
  {
    title: 'Backend Logic',
    content: 'Node.js/Express with Socket.io for bi-directional real-time status updates (resting vs studying) to handle low-latency interactions.'
  },
  {
    title: 'Database & Real-time',
    content: 'PostgreSQL for relational data (sessions, users). Redis for live presence/status tracking and fast leaderboards using Sorted Sets.'
  },
  {
    title: 'Focus Mode API',
    content: 'Page Visibility API to detect tab switching. Mobile implementation would use background state listeners to pause session timers.'
  }
];
