import React, { useState, useRef } from 'react';
import {
  Upload, Music, FileText, Video, Play,
  CheckCircle2, Plus, Info, Globe, Sparkles,
  X, Clock, ChevronRight, AlertCircle, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';
import { useCourses } from '@/app/stores/useCourseStore';

const INSTRUMENTS = [
  'Saxophone', 'Piano', 'Guitar', 'Trumpet', 'Recorder',
  'Violin', 'Drums', 'Voice', 'Flute', 'Setinkane', 'Segaba',
  'Music Production', 'Bass Guitar',
];

const GENRES = [
  'Classical', 'Jazz', 'Afrobeat', 'Gospel & Worship',
  'Folk & Acoustic', 'Blues & R&B', 'Traditional Botswana', 'Pop',
];

const LEVEL_OPTIONS: { label: string; value: 'Beginner' | 'Intermediate' | 'Advanced' }[] = [
  { label: 'Beg.', value: 'Beginner' },
  { label: 'Inter.', value: 'Intermediate' },
  { label: 'Adv.', value: 'Advanced' },
];

const PRICE_BY_LEVEL: Record<string, string> = {
  Beginner: 'P450',
  Intermediate: 'P750',
  Advanced: 'P1,100',
};

// Thumbnails for each instrument
const THUMBNAILS: Record<string, string> = {
  Saxophone: 'https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=400&h=250&fit=crop',
  Piano: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=250&fit=crop',
  Guitar: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=250&fit=crop',
  Trumpet: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=250&fit=crop',
  Recorder: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=250&fit=crop',
  Violin: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=250&fit=crop',
  Drums: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=250&fit=crop',
};

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const InstructorUpload = () => {
  const { state: authState } = useAuth();
  const { state: courseState, dispatch: courseDispatch } = useCourses();
  const user = authState.user;

  // Form state
  const [category, setCategory] = useState<'course' | 'practice'>('course');
  const [title, setTitle] = useState('');
  const [instrument, setInstrument] = useState(user.instrument || '');
  const [genre, setGenre] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [description, setDescription] = useState('');
  const [theoryContent, setTheoryContent] = useState('');
  const [price, setPrice] = useState(PRICE_BY_LEVEL.Beginner);

  // File state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLInputElement>(null);

  // Instructor's own contributions (pending + approved from store)
  const myApproved = courseState.courses.filter(c => c.instructorId === user.id);
  const myPending = courseState.pendingCourses.filter(c => c.instructorId === user.id);
  const myAll = [...myPending, ...myApproved];

  const handleLevelChange = (v: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setLevel(v);
    setPrice(PRICE_BY_LEVEL[v]);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > maxSize) {
      toast.error('File too large', { description: 'Maximum video size is 2GB.' });
      return;
    }
    setVideoFile(file);
    toast.success('Video selected', { description: `${file.name} (${formatBytes(file.size)})` });
  };

  const handleNotesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNotesFile(file);
    toast.success('Notes selected', { description: file.name });
  };

  const validate = () => {
    if (!title.trim()) { toast.error('Please enter a lesson title'); return false; }
    if (!instrument) { toast.error('Please select an instrument'); return false; }
    if (!genre) { toast.error('Please select a genre'); return false; }
    if (!description.trim()) { toast.error('Please write a lesson description'); return false; }
    return true;
  };

  const handlePublish = async () => {
    if (!validate()) return;

    setIsUploading(true);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 80));
      setUploadProgress(i);
    }

    const newCourse = {
      id: `upload-${Date.now()}`,
      title: title.trim(),
      instrument,
      genre,
      instructor: user.name,
      instructorId: user.id,
      instructorAvatar: user.avatar,
      level,
      duration: category === 'practice' ? '~30 min' : '4 weeks',
      students: 0,
      rating: 0,
      price,
      thumbnail: THUMBNAILS[instrument] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
      description: description.trim(),
      lessons: [
        {
          id: 'l1',
          title: title.trim(),
          duration: videoFile ? '—' : '—',
          status: 'active' as const,
          videoUrl: '',
          theoryContent: theoryContent.trim() || description.trim(),
        },
      ],
      tags: [instrument.toLowerCase(), genre.toLowerCase(), level.toLowerCase()],
      status: 'pending' as const,
      uploadedAt: new Date().toISOString(),
      videoFileName: videoFile?.name,
      notesFileName: notesFile?.name,
    };

    courseDispatch({ type: 'ADD_PENDING_COURSE', course: newCourse });

    setIsUploading(false);
    setUploadProgress(0);
    toast.success('Submitted to Approval Queue', {
      description: `"${title}" is pending review by the academy admin.`,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTheoryContent('');
    setVideoFile(null);
    setNotesFile(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (notesInputRef.current) notesInputRef.current.value = '';
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-primary">Content Creator Studio</h1>
          <p className="text-muted-foreground font-medium">
            Upload new lessons, practice sessions, and theoretical notes for your students.
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl border border-border shrink-0">
          <button
            onClick={() => setCategory('course')}
            className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${category === 'course' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}
          >
            Full Course
          </button>
          <button
            onClick={() => setCategory('practice')}
            className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${category === 'practice' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}
          >
            Practice Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Upload Form ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-[2.5rem] p-8 lg:p-10 shadow-sm space-y-8">

            {/* Step 1 — Instrument, Genre & Level */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary font-black text-xs">1</div>
                <h3 className="text-xl font-black">Instrument & Target Level</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Instrument */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    Choose Instrument
                  </label>
                  <select
                    value={instrument}
                    onChange={e => setInstrument(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Select instrument…</option>
                    {INSTRUMENTS.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    Genre / Style
                  </label>
                  <select
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Select genre…</option>
                    {GENRES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Level Toggle — short labels to prevent overflow */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                  Target Level
                </label>
                <div className="flex bg-muted/50 p-1 rounded-2xl border border-border gap-1">
                  {LEVEL_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleLevelChange(opt.value)}
                      title={opt.value}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
                        level === opt.value ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-medium text-muted-foreground px-1">
                  Selected: <span className="font-black text-primary">{level}</span> · Suggested price: <span className="font-black text-primary">{PRICE_BY_LEVEL[level]}</span>
                </p>
              </div>

              {/* Price override */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                  Price (Botswana Pula)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary">P</span>
                  <input
                    type="text"
                    value={price.replace('P', '')}
                    onChange={e => setPrice('P' + e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-2xl pl-9 pr-5 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="750"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 — Media Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary font-black text-xs">2</div>
                <h3 className="text-xl font-black">Video & Lesson Notes</h3>
              </div>

              {/* Hidden file inputs */}
              <input ref={videoInputRef} type="file" accept="video/mp4,video/mov,video/quicktime,video/*" className="hidden" onChange={handleVideoSelect} />
              <input ref={notesInputRef} type="file" accept=".pdf,.md,.txt,.docx" className="hidden" onChange={handleNotesSelect} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Video upload */}
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all ${videoFile ? 'border-green-400 bg-green-50/30' : 'border-border bg-muted/20'}`}
                >
                  {videoFile ? (
                    <>
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-3">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <p className="font-black text-sm text-green-700 mb-1">Video Ready</p>
                      <p className="text-[10px] text-green-600 font-medium break-all px-2">{videoFile.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1">{formatBytes(videoFile.size)}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                        <Video className="w-7 h-7" />
                      </div>
                      <p className="font-black text-sm mb-1">Upload Video Lesson</p>
                      <p className="text-[10px] text-muted-foreground font-medium">MP4, MOV up to 2GB</p>
                      <p className="text-[10px] text-primary font-black mt-2">Click to browse</p>
                    </>
                  )}
                </button>

                {/* Notes upload */}
                <button
                  type="button"
                  onClick={() => notesInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all ${notesFile ? 'border-green-400 bg-green-50/30' : 'border-border bg-muted/20'}`}
                >
                  {notesFile ? (
                    <>
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-3">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <p className="font-black text-sm text-green-700 mb-1">Notes Attached</p>
                      <p className="text-[10px] text-green-600 font-medium break-all px-2">{notesFile.name}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary mb-3 group-hover:scale-110 transition-transform">
                        <FileText className="w-7 h-7" />
                      </div>
                      <p className="font-black text-sm mb-1">Lesson Notes (PDF/MD)</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Theory & student summaries</p>
                      <p className="text-[10px] text-primary font-black mt-2">Click to browse</p>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 3 — Title, Description, Theory */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-primary font-black text-xs">3</div>
                <h3 className="text-xl font-black">Lesson Details & Theory</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={`e.g. ${instrument || 'Saxophone'} Foundations — Lesson 1`}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    Course Description *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What will students learn in this course? What level should they be at to start?"
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                    Theory Notes (shown below video to students)
                  </label>
                  <textarea
                    rows={4}
                    value={theoryContent}
                    onChange={e => setTheoryContent(e.target.value)}
                    placeholder="Summarize the core theory or notes for this lesson. Use bullet points or structured text. Max 500 words."
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                  <p className="text-[10px] text-muted-foreground px-1">{theoryContent.length} / 2000 chars</p>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-primary">Uploading to Academy Queue…</span>
                    <span className="text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isUploading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {isUploading ? 'Publishing…' : 'Publish to Academy Queue'}
            </button>

            <p className="text-center text-[10px] text-muted-foreground font-medium">
              Your lesson will be reviewed by the Academy admin before going live to students.
            </p>
          </div>
        </div>

        {/* ── Right: Contributions + Tips ──────────────────────────── */}
        <div className="space-y-8">
          {/* Tips */}
          <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Creator Tips
              </h4>
              <ul className="space-y-4">
                {[
                  'Lighting should highlight finger placement clearly.',
                  'Theory notes should be under 200 words per lesson.',
                  'Slow demonstrations are more effective for beginners.',
                  'Level 5+ requires AI MIDI file or backing track.',
                  'Always tune before recording — A440Hz standard.',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-xs font-medium text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <Globe className="w-32 h-32 absolute -bottom-8 -right-8 opacity-10" />
          </div>

          {/* Your Contributions */}
          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">
              Your Contributions ({myAll.length})
            </h4>

            {myAll.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                  <Music className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-bold text-muted-foreground">No lessons published yet</p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Use the form to submit your first lesson to the academy.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {myAll.map((item, i) => (
                  <div key={item.id} className="flex items-center justify-between group cursor-pointer hover:bg-muted/30 p-3 rounded-2xl transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors truncate">{item.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {item.instrument} · {item.level} · {item.uploadedAt
                          ? new Date(item.uploadedAt).toLocaleDateString('en-BW', { day: 'numeric', month: 'short' })
                          : 'Built-in'}
                      </p>
                    </div>
                    <span className={`ml-3 shrink-0 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase ${
                      item.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'approved' ? 'Live' : item.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button className="w-full mt-6 py-4 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
              View All Content <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Studio Help */}
          <div className="p-8 bg-secondary rounded-[2.5rem] text-primary">
            <div className="flex items-center gap-4 mb-4">
              <Info className="w-6 h-6" />
              <h4 className="text-sm font-black uppercase tracking-widest">Need Help?</h4>
            </div>
            <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">
              Our royal support team is available at Thusanyo House if you need professional filming equipment or studio booking.
            </p>
            <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
              Book Studio Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
