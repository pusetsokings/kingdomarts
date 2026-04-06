import { createContext, useContext } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // seconds
}

export interface PlayerState {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number; // 0-1
  isVisible: boolean;
  isMuted: boolean;
}

export type PlayerAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'SET_PROGRESS'; value: number }
  | { type: 'SET_VOLUME'; value: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SHOW_PLAYER' }
  | { type: 'HIDE_PLAYER' }
  | { type: 'SET_TRACK'; index: number };

// Free/royalty-free audio samples (short preview clips from public sources)
export const TRACKS: Track[] = [
  {
    id: 't1',
    title: 'African Jazz Morning',
    artist: 'Blessing Moyo',
    coverUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=80&h=80&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: 't2',
    title: 'Blues at Midnight',
    artist: 'Kagiso Sithole',
    coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=80&h=80&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 351,
  },
  {
    id: 't3',
    title: 'Gospel Sunrise',
    artist: 'Naledi Kgosi',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 404,
  },
  {
    id: 't4',
    title: 'Kwaito Groove',
    artist: 'Mpho Tau',
    coverUrl: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=80&h=80&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 288,
  },
];

export function getInitialPlayerState(): PlayerState {
  return {
    tracks: TRACKS,
    currentIndex: 0,
    isPlaying: false,
    progress: 0,
    volume: 0.8,
    isVisible: true,
    isMuted: false,
  };
}

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY': return { ...state, isPlaying: true };
    case 'PAUSE': return { ...state, isPlaying: false };
    case 'TOGGLE_PLAY': return { ...state, isPlaying: !state.isPlaying };
    case 'NEXT_TRACK': return {
      ...state,
      currentIndex: (state.currentIndex + 1) % state.tracks.length,
      progress: 0,
      isPlaying: true,
    };
    case 'PREV_TRACK': return {
      ...state,
      currentIndex: state.currentIndex === 0 ? state.tracks.length - 1 : state.currentIndex - 1,
      progress: 0,
      isPlaying: true,
    };
    case 'SET_PROGRESS': return { ...state, progress: action.value };
    case 'SET_VOLUME': return { ...state, volume: action.value, isMuted: action.value === 0 };
    case 'TOGGLE_MUTE': return { ...state, isMuted: !state.isMuted };
    case 'SHOW_PLAYER': return { ...state, isVisible: true };
    case 'HIDE_PLAYER': return { ...state, isVisible: false, isPlaying: false };
    case 'SET_TRACK': return { ...state, currentIndex: action.index, progress: 0, isPlaying: true };
    default: return state;
  }
}

export interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within AppProvider');
  return ctx;
}
