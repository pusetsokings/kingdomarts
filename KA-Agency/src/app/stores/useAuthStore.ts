import { createContext, useContext, useReducer } from 'react';

export type AgencyRole = 'musician' | 'client' | 'agency_admin' | 'guest';

export interface AgencyUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: AgencyRole;
  certified: boolean;
  instrument?: string;
  level?: number;
  xp: number;
  xpToNext: number;
  bio?: string;
  location?: string;
  joinedAt: string;
}

interface AuthState {
  user: AgencyUser;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_ROLE'; role: AgencyRole }
  | { type: 'UPDATE_USER'; payload: Partial<AgencyUser> }
  | { type: 'LOGOUT' };

const MOCK_USERS: Record<AgencyRole, AgencyUser> = {
  musician: {
    id: 'mus-001',
    name: 'Kagiso Sithole',
    email: 'kagiso@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=musician',
    role: 'musician',
    certified: true,
    instrument: 'Guitar',
    level: 7,
    xp: 3400,
    xpToNext: 5000,
    bio: 'Professional guitarist with 8 years experience in jazz, afrobeat and classical genres.',
    location: 'Gaborone, Botswana',
    joinedAt: '2024-06-01',
  },
  client: {
    id: 'cli-001',
    name: 'Thabo Enterprises',
    email: 'thabo@events.bw',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
    role: 'client',
    certified: false,
    xp: 0,
    xpToNext: 0,
    bio: 'Event management company specialising in concerts and corporate events.',
    location: 'Francistown, Botswana',
    joinedAt: '2024-09-15',
  },
  agency_admin: {
    id: 'adm-001',
    name: 'Kingdom Arts Admin',
    email: 'admin@kingdomarts.org.bw',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'agency_admin',
    certified: false,
    xp: 0,
    xpToNext: 0,
    location: 'Gaborone, Botswana',
    joinedAt: '2023-01-01',
  },
  guest: {
    id: 'gst-001',
    name: 'Guest',
    email: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    role: 'guest',
    certified: false,
    xp: 0,
    xpToNext: 0,
    joinedAt: '',
  },
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_ROLE':
      return { user: MOCK_USERS[action.role], isAuthenticated: action.role !== 'guest' };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return { user: MOCK_USERS['guest'], isAuthenticated: false };
    default:
      return state;
  }
}

import React from 'react';

const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: MOCK_USERS['guest'],
    isAuthenticated: false,
  });
  return React.createElement(AuthContext.Provider, { value: { state, dispatch } }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
