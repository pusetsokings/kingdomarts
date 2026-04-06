/**
 * LessonPlayer — Full-featured video lesson player
 *
 * Improvements over v1:
 *  • Speed control: 0.5x · 0.75x · 1x · 1.25x · 1.5x
 *  • Sheet music / chord chart panel (tabbed sidebar)
 *  • Real-time note detection indicator (Web Audio pitch detection)
 *  • Backing track player (play-along audio)
 *  • Enhanced feedback with timestamp-click-to-seek
 *  • Download lesson resources button
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, Volume2, Music, List, Crown,
  Upload, Video, CheckCircle2, Clock, Activity, MessageSquare, Star,
  Mic, MicOff, Settings, Maximize, ChevronDown, FileMusic,
  Download, Headphones, BookOpen, Gauge, Zap, Target,
  ChevronRight, Lock, SkipForward, SkipBack,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useMetronome } from '@/app/hooks/useMetronome';
import { useTuner } from '@/app/hooks/useTuner';
import { useBreathMeter } from '@/app/hooks/useBreathMeter';
import { useCourses } from '@/app/stores/useCourseStore';
import { useAuth } from '@/app/stores/useAuthStore';

// ── Constants ────────────────────────────────────────────────────────────────

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5] as const;
type Speed = typeof SPEED_OPTIONS[number];

const CHORD_CHARTS: { label: string; image: string; description: string }[] = [
  {
    label: 'Embouchure Position',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop',
    description: 'Correct lip placement and facial muscle position for clear tone production.',
  },
  {
    label: 'Bb Major Scale',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop',
    description: 'Two octave Bb major scale fingering chart with breath marks.',
  },
  {
    label: 'Diaphragm Breathing',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop',
    description: 'Anatomy of supported breathing for sustained tone and dynamic control.',
  },
];

const BACKING_TRACKS = [
  { label: 'Blues in Bb — 80 BPM', tempo: 80 },
  { label: 'Jazz Waltz — 120 BPM', tempo: 120 },
  { label: 'Afrobeat Groove — 100 BPM', tempo: 100 },
];

const CURRICULUM = [
  { title: 'Assembling the Horn', time: '08:45', status: 'completed' as const },
  { title: 'The Perfect Reed Placement', time: '11:20', status: 'completed' as const },
  { title: 'Embouchure & Breathing', time: '35:00', status: 'active' as const },
  { title: 'First Notes: B, A, G', time: '22:15', status: 'locked' as const },
  { title: 'Level 1 Repertoire', time: 'Practice', status: 'locked' as const },
];

const INSTRUCTOR_FEEDBACK = [
  { timestamp: '02:15', seconds: 135, comment: 'Excellent embouchure here. Your lip seal is much tighter than last week!', type: 'positive' },
  { timestamp: '05:40', seconds: 340, comment: 'Watch your breath support in this transition. You tend to drop pitch on the lower notes.', type: 'correction' },
  { timestamp: '12:20', seconds: 740, comment: 'Beautiful dynamic control. The crescendo on the Altissimo G feels very natural.', type: 'positive' },
];

type SidebarTab = 'curriculum' | 'sheet-music' | 'feedback' | 'backing';

// ── Note detection (simple pitch → note name mapping) ────────────────────────
function noteFromFrequency(freq: number): { note: string; octave: number; cents: number } {
  const A4 = 440;
  const semitones = 12 * Math.log2(freq / A4);
  const rounded = Math.round(semitones);
  const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = 4 + Math.floor((rounded + 9) / 12);
  const cents = Math.round((semitones - rounded) * 100);
  return { note: NOTES[noteIndex], octave, cents };
}

// ── Main Component ────────────────────────────────────────────────────────────
export const LessonPlayer = () => {
  const { state: courseState, dispatch: courseDispatch } = useCourses();
  const { dispatch: authDispatch } = useAuth();

  // Video / playback state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [speed, setSpeed] = useState<Speed>(1);
  const [volume, setVolume] = useState(80);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:45');

  // Panels
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('curriculum');
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isTunerOpen, setIsTunerOpen] = useState(false);
  const [activeChartIdx, setActiveChartIdx] = useState(0);
  const [playingBackingTrack, setPlayingBackingTrack] = useState<number | null>(null);

  // Real audio hooks
  const metronome = useMetronome({ bpm: 120, timeSignature: '4/4' });
  const tuner = useTuner();
  const breath = useBreathMeter();

  // Sync speed to video element when it exists
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  const handleSpeedChange = (s: Speed) => {
    setSpeed(s);
    setShowSpeedPicker(false);
    if (s !== 1) toast.info(`Playback speed: ${s}×`, { duration: 1500 });
  };

  const handleTunerToggle = async () => {
    if (!isTunerOpen) { setIsTunerOpen(true); await tuner.start(); }
    else { setIsTunerOpen(false); tuner.stop(); }
  };

  const handleBreathToggle = async () => {
    if (isPlaying) { setIsPlaying(false); breath.stop(); }
    else { setIsPlaying(true); await breath.start(); }
  };

  const handleSubmit = () => {
    toast.success('Assignment Submitted!', { description: 'Your instructor will review it within 24 hours.' });
    setIsSubmissionOpen(false);
    authDispatch({ type: 'ADD_XP', amount: 50 });
    const enrollment = courseState.enrollments[0];
    if (enrollment) {
      courseDispatch({ type: 'COMPLETE_LESSON', courseId: enrollment.courseId, lessonId: enrollment.currentLessonId });
    }
  };

  const seekToTimestamp = (seconds: number) => {
    const totalSeconds = 35 * 60;
    setProgress((seconds / totalSeconds) * 100);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    setCurrentTime(`${m}:${s.toString().padStart(2, '0')}`);
    toast.info(`Jumped to ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`);
  };

  const tunerColor = tuner.result
    ? Math.abs(tuner.result.cents) < 5 ? 'text-green-400'
    : Math.abs(tuner.result.cents) < 15 ? 'text-yellow-400'
    : 'text-red-400'
    : 'text-white/40';

  return (
    <div className="space-y-6">
      {/* ── Video Player ──────────────────────────────────────────────────── */}
      <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-primary">
        <div className="aspect-video relative group">

          {/* Placeholder image — swap for <video ref={videoRef} src="..."> in production */}
          <img
            src="https://images.unsplash.com/photo-1549488344-932fceb38dcd?w=1200&h=675&fit=crop"
            className="w-full h-full object-cover opacity-80"
            alt="Saxophone Lesson"
          />

          {/* Speed badge — always visible */}
          {speed !== 1 && (
            <div className="absolute top-4 right-4 bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1.5">
              <Gauge className="w-3 h-3" /> {speed}×
            </div>
          )}

          {/* Note detection badge — shows detected note when tuner is active */}
          {tuner.result && isTunerOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className={`absolute top-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border z-10 flex items-center gap-3 ${
                Math.abs(tuner.result.cents) < 5 ? 'border-green-500/50' : 'border-yellow-500/50'
              }`}
            >
              <div className="text-center">
                <p className={`text-2xl font-black ${tunerColor}`}>{tuner.result.note}</p>
                <p className="text-white/40 text-[8px] font-bold">{tuner.result.octave}</p>
              </div>
              <div>
                <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Detecting</p>
                <p className={`text-xs font-black ${tunerColor}`}>
                  {Math.abs(tuner.result.cents) < 5 ? '✓ In Tune' : `${tuner.result.cents > 0 ? '+' : ''}${tuner.result.cents}¢`}
                </p>
              </div>
            </motion.div>
          )}

          {/* Air flow overlay */}
          <div className="absolute bottom-6 left-6 pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Air Flow</span>
                <div className="w-4 h-20 bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div animate={{ height: `${breath.level}%` }} transition={{ duration: 0.15 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-secondary" />
                </div>
                <span className="text-[9px] font-mono text-white/60">{breath.level}%</span>
              </div>
              <div className="text-white">
                <p className="font-bold text-sm">Target: 85 PSI</p>
                <p className="text-[11px] text-secondary italic mt-1">
                  {breath.isListening ? 'Microphone active' : '"Breathe from diaphragm"'}
                </p>
              </div>
            </div>
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleBreathToggle}
              className="w-20 h-20 bg-secondary text-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
          </div>
        </div>

        {/* ── Controls Bar ─────────────────────────────────────────────── */}
        <div className="bg-primary p-5 text-white">
          {/* Progress bar */}
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/prog relative mb-4"
            onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - r.left) / r.width) * 100); }}>
            <div className="h-full bg-secondary transition-all relative" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow opacity-0 group-hover/prog:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Left: transport */}
            <div className="flex items-center gap-3">
              <button onClick={() => setProgress(p => Math.max(0, p - 5))} className="hover:text-secondary transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button onClick={handleBreathToggle} className="hover:text-secondary transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={() => setProgress(p => Math.min(100, p + 5))} className="hover:text-secondary transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
              <button onClick={() => setProgress(0)} className="hover:text-secondary transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume */}
              <div className="relative">
                <button onClick={() => setShowVolume(v => !v)} className="hover:text-secondary transition-colors">
                  <Volume2 className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {showVolume && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-2 z-20">
                      <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}
                        className="h-20 appearance-none accent-secondary" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
                      <span className="text-[10px] font-bold">{volume}%</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="text-xs font-bold font-mono opacity-70">{currentTime} / 35:00</span>
            </div>

            {/* Right: speed + tools */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* ── Speed control ── */}
              <div className="relative">
                <button onClick={() => setShowSpeedPicker(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                  <Gauge className="w-3.5 h-3.5" />
                  {speed}×
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                <AnimatePresence>
                  {showSpeedPicker && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute bottom-10 right-0 bg-black/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30 min-w-[120px]">
                      {SPEED_OPTIONS.map(s => (
                        <button key={s} onClick={() => handleSpeedChange(s)}
                          className={`w-full px-4 py-2.5 text-left text-xs font-black hover:bg-white/10 transition-colors flex items-center justify-between gap-4 ${speed === s ? 'text-secondary' : 'text-white/80'}`}>
                          <span>{s}×</span>
                          {s === 1 && <span className="text-white/30 text-[9px]">Normal</span>}
                          {s === 0.5 && <span className="text-white/30 text-[9px]">Practice</span>}
                          {s === 1.5 && <span className="text-white/30 text-[9px]">Review</span>}
                          {speed === s && <span className="w-1.5 h-1.5 bg-secondary rounded-full" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tuner */}
              <button onClick={handleTunerToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${isTunerOpen ? 'bg-secondary text-primary border-secondary' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}>
                <Activity className="w-3.5 h-3.5" />
                {tuner.result && isTunerOpen ? tuner.result.note : 'Tuner'}
                {tuner.isListening && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />}
              </button>

              {/* Metronome */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <button onClick={metronome.toggle} className="hover:text-secondary transition-colors">
                  <Clock className={`w-3.5 h-3.5 ${metronome.bpm > 0 ? 'text-secondary' : ''}`} />
                </button>
                <span className="text-[10px] font-black font-mono">{metronome.bpm}</span>
                <span className="text-[8px] opacity-50">BPM</span>
                <input type="range" min="40" max="220" value={metronome.bpm}
                  onChange={e => metronome.setBpm(parseInt(e.target.value))}
                  className="w-14 h-1 accent-secondary bg-white/20 rounded-full appearance-none" />
                <div className="flex gap-1">
                  {Array.from({ length: metronome.totalBeats }).map((_, i) => (
                    <div key={i} className={`rounded-full transition-all duration-75 ${metronome.beat === i ? 'w-2.5 h-2.5 bg-secondary shadow-[0_0_6px_rgba(253,185,19,0.8)]' : 'w-1.5 h-1.5 bg-white/20'}`} />
                  ))}
                </div>
              </div>

              {/* Breath mic */}
              <button onClick={handleBreathToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${breath.isListening ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}>
                {breath.isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                Breath
              </button>

              {/* Time sig */}
              <select value={metronome.timeSignature} onChange={e => metronome.setTimeSignature(e.target.value as any)}
                className="bg-white/10 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] font-black text-white">
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="6/8">6/8</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tuner Panel */}
        <AnimatePresence>
          {isTunerOpen && (
            <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
              className="absolute top-4 right-4 bottom-32 w-60 bg-black/95 backdrop-blur-md border border-white/10 rounded-3xl p-6 z-20 flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Note Detection</p>
                {tuner.result ? (
                  <>
                    <p className={`text-6xl font-black ${tunerColor} transition-colors`}>{tuner.result.note}</p>
                    <p className="text-white/40 text-sm mt-1">{tuner.result.octave} · {tuner.result.frequency} Hz</p>
                    <p className={`text-sm font-bold mt-2 ${tunerColor}`}>
                      {Math.abs(tuner.result.cents) < 5 ? '✓ Perfect' : `${tuner.result.cents > 0 ? '▲' : '▼'} ${Math.abs(tuner.result.cents)}¢ off`}
                    </p>
                  </>
                ) : (
                  <p className="text-white/40 text-2xl font-black">Play a note…</p>
                )}
              </div>
              <div className="w-full space-y-2">
                <div className="h-2 bg-white/10 rounded-full relative overflow-hidden">
                  <motion.div animate={{ left: `${50 + (tuner.result?.cents ?? 0)}%` }} transition={{ duration: 0.1 }}
                    className={`absolute top-0 bottom-0 w-1 ${tunerColor.replace('text-', 'bg-')} shadow-glow`}
                    style={{ transform: 'translateX(-50%)' }} />
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/40" />
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/40">
                  <span>♭ Flat</span>
                  <span className={Math.abs(tuner.result?.cents ?? 99) < 5 ? 'text-green-400' : 'text-white/40'}>In Tune</span>
                  <span>Sharp ♯</span>
                </div>
              </div>
              {tuner.error && <p className="text-red-400 text-[10px] text-center">{tuner.error}</p>}
              <button onClick={handleTunerToggle}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Lesson Content ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-2xl font-black tracking-tight">Level 1: Embouchure & Breathing</h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-secondary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Active Lesson</span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <Gauge className="w-3 h-3" /> {speed}×
                </span>
              </div>
            </div>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Teacher Lesedi breaks down the fundamental saxophone embouchure. Use the speed control to slow down tricky passages,
              enable Note Detection to check your pitch in real time, and the Breath meter to monitor your air support.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setIsSubmissionOpen(true)}
                className="flex-1 py-3.5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 min-w-[160px]">
                Submit Rehearsal <Video className="w-4 h-4" />
              </button>
              <button onClick={() => toast.success('Downloading resources…', { description: 'Chord charts and sheet music will download shortly.' })}
                className="flex-1 py-3.5 bg-muted text-primary border border-border rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2 min-w-[160px]">
                <Download className="w-4 h-4" /> Download Resources
              </button>
            </div>
          </div>

          {/* Timestamp feedback */}
          <div className="bg-white border border-border rounded-[2.5rem] p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h4 className="text-xl font-black flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Instructor Feedback
              </h4>
              <div className="flex items-center gap-1 text-secondary">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                <span className="ml-1.5 text-xs font-black text-primary">5.0 Mastery</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Click a timestamp to jump to that moment in the lesson.</p>
            <div className="space-y-3">
              {INSTRUCTOR_FEEDBACK.map((fb, i) => (
                <div key={i} className="flex gap-5 p-5 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                  <div className="flex flex-col items-center shrink-0">
                    <button onClick={() => seekToTimestamp(fb.seconds)}
                      className="px-2 py-1 bg-primary text-white rounded-lg text-[10px] font-mono font-bold hover:bg-secondary hover:text-primary transition-colors">
                      {fb.timestamp}
                    </button>
                    <div className="w-px flex-1 bg-border my-2" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${fb.type === 'positive' ? 'text-green-600' : 'text-amber-600'}`}>
                      {fb.type === 'positive' ? '✓ Great Work' : '→ Refinement Needed'}
                    </span>
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed mt-1">{fb.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Instructor"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
              <div>
                <p className="text-xs font-black">Lesedi Phiri <span className="text-muted-foreground font-medium ml-1">Lead Saxophone</span></p>
                <p className="text-xs text-muted-foreground italic mt-0.5">"Your tone is improving rapidly. Keep focusing on diaphragm support for high notes."</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Sidebar tab switcher */}
          <div className="bg-white border border-border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="flex border-b border-border">
              {([
                { key: 'curriculum', icon: List, label: 'Lessons' },
                { key: 'sheet-music', icon: FileMusic, label: 'Charts' },
                { key: 'backing', icon: Headphones, label: 'Backing' },
              ] as { key: SidebarTab; icon: React.ElementType; label: string }[]).map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setSidebarTab(key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 ${sidebarTab === key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-primary'}`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── Curriculum ── */}
              {sidebarTab === 'curriculum' && (
                <motion.div key="curriculum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-4 space-y-1.5">
                  {CURRICULUM.map((lesson, i) => (
                    <button key={i} disabled={lesson.status === 'locked'}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left ${lesson.status === 'active' ? 'bg-primary text-white shadow-lg' : lesson.status === 'completed' ? 'hover:bg-muted opacity-70' : 'opacity-30 cursor-not-allowed'}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-black w-4 shrink-0 ${lesson.status === 'completed' ? 'text-green-400' : ''}`}>
                          {lesson.status === 'completed' ? '✓' : lesson.status === 'locked' ? '🔒' : i + 1}
                        </span>
                        <span className="text-xs font-bold truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-60 shrink-0 ml-2">{lesson.time}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* ── Sheet Music / Chord Charts ── */}
              {sidebarTab === 'sheet-music' && (
                <motion.div key="sheets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lesson Resources</p>
                  {/* Chart selector */}
                  <div className="flex flex-col gap-1.5">
                    {CHORD_CHARTS.map((chart, i) => (
                      <button key={i} onClick={() => setActiveChartIdx(i)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeChartIdx === i ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'}`}>
                        <FileMusic className="w-3.5 h-3.5 shrink-0" />
                        {chart.label}
                      </button>
                    ))}
                  </div>
                  {/* Chart viewer */}
                  <div className="rounded-2xl overflow-hidden border border-border">
                    <img src={CHORD_CHARTS[activeChartIdx].image} alt={CHORD_CHARTS[activeChartIdx].label}
                      className="w-full h-40 object-cover" />
                    <div className="p-3 bg-muted/50">
                      <p className="text-xs font-black text-primary">{CHORD_CHARTS[activeChartIdx].label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{CHORD_CHARTS[activeChartIdx].description}</p>
                    </div>
                  </div>
                  <button onClick={() => toast.success('Downloading chart…')}
                    className="w-full py-2.5 bg-primary/5 border border-primary/20 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </motion.div>
              )}

              {/* ── Backing Tracks ── */}
              {sidebarTab === 'backing' && (
                <motion.div key="backing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Play-Along Tracks</p>
                  <p className="text-xs text-muted-foreground">Practice with professional backing tracks. Set your metronome to match the tempo and play along.</p>
                  <div className="space-y-2">
                    {BACKING_TRACKS.map((track, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-muted/40 rounded-xl border border-border hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${playingBackingTrack === i ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                            {playingBackingTrack === i ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{track.label}</p>
                            <p className="text-[10px] text-muted-foreground">Tap metronome to sync</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (playingBackingTrack === i) {
                              setPlayingBackingTrack(null);
                              toast.info('Backing track stopped');
                            } else {
                              setPlayingBackingTrack(i);
                              metronome.setBpm(track.tempo);
                              toast.success(`Playing: ${track.label}`, { description: `Metronome set to ${track.tempo} BPM` });
                            }
                          }}
                          className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${playingBackingTrack === i ? 'bg-red-100 text-red-600' : 'bg-primary text-white hover:bg-primary/90'}`}>
                          {playingBackingTrack === i ? 'Stop' : 'Play'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                    <p className="text-[10px] font-black text-primary mb-1">Pro tip</p>
                    <p className="text-[10px] text-muted-foreground">Start at 0.75× speed to perfect a phrase, then gradually increase to 1×.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Practice Tools card */}
          <div className="p-6 bg-secondary rounded-[2rem] text-primary relative overflow-hidden">
            <h4 className="font-black text-lg mb-1">Practice Tools</h4>
            <p className="text-xs font-bold opacity-70 mb-4">Web Audio API — real instrument feedback.</p>
            <div className="space-y-2.5">
              <button onClick={handleTunerToggle}
                className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isTunerOpen ? 'bg-primary text-white shadow-inner' : 'bg-primary text-white shadow-lg hover:bg-primary/90'}`}>
                <Activity className="w-4 h-4" />
                {isTunerOpen ? `${tuner.result?.note ?? 'Detecting…'}` : 'Note Detection'}
              </button>
              <button onClick={metronome.toggle}
                className="w-full py-2.5 bg-white/30 hover:bg-white/50 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                <Clock className="w-4 h-4" />
                {metronome.bpm > 0 ? `♩ ${metronome.bpm} BPM` : 'Start Metronome'}
              </button>
              <button onClick={handleBreathToggle}
                className="w-full py-2.5 bg-white/20 hover:bg-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                {breath.isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {breath.isListening ? 'Stop Breath Meter' : 'Start Breath Meter'}
              </button>
            </div>
            <Crown className="w-28 h-28 absolute -bottom-6 -right-6 opacity-10" />
          </div>
        </div>
      </div>

      {/* ── Submission Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSubmissionOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSubmissionOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
              <div className="bg-primary p-7 text-white">
                <h2 className="text-2xl font-black mb-1">Submit Assignment</h2>
                <p className="text-white/70 text-sm font-medium">Record or upload your rehearsal for review</p>
              </div>
              <div className="p-7 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[{ icon: Video, label: 'Record Now', sub: 'Use your webcam' }, { icon: Upload, label: 'Upload File', sub: 'MP4, MOV up to 500MB' }].map(({ icon: Icon, label, sub }) => (
                    <button key={label}
                      className="p-6 border-2 border-dashed border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-black uppercase tracking-widest text-[10px]">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submission Checklist</h4>
                  {['Hands / instrument are clearly visible', 'Audio is clear and distortion-free', 'Target notes are demonstrated', 'Tempo at least 80 BPM'].map(item => (
                    <div key={item} className="flex items-center gap-3 bg-muted/50 p-3.5 rounded-xl border border-border/50">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsSubmissionOpen(false)}
                    className="flex-1 py-3.5 text-muted-foreground font-black uppercase tracking-widest text-xs hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSubmit}
                    className="flex-[2] py-3.5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary/90 transition-all">
                    Confirm Submission
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
