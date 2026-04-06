import { useRef, useEffect, useCallback } from 'react';
import { usePlayer } from '@/app/stores/usePlayerStore';

export function useAudioPlayer() {
  const { state, dispatch } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = state.tracks[state.currentIndex];

  // Create audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Sync track source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const wasPlaying = state.isPlaying;
    audio.src = currentTrack.audioUrl;
    audio.load();
    if (wasPlaying) audio.play().catch(() => {});
  }, [state.currentIndex, currentTrack]); // eslint-disable-line

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state.isPlaying) {
      audio.play().catch(() => dispatch({ type: 'PAUSE' }));
    } else {
      audio.pause();
    }
  }, [state.isPlaying, dispatch]);

  // Sync volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.isMuted ? 0 : state.volume;
  }, [state.volume, state.isMuted]);

  // Track progress via timeupdate
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTime = () => {
      if (audio.duration) {
        dispatch({ type: 'SET_PROGRESS', value: (audio.currentTime / audio.duration) * 100 });
      }
    };
    const handleEnded = () => dispatch({ type: 'NEXT_TRACK' });
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
    dispatch({ type: 'SET_PROGRESS', value: pct });
  }, [dispatch]);

  const formatTime = useCallback((pct: number) => {
    const audio = audioRef.current;
    const dur = audio?.duration || currentTrack?.duration || 0;
    const secs = Math.floor((pct / 100) * dur);
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [currentTrack]);

  return { audioRef, seek, formatTime, currentTrack };
}
