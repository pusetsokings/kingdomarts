import React, { useState } from 'react';
import { 
  Upload, Music, FileText, Video, Play, 
  CheckCircle2, Plus, Info, Layers, 
  BarChart, Globe, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const InstructorUpload = () => {
  const [step, setStep] = useState(1);
  const [instrument, setInstrument] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [category, setCategory] = useState<'course' | 'practice'>('course');

  const instruments = ['Piano', 'Guitar', 'Setinkane', 'Segaba', 'Vocals', 'Violin', 'Drums'];
  const levels = ['Beginner', 'Intermediate', 'Professional'];

  const handleUpload = () => {
    toast.success("Lesson Uploaded Successfully", {
      description: `Your ${level} ${instrument} lesson is now in the approval queue.`,
    });
    setStep(1);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-primary">Content Creator Studio</h1>
          <p className="text-muted-foreground font-medium">Upload new lessons, practice sessions, and theoretical notes.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl border border-border">
          <button 
            onClick={() => setCategory('course')}
            className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${category === 'course' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}
          >
            Full Course
          </button>
          <button 
            onClick={() => setCategory('practice')}
            className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${category === 'practice' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}
          >
            Practice Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-[2.5rem] p-8 lg:p-10 shadow-sm space-y-8">
            {/* Step 1: Instrument & Level */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary font-black text-xs">1</div>
                <h3 className="text-xl font-black">Instrument & Expertise</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Select Instrument</label>
                  <select 
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Choose instrument...</option>
                    {instruments.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Target Level</label>
                  <div className="flex bg-muted/50 p-1 rounded-2xl border border-border">
                    {levels.map(l => (
                      <button 
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${level === l ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Media Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary font-black text-xs">2</div>
                <h3 className="text-xl font-black">Video & Lesson Media</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer bg-muted/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Video className="w-8 h-8" />
                  </div>
                  <p className="font-black text-sm mb-1">Upload Video Lesson</p>
                  <p className="text-[10px] text-muted-foreground font-medium">MP4, MOV up to 2GB</p>
                </div>
                <div className="border-2 border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all cursor-pointer bg-muted/20">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="font-black text-sm mb-1">Lesson Notes (PDF/MD)</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Theory & summaries</p>
                </div>
              </div>
            </div>

            {/* Step 3: Lesson Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary font-black text-xs">3</div>
                <h3 className="text-xl font-black">Theory & Summary</h3>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Lesson Title (e.g. Traditional Setinkane Rhythms)" 
                  className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea 
                  rows={4}
                  placeholder="Summarize the core theory or notes for this lesson. These will appear below the video for the student."
                  className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>

            <button 
              onClick={handleUpload}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3"
            >
              <Upload className="w-5 h-5" /> Publish to Academy Queue
            </button>
          </div>
        </div>

        {/* Right: Info & Stats */}
        <div className="space-y-8">
          <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Creator Tips
              </h4>
              <ul className="space-y-4">
                {[
                  "Ensure lighting highlights finger placement.",
                  "Summaries should be 200 words max.",
                  "Use clear, slow demonstrations for Practice sessions.",
                  "Level 5+ requires AI MIDI file generation."
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-xs font-medium text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <Globe className="w-32 h-32 absolute -bottom-8 -right-8 opacity-10" />
          </div>

          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Your Contributions</h4>
            <div className="space-y-6">
              {[
                { title: 'Gaborone Jazz Chords', type: 'Course', date: '2 days ago', status: 'Live' },
                { title: 'Morning Scale Drill', type: 'Practice', date: '1 week ago', status: 'Live' },
                { title: 'Polyrhythm Intro', type: 'Course', date: 'New', status: 'Pending' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div>
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.type} • {item.date}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${item.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-colors">
              View All Content
            </button>
          </div>

          <div className="p-8 bg-secondary rounded-[2.5rem] text-primary">
            <div className="flex items-center gap-4 mb-4">
               <Info className="w-6 h-6" />
               <h4 className="text-sm font-black uppercase tracking-widest">Need Help?</h4>
            </div>
            <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">
              Our royal support team is available at Thusanyo House if you need professional filming equipment.
            </p>
            <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Book Studio</button>
          </div>
        </div>
      </div>
    </div>
  );
};
