import { createContext, useContext } from 'react';

export interface LiveStudent {
  id: string;
  name: string;
  avatar: string;
  instrument: string;
  status: 'invited' | 'joined' | 'declined' | 'waiting';
}

export interface LiveSession {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  courseId: string;
  courseTitle: string;
  instrument: string;
  startedAt: string;
  isLive: boolean;
  students: LiveStudent[];
}

export interface LiveStreamState {
  // Instructor side
  activeSession: LiveSession | null;
  isGoingLive: boolean;

  // Student side — invite received
  pendingInvite: {
    sessionId: string;
    instructorName: string;
    instructorAvatar: string;
    courseTitle: string;
    instrument: string;
    /** Jitsi room name — set by instructor when session starts */
    roomName?: string;
    /** Session type — determines Jitsi config for student */
    sessionType?: string;
  } | null;
  joinedSessionId: string | null;
  /** Jitsi room info for the student when they accept an invite */
  joinedRoom?: { roomName: string; courseTitle: string; instructorName: string; sessionType: string } | null;
}

export type LiveStreamAction =
  | { type: 'START_SESSION'; session: LiveSession }
  | { type: 'END_SESSION' }
  | { type: 'INVITE_STUDENT'; student: LiveStudent }
  | { type: 'CONFIRM_STUDENT'; studentId: string }
  | { type: 'REMOVE_STUDENT'; studentId: string }
  | { type: 'SET_GOING_LIVE'; value: boolean }
  | { type: 'RECEIVE_INVITE'; invite: LiveStreamState['pendingInvite'] }
  | { type: 'DISMISS_INVITE' }
  | { type: 'JOIN_SESSION'; sessionId: string }
  | { type: 'LEAVE_SESSION' };

// BroadcastChannel for real cross-tab messaging
let _channel: BroadcastChannel | null = null;
export function getLiveChannel(): BroadcastChannel {
  if (!_channel) {
    _channel = new BroadcastChannel('kaa_live_stream');
  }
  return _channel;
}

export function getInitialLiveStreamState(): LiveStreamState {
  return {
    activeSession: null,
    isGoingLive: false,
    pendingInvite: null,
    joinedSessionId: null,
    joinedRoom: null,
  };
}

export function liveStreamReducer(state: LiveStreamState, action: LiveStreamAction): LiveStreamState {
  switch (action.type) {
    case 'START_SESSION':
      return { ...state, activeSession: action.session, isGoingLive: false };
    case 'END_SESSION':
      return { ...state, activeSession: null, isGoingLive: false };
    case 'INVITE_STUDENT': {
      if (!state.activeSession) return state;
      const already = state.activeSession.students.find(s => s.id === action.student.id);
      if (already) return state;
      const students = [...state.activeSession.students, action.student];
      return { ...state, activeSession: { ...state.activeSession, students } };
    }
    case 'CONFIRM_STUDENT': {
      if (!state.activeSession) return state;
      const students = state.activeSession.students.map(s =>
        s.id === action.studentId ? { ...s, status: 'joined' as const } : s
      );
      return { ...state, activeSession: { ...state.activeSession, students } };
    }
    case 'REMOVE_STUDENT': {
      if (!state.activeSession) return state;
      const students = state.activeSession.students.filter(s => s.id !== action.studentId);
      return { ...state, activeSession: { ...state.activeSession, students } };
    }
    case 'SET_GOING_LIVE':
      return { ...state, isGoingLive: action.value };
    case 'RECEIVE_INVITE':
      return { ...state, pendingInvite: action.invite };
    case 'DISMISS_INVITE':
      return { ...state, pendingInvite: null };
    case 'JOIN_SESSION': {
      // Carry the room info forward so the student's Jitsi room can open
      const invite = state.pendingInvite;
      return {
        ...state,
        joinedSessionId: action.sessionId,
        pendingInvite: null,
        joinedRoom: invite?.roomName
          ? {
              roomName: invite.roomName,
              courseTitle: invite.courseTitle,
              instructorName: invite.instructorName,
              sessionType: invite.sessionType ?? 'private',
            }
          : null,
      };
    }
    case 'LEAVE_SESSION':
      return { ...state, joinedSessionId: null, joinedRoom: null };
    default: return state;
  }
}

export interface LiveStreamContextType {
  state: LiveStreamState;
  dispatch: React.Dispatch<LiveStreamAction>;
}

export const LiveStreamContext = createContext<LiveStreamContextType | null>(null);

export function useLiveStream() {
  const ctx = useContext(LiveStreamContext);
  if (!ctx) throw new Error('useLiveStream must be used within AppProvider');
  return ctx;
}
