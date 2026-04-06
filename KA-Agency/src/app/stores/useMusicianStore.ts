import React, { createContext, useContext, useReducer } from 'react';

export interface Musician {
  id: string;
  name: string;
  avatar: string;
  instruments: string[];
  genres: string[];
  level: number;
  certified: boolean;
  certSource: 'kaa' | 'external' | 'pending';
  location: string;
  bio: string;
  availability: 'available' | 'booked' | 'on-gig';
  gigsCompleted: number;
  rating: number;
  joinedAt: string;
  samples: { title: string; type: 'audio' | 'video'; url: string }[];
}

interface MusicianState {
  roster: Musician[];
}

type MusicianAction = { type: 'UPDATE_AVAILABILITY'; id: string; availability: Musician['availability'] };

const MOCK_ROSTER: Musician[] = [
  { id: 'mus-001', name: 'Kagiso Sithole', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=musician', instruments: ['Guitar'], genres: ['Jazz', 'Afrobeat', 'Classical'], level: 7, certified: true, certSource: 'kaa', location: 'Gaborone', bio: 'Professional guitarist with 8 years experience.', availability: 'available', gigsCompleted: 14, rating: 4.9, joinedAt: '2024-06-01', samples: [{ title: 'Jazz Improvisation', type: 'audio', url: '#' }] },
  { id: 'mus-002', name: 'Naledi Moremi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=naledi', instruments: ['Piano', 'Keyboard'], genres: ['Jazz', 'Blues', 'Gospel'], level: 8, certified: true, certSource: 'kaa', location: 'Gaborone', bio: 'Concert pianist and composer.', availability: 'available', gigsCompleted: 22, rating: 5.0, joinedAt: '2024-03-15', samples: [{ title: 'Original Composition', type: 'audio', url: '#' }] },
  { id: 'mus-003', name: 'Tebogo Nkosi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tebogo', instruments: ['Drums'], genres: ['Afrobeat', 'Reggae', 'Fusion'], level: 6, certified: true, certSource: 'external', location: 'Francistown', bio: 'Session drummer with touring experience across Southern Africa.', availability: 'on-gig', gigsCompleted: 9, rating: 4.7, joinedAt: '2024-09-20', samples: [] },
  { id: 'mus-004', name: 'Mpho Tau', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mpho', instruments: ['Voice'], genres: ['Gospel', 'Afropop', 'R&B'], level: 5, certified: true, certSource: 'kaa', location: 'Gaborone', bio: 'Vocalist and songwriter. Two-time national competition finalist.', availability: 'available', gigsCompleted: 6, rating: 4.8, joinedAt: '2025-01-10', samples: [{ title: 'Live Performance Clip', type: 'video', url: '#' }] },
  { id: 'mus-005', name: 'Kefilwe Ditheko', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kefilwe', instruments: ['Violin', 'Viola'], genres: ['Classical', 'Orchestral', 'Contemporary'], level: 9, certified: true, certSource: 'external', location: 'Gaborone', bio: 'Classical violinist trained at RSAMD. Available for studio and live work.', availability: 'available', gigsCompleted: 31, rating: 5.0, joinedAt: '2023-11-05', samples: [{ title: 'Mozart Violin Concerto No. 5', type: 'audio', url: '#' }] },
  { id: 'mus-006', name: 'Lerato Kgosi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lerato', instruments: ['Bass Guitar'], genres: ['Jazz', 'Funk', 'R&B'], level: 6, certified: true, certSource: 'kaa', location: 'Maun', bio: 'Bassist with deep groove and feel. Studio and live ready.', availability: 'booked', gigsCompleted: 11, rating: 4.6, joinedAt: '2024-07-22', samples: [] },
];

function musicianReducer(state: MusicianState, action: MusicianAction): MusicianState {
  switch (action.type) {
    case 'UPDATE_AVAILABILITY':
      return { roster: state.roster.map(m => m.id === action.id ? { ...m, availability: action.availability } : m) };
    default:
      return state;
  }
}

const MusicianContext = createContext<{ state: MusicianState; dispatch: React.Dispatch<MusicianAction> } | null>(null);

export function MusicianProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicianReducer, { roster: MOCK_ROSTER });
  return React.createElement(MusicianContext.Provider, { value: { state, dispatch } }, children);
}

export function useMusicians() {
  const ctx = useContext(MusicianContext);
  if (!ctx) throw new Error('useMusicians must be used within MusicianProvider');
  return ctx;
}
