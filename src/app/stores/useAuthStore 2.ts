import { createContext, useContext } from 'react';

export type UserRole = 'student' | 'guest' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  instrument: string;
  level: number;
  xp: number;
  xpToNext: number;
  crowns: number;
  streak: number;
  joinDate: string;
  inviteCode: string;
}

export interface AuthState {
  user: UserProfile;
  isEditing: boolean;
}

export type AuthAction =
  | { type: 'SET_ROLE'; role: UserRole }
  | { type: 'UPDATE_PROFILE'; updates: Partial<UserProfile> }
  | { type: 'SET_EDITING'; value: boolean }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'ADD_CROWN' }
  | { type: 'INCREMENT_STREAK' }
  // Supabase — set a real authenticated user from the database
  | { type: 'SET_SUPABASE_USER'; profile: UserProfile };

const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  student: {
    id: 'user-001',
    name: 'Lerato Dube',
    email: 'lerato@kingdomarts.bw',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    bio: 'Passionate about music. Level 5 student at Kingdom Arts Academy.',
    instrument: 'Piano',
    level: 5,
    xp: 850,
    xpToNext: 1000,
    crowns: 12,
    streak: 7,
    joinDate: '2026-01-15',
    inviteCode: 'KAA-LERATO-7X2',
  },
  guest: {
    id: 'guest-001',
    name: 'Guest Artist',
    email: '',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    bio: 'Exploring Kingdom Arts Academy.',
    instrument: '',
    level: 0,
    xp: 0,
    xpToNext: 100,
    crowns: 0,
    streak: 0,
    joinDate: '',
    inviteCode: '',
  },
  // School owner — Saxophone teacher (instructorId must match 'instr-001' in courses)
  instructor: {
    id: 'instr-001',
    name: 'Naledi Moremi',
    email: 'naledi@kingdomarts.bw',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop',
    bio: 'Founder & Head of Kingdom Arts Academy. Saxophone specialist with 12 years of teaching experience.',
    instrument: 'Saxophone',
    level: 10,
    xp: 9800,
    xpToNext: 10000,
    crowns: 48,
    streak: 21,
    joinDate: '2023-01-10',
    inviteCode: 'KAA-NALEDI-9Y4',
  },
  admin: {
    id: 'admin-001',
    name: 'Academy Admin',
    email: 'admin@kingdomarts.bw',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    bio: 'Kingdom Arts Academy system administrator.',
    instrument: '',
    level: 10,
    xp: 9999,
    xpToNext: 10000,
    crowns: 99,
    streak: 30,
    joinDate: '2023-01-01',
    inviteCode: 'KAA-ADMIN-0Z9',
  },
};

// ── Full academy user directory (used by UserManagement, Community) ────────────
export interface AcademyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  instrument: string;
  level: number | string;
  status: 'Active' | 'Pending Approval' | 'On Leave' | 'Suspended';
  joinDate: string;
  city: string;
}

export const ACADEMY_USERS: AcademyUser[] = [
  {
    id: 'instr-001', name: 'Naledi Moremi', email: 'naledi@kingdomarts.bw',
    role: 'instructor', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop',
    instrument: 'Saxophone', level: 'Founder', status: 'Active', joinDate: '2023-01-10', city: 'Gaborone',
  },
  {
    id: 'instr-002', name: 'Blessing Moyo', email: 'blessing@kingdomarts.bw',
    role: 'instructor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    instrument: 'Piano', level: 'Master', status: 'Active', joinDate: '2024-03-15', city: 'Francistown',
  },
  {
    id: 'instr-003', name: 'Amara Diallo', email: 'amara@kingdomarts.bw',
    role: 'instructor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    instrument: 'Violin', level: 'Expert', status: 'On Leave', joinDate: '2024-12-10', city: 'Gaborone',
  },
  {
    id: 'user-001', name: 'Lerato Dube', email: 'lerato@kingdomarts.bw',
    role: 'student', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    instrument: 'Piano', level: 5, status: 'Active', joinDate: '2026-01-15', city: 'Gaborone',
  },
  {
    id: 'user-002', name: 'Tshiamo Bogosi', email: 'tshiamo@example.bw',
    role: 'student', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    instrument: 'Guitar', level: 3, status: 'Active', joinDate: '2026-01-20', city: 'Maun',
  },
  {
    id: 'user-003', name: 'Mpho Segwane', email: 'mpho@example.bw',
    role: 'student', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop',
    instrument: 'Saxophone', level: 4, status: 'Active', joinDate: '2026-02-03', city: 'Gaborone',
  },
  {
    id: 'user-004', name: 'Kabo Letsholo', email: 'kabo@example.bw',
    role: 'student', avatar: 'https://i.pravatar.cc/100?u=Kabo',
    instrument: 'Segaba', level: 8, status: 'Active', joinDate: '2025-11-02', city: 'Serowe',
  },
  {
    id: 'user-005', name: 'Onalenna Tau', email: 'onalenna@example.bw',
    role: 'student', avatar: 'https://i.pravatar.cc/100?u=Onalenna',
    instrument: 'Drums', level: 2, status: 'Pending Approval', joinDate: '2026-03-01', city: 'Lobatse',
  },
  {
    id: 'admin-001', name: 'Academy Admin', email: 'admin@kingdomarts.bw',
    role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    instrument: '', level: 'Admin', status: 'Active', joinDate: '2023-01-01', city: 'Gaborone',
  },
];

function loadPersistedProfile(): Partial<UserProfile> {
  try {
    const raw = localStorage.getItem('kaa_user_profile');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getInitialAuthState(): AuthState {
  // Always ensure dark class is stripped on load
  document.documentElement.classList.remove('dark');
  localStorage.removeItem('kaa_dark_mode');
  const persisted = loadPersistedProfile();
  const role: UserRole = (persisted.role as UserRole) || 'student';
  const base = ROLE_PROFILES[role];
  return {
    user: { ...base, ...persisted, role },
    isEditing: false,
  };
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_ROLE': {
      const base = ROLE_PROFILES[action.role];
      const persisted = loadPersistedProfile();
      const merged = action.role === (persisted.role as UserRole)
        ? { ...base, ...persisted, role: action.role }
        : { ...base, role: action.role };
      localStorage.setItem('kaa_user_profile', JSON.stringify(merged));
      return { ...state, user: merged };
    }
    case 'UPDATE_PROFILE': {
      const updated = { ...state.user, ...action.updates };
      localStorage.setItem('kaa_user_profile', JSON.stringify(updated));
      return { ...state, user: updated, isEditing: false };
    }
    case 'SET_EDITING':
      return { ...state, isEditing: action.value };
    case 'ADD_XP': {
      const newXp = state.user.xp + action.amount;
      const levelUp = newXp >= state.user.xpToNext;
      const updated = {
        ...state.user,
        xp: levelUp ? newXp - state.user.xpToNext : newXp,
        level: levelUp ? state.user.level + 1 : state.user.level,
        xpToNext: levelUp ? state.user.xpToNext + 200 : state.user.xpToNext,
      };
      localStorage.setItem('kaa_user_profile', JSON.stringify(updated));
      return { ...state, user: updated };
    }
    case 'ADD_CROWN': {
      const updated = { ...state.user, crowns: state.user.crowns + 1 };
      localStorage.setItem('kaa_user_profile', JSON.stringify(updated));
      return { ...state, user: updated };
    }
    case 'INCREMENT_STREAK': {
      const updated = { ...state.user, streak: state.user.streak + 1 };
      localStorage.setItem('kaa_user_profile', JSON.stringify(updated));
      return { ...state, user: updated };
    }
    case 'SET_SUPABASE_USER': {
      // Real user from Supabase — persist locally for fast rehydration on reload
      localStorage.setItem('kaa_user_profile', JSON.stringify(action.profile));
      return { ...state, user: action.profile, isEditing: false };
    }
    default: return state;
  }
}

export interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  roleProfiles: typeof ROLE_PROFILES;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AppProvider');
  return ctx;
}
