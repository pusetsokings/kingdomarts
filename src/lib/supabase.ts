import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = 'https://xmsvufqsoqipzspjysvx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_7ZgxfEPZ3WVYUBnsFVoLWw_nwwn9S23';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// ── Auth helpers ─────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, fullName: string, instrument: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        instrument,
        role: 'student',
      },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ── Profile helpers ──────────────────────────────────────────────────────────

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: Partial<{
  full_name: string;
  bio: string;
  instrument: string;
  avatar_url: string;
  city: string;
}>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

// ── Courses helpers ──────────────────────────────────────────────────────────

export async function fetchCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(id, full_name, avatar_url, instrument)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function fetchEnrollments(userId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('course_id, enrolled_at, progress')
    .eq('user_id', userId);
  return { data, error };
}

export async function enrollInCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, course_id: courseId })
    .select()
    .single();
  return { data, error };
}

// ── Messages helpers ─────────────────────────────────────────────────────────

export async function fetchConversations(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id, content, created_at, read_at,
      sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
      receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, content })
    .select()
    .single();
  return { data, error };
}

// ── Community helpers ────────────────────────────────────────────────────────

export async function fetchCommunityPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      author:profiles!community_posts_author_id_fkey(id, full_name, avatar_url, instrument)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function createCommunityPost(authorId: string, content: string, category: string) {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({ author_id: authorId, content, category })
    .select()
    .single();
  return { data, error };
}
