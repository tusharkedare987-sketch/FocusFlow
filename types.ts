
export type UserStatus = 'idle' | 'studying' | 'resting';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  currentSubject?: string;
  totalStudyTime: number; // in seconds
  rank: number;
}

export interface Friend extends User {
  isOnline: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
}

export interface JoinRequest {
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: Date;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  description: string;
  isPrivate: boolean;
  adminId: string;
  joinRequests?: JoinRequest[];
}

export interface ArchitectureTip {
  title: string;
  content: string;
}
