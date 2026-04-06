/**
 * AppProvider — Global state + Supabase session management
 *
 * On mount, we:
 *  1. Check for an existing Supabase session (persisted in localStorage)
 *  2. Subscribe to auth state changes (login / logout events)
 *  3. When a real user is found, fetch their profile from the profiles table
 *     and hydrate the AuthContext with real data
 *  4. On sign-out, reset back to the guest state
 */

import React, { useReducer, useEffect } from 'react';
import { AuthContext, authReducer, getInitialAuthState } from '@/app/stores/useAuthStore';
import { CourseContext, courseReducer, getInitialCourseState } from '@/app/stores/useCourseStore';
import { MessageContext, messageReducer, getInitialMessageState } from '@/app/stores/useMessageStore';
import { CommunityContext, communityReducer, getInitialCommunityState } from '@/app/stores/useCommunityStore';
import { PlayerContext, playerReducer, getInitialPlayerState } from '@/app/stores/usePlayerStore';
import { LiveStreamContext, liveStreamReducer, getInitialLiveStreamState } from '@/app/stores/useLiveStreamStore';
import { SongRequestContext, songRequestReducer, getInitialSongRequestState } from '@/app/stores/useSongRequestStore';
import { supabase, fetchProfile } from '@/lib/supabase';
import type { UserRole } from '@/app/stores/useAuthStore';

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [authState, authDispatch] = useReducer(authReducer, undefined, getInitialAuthState);
  const [courseState, courseDispatch] = useReducer(courseReducer, undefined, getInitialCourseState);
  const [messageState, messageDispatch] = useReducer(messageReducer, undefined, getInitialMessageState);
  const [communityState, communityDispatch] = useReducer(communityReducer, undefined, getInitialCommunityState);
  const [playerState, playerDispatch] = useReducer(playerReducer, undefined, getInitialPlayerState);
  const [liveStreamState, liveStreamDispatch] = useReducer(liveStreamReducer, undefined, getInitialLiveStreamState);
  const [songRequestState, songRequestDispatch] = useReducer(songRequestReducer, undefined, getInitialSongRequestState);

  useEffect(() => {
    // ── Hydrate from existing session on first load ─────────
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        hydrateFromSupabaseUser(session.user.id);
      }
    });

    // ── Listen to future auth state changes ─────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        hydrateFromSupabaseUser(session.user.id);
      } else {
        // Signed out — revert to guest
        authDispatch({ type: 'SET_ROLE', role: 'guest' });
        localStorage.removeItem('kaa_user_profile');
        localStorage.removeItem('kaa_supabase_uid');
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Fetch Supabase profile and sync it into the AuthContext */
  async function hydrateFromSupabaseUser(userId: string) {
    const { data: profile } = await fetchProfile(userId);
    if (!profile) return;

    // Map Supabase profile → existing UserProfile shape
    authDispatch({
      type: 'SET_SUPABASE_USER',
      profile: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: profile.role as UserRole,
        avatar: profile.avatar_url ?? `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(profile.full_name)}`,
        bio: profile.bio ?? '',
        instrument: profile.instrument ?? '',
        level: profile.level,
        xp: profile.xp,
        xpToNext: profile.xp_to_next,
        crowns: profile.crowns,
        streak: profile.streak,
        joinDate: profile.created_at.slice(0, 10),
        inviteCode: profile.invite_code ?? '',
      },
    });

    // Persist uid so other hooks can use it
    localStorage.setItem('kaa_supabase_uid', userId);
  }

  return (
    <AuthContext.Provider value={{ state: authState, dispatch: authDispatch, roleProfiles: {} as any }}>
      <CourseContext.Provider value={{ state: courseState, dispatch: courseDispatch }}>
        <MessageContext.Provider value={{ state: messageState, dispatch: messageDispatch }}>
          <CommunityContext.Provider value={{ state: communityState, dispatch: communityDispatch }}>
            <PlayerContext.Provider value={{ state: playerState, dispatch: playerDispatch }}>
              <LiveStreamContext.Provider value={{ state: liveStreamState, dispatch: liveStreamDispatch }}>
                <SongRequestContext.Provider value={{ state: songRequestState, dispatch: songRequestDispatch }}>
                  {children}
                </SongRequestContext.Provider>
              </LiveStreamContext.Provider>
            </PlayerContext.Provider>
          </CommunityContext.Provider>
        </MessageContext.Provider>
      </CourseContext.Provider>
    </AuthContext.Provider>
  );
}
