import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, ChevronRight, Settings, Maximize, List, Crown, Volume1, VolumeX, Upload, Video, CheckCircle2, Clock, Activity, MessageSquare, User, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const LessonPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeKeys, setActiveKeys] = useState<number[]>([]);
  const [progress, setProgress] = useState(35);
  
  // Metronome State
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beat, setBeat] = useState(0);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  // Tuner State
  const [isTunerOpen, setIsTunerOpen] = useState(false);
  const [tunerNote, setTunerNote] = useState('G');
  const [tunerCents, setTunerCents] = useState(0);

  // Simulated "Flowkey" style key tracking
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const keys = Array.from({ length: 3 }, () => Math.floor(Math.random() * 24));
        setActiveKeys(keys);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setActiveKeys([]);
    }
  }, [isPlaying]);

  // Metronome Logic
  useEffect(() => {
    if (metronomeOn) {
      const intervalTime = (60 / bpm) * 1000;
      const interval = setInterval(() => {
        setBeat((prev) => (prev + 1) % 4);
      }, intervalTime);
      return () => clearInterval(interval);
    } else {
      setBeat(0);
    }
  }, [metronomeOn, bpm]);

  // Tuner Simulation Logic
  useEffect(() => {
    if (isTunerOpen) {
      const interval = setInterval(() => {
        setTunerCents(Math.floor(Math.random() * 40) - 20);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isTunerOpen]);

  const pianoKeys = Array.from({ length: 24 });

  const instructorFeedback = [
    { timestamp: '02:15', comment: 'Excellent hand positioning here. Your thumb transition is much smoother than last week!', type: 'positive' },
    { timestamp: '05:40', comment: 'Watch your tempo in this transition. You tend to rush the eighth notes.', type: 'correction' },
    { timestamp: '12:20', comment: 'Beautiful dynamic control. The crescendo feels very natural.', type: 'positive' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-primary">
        {/* Video Area */}
        <div className="aspect-video relative group">
          <img 
            src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80" 
            className="w-full h-full object-cover opacity-80" 
            alt="Piano Lesson"
          />
          
          {/* Flowkey Visualizer Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent">
             <div className="flex justify-center h-full items-end px-4 pb-4 gap-0.5">
               {pianoKeys.map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     height: activeKeys.includes(i) ? '100%' : '60%',
                     backgroundColor: activeKeys.includes(i) ? '#fdb913' : '#ffffff' 
                   }}
                   className="flex-1 rounded-t-sm transition-all duration-150"
                 />
               ))}
             </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 bg-secondary text-primary rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-primary" /> : <Play className="w-8 h-8 fill-primary ml-1" />}
            </button>
          </div>
        </div>

        {/* Player Controls */}
        <div className="bg-primary p-6 text-white">
          <div className="flex flex-col gap-4">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group relative">
               <div className="absolute h-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
               <div className="absolute h-4 w-4 bg-white rounded-full -top-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${progress}%` }} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-secondary transition-colors">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button className="hover:text-secondary transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  <div className="w-20 h-1 bg-white/20 rounded-full"><div className="w-3/4 h-full bg-white" /></div>
                </div>
                <span className="text-xs font-bold font-mono">12:45 / 35:00</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Tuner Toggle */}
                <button 
                  onClick={() => setIsTunerOpen(!isTunerOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${isTunerOpen ? 'bg-secondary text-primary border-secondary' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}
                >
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tuner</span>
                </button>

                {/* Metronome Tool */}
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => setMetronomeOn(!metronomeOn)}
                    className={`p-1.5 rounded-lg transition-colors ${metronomeOn ? 'bg-secondary text-primary' : 'hover:bg-white/20'}`}
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center min-w-[32px]">
                    <span className="text-[10px] font-black">{bpm}</span>
                    <span className="text-[8px] opacity-60">BPM</span>
                  </div>
                  <input 
                    type="range" 
                    min="40" 
                    max="220" 
                    value={bpm} 
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-16 h-1 accent-secondary bg-white/20 rounded-full appearance-none"
                  />
                  <div className="flex gap-1 ml-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          metronomeOn && beat === i ? 'bg-secondary scale-125' : 'bg-white/20'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Key Tracking
                </div>
                <button className="hover:text-secondary transition-colors"><Settings className="w-5 h-5" /></button>
                <button className="hover:text-secondary transition-colors"><Maximize className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Tuner Overlay Panel */}
        <AnimatePresence>
          {isTunerOpen && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute top-6 right-6 bottom-32 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 z-20 flex flex-col items-center justify-center gap-8"
            >
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Instrument Tuner</p>
                <p className="text-6xl font-black text-secondary">{tunerNote}</p>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full relative overflow-hidden">
                <motion.div 
                  animate={{ x: `${50 + tunerCents}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-secondary shadow-[0_0_10px_rgba(253,185,19,1)]"
                />
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/50" />
              </div>

              <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-widest text-white/50">
                <span>Flat</span>
                <span className={Math.abs(tunerCents) < 5 ? 'text-green-500' : 'text-white/50'}>Perfect</span>
                <span>Sharp</span>
              </div>

              <button 
                onClick={() => setIsTunerOpen(false)}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Close Tuner
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight">Level 2: Major Scale Mastery</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-secondary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Assignment Due</span>
              </div>
            </div>
            <p className="text-muted-foreground font-medium leading-relaxed">
              In this session, Teacher Thapelo breaks down the fingering patterns for the G Major scale. 
              Watch the keyboard visualizer carefully to match your hand position to the highlighted keys.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsSubmissionOpen(true)}
                className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Submit Rehearsal <Video className="w-4 h-4" />
              </button>
              <button className="flex-1 py-4 bg-muted text-primary border border-border rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all">
                Download Resources
              </button>
            </div>
          </div>

          {/* Video Feedback Section */}
          <div className="bg-white border border-border rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-black tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Instructor Feedback
              </h4>
              <div className="flex items-center gap-1 text-secondary">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-secondary" />)}
                <span className="ml-2 text-xs font-black text-primary">5.0 Mastery</span>
              </div>
            </div>

            <div className="space-y-4">
              {instructorFeedback.map((feedback, i) => (
                <div key={i} className="group relative flex gap-6 p-6 rounded-3xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="flex flex-col items-center">
                    <span className="px-2 py-1 bg-primary text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer hover:bg-secondary hover:text-primary transition-colors">
                      {feedback.timestamp}
                    </span>
                    <div className="w-px flex-1 bg-border my-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${feedback.type === 'positive' ? 'text-green-600' : 'text-amber-600'}`}>
                        {feedback.type === 'positive' ? 'Great Work' : 'Refinement Needed'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                      {feedback.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Instructor" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black">Neo Sebego <span className="text-muted-foreground font-bold ml-2">Head Instructor</span></p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5 italic">"Your progress is impressive. Keep focusing on the wrist rotation."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-border rounded-[2rem] p-6 space-y-6">
            <div className="flex items-center gap-2 px-2">
              <List className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-black uppercase tracking-widest">Level 2 Curriculum</h4>
            </div>
            <div className="space-y-2">
              {[
                { title: 'Intro to Major Scales', time: '12:45', status: 'completed' },
                { title: 'C Major: Foundation', time: '15:20', status: 'completed' },
                { title: 'G Major: Key Visualizer', time: '35:00', status: 'active' },
                { title: 'D Major: Fingerings', time: '22:15', status: 'locked' },
                { title: 'Level 2 Assignment', time: 'Manual', status: 'locked' },
              ].map((lesson, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    lesson.status === 'active' ? 'bg-primary text-white shadow-lg' : 
                    lesson.status === 'completed' ? 'hover:bg-muted opacity-60' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black">{i + 1}</span>
                    <span className="text-xs font-bold text-left">{lesson.title}</span>
                  </div>
                  <span className="text-[10px] font-mono">{lesson.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-secondary rounded-[2rem] text-primary relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black text-xl mb-2">Practice Tools</h4>
              <p className="text-xs font-bold opacity-80 mb-6">Use the tuner for your Segaba or Setinkane before starting.</p>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsTunerOpen(true)}
                  className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                >
                  <Activity className="w-4 h-4" /> Open Tuner
                </button>
                <button className="w-full py-3 bg-white/20 hover:bg-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                  <Music className="w-4 h-4" /> Sheet Music
                </button>
              </div>
            </div>
            <Crown className="w-32 h-32 absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Video Submission Portal Modal */}
      <AnimatePresence>
        {isSubmissionOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmissionOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="bg-primary p-8 text-white">
                <h2 className="text-3xl font-black tracking-tight mb-2">Submit Assignment</h2>
                <p className="text-white/70 font-medium">Record or upload your rehearsal for Level 2 Mastery</p>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <button className="p-8 border-2 border-dashed border-border rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Video className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-black uppercase tracking-widest text-[10px]">Record Now</p>
                      <p className="text-xs text-muted-foreground mt-1">Use your webcam</p>
                    </div>
                  </button>
                  <button className="p-8 border-2 border-dashed border-border rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-black uppercase tracking-widest text-[10px]">Upload File</p>
                      <p className="text-xs text-muted-foreground mt-1">MP4, MOV up to 500MB</p>
                    </div>
                  </button>
                </div>

                <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Submission Checklist</h4>
                   <div className="space-y-3">
                     {[
                       'Hands are clearly visible',
                       'Audio is clear and distortion-free',
                       'Both hands used for the scale',
                       'Tempo set to at least 80 BPM'
                     ].map((item, i) => (
                       <div key={i} className="flex items-center gap-3 bg-muted/50 p-4 rounded-2xl border border-border/50">
                         <CheckCircle2 className="w-4 h-4 text-primary" />
                         <span className="text-xs font-bold">{item}</span>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsSubmissionOpen(false)}
                    className="flex-1 py-4 text-muted-foreground font-black uppercase tracking-widest text-xs hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      toast.success("Assignment Submitted!", { description: "Your instructor will review it within 24 hours." });
                      setIsSubmissionOpen(false);
                    }}
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
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
