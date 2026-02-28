import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Sidebar, UserRole } from '@/app/components/Sidebar';
import { CourseCard } from '@/app/components/CourseCard';
import { LessonPlayer } from '@/app/components/LessonPlayer';
import { StudentShowcase } from '@/app/components/StudentShowcase';
import { RegistrationModal } from '@/app/components/RegistrationModal';
import { PaymentModal } from '@/app/components/PaymentModal';
import { Profile } from '@/app/components/Profile';
import { InstructorMap } from '@/app/components/InstructorMap';
import { LiveSchedule } from '@/app/components/LiveSchedule';
import { Community } from '@/app/components/Community';
import { Achievements, Settings, Support } from '@/app/components/MiscViews';
import { MusicScanner } from '@/app/components/MusicScanner';
import { VirtualStage } from '@/app/components/VirtualStage';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { InstructorDashboard } from '@/app/components/InstructorDashboard';
import { UserManagement } from '@/app/components/UserManagement';
import { Messaging } from '@/app/components/Messaging';
import { GroupClass } from '@/app/components/GroupClass';
import { ApprovalsQueue } from '@/app/components/ApprovalsQueue';
import { InstructorUpload } from '@/app/components/InstructorUpload';
import { CourseMaterialView } from '@/app/components/CourseMaterialView';
import { GradingRubrics, RecordingGuide, RoyaltyStatements } from '@/app/components/AcademySupport';
import { ModernCoursesCatalog } from '@/app/components/ModernCoursesCatalog';
import { HallOfFame } from '@/app/components/HallOfFame';
import { 
  PlayCircle, Users, ArrowRight, Music, Sparkles, 
  Search, Filter, Crown as CrownIcon, BellRing, 
  Trophy, MessageCircle, Brain, Tv, ChevronDown, 
  ShieldCheck, UserCheck, Eye, Layout, Upload, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

type View = 
  | 'home' 
  | 'courses' 
  | 'instructors' 
  | 'community' 
  | 'profile' 
  | 'schedule' 
  | 'settings' 
  | 'help' 
  | 'achievements' 
  | 'scanner' 
  | 'stage' 
  | 'admin-dash' 
  | 'instructor-dash' 
  | 'feedback-review'
  | 'users-manage'
  | 'messages'
  | 'ensemble'
  | 'content-approve'
  | 'upload-lesson'
  | 'course-detail'
  | 'rubrics'
  | 'upload-guide'
  | 'royalties'
  | 'hall-of-fame';

const App = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCourseData, setSelectedCourseData] = useState<{instrument: string, genre: string, instructor: string} | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({ title: '', price: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const handleEnrollClick = (title: string, instrument: string, genre: string, instructor: string) => {
    if (role === 'guest') {
      toast.error("Account Required", { description: "Please register to enroll in masterclasses." });
      setIsAuthOpen(true);
      return;
    }
    setSelectedCourseData({ instrument, genre, instructor });
    setCurrentView('course-detail');
    toast.success(`Accessing ${title}`, {
      description: `Loading your ${instrument} ${genre} learning path...`,
    });
  };

  const handleNavigate = (v: any) => {
    setCurrentView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsRoleMenuOpen(false);
    toast.info(`Switched to ${newRole.toUpperCase()} View`, {
      description: `Navigation and permissions updated for ${newRole}.`,
      icon: <Layout className="w-4 h-4" />
    });
    
    if (newRole === 'admin') setCurrentView('admin-dash');
    else if (newRole === 'instructor') setCurrentView('instructor-dash');
    else setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'hall-of-fame':
        return <HallOfFame />;
      case 'courses':
        return <ModernCoursesCatalog onEnroll={handleEnrollClick} />;
      case 'rubrics':
        return <GradingRubrics />;
      case 'upload-guide':
        return <RecordingGuide role={role} />;
      case 'royalties':
        return role === 'instructor' || role === 'admin' ? <RoyaltyStatements /> : <div className="p-20 text-center font-black">Access Denied</div>;
      case 'course-detail':
        return (
          <CourseMaterialView 
            instrument={selectedCourseData?.instrument || "Piano"} 
            genre={selectedCourseData?.genre || "Classical & Contemporary"} 
            instructor={selectedCourseData?.instructor || "Blessing Moyo"}
            onBack={() => setCurrentView('courses')}
            role={role}
          />
        );
      case 'admin-dash':
        return role === 'admin' ? <AdminDashboard /> : <div className="p-20 text-center font-black">Access Denied</div>;
      case 'users-manage':
        return role === 'admin' ? <UserManagement /> : <div className="p-20 text-center font-black">Access Denied</div>;
      case 'content-approve':
        return role === 'admin' ? <ApprovalsQueue /> : <div className="p-20 text-center font-black">Access Denied</div>;
      case 'instructor-dash':
      case 'feedback-review':
        return role === 'instructor' ? <InstructorDashboard /> : <div className="p-20 text-center font-black">Access Denied</div>;
      case 'upload-lesson':
        return role === 'instructor' ? <InstructorUpload /> : <div className="p-20 text-center font-black">Access Denied</div>;
      case 'messages':
        return <Messaging />;
      case 'ensemble':
        return <GroupClass />;
      case 'profile':
        return <Profile />;
      case 'instructors':
        return <InstructorMap />;
      case 'schedule':
        return <LiveSchedule />;
      case 'community':
        return <Community />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Support />;
      case 'scanner':
        return <div className="p-6 lg:p-10 max-w-4xl mx-auto"><MusicScanner /></div>;
      case 'stage':
        return <VirtualStage />;
      case 'home':
      default:
        if (role === 'guest') {
           return (
             <div className="p-6 lg:p-10 space-y-16">
               <div className="bg-primary p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                  <div className="max-w-md relative z-10">
                    <div className="flex items-center gap-2 text-secondary mb-4">
                       <Sparkles className="w-5 h-5 fill-current" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Guest Artist Access</span>
                    </div>
                    <h2 className="text-4xl font-black mb-4 leading-tight">Welcome to the Kingdom Arts Experience</h2>
                    <p className="text-white/70 font-medium mb-8">As an invited guest, you can explore our elite faculty, join live community practices, and watch masterclass recitals on the Virtual Stage.</p>
                    <div className="flex flex-wrap gap-4">
                       <button onClick={() => setIsAuthOpen(true)} className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl shadow-xl">Join Full Academy</button>
                       <button onClick={() => handleNavigate('instructors')} className="bg-white/10 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl border border-white/20 backdrop-blur-md">Meet Teachers</button>
                    </div>
                  </div>
                  <Globe className="absolute -bottom-10 -right-10 w-80 h-80 opacity-10" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white border-4 border-primary/10 p-10 rounded-[2.5rem] space-y-6">
                     <Users className="w-12 h-12 text-primary" />
                     <h3 className="text-2xl font-black">Live Practices & Duets</h3>
                     <p className="text-muted-foreground text-sm font-medium">Guests are invited to shadow live practice sessions and observe professional duets in our community hub.</p>
                     <button onClick={() => handleNavigate('community')} className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group">Go to Community <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></button>
                  </div>
                  <div className="bg-secondary p-10 rounded-[2.5rem] space-y-6 border-4 border-primary">
                     <Tv className="w-12 h-12 text-primary" />
                     <h3 className="text-2xl font-black text-primary">Masterclass Recitals</h3>
                     <p className="text-primary/70 text-sm font-medium">Witness the growth of our level 1-10 students as they perform on the Virtual Stage for international audiences.</p>
                     <button onClick={() => handleNavigate('stage')} className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg">Watch Now</button>
                  </div>
               </div>
               <StudentShowcase />
             </div>
           );
        }
        return (
          <>
            <section className="relative overflow-hidden bg-primary p-8 lg:p-16 text-white">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl">
                  <Sparkles className="w-3 h-3 fill-primary" />
                  Botswana's Premier Music Hub
                </div>
                <h1 className="text-4xl lg:text-5xl font-black leading-[1.2] mb-6 tracking-tight">
                  A fun, engaging, and <span className="text-secondary">enriching musical education</span> to learners of all ages
                </h1>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => handleNavigate('courses')} className="bg-secondary text-primary font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full shadow-xl">
                    Explore Courses
                  </button>
                  <button onClick={() => handleNavigate('messages')} className="bg-white/10 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full border border-white/20">
                    My Messages
                  </button>
                </div>
              </div>
            </section>

            <div className="p-6 lg:p-10 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.button whileHover={{ y: -5 }} onClick={() => handleNavigate('ensemble')} className="bg-secondary p-10 rounded-[2.5rem] text-left text-primary border-4 border-primary shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <Users className="w-10 h-10 text-primary mb-6" />
                    <h3 className="text-2xl font-black mb-2">Live Ensemble</h3>
                    <p className="text-primary/70 font-medium text-xs">Join a group rehearsal now.</p>
                  </div>
                </motion.button>
                <motion.button whileHover={{ y: -5 }} onClick={() => handleNavigate('stage')} className="bg-primary p-10 rounded-[2.5rem] text-left text-white border-4 border-secondary shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <Tv className="w-10 h-10 text-secondary mb-6" />
                    <h3 className="text-2xl font-black mb-2">Virtual Stage</h3>
                    <p className="text-white/70 font-medium text-xs">Watch monthly recitals.</p>
                  </div>
                </motion.button>
                <motion.button whileHover={{ y: -5 }} onClick={() => handleNavigate('scanner')} className="bg-white p-10 rounded-[2.5rem] text-left text-primary border-4 border-primary shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <Brain className="w-10 h-10 text-primary mb-6" />
                    <h3 className="text-2xl font-black mb-2">AI Scanner</h3>
                    <p className="text-primary/70 font-medium text-xs">Convert sheets to MIDI.</p>
                  </div>
                </motion.button>
              </div>
              <LessonPlayer />
              <StudentShowcase />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary font-sans">
      <Toaster richColors position="bottom-right" />
      
      <div className="fixed bottom-6 right-6 z-[120]">
        <div className="relative">
          <button onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)} className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-full shadow-2xl border-2 border-secondary hover:scale-105 transition-transform font-black text-xs uppercase tracking-widest">
            {role === 'admin' ? <ShieldCheck className="w-4 h-4 text-secondary" /> : <UserCheck className="w-4 h-4 text-secondary" />}
            View As: {role}
            <ChevronDown className={`w-4 h-4 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isRoleMenuOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full right-0 mb-4 w-56 bg-white border border-border rounded-3xl shadow-2xl overflow-hidden p-2">
                {(['student', 'guest', 'instructor', 'admin'] as UserRole[]).map((r) => (
                  <button key={r} onClick={() => handleRoleChange(r)} className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors ${role === r ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}>
                    {r} View
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Navbar onOpenAuth={() => setIsAuthOpen(true)} onNavigate={handleNavigate} currentView={currentView} />
      
      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} role={role} />
        
        <main className="flex-1 min-w-0 pb-20">
          <AnimatePresence mode="wait">
            <motion.div key={currentView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
