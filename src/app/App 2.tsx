import React, { useState, useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Sidebar, UserRole } from '@/app/components/Sidebar';
import { useAuth } from '@/app/stores/useAuthStore';
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
import { TeacherReviews } from '@/app/components/TeacherReviews';
import { InstructorLessons } from '@/app/components/InstructorLessons';
import { LoginModal } from '@/app/components/LoginModal';
import { AuthModal } from '@/app/components/AuthModal';
import { LiveLessonRoom, type SessionType } from '@/app/components/LiveLessonRoom';
import { supabase, signOut } from '@/lib/supabase';
import { useLiveStream, getLiveChannel } from '@/app/stores/useLiveStreamStore';
import {
  PlayCircle, Users, ArrowRight, Music, Sparkles,
  Trophy, MessageCircle, Brain, Tv,
  ShieldCheck, Eye, Upload, Globe,
  Radio, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { GlobalPlayer } from '@/app/components/GlobalPlayer';

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
  | 'instructor-lessons'
  | 'teacher-reviews'
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

const VALID_VIEWS = new Set(['home','courses','instructors','community','profile','schedule','settings','help','achievements','scanner','stage','admin-dash','instructor-dash','feedback-review','instructor-lessons','teacher-reviews','users-manage','messages','ensemble','content-approve','upload-lesson','course-detail','rubrics','upload-guide','royalties','hall-of-fame']);

function getViewFromHash(): View {
  const hash = window.location.hash.replace('#', '').replace('/', '') as View;
  return VALID_VIEWS.has(hash) ? hash : 'home';
}

// ── Access Denied ─────────────────────────────────────────────────────────────
function AccessDenied({ requiredRole }: { requiredRole?: string }) {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center">
        <ShieldCheck className="w-12 h-12 text-primary/30" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h2 className="text-2xl font-black text-primary">Access Restricted</h2>
        <p className="text-muted-foreground font-medium">
          {requiredRole
            ? `This section is only accessible to ${requiredRole} accounts.`
            : 'You do not have permission to view this page.'}
        </p>
      </div>
      <div className="flex items-center gap-2 px-5 py-3 bg-muted rounded-2xl border border-border text-xs font-bold text-muted-foreground">
        <Eye className="w-4 h-4" />
        Use the "View As" switcher to change your role.
      </div>
    </div>
  );
}

// ── Live Invite Banner ────────────────────────────────────────────────────────
function LiveInviteBanner() {
  const { state: lsState, dispatch: lsDispatch } = useLiveStream();
  const invite = lsState.pendingInvite;
  const channel = getLiveChannel();

  if (!invite) return null;

  const handleJoin = () => {
    lsDispatch({ type: 'JOIN_SESSION', sessionId: invite.sessionId });
    // Notify instructor tab that student joined
    channel.postMessage({
      type: 'STUDENT_JOINED',
      studentId: 'stu-current',
      studentName: 'You',
      sessionId: invite.sessionId,
    });
    toast.success(`Joined live session!`, {
      description: `You are now in ${invite.courseTitle} with ${invite.instructorName}`,
    });
  };

  const handleDismiss = () => {
    lsDispatch({ type: 'DISMISS_INVITE' });
  };

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed top-0 left-0 right-0 z-[500] bg-red-600 text-white shadow-2xl"
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Lesson</span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={invite.instructorAvatar}
              alt={invite.instructorName}
              className="w-8 h-8 rounded-full border-2 border-white/50 object-cover"
            />
            <div>
              <p className="font-black text-sm">{invite.instructorName} is inviting you to join</p>
              <p className="text-xs text-red-100 font-medium">{invite.courseTitle} · {invite.instrument}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleJoin}
            className="bg-white text-red-600 font-black uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-full shadow-lg hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Radio className="w-3.5 h-3.5" /> Join Now
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Joined Session Banner ─────────────────────────────────────────────────────
function JoinedSessionBanner() {
  const { state: lsState, dispatch: lsDispatch } = useLiveStream();
  const channel = getLiveChannel();

  if (!lsState.joinedSessionId) return null;

  const handleLeave = () => {
    lsDispatch({ type: 'LEAVE_SESSION' });
    channel.postMessage({ type: 'STUDENT_LEFT', sessionId: lsState.joinedSessionId });
    toast.info('You left the live session');
  };

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-[500] bg-primary text-white shadow-2xl"
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse" />
          <span className="text-sm font-black">You are in a live lesson session</span>
        </div>
        <button
          onClick={handleLeave}
          className="bg-white/20 hover:bg-white/30 text-white font-black uppercase tracking-widest text-[10px] px-5 py-2 rounded-full transition-colors"
        >
          Leave Session
        </button>
      </div>
    </motion.div>
  );
}

const App = () => {
  const { state: authState, dispatch: authDispatch } = useAuth();
  const { state: lsState, dispatch: lsDispatch } = useLiveStream();
  const role = authState.user.role as UserRole;
  const [currentView, setCurrentView] = useState<View>(getViewFromHash);
  const [selectedCourseData, setSelectedCourseData] = useState<{ instrument: string, genre: string, instructor: string } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({ title: '', price: '' });
  const [searchQuery, setSearchQuery] = useState('');
  // 'loading' while we check Supabase session, 'auth' = show real login, 'dev' = show role-switcher, null = logged in
  const [authScreen, setAuthScreen] = useState<'loading' | 'auth' | 'dev' | null>('loading');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // On mount: check if there's an existing Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Logged in — AppProvider will hydrate the profile
        setAuthScreen(null);
      } else {
        // No session — check if we have a persisted guest/demo role
        const persisted = localStorage.getItem('kaa_user_profile');
        if (persisted) {
          try {
            const parsed = JSON.parse(persisted);
            // If persisted role is a demo account (no real Supabase ID format), go to dev mode silently
            if (parsed.id && !parsed.id.includes('-') || parsed.role === 'guest') {
              setAuthScreen(null); // allow demo continue
            } else {
              setAuthScreen('auth');
            }
          } catch { setAuthScreen('auth'); }
        } else {
          setAuthScreen('auth');
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hash routing — sync URL with view
  useEffect(() => {
    window.location.hash = '#' + currentView;
  }, [currentView]);

  useEffect(() => {
    const onHashChange = () => {
      const v = getViewFromHash();
      setCurrentView(v);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // BroadcastChannel — receive live stream messages from other tabs
  useEffect(() => {
    const channel = getLiveChannel();
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      // Forward relevant messages to local liveStream reducer
      if (msg.type === 'RECEIVE_INVITE') {
        lsDispatch({ type: 'RECEIVE_INVITE', invite: msg.invite });
      } else if (msg.type === 'END_SESSION') {
        lsDispatch({ type: 'END_SESSION' });
        lsDispatch({ type: 'LEAVE_SESSION' });
        toast.info('The live session has ended');
      }
    };
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  }, [lsDispatch]);

  const hasBanner = !!lsState.pendingInvite || !!lsState.joinedSessionId;

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

  // ── Real Supabase auth handlers ───────────────────────────────────────────────
  const handleAuthSuccess = (_userId: string) => {
    // AppProvider's useEffect will auto-hydrate the profile via onAuthStateChange
    setAuthScreen(null);
    setCurrentView('home');
    toast.success('Welcome to Kingdom Arts Academy!');
  };

  const handleGuestEntry = () => {
    authDispatch({ type: 'SET_ROLE', role: 'guest' });
    setAuthScreen(null);
    setCurrentView('home');
  };

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('kaa_user_profile');
    localStorage.removeItem('kaa_supabase_uid');
    setAuthScreen('auth');
    setCurrentView('home');
    toast.info('Signed out successfully.');
  };

  // ── Dev/demo mode role switcher (legacy) ──────────────────────────────────────
  const handleLogin = (selectedRole: UserRole) => {
    authDispatch({ type: 'SET_ROLE', role: selectedRole });
    setAuthScreen(null);
    if (selectedRole === 'admin') setCurrentView('admin-dash');
    else if (selectedRole === 'instructor') setCurrentView('instructor-dash');
    else setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      // ── Public ──────────────────────────────────────────────────────────────
      case 'hall-of-fame':
        return <HallOfFame />;
      case 'courses':
        return <ModernCoursesCatalog onEnroll={handleEnrollClick} />;
      case 'rubrics':
        return <GradingRubrics />;
      case 'upload-guide':
        return <RecordingGuide role={role} />;
      case 'profile':
        return <Profile />;
      case 'instructors':
        return <InstructorMap />;
      case 'schedule':
        return <LiveSchedule />;
      case 'community':
        return <Community />;
      case 'achievements':
        return role !== 'guest' ? <Achievements /> : <AccessDenied requiredRole="student" />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Support />;
      case 'scanner':
        return <div className="p-6 lg:p-10 max-w-4xl mx-auto"><MusicScanner /></div>;
      case 'stage':
        return <VirtualStage />;
      case 'messages':
        return role !== 'guest' ? <Messaging /> : <AccessDenied requiredRole="student or instructor" />;
      case 'ensemble':
        return <GroupClass />;

      // ── Course detail ────────────────────────────────────────────────────────
      case 'course-detail':
        return (
          <CourseMaterialView
            instrument={selectedCourseData?.instrument || 'Piano'}
            genre={selectedCourseData?.genre || 'Classical & Contemporary'}
            instructor={selectedCourseData?.instructor || 'Naledi Moremi'}
            onBack={() => setCurrentView('courses')}
            role={role}
          />
        );

      // ── Admin-only ───────────────────────────────────────────────────────────
      case 'admin-dash':
        return role === 'admin' ? <AdminDashboard /> : <AccessDenied requiredRole="admin" />;
      case 'users-manage':
        return role === 'admin' ? <UserManagement /> : <AccessDenied requiredRole="admin" />;
      case 'content-approve':
        return role === 'admin' ? <ApprovalsQueue /> : <AccessDenied requiredRole="admin" />;

      // ── Instructor-only ──────────────────────────────────────────────────────
      case 'instructor-dash':
      case 'feedback-review':
        return role === 'instructor' ? <InstructorDashboard /> : <AccessDenied requiredRole="instructor" />;
      case 'upload-lesson':
        return role === 'instructor' ? <InstructorUpload /> : <AccessDenied requiredRole="instructor" />;
      case 'royalties':
        return role === 'instructor' || role === 'admin'
          ? <RoyaltyStatements />
          : <AccessDenied requiredRole="instructor or admin" />;

      // ── My Lessons — instructor sees their own courses ────────────────────────
      case 'instructor-lessons':
        return role === 'instructor'
          ? <InstructorLessons onUpload={() => handleNavigate('upload-lesson')} />
          : <AccessDenied requiredRole="instructor" />;

      // ── Teacher Reviews ───────────────────────────────────────────────────────
      case 'teacher-reviews':
        return <TeacherReviews />;
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
    <div className={`min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary font-sans ${hasBanner ? 'pt-14' : ''}`}>
      <Toaster richColors position="bottom-right" />
      <GlobalPlayer />

      {/* Live session banners */}
      <AnimatePresence>
        {lsState.pendingInvite && <LiveInviteBanner key="invite" />}
        {lsState.joinedSessionId && !lsState.pendingInvite && <JoinedSessionBanner key="joined" />}
      </AnimatePresence>

      {/* Auth Gate — real login or dev role-switcher */}
      <AnimatePresence>
        {authScreen === 'auth' && (
          <AuthModal
            key="auth-modal"
            onAuthSuccess={handleAuthSuccess}
            onGuestEntry={handleGuestEntry}
            onDevMode={() => setAuthScreen('dev')}
          />
        )}
        {authScreen === 'dev' && (
          <LoginModal key="dev-modal" onLogin={handleLogin} />
        )}
      </AnimatePresence>

      {/* Student Jitsi Room — shown when student accepts a live lesson invite */}
      <AnimatePresence>
        {lsState.joinedRoom && lsState.joinedSessionId && role !== 'instructor' && (
          <LiveLessonRoom
            key="student-room"
            roomName={lsState.joinedRoom.roomName}
            displayName={authState.user.name}
            email={authState.user.email}
            avatarUrl={authState.user.avatar}
            lessonTitle={lsState.joinedRoom.courseTitle}
            subject={lsState.joinedRoom.courseTitle}
            instructorName={lsState.joinedRoom.instructorName}
            sessionType={(lsState.joinedRoom.sessionType as SessionType) ?? 'private'}
            role="student"
            onLeave={() => {
              lsDispatch({ type: 'LEAVE_SESSION' });
              getLiveChannel().postMessage({ type: 'STUDENT_LEFT', sessionId: lsState.joinedSessionId });
              toast.info('You left the lesson. See you next time!');
            }}
          />
        )}
      </AnimatePresence>

      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
        onToggleMobileMenu={() => setIsMobileMenuOpen(v => !v)}
      />

      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          role={role}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
          onSwitchAccount={handleSignOut}
        />

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
