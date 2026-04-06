import { createContext, useContext } from 'react';

export interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  read: boolean;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
  messages: Message[];
}

export interface MessageState {
  contacts: Contact[];
  selectedContactId: string;
  searchQuery: string;
}

export type MessageAction =
  | { type: 'SELECT_CONTACT'; id: string }
  | { type: 'SEND_MESSAGE'; contactId: string; text: string }
  | { type: 'RECEIVE_MESSAGE'; contactId: string; text: string }
  | { type: 'MARK_READ'; contactId: string }
  | { type: 'SET_SEARCH'; query: string };

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Blessing Moyo',
    role: 'Piano Instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    online: true,
    lastSeen: 'now',
    messages: [
      { id: 'm1', sender: 'them', text: 'Great practice session today, Lerato! Your arpeggios are really improving.', time: '10:32 AM', read: true },
      { id: 'm2', sender: 'me', text: 'Thank you! I have been practising the fingering exercises every day.', time: '10:35 AM', read: true },
      { id: 'm3', sender: 'them', text: 'It shows. Make sure to review the Hanon exercises before Thursday\'s lesson.', time: '10:36 AM', read: false },
    ],
  },
  {
    id: 'c2',
    name: 'Naledi Kgosi',
    role: 'Vocal Coach',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop',
    online: true,
    lastSeen: 'now',
    messages: [
      { id: 'm4', sender: 'them', text: 'Hi! Just checking in — are you coming to the group recital rehearsal on Saturday?', time: 'Yesterday', read: true },
      { id: 'm5', sender: 'me', text: 'Yes, absolutely! What time does it start?', time: 'Yesterday', read: true },
      { id: 'm6', sender: 'them', text: 'Great! 10 AM at the main hall. Bring your music sheets.', time: 'Yesterday', read: true },
    ],
  },
  {
    id: 'c3',
    name: 'Mpho Tau',
    role: 'Drums & Rhythm Instructor',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop',
    online: false,
    lastSeen: '2 hours ago',
    messages: [
      { id: 'm7', sender: 'them', text: 'Your submission for the Kwaito rhythm assignment has been received.', time: 'Mon', read: true },
    ],
  },
  {
    id: 'c4',
    name: 'Amara Diallo',
    role: 'Violin Instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    online: false,
    lastSeen: '1 day ago',
    messages: [
      { id: 'm8', sender: 'them', text: 'Welcome to Kingdom Arts! Looking forward to hearing you play.', time: 'Mar 1', read: true },
    ],
  },
];

function loadMessages(): Contact[] {
  try {
    const raw = localStorage.getItem('kaa_messages');
    return raw ? JSON.parse(raw) : INITIAL_CONTACTS;
  } catch { return INITIAL_CONTACTS; }
}

function saveMessages(contacts: Contact[]) {
  localStorage.setItem('kaa_messages', JSON.stringify(contacts));
}

function makeId(): string {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

function formatTime(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${ampm}`;
}

export function getInitialMessageState(): MessageState {
  return {
    contacts: loadMessages(),
    selectedContactId: 'c1',
    searchQuery: '',
  };
}

export function messageReducer(state: MessageState, action: MessageAction): MessageState {
  switch (action.type) {
    case 'SELECT_CONTACT': {
      const contacts = state.contacts.map(c =>
        c.id === action.id
          ? { ...c, messages: c.messages.map(m => ({ ...m, read: true })) }
          : c
      );
      saveMessages(contacts);
      return { ...state, contacts, selectedContactId: action.id };
    }
    case 'SEND_MESSAGE': {
      const newMsg: Message = {
        id: makeId(),
        sender: 'me',
        text: action.text,
        time: formatTime(),
        read: true,
      };
      const contacts = state.contacts.map(c =>
        c.id === action.contactId
          ? { ...c, messages: [...c.messages, newMsg] }
          : c
      );
      saveMessages(contacts);
      return { ...state, contacts };
    }
    case 'RECEIVE_MESSAGE': {
      const reply: Message = {
        id: makeId(),
        sender: 'them',
        text: action.text,
        time: formatTime(),
        read: state.selectedContactId === action.contactId,
      };
      const contacts = state.contacts.map(c =>
        c.id === action.contactId
          ? { ...c, messages: [...c.messages, reply] }
          : c
      );
      saveMessages(contacts);
      return { ...state, contacts };
    }
    case 'MARK_READ': {
      const contacts = state.contacts.map(c =>
        c.id === action.contactId
          ? { ...c, messages: c.messages.map(m => ({ ...m, read: true })) }
          : c
      );
      saveMessages(contacts);
      return { ...state, contacts };
    }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    default: return state;
  }
}

export interface MessageContextType {
  state: MessageState;
  dispatch: React.Dispatch<MessageAction>;
}

export const MessageContext = createContext<MessageContextType | null>(null);

export function useMessages() {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error('useMessages must be used within AppProvider');
  return ctx;
}
