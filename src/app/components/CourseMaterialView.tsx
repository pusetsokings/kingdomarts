import React, { useState } from 'react';
import { 
  Play, BookOpen, FileText, CheckCircle, 
  ChevronRight, Lock, Clock, Star, 
  Video, Music, Award, Download,
  MessageCircle, Send, Plus, PlayCircle,
  Repeat, Settings, ArrowLeft, Layers,
  Trophy, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { PianoPlayer, Metronome, PracticeDrills, ExpertInstruction } from '@/app/components/PracticeTools';

interface CourseMaterialViewProps {
  instrument?: string;
  genre?: string;
  instructor?: string;
  onBack?: () => void;
  role?: string;
}

export const CourseMaterialView = ({ 
  instrument = "Piano", 
  genre = "Classical & Contemporary",
  instructor = "Neo Sebego",
  onBack,
  role = "student"
}: CourseMaterialViewProps) => {
  const [activeTab, setActiveTab] = useState<'course' | 'practice' | 'assignments'>('course');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'pro'>('beginner');
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [isViewingCourse, setIsViewingCourse] = useState(true);

  if (!isViewingCourse && onBack) {
    onBack();
    return null;
  }

  const isTraditional = genre.includes("Traditional") || instrument === "Traditional";

  const courseData = {
    title: `Kingdom ${instrument} Masterclass: ${genre}`,
    instructor: instructor,
    curriculum: isTraditional ? [
      { id: 1, title: `${instrument} History & Oral Traditions`, level: 1, stage: "beginner", duration: "20m", type: "theory", completed: true },
      { id: 2, title: `Tswana Pentatonic Scales & Tuning`, level: 2, stage: "beginner", duration: "35m", type: "video", completed: true },
      { id: 3, title: `Polyrhythmic Patterns in Botswana Music`, level: 3, stage: "beginner", duration: "40m", type: "video", completed: false },
      { id: 4, title: `The Art of ${instrument === "Traditional" ? "Segaba Bowing" : "Rhythmic Accents"}`, level: 4, stage: "intermediate", duration: "50m", type: "video", completed: false },
      { id: 5, title: "Modern Afro-Jazz Fusion Techniques", level: 8, stage: "pro", duration: "1h 15m", type: "video", completed: false },
    ] : [
      { id: 1, title: `${instrument} Anatomy & Proper Posture`, level: 1, stage: "beginner", duration: "15m", type: "theory", completed: true },
      { id: 2, title: `${instrument === "Saxophone" ? "Embouchure & First Tones" : "The 5-Finger Pattern & Major Scales"}`, level: 2, stage: "beginner", duration: "30m", type: "video", completed: true },
      { id: 3, title: `Botswana ${genre.includes("Jazz") ? "Jazz" : "Folk"} Rhythms: Phase I`, level: 3, stage: "beginner", duration: "25m", type: "video", completed: false },
      { id: 4, title: `Introduction to ${instrument === "Saxophone" ? "Overtones" : "Chord Inversions"}`, level: 4, stage: "intermediate", duration: "45m", type: "video", completed: false },
      { id: 5, title: "Advanced Harmonic Progression", level: 8, stage: "pro", duration: "1h 05m", type: "video", completed: false },
    ],
    assignments: [
      { id: 1, title: `Submit Level 1 ${instrument} Technique Video`, deadline: "Feb 15, 2026", status: "Pending" },
      { id: 2, title: `Theory Quiz: ${isTraditional ? "Tswana Music Structures" : (instrument === "Piano" ? "Grand Staff" : "Clef Reading")}`, deadline: "Completed", status: "Graded (A+)" }
    ]
  };

  const getInstructorImage = (name: string) => {
    const images: Record<string, string> = {
      'Blessing Moyo': 'https://images.unsplash.com/photo-1656313836297-0cd072f08f43?auto=format&fit=crop&w=200&q=80',
      'Kopano Molefe': 'https://images.unsplash.com/photo-1606934555462-4c14244d180c?auto=format&fit=crop&w=200&q=80',
      'Akhu Kgosing': 'https://images.unsplash.com/photo-1763215733028-02803292649c?auto=format&fit=crop&w=200&q=80',
      'Mma Tshepo': 'https://images.unsplash.com/photo-1552157194-da6d1320a741?auto=format&fit=crop&w=200&q=80',
      'Rre Molefi': 'https://images.unsplash.com/photo-1634024319238-3f7c736255bc?auto=format&fit=crop&w=200&q=80',
      'Kagiso Tlou': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    };
    return images[name] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';
  };

  const filteredCurriculum = courseData.curriculum.filter(item => item.stage === difficulty);
  const currentLesson = courseData.curriculum.find(l => l.id === selectedLessonId) || courseData.curriculum[0];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Expert Navigation & Difficulty Filter */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                if (onBack) onBack();
                setIsViewingCourse(false);
              }}
              className="p-3 hover:bg-muted rounded-2xl text-primary transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-xl font-black text-primary tracking-tight">{courseData.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                   {difficulty === 'beginner' ? 'Level 1-3' : difficulty === 'intermediate' ? 'Level 4-7' : 'Level 8-10'} Masterclass Path
                 </span>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-muted p-1.5 rounded-2xl border border-border">
            {(['beginner', 'intermediate', 'pro'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setDifficulty(stage)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  difficulty === stage 
                    ? 'bg-primary text-white shadow-xl' 
                    : 'text-muted-foreground hover:bg-white/50'
                }`}
              >
                {stage === 'beginner' && <GraduationCap className="w-3.5 h-3.5" />}
                {stage === 'intermediate' && <Layers className="w-3.5 h-3.5" />}
                {stage === 'pro' && <Trophy className="w-3.5 h-3.5" />}
                {stage}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-10">
        
        {/* Main View Mode Selector */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white p-2 rounded-[2.5rem] shadow-xl border border-border">
            {(['course', 'practice', 'assignments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {tab === 'course' ? 'Full Course Content' : tab === 'practice' ? 'Performance Practice Lab' : 'Assessments & Tasks'}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Instructor Intro (Always visible at top level of content) */}
        <div className="bg-zinc-950 aspect-[21/7] rounded-[3rem] relative overflow-hidden shadow-2xl border-4 border-zinc-900 group">
          <img 
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80" 
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" 
            alt="Instructor Introduction" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-primary shadow-2xl hover:scale-110 transition-transform">
              <PlayCircle className="w-10 h-10 fill-current" />
            </button>
          </div>
          <div className="absolute bottom-10 left-10 flex items-end justify-between right-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl border-2 border-secondary overflow-hidden shadow-2xl">
                <img src={getInstructorImage(courseData.instructor)} className="w-full h-full object-cover" alt={courseData.instructor} />
              </div>
              <div className="text-white">
                <h3 className="text-2xl font-black">{courseData.instructor}</h3>
                <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em]">Master Instructor • Kingdom Arts Academy</p>
              </div>
            </div>
            <div className="hidden md:flex gap-4">
               <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Lessons</p>
                  <p className="text-xl font-black text-white">{courseData.curriculum.length}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Est. Duration</p>
                  <p className="text-xl font-black text-white">12.5 hrs</p>
               </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'course' && (
            <motion.div 
              key="course"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              <div className="lg:col-span-8 space-y-10">
                {/* Lesson Video Portal */}
                <div className="bg-black aspect-video rounded-[2.5rem] relative overflow-hidden shadow-2xl border-2 border-zinc-900">
                   <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
                      <div className="text-center space-y-4">
                         <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                            <Video className="w-8 h-8 text-primary" />
                         </div>
                         <p className="text-white/40 text-sm font-black uppercase tracking-widest">Select a lesson from the curriculum</p>
                      </div>
                   </div>
                   {/* This would be the actual video player */}
                   <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <h4 className="text-white text-xl font-black">Lesson {currentLesson.id}: {currentLesson.title}</h4>
                      <p className="text-white/60 text-xs font-black uppercase tracking-widest mt-1">Level {currentLesson.level} • {currentLesson.duration}</p>
                   </div>
                </div>

                {/* Theoretical Foundation Below Video */}
                <div className="bg-white border border-border rounded-[3rem] p-12 shadow-sm space-y-8">
                   <div className="flex items-center justify-between border-b border-border pb-8">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                            <BookOpen className="w-6 h-6" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-primary">Theoretical Foundation</h3>
                            <p className="text-sm font-medium text-muted-foreground">Detailed notes and concepts for Level {currentLesson.level}</p>
                         </div>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">
                         <Download className="w-4 h-4" /> Download Resources
                      </button>
                   </div>
                   <div className="prose prose-lg prose-p:font-medium prose-p:text-muted-foreground prose-headings:text-primary max-w-none">
                      <p>In this comprehensive lesson, we deconstruct the core mechanics of <strong>{currentLesson.title}</strong>. As an expert, you must transition from mechanical repetition to emotional resonance.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                         <div className="bg-muted/30 p-8 rounded-3xl border border-border">
                            <h5 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                               <CheckCircle className="w-4 h-4" /> Key Learning Objectives
                            </h5>
                            <ul className="space-y-3 text-sm">
                               <li className="flex gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                  Mastery of fingering across two octaves.
                               </li>
                               <li className="flex gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                  Understanding the "Ghost Note" technique in Botswana jazz.
                               </li>
                            </ul>
                         </div>
                         <div className="bg-secondary/5 p-8 rounded-3xl border border-secondary/20">
                            <h5 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                               <Plus className="w-4 h-4" /> Advanced Extension
                            </h5>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                               Try applying the <em>Setinkane-style</em> syncopation to your left hand while maintaining the classical melody in your right.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Curriculum Sidebar (Course Mode Only) */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white border border-border rounded-[3rem] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Expert Curriculum</h3>
                     <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase">{difficulty} Phase</span>
                  </div>
                  <div className="space-y-4">
                    {filteredCurriculum.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`w-full text-left p-6 rounded-3xl transition-all border flex items-center justify-between group ${
                          selectedLessonId === lesson.id 
                            ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/20 scale-[1.03]' 
                            : 'bg-white border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black ${selectedLessonId === lesson.id ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {lesson.level}
                          </div>
                          <div>
                            <p className={`text-sm font-black break-words leading-tight ${selectedLessonId === lesson.id ? 'text-white' : 'text-primary'}`}>{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[8px] font-black uppercase tracking-widest ${selectedLessonId === lesson.id ? 'text-white/60' : 'text-muted-foreground'}`}>{lesson.duration}</span>
                              <span className={`w-1 h-1 rounded-full ${selectedLessonId === lesson.id ? 'bg-white/30' : 'bg-border'}`} />
                              <span className={`text-[8px] font-black uppercase tracking-widest ${selectedLessonId === lesson.id ? 'text-white/60' : 'text-muted-foreground'}`}>{lesson.type}</span>
                            </div>
                          </div>
                        </div>
                        {lesson.completed && <CheckCircle className={`w-5 h-5 ${selectedLessonId === lesson.id ? 'text-secondary' : 'text-green-500'}`} />}
                      </button>
                    ))}
                  </div>
                  <div className="mt-10 p-6 bg-muted rounded-[2rem] space-y-4">
                     <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Student Support</h5>
                     <div className="relative">
                         <input type="text" placeholder={`Direct question to ${courseData.instructor.split(' ')[0]}...`} className="w-full bg-white border border-border rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20" />
                        <button className="absolute right-2 top-1.5 p-1.5 bg-primary text-white rounded-lg hover:bg-secondary hover:text-primary transition-all shadow-md"><Send className="w-3.5 h-3.5" /></button>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'practice' && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Performance Lab Visualizer */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                  <div>
                    <h3 className="text-3xl font-black text-primary tracking-tight">{instrument} Proficiency Lab</h3>
                    <p className="text-sm font-medium text-muted-foreground">Interactive MIDI visualizer for real-time technical analysis.</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="bg-white border border-border px-4 py-2 rounded-2xl flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Device Linked</span>
                     </div>
                     <button className="px-6 py-3 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Calibration
                     </button>
                  </div>
                </div>
                <PianoPlayer instrument={instrument} />
              </div>

              {/* Bottom Grid: Drills & Metronome */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-4 space-y-8">
                    <Metronome />
                 </div>
                 <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <PracticeDrills level={currentLesson.level} />
                       <div className="space-y-8">
                          <ExpertInstruction topic="Wrist Fluidity & Weight" />
                          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Practice Analytics</h4>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                   <span className="font-bold">Tempo Stability</span>
                                   <span className="text-primary font-black">94%</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                   <div className="h-full bg-primary w-[94%]" />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                   <span className="font-bold">Note Accuracy</span>
                                   <span className="text-secondary font-black">88%</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                   <div className="h-full bg-secondary w-[88%]" />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'assignments' && (
            <motion.div 
              key="assignments"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="text-center space-y-4 mb-10">
                 <h3 className="text-4xl font-black text-primary tracking-tight">Performance Assessments</h3>
                 <p className="text-muted-foreground font-medium max-w-xl mx-auto">Upload your technical assessment videos for formal grading and expert feedback from {courseData.instructor}.</p>
              </div>
              {courseData.assignments.map((assignment, i) => (
                <div key={i} className="bg-white border border-border rounded-[2.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm group hover:border-primary transition-all">
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${assignment.status.includes('Graded') ? 'bg-green-100 text-green-600' : 'bg-primary/5 text-primary'}`}>
                      {assignment.status.includes('Graded') ? <Trophy className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-black">{assignment.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">Deadline: {assignment.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-block ${assignment.status.includes('Graded') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-muted text-muted-foreground'}`}>
                          {assignment.status}
                        </span>
                        {assignment.status.includes('Graded') && <p className="text-[10px] font-black text-primary mt-2">View Feedback <ChevronRight className="w-3 h-3 inline" /></p>}
                     </div>
                     <button className="w-14 h-14 bg-primary text-white rounded-2xl hover:bg-secondary hover:text-primary transition-all shadow-xl flex items-center justify-center">
                       <Plus className="w-6 h-6" />
                     </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
