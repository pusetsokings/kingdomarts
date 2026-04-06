import { useState, useRef, useCallback, useEffect } from 'react';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function frequencyToNote(freq: number): { note: string; octave: number; cents: number } {
  const A4 = 440;
  const semitones = 12 * Math.log2(freq / A4);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12 + 9) % 12; // A is index 9
  const octave = Math.floor((rounded + 9) / 12) + 4;
  return { note: NOTE_NAMES[noteIndex], octave, cents };
}

// Autocorrelation pitch detection
function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let best_offset = -1;
  let best_correlation = 0;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return null; // too quiet

  let lastCorrelation = 1;
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs((buffer[i]) - (buffer[i + offset]));
    }
    correlation = 1 - (correlation / MAX_SAMPLES);
    if (correlation > 0.9 && correlation > lastCorrelation) {
      best_correlation = correlation;
      best_offset = offset;
    }
    lastCorrelation = correlation;
  }

  if (best_correlation > 0.01 && best_offset > 0) {
    return sampleRate / best_offset;
  }
  return null;
}

export interface TunerResult {
  note: string;
  octave: number;
  cents: number;
  frequency: number;
  isActive: boolean;
}

export interface TunerReturn {
  result: TunerResult | null;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  toggle: () => Promise<void>;
}

export function useTuner(): TunerReturn {
  const [result, setResult] = useState<TunerResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(() => !!(navigator.mediaDevices?.getUserMedia));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const analyse = useCallback(() => {
    if (!analyserRef.current || !audioCtxRef.current) return;
    const analyser = analyserRef.current;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    const freq = detectPitch(buffer, audioCtxRef.current.sampleRate);

    if (freq && freq > 20 && freq < 5000) {
      const { note, octave, cents } = frequencyToNote(freq);
      setResult({ note, octave, cents, frequency: Math.round(freq * 10) / 10, isActive: true });
    } else {
      setResult(prev => prev ? { ...prev, isActive: false } : null);
    }
    rafRef.current = requestAnimationFrame(analyse);
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) { setError('Microphone not supported in this browser.'); return; }
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsListening(true);
      rafRef.current = requestAnimationFrame(analyse);
    } catch (err: any) {
      setError(err.message === 'Permission denied' ? 'Microphone access denied. Please allow microphone in your browser settings.' : 'Could not access microphone.');
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
    setResult(null);
  }, []);

  const toggle = useCallback(async () => {
    if (isListening) stop();
    else await start();
  }, [isListening, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { result, isListening, isSupported, error, start, stop, toggle };
}
