import { useRef, useEffect, useCallback, useState } from 'react';

export type TimeSignature = '4/4' | '3/4' | '6/8';

interface MetronomeOptions {
  bpm: number;
  timeSignature: TimeSignature;
  isOn: boolean;
}

interface MetronomeReturn {
  beat: number;           // current beat (0-indexed)
  totalBeats: number;     // beats per measure
  isSupported: boolean;
  toggle: () => void;
  setBpm: (bpm: number) => void;
  bpm: number;
  timeSignature: TimeSignature;
  setTimeSignature: (ts: TimeSignature) => void;
}

const BEATS: Record<TimeSignature, number> = { '4/4': 4, '3/4': 3, '6/8': 6 };

export function useMetronome(initial: Partial<MetronomeOptions> = {}): MetronomeReturn {
  const [bpm, setBpmState] = useState(initial.bpm ?? 120);
  const [isOn, setIsOn] = useState(initial.isOn ?? false);
  const [beat, setBeat] = useState(0);
  const [timeSignature, setTSState] = useState<TimeSignature>(initial.timeSignature ?? '4/4');
  const [isSupported] = useState(() => typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const beatRef = useRef<number>(0);
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  }, []);

  const scheduleClick = useCallback((time: number, isAccent: boolean) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = isAccent ? 1000 : 800;
    gain.gain.setValueAtTime(isAccent ? 0.8 : 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);
  }, [getCtx]);

  const totalBeats = BEATS[timeSignature];

  const scheduler = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const secondsPerBeat = 60.0 / bpm;
    const scheduleAheadTime = 0.1;

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const isAccent = beatRef.current === 0;
      scheduleClick(nextNoteTimeRef.current, isAccent);
      setBeat(beatRef.current);
      beatRef.current = (beatRef.current + 1) % totalBeats;
      nextNoteTimeRef.current += secondsPerBeat;
    }

    schedulerRef.current = setTimeout(scheduler, 25);
  }, [bpm, scheduleClick, totalBeats]);

  useEffect(() => {
    if (isOn && isSupported) {
      const ctx = getCtx();
      if (ctx.state === 'suspended') ctx.resume();
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
      beatRef.current = 0;
      scheduler();
    } else {
      if (schedulerRef.current) clearTimeout(schedulerRef.current);
      setBeat(0);
      beatRef.current = 0;
    }
    return () => {
      if (schedulerRef.current) clearTimeout(schedulerRef.current);
    };
  }, [isOn, scheduler, getCtx, isSupported]);

  // Restart when bpm or time signature changes while on
  useEffect(() => {
    if (isOn && audioCtxRef.current) {
      if (schedulerRef.current) clearTimeout(schedulerRef.current);
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      beatRef.current = 0;
      scheduler();
    }
  }, [bpm, timeSignature]); // eslint-disable-line

  const toggle = useCallback(() => setIsOn(v => !v), []);
  const setBpm = useCallback((v: number) => setBpmState(Math.max(40, Math.min(220, v))), []);
  const setTimeSignature = useCallback((ts: TimeSignature) => setTSState(ts), []);

  return { beat, totalBeats, isSupported, toggle, setBpm, bpm, timeSignature, setTimeSignature };
}
