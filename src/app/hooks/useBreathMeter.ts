import { useState, useRef, useCallback, useEffect } from 'react';

export interface BreathMeterReturn {
  level: number;          // 0-100 amplitude level
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  toggle: () => Promise<void>;
}

export function useBreathMeter(): BreathMeterReturn {
  const [level, setLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(() => !!(navigator.mediaDevices?.getUserMedia));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const analyse = useCallback(() => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const val = (dataArray[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    // Scale: rms is 0-1 from mic input; scale to 0-100 with some amplification
    const scaled = Math.min(100, Math.round(rms * 400));
    setLevel(scaled);
    rafRef.current = requestAnimationFrame(analyse);
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) { setError('Microphone not supported.'); return; }
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);
      rafRef.current = requestAnimationFrame(analyse);
    } catch {
      setError('Microphone access denied.');
    }
  }, [isSupported, analyse]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    setIsListening(false);
    setLevel(0);
  }, []);

  const toggle = useCallback(async () => {
    if (isListening) stop();
    else await start();
  }, [isListening, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { level, isListening, isSupported, error, start, stop, toggle };
}
