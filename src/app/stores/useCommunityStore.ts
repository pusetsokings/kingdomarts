import { createContext, useContext } from 'react';

export type PostCategory = 'discussion' | 'performance' | 'event' | 'group';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Post {
  id: string;
  author: string;
  role: string;
  avatar: string;
  category: PostCategory;
  content: string;
  imageUrl?: string;
  videoThumb?: string;
  time: string;
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
  shares: number;
  eventDate?: string;
  eventLocation?: string;
  groupMembers?: number;
}

export interface CommunityState {
  posts: Post[];
  activeFilter: 'all' | PostCategory;
  newPostText: string;
  newPostCategory: PostCategory;
}

export type CommunityAction =
  | { type: 'ADD_POST'; post: Omit<Post, 'id' | 'time' | 'likes' | 'likedByMe' | 'comments' | 'shares'> }
  | { type: 'TOGGLE_LIKE'; postId: string }
  | { type: 'ADD_COMMENT'; postId: string; comment: Omit<Comment, 'id'> }
  | { type: 'SET_FILTER'; filter: CommunityState['activeFilter'] }
  | { type: 'SET_NEW_POST_TEXT'; text: string }
  | { type: 'SET_NEW_POST_CATEGORY'; category: PostCategory };

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1', author: 'Kagiso Sithole', role: 'Guitar Instructor', category: 'performance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
    content: 'Just finished recording a new Blues Guitar demo for the upcoming masterclass. Can\'t wait to share it with you all! 🎸',
    videoThumb: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=220&fit=crop',
    time: '2 hours ago', likes: 47, likedByMe: false,
    comments: [
      { id: 'cmt1', author: 'Lerato Dube', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop', text: 'Can\'t wait to watch this!', time: '1h ago' },
      { id: 'cmt2', author: 'Mpho Tau', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop', text: 'The blues recordings you share always inspire me.', time: '45m ago' },
    ],
    shares: 12,
  },
  {
    id: 'p2', author: 'Amara Diallo', role: 'Violin Instructor', category: 'discussion',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    content: 'Question for all students: what\'s your go-to practice routine when you\'re feeling stuck on a difficult passage? I\'d love to hear your strategies! 🎻',
    time: '4 hours ago', likes: 31, likedByMe: false,
    comments: [
      { id: 'cmt3', author: 'Lerato Dube', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop', text: 'I slow it down to 50% and use the metronome strictly!', time: '3h ago' },
    ],
    shares: 8,
  },
  {
    id: 'p3', author: 'Kingdom Arts Academy', role: 'Official', category: 'event',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop',
    content: 'Join us for the March Monthly Recital! Our Level 3–5 students will be performing live. All are welcome.',
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=220&fit=crop',
    time: '1 day ago', likes: 89, likedByMe: false,
    comments: [],
    shares: 34,
    eventDate: 'March 22, 2026 · 3:00 PM',
    eventLocation: 'Main Performance Hall, Gaborone',
  },
  {
    id: 'p4', author: 'Naledi Kgosi', role: 'Vocal Coach', category: 'group',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop',
    content: 'The Gospel & Jazz Vocal Ensemble is now open for new members! We rehearse every Wednesday evening. Join us to grow your voice in a supportive community. 🎤',
    time: '2 days ago', likes: 52, likedByMe: false,
    comments: [
      { id: 'cmt4', author: 'Lerato Dube', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop', text: 'I would love to join!', time: '1d ago' },
    ],
    shares: 19,
    groupMembers: 14,
  },
  {
    id: 'p5', author: 'Blessing Moyo', role: 'Piano Instructor', category: 'discussion',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    content: 'Reminder: the best pianists aren\'t those who never make mistakes — they\'re the ones who keep playing through them with confidence. Trust your practice. 🎹',
    time: '3 days ago', likes: 124, likedByMe: false,
    comments: [],
    shares: 41,
  },
];

function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem('kaa_posts');
    return raw ? JSON.parse(raw) : INITIAL_POSTS;
  } catch { return INITIAL_POSTS; }
}

function savePosts(posts: Post[]) {
  localStorage.setItem('kaa_posts', JSON.stringify(posts));
}

function makeId(): string {
  return 'post-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

export function getInitialCommunityState(): CommunityState {
  return {
    posts: loadPosts(),
    activeFilter: 'all',
    newPostText: '',
    newPostCategory: 'discussion',
  };
}

export function communityReducer(state: CommunityState, action: CommunityAction): CommunityState {
  switch (action.type) {
    case 'ADD_POST': {
      const newPost: Post = {
        ...action.post,
        id: makeId(),
        time: 'Just now',
        likes: 0,
        likedByMe: false,
        comments: [],
        shares: 0,
      };
      const posts = [newPost, ...state.posts];
      savePosts(posts);
      return { ...state, posts, newPostText: '' };
    }
    case 'TOGGLE_LIKE': {
      const posts = state.posts.map(p =>
        p.id === action.postId
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 }
          : p
      );
      savePosts(posts);
      return { ...state, posts };
    }
    case 'ADD_COMMENT': {
      const newComment: Comment = { ...action.comment, id: makeId() };
      const posts = state.posts.map(p =>
        p.id === action.postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      );
      savePosts(posts);
      return { ...state, posts };
    }
    case 'SET_FILTER': return { ...state, activeFilter: action.filter };
    case 'SET_NEW_POST_TEXT': return { ...state, newPostText: action.text };
    case 'SET_NEW_POST_CATEGORY': return { ...state, newPostCategory: action.category };
    default: return state;
  }
}

export interface CommunityContextType {
  state: CommunityState;
  dispatch: React.Dispatch<CommunityAction>;
}

export const CommunityContext = createContext<CommunityContextType | null>(null);

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within AppProvider');
  return ctx;
}
