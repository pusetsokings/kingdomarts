import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, Play, Pause, ChevronLeft, ChevronRight, 
  Volume2, Settings, Repeat, BookOpen 
} from 'lucide-react';

// --- Practice Drills Component ---
export const PracticeDrills = ({ level = 1 }: { level?: number }) => {
  const drills = [
    { id: 1, title: "Velocity & Articulation", duration: "5m", intensity: "Medium" },
    { id: 2, title: "Dynamic Range Mastery", duration: "10m", intensity: "High" },
    { id: 3, title: "Polyphonic Independence", duration: "15m", intensity: "Pro" },
  ];

  return (
    <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" /> Technical Drills
        </h3>
        <span className="px-3 py-1 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">Level {level} Focus</span>
      </div>
      <div className="space-y-3">
        {drills.map((drill) => (
          <div key={drill.id} className="p-4 bg-muted/30 rounded-2xl flex items-center justify-between hover:bg-muted transition-all cursor-pointer group border border-transparent hover:border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-black">{drill.title}</h4>
                <p className="text-[10px] font-medium text-muted-foreground">{drill.duration} • {drill.intensity} Intensity</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Expert Instruction Component ---
export const ExpertInstruction = ({ topic = "Technical Foundation" }) => {
  return (
    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 shadow-sm space-y-6 relative overflow-hidden">
      <div className="flex items-center gap-3 text-primary">
        <BookOpen className="w-5 h-5" />
        <h3 className="text-xs font-black uppercase tracking-widest">{topic}</h3>
      </div>
      <div className="prose prose-sm prose-p:font-medium prose-p:text-muted-foreground max-w-none">
        <p className="leading-relaxed">
          Ensure your wrists remain fluid. In this level, focus on the <span className="text-primary font-black">Weight Transfer Technique</span>. 
          The golden rule for Botswana classical fusion is the rhythmic syncopation on the 3rd beat. 
          Use the metronome at 60% speed before attempting the full tempo.
        </p>
      </div>
      <Music className="absolute -bottom-6 -right-6 w-24 h-24 opacity-5 rotate-12" />
    </div>
  );
};
export const Metronome = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        setBeat((prev) => (prev + 1) % 4);
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setBeat(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm]);

  return (
    <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Music className="w-4 h-4 text-primary" /> Metronome
        </h3>
        <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 py-4">
        {/* Visual Pulse */}
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((b) => (
            <motion.div
              key={b}
              animate={{
                scale: isPlaying && beat === b ? 1.2 : 1,
                backgroundColor: isPlaying && beat === b ? 'var(--color-primary)' : 'var(--color-border)',
                opacity: isPlaying && beat === b ? 1 : 0.3
              }}
              className="w-4 h-4 rounded-full"
            />
          ))}
        </div>

        <div className="text-center">
          <span className="text-6xl font-black text-primary tracking-tighter">{bpm}</span>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">BPM</p>
        </div>

        <div className="flex items-center gap-6 w-full">
          <button onClick={() => setBpm(Math.max(40, bpm - 1))} className="p-3 bg-muted rounded-2xl hover:bg-primary hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="range"
            min="40"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="flex-1 accent-primary h-2 rounded-full bg-muted cursor-pointer"
          />
          <button onClick={() => setBpm(Math.min(240, bpm + 1))} className="p-3 bg-muted rounded-2xl hover:bg-primary hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
            isPlaying ? 'bg-secondary text-primary shadow-xl shadow-secondary/20' : 'bg-primary text-white shadow-xl shadow-primary/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" /> Stop Metronome
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Start Practice
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Flowkey-style Piano Component (MIDI Visualizer) ---
export const PianoPlayer = ({ instrument = "Piano" }: { instrument?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeKeys, setActiveKeys] = useState<{ key: number; hand: 'left' | 'right' }[]>([]);
  const [scrollPos, setScrollPos] = useState(0);

  const isPiano = instrument === "Piano";
  const isSax = instrument === "Saxophone";
  const isDrums = instrument === "Drums";
  const isTraditional = instrument === "Traditional";
  
  // Simulated MIDI playback/Visualizer
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setScrollPos(prev => (prev + 1) % 1000);
      const mockNotes: { key: number; hand: 'left' | 'right' }[] = [
        { key: Math.floor(Math.random() * 8), hand: 'left' },
        { key: 12 + Math.floor(Math.random() * 12), hand: 'right' }
      ];
      setActiveKeys(mockNotes);
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const whiteKeys = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="flex flex-col bg-zinc-950 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-zinc-900">
      {/* MIDI Visualizer Keyboard Layer */}
      <div className="relative h-64 bg-zinc-900 flex justify-center pt-8 px-4">
        
        {isPiano ? (
          <>
            {/* White Keys */}
            <div className="flex w-full max-w-5xl justify-center relative">
              {whiteKeys.map((k) => {
                const isActive = activeKeys.some(ak => Math.floor(ak.key / 1.6) === k);
                const hand = activeKeys.find(ak => Math.floor(ak.key / 1.6) === k)?.hand;
                return (
                  <div 
                    key={k} 
                    className={`flex-1 h-48 border-r border-zinc-300 rounded-b-xl transition-all relative ${
                      isActive ? (hand === 'left' ? 'bg-primary' : 'bg-secondary') : 'bg-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="absolute inset-0 blur-xl bg-inherit" 
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Black Keys */}
            <div className="absolute top-8 inset-x-0 flex justify-center pointer-events-none">
              <div className="flex w-full max-w-5xl relative">
                {whiteKeys.map((_, i) => {
                  const hasBlack = ![2, 6, 9, 13].includes(i);
                  if (i === whiteKeys.length - 1 || !hasBlack) return <div key={i} className="flex-1" />;
                  return (
                    <div key={i} className="flex-1 relative">
                      <div className="absolute -right-[20%] w-[40%] h-32 bg-zinc-800 rounded-b-lg border-x border-b border-black z-20 shadow-xl" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Generic Instrument Visualizer (Sax, Drums, Traditional) */
          <div className="flex items-center justify-center w-full max-w-5xl gap-8 px-10">
            {[...Array(isDrums ? 4 : 8)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{
                  height: activeKeys.some(ak => ak.key % 8 === i) ? (isDrums ? '120px' : '180px') : (isDrums ? '100px' : '140px'),
                  backgroundColor: activeKeys.some(ak => ak.key % 8 === i) ? 'var(--color-secondary)' : 'rgba(255,255,255,0.05)',
                  boxShadow: activeKeys.some(ak => ak.key % 8 === i) ? '0 0 30px var(--color-secondary)' : 'none'
                }}
                className={`flex-1 ${isDrums ? 'rounded-full aspect-square' : 'rounded-3xl'} border border-white/10 flex flex-col items-center justify-end pb-6`}
              >
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  {isDrums ? (i === 0 ? "Kick" : i === 1 ? "Snare" : i === 2 ? "Hat" : "Tom") : `Pad ${i+1}`}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* HUD Overlay */}
        <div className="absolute top-4 left-8 flex items-center gap-4">
           <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{instrument} Visualizer</span>
           </div>
        </div>
        
        {/* Play/Pause Button */}
        <div className="absolute bottom-4 right-8">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
        </div>
      </div>

      {/* Bottom: Sheet Music View */}
      <div className="bg-white p-8 h-56 relative overflow-hidden flex items-center">
        <motion.div 
          className="flex gap-12 whitespace-nowrap min-w-full"
          animate={{ x: isPlaying ? -scrollPos * 2.5 : -scrollPos * 2.5 }}
          transition={{ type: "tween", ease: "linear" }}
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-40 border-l border-zinc-100 p-4 flex flex-col justify-center relative">
               <div className="space-y-3">
                  {[...Array(5)].map((_, line) => (
                    <div key={line} className="w-full h-[1px] bg-zinc-200" />
                  ))}
               </div>
               <div className="absolute flex gap-6 mt-[-20px]">
                  <div className={`w-3.5 h-3.5 rounded-full ${i % 3 === 0 ? 'bg-primary' : 'bg-black'}`} />
                  <div className="w-3.5 h-3.5 rounded-full bg-black translate-y-4" />
               </div>
            </div>
          ))}
        </motion.div>
        <div className="absolute top-0 bottom-0 left-1/4 w-[2px] bg-primary/20 shadow-[0_0_10px_rgba(82,45,128,0.2)]" />
      </div>

      {/* Controls */}
      <div className="bg-zinc-100 px-8 py-4 flex items-center justify-between border-t border-zinc-200">
         <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-all">
               <Repeat className="w-3.5 h-3.5" /> Loop
            </button>
            <button className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-all">
               <Volume2 className="w-3.5 h-3.5" /> Vol
            </button>
         </div>
         <div className="flex items-center gap-4">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Speed</span>
            <div className="flex bg-white rounded-lg p-0.5 border border-zinc-200">
               {['50%', '100%'].map(s => <button key={s} className={`px-3 py-1 text-[8px] font-black rounded-md ${s === '100%' ? 'bg-primary text-white' : ''}`}>{s}</button>)}
            </div>
         </div>
      </div>
    </div>
  );
};
