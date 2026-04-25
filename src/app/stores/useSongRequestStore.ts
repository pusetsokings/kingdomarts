import { createContext, useContext } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'completed';
export type RequestPriority = 'low' | 'normal' | 'high';

export interface SongRequest {
  id: string;
  /** Student who submitted the request */
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  /** Instructor the request is directed to */
  instructorId: string;
  instructorName: string;
  /** Song details */
  songTitle: string;
  artistName: string;
  genre?: string;
  /** Why they want to learn it — helps instructor plan */
  reason?: string;
  /** Any notes the instructor leaves when accepting/declining */
  instructorNote?: string;
  /** 'pending' → 'accepted'/'declined' → 'completed' */
  status: RequestStatus;
  priority: RequestPriority;
  /** ISO timestamps */
  createdAt: string;
  updatedAt: string;
  /** Votes from other students — show popular requests to instructors */
  upvotes: string[];  // array of studentIds who upvoted
}

export interface SongRequestState {
  requests: SongRequest[];
  /** Currently open song to preview — could link to YouTube embed */
  previewUrl: string | null;
  filterStatus: RequestStatus | 'all';
  sortBy: 'newest' | 'popular' | 'status';
}

export type SongRequestAction =
  | { type: 'SUBMIT_REQUEST'; request: Omit<SongRequest, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'status'> }
  | { type: 'UPDATE_STATUS'; requestId: string; status: RequestStatus; instructorNote?: string }
  | { type: 'UPVOTE'; requestId: string; studentId: string }
  | { type: 'SET_PRIORITY'; requestId: string; priority: RequestPriority }
  | { type: 'SET_FILTER'; status: RequestStatus | 'all' }
  | { type: 'SET_SORT'; by: SongRequestState['sortBy'] }
  | { type: 'SET_PREVIEW'; url: string | null }
  | { type: 'DELETE_REQUEST'; requestId: string };

// ── Persistence ───────────────────────────────────────────────────────────────

function load(): SongRequest[] {
  try {
    const raw = localStorage.getItem('kaa_song_requests');
    return raw ? JSON.parse(raw) : SAMPLE_REQUESTS;
  } catch { return SAMPLE_REQUESTS; }
}

function save(requests: SongRequest[]) {
  localStorage.setItem('kaa_song_requests', JSON.stringify(requests));
}

// ── Sample data ───────────────────────────────────────────────────────────────

const SAMPLE_REQUESTS: SongRequest[] = [
  {
    id: 'req-001',
    studentId: 'stu-1', studentName: 'Thabo Kgosi',
    instructorId: 'instr-001', instructorName: 'Naledi Moremi',
    songTitle: 'Careless Whisper', artistName: 'George Michael', genre: 'Jazz/Pop',
    reason: 'I love the sax solo and want to learn it for a family event.',
    status: 'accepted', priority: 'high',
    instructorNote: "Great choice! We'll tackle the iconic riff in our next session.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    upvotes: ['stu-2', 'stu-3'],
  },
  {
    id: 'req-002',
    studentId: 'stu-2', studentName: 'Kefilwe Dlamini',
    instructorId: 'instr-001', instructorName: 'Naledi Moremi',
    songTitle: 'Baker Street', artistName: 'Gerry Rafferty', genre: 'Classic Rock',
    reason: 'The saxophone riff is iconic. I want it to be my signature piece.',
    status: 'pending', priority: 'normal',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    upvotes: ['stu-1', 'stu-4', 'stu-5'],
  },
  {
    id: 'req-003',
    studentId: 'stu-3', studentName: 'Lesego Phiri',
    instructorId: 'instr-001', instructorName: 'Naledi Moremi',
    songTitle: 'Pick Up the Pieces', artistName: 'Average White Band', genre: 'Funk',
    reason: 'Want to get into funk saxophone for our school band.',
    status: 'pending', priority: 'normal',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    upvotes: ['stu-6'],
  },
  {
    id: 'req-004',
    studentId: 'stu-4', studentName: 'Mpho Setlhare',
    instructorId: 'instr-001', instructorName: 'Naledi Moremi',
    songTitle: 'What\'d I Say', artistName: 'Ray Charles', genre: 'R&B',
    reason: 'It\'s my mom\'s favourite song. Would love to play it for her birthday.',
    status: 'declined', priority: 'low',
    instructorNote: 'Let\'s finish your scales first — revisit in 3 weeks.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    upvotes: [],
  },
];

// ── Reducer ───────────────────────────────────────────────────────────────────

export function getInitialSongRequestState(): SongRequestState {
  return {
    requests: load(),
    previewUrl: null,
    filterStatus: 'all',
    sortBy: 'newest',
  };
}

export function songRequestReducer(state: SongRequestState, action: SongRequestAction): SongRequestState {
  switch (action.type) {
    case 'SUBMIT_REQUEST': {
      const newReq: SongRequest = {
        ...action.request,
        id: `req-${Date.now()}`,
        status: 'pending',
        upvotes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newReq, ...state.requests];
      save(updated);
      return { ...state, requests: updated };
    }
    case 'UPDATE_STATUS': {
      const updated = state.requests.map(r =>
        r.id === action.requestId
          ? { ...r, status: action.status, instructorNote: action.instructorNote ?? r.instructorNote, updatedAt: new Date().toISOString() }
          : r
      );
      save(updated);
      return { ...state, requests: updated };
    }
    case 'UPVOTE': {
      const updated = state.requests.map(r => {
        if (r.id !== action.requestId) return r;
        const alreadyVoted = r.upvotes.includes(action.studentId);
        const upvotes = alreadyVoted
          ? r.upvotes.filter(id => id !== action.studentId)
          : [...r.upvotes, action.studentId];
        return { ...r, upvotes, updatedAt: new Date().toISOString() };
      });
      save(updated);
      return { ...state, requests: updated };
    }
    case 'SET_PRIORITY': {
      const updated = state.requests.map(r =>
        r.id === action.requestId ? { ...r, priority: action.priority } : r
      );
      save(updated);
      return { ...state, requests: updated };
    }
    case 'DELETE_REQUEST': {
      const updated = state.requests.filter(r => r.id !== action.requestId);
      save(updated);
      return { ...state, requests: updated };
    }
    case 'SET_FILTER': return { ...state, filterStatus: action.status };
    case 'SET_SORT': return { ...state, sortBy: action.by };
    case 'SET_PREVIEW': return { ...state, previewUrl: action.url };
    default: return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

export interface SongRequestContextType {
  state: SongRequestState;
  dispatch: React.Dispatch<SongRequestAction>;
}

export const SongRequestContext = createContext<SongRequestContextType | null>(null);

export function useSongRequests() {
  const ctx = useContext(SongRequestContext);
  if (!ctx) throw new Error('useSongRequests must be used within AppProvider');
  return ctx;
}
