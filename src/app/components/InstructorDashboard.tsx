import React, { useState, useEffect } from 'react';
import {
  Users, Video, MessageSquare, Clock, ArrowRight,
  Play, Star, CheckCircle2, AlertCircle, TrendingUp,
  Calendar, Award, Search, Filter, ClipboardCheck, Eye,
  Radio, X, UserPlus, Mic, MicOff, StopCircle, BookOpen,
  Music, ChevronRight, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth, ACADEMY_USERS } from '@/app/stores/useAuthStore';
import { useLiveStream, getLiveChannel, LiveStudent } from '@/app/stores/useLiveStreamStore';
import { ALL_COURSES } from '@/app/stores/useCourseStore';
import { LiveLessonRoom, generateRoomName, type SessionType } from '@/app/components/LiveLessonRoom';

// ── Session type config ───────────────────────────────────────────────────────
const SESSION_TYPES: { value: SessionType; label: string; desc: string; icon: React.ElementType }[] = [
  { value: 'private', label: '1-on-1 Lesson', desc: 'Private session with a single student', icon: Music },
  { value: 'group',   label: 'Group Class',   desc: 'Multiple students — ensemble or masterclass', icon: Users },
  { value: 'theory',  label: 'Theory Lesson', desc: 'Screen sharing + whiteboard for music theory', icon: BookOpen },
];

// ── Go Live Modal ─────────────────────────────────────────────────────────────
function GoLiveModal({ onClose, instructorName, instructorAvatar, instructorId, instructorEmail }: {
  onClose: () => void;
  instructorName: string;
  instructorAvatar: string;
  instructorId: string;
  instructorEmail: string;
}) {
  const { state: lsState, dispatch: lsDispatch } = useLiveStream();
  const channel = getLiveChannel();

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [sessionType, setSessionType] = useState<SessionType>('private');
  const [step, setStep] = useState<'setup' | 'live'>('setup');
  const [activeRoomName, setActiveRoomName] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // Get instructor's own courses for the dropdown
  const instructorCourses = ALL_COURSES.filter(c => c.instructorId === instructorId);

  // Real student list from ACADEMY_USERS
  const enrolledStudents = ACADEMY_USERS
    .filter(u => u.role === 'student')
    .map(u => ({
      id: u.id,
      name: u.name,
      level: typeof u.level === 'number' ? `Level ${u.level}` : String(u.level),
      instrument: u.instrument || 'Multiple',
      progress: 60,
      avatar: u.avatar || `https://i.pravatar.cc/150?u=${u.id}`,
      lastActive: u.status === 'Active' ? 'Online' : 'Offline',
    }));

  const handleGoLive = () => {
    if (!selectedCourseId) {
      toast.error('Please select a course for this live session');
      return;
    }
    const course = instructorCourses.find(c => c.id === selectedCourseId)!;

    // Generate a unique room name — shared to students via invite payload
    const roomName = generateRoomName(course.id, sessionType);
    setActiveRoomName(roomName);

    const session = {
      id: `session-${Date.now()}`,
      instructorId,
      instructorName,
      instructorAvatar,
      courseId: course.id,
      courseTitle: course.title,
      instrument: course.instrument,
      startedAt: new Date().toISOString(),
      isLive: true,
      students: [],
      // Store room name and type in session so students can join
      roomName,
      sessionType,
    };
    lsDispatch({ type: 'START_SESSION', session: session as any });
    setStep('live');
    toast.success('You are now LIVE!', { description: `${course.title} — Invite your students to join` });
  };

  const handleInviteStudent = (student: { id: string; name: string; avatar: string; instrument: string }) => {
    if (!lsState.activeSession) return;

    const liveStudent: LiveStudent = {
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      instrument: student.instrument,
      status: 'invited',
    };

    lsDispatch({ type: 'INVITE_STUDENT', student: liveStudent });

    // Broadcast invite to student tabs via BroadcastChannel
    // Include roomName and sessionType so the student can open the right Jitsi room
    channel.postMessage({
      type: 'RECEIVE_INVITE',
      invite: {
        sessionId: lsState.activeSession.id,
        instructorName: lsState.activeSession.instructorName,
        instructorAvatar: lsState.activeSession.instructorAvatar,
        courseTitle: lsState.activeSession.courseTitle,
        instrument: lsState.activeSession.instrument,
        roomName: (lsState.activeSession as any).roomName ?? activeRoomName,
        sessionType: (lsState.activeSession as any).sessionType ?? sessionType,
      },
    });

    toast.success(`Invite sent to ${student.name}`);
  };

  const handleEndSession = () => {
    lsDispatch({ type: 'END_SESSION' });
    channel.postMessage({ type: 'END_SESSION' });
    toast.info('Live session ended');
    onClose();
  };

  const activeStudents = lsState.activeSession?.students ?? [];

  // ── When live: show Jitsi room overlay + invite panel ────────────────────────
  if (step === 'live' && activeRoomName) {
    const courseTitle = lsState.activeSession?.courseTitle ?? 'Live Lesson';
    return (
      <>
        {/* Full-screen Jitsi room */}
        <LiveLessonRoom
          roomName={activeRoomName}
          displayName={instructorName}
          email={instructorEmail}
          lessonTitle={courseTitle}
          subject={lsState.activeSession?.instrument ?? ''}
          instructorName={instructorName}
          sessionType={sessionType}
          role="instructor"
          onLeave={handleEndSession}
        />

        {/* Floating student invite panel — sits over the Jitsi room */}
        <motion.div
          initial={{ x: 340 }} animate={{ x: 0 }}
          className="fixed top-24 right-4 z-[500] w-80 bg-white rounded-[2rem] shadow-2xl border border-border overflow-hidden"
        >
          <div className="bg-primary px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
              <span className="text-white font-black text-sm">Invite Students</span>
            </div>
            <span className="text-white/60 text-[10px] font-bold">
              {activeStudents.filter(s => s.status === 'joined').length} joined
            </span>
          </div>
          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {enrolledStudents.map(student => {
              const invited = activeStudents.find(s => s.id === student.id);
              return (
                <div key={student.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                  <div className="flex items-center gap-2">
                    <img src={student.avatar} className="w-8 h-8 rounded-xl object-cover" alt={student.name} />
                    <div>
                      <p className="text-xs font-bold leading-tight">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground">{student.instrument}</p>
                    </div>
                  </div>
                  {invited ? (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                      invited.status === 'joined' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {invited.status === 'joined' ? '✓ In' : 'Sent'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleInviteStudent(student)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      <UserPlus className="w-3 h-3" /> Invite
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t border-border">
            <button
              onClick={handleEndSession}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
            >
              <StopCircle className="w-4 h-4" /> End Session for All
            </button>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className={`p-8 flex items-center justify-between ${step === 'live' ? 'bg-red-600' : 'bg-primary'} text-white`}>
          <div className="flex items-center gap-4">
            {step === 'live' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Now</span>
              </div>
            )}
            <h2 className="text-2xl font-black">{step === 'setup' ? 'Go Live' : lsState.activeSession?.courseTitle}</h2>
          </div>
          <button onClick={step === 'live' ? handleEndSession : onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {step === 'setup' ? (
            // ── Setup Step ────────────────────────────────────────────────
            <>
              {/* Session type selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-3">
                  Session Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {SESSION_TYPES.map(({ value, label, desc, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSessionType(value)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        sessionType === value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${sessionType === value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`text-xs font-black ${sessionType === value ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5 leading-relaxed">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-3">
                  Select Course for This Session
                </label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full border border-border rounded-2xl px-5 py-4 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Choose a course…</option>
                  {instructorCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} — {c.instrument}</option>
                  ))}
                </select>
              </div>

              <div className="p-5 bg-muted/50 rounded-2xl space-y-2 text-sm">
                <p className="font-black text-xs uppercase tracking-widest text-muted-foreground">How it works</p>
                <p className="font-medium text-muted-foreground">1. Choose session type and course, then go live.</p>
                <p className="font-medium text-muted-foreground">2. Your Jitsi video room opens instantly — allow camera/mic access.</p>
                <p className="font-medium text-muted-foreground">3. Invite students — they get a notification banner to join.</p>
                <p className="font-medium text-muted-foreground">4. Click End Session when the lesson is done.</p>
              </div>

              <button
                onClick={handleGoLive}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-red-700 transition-colors"
              >
                <Radio className="w-5 h-5" /> Start Live Session
              </button>
            </>
          ) : (
            // ── Live Step ─────────────────────────────────────────────────
            <>
              {/* Live Controls */}
              <div className="flex items-center justify-between p-5 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Radio className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-red-700">Session Active</p>
                    <p className="text-xs text-red-500 font-medium">{activeStudents.filter(s => s.status === 'joined').length} student(s) joined</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-xl transition-colors ${isMuted ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleEndSession}
                    className="px-5 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-colors"
                  >
                    <StopCircle className="w-4 h-4" /> End Session
                  </button>
                </div>
              </div>

              {/* Student Invite List */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Invite Students</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {enrolledStudents.map(student => {
                    const invited = activeStudents.find(s => s.id === student.id);
                    return (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} className="w-9 h-9 rounded-xl object-cover" alt={student.name} />
                          <div>
                            <p className="text-sm font-bold">{student.name}</p>
                            <p className="text-[10px] font-medium text-muted-foreground">{student.level} · {student.instrument} · active {student.lastActive}</p>
                          </div>
                        </div>
                        {invited ? (
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            invited.status === 'joined' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {invited.status === 'joined' ? '✓ Joined' : 'Invited'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleInviteStudent(student)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
                          >
                            <UserPlus className="w-3 h-3" /> Invite
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export const InstructorDashboard = () => {
  const { state: authState } = useAuth();
  const { state: lsState, dispatch: lsDispatch } = useLiveStream();

  const user = authState.user;
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'students'>('overview');
  const [showGoLive, setShowGoLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // My courses = courses uploaded by this instructor
  const myCourses = ALL_COURSES.filter(c => c.instructorId === user.id);

  // Listen for student joins via BroadcastChannel
  useEffect(() => {
    const channel = getLiveChannel();
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.type === 'STUDENT_JOINED') {
        lsDispatch({ type: 'CONFIRM_STUDENT', studentId: msg.studentId });
        toast.success(`${msg.studentName} joined the live session!`);
      }
    };
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  }, [lsDispatch]);

  const isLive = !!lsState.activeSession;

  const stats = [
    { label: 'My Courses', value: String(myCourses.length), icon: BookOpen, trend: `${myCourses.length} active` },
    { label: 'Students Enrolled', value: '0', icon: Users, trend: 'Awaiting sign-ups' },
    { label: 'Live Sessions', value: isLive ? '1' : '0', icon: Radio, trend: isLive ? 'Live now' : 'None active', live: isLive },
    { label: 'Course Rating', value: '—', icon: Star, trend: 'No ratings yet' },
  ];

  // Real student list from ACADEMY_USERS
  const academyStudents = ACADEMY_USERS
    .filter(u => u.role === 'student')
    .map(u => ({
      id: u.id,
      name: u.name,
      level: typeof u.level === 'number' ? `Level ${u.level}` : String(u.level),
      instrument: u.instrument || 'Multiple',
      progress: 60,
      avatar: u.avatar || `https://i.pravatar.cc/150?u=${u.id}`,
      lastActive: u.status === 'Active' ? 'Online' : 'Offline',
    }));

  const filteredStudents = academyStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.instrument.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        {showGoLive && (
          <GoLiveModal
            onClose={() => setShowGoLive(false)}
            instructorName={user.name}
            instructorAvatar={user.avatar}
            instructorId={user.id}
            instructorEmail={user.email}
          />
        )}
      </AnimatePresence>

      <div className="p-6 lg:p-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-primary shadow-xl shrink-0">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-1">Dumela, {user.name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-secondary" />
                {(user as any).instrument || 'Instrument'} Instructor · Kingdom Arts Academy
              </p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            {isLive ? (
              <button
                onClick={() => setShowGoLive(true)}
                className="bg-red-600 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse"
              >
                <Radio className="w-4 h-4" /> Session Live
              </button>
            ) : (
              <button
                onClick={() => setShowGoLive(true)}
                className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <Video className="w-4 h-4" /> Go Live
              </button>
            )}
            <button className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Lesson
            </button>
          </div>
        </div>

        {/* Live Banner */}
        <AnimatePresence>
          {isLive && lsState.activeSession && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-600 text-white p-6 rounded-[2rem] flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <div>
                  <p className="font-black">You are LIVE · {lsState.activeSession.courseTitle}</p>
                  <p className="text-sm text-red-100 font-medium">
                    {lsState.activeSession.students.filter(s => s.status === 'joined').length} student(s) joined ·{' '}
                    {lsState.activeSession.students.filter(s => s.status === 'invited').length} invited
                  </p>
                </div>
              </div>
              <button onClick={() => setShowGoLive(true)} className="bg-white text-red-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Manage Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white border p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-all ${stat.live ? 'border-red-200 bg-red-50/30' : 'border-border'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-muted rounded-2xl flex items-center justify-center ${stat.live ? 'text-red-600' : 'text-primary'}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.live && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-[10px] font-medium text-muted-foreground mt-1">{stat.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted p-1.5 rounded-2xl w-fit gap-1">
          {(['overview', 'lessons', 'students'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {tab === 'lessons' ? 'My Lessons' : tab === 'overview' ? 'Overview' : 'Students'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {activeTab === 'overview' && (
              <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-border">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <ClipboardCheck className="w-6 h-6 text-primary" /> Quick Overview
                  </h3>
                </div>
                <div className="p-8 space-y-4">
                  <div className="p-6 bg-secondary/20 border border-secondary/30 rounded-2xl">
                    <p className="font-black text-lg mb-1">Your courses are published and ready</p>
                    <p className="text-sm text-muted-foreground font-medium">You have {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} in the catalog. Students will enroll once the academy opens.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Grading Rubrics', icon: ClipboardCheck, desc: 'Assessment frameworks' },
                      { label: 'Video Upload Guide', icon: Video, desc: 'Recording best practices' },
                      { label: 'Royalty Statements', icon: TrendingUp, desc: 'Track your earnings' },
                    ].map((tool, i) => (
                      <button key={i} className="flex items-center justify-between p-5 bg-muted/30 hover:bg-muted transition-colors rounded-2xl text-sm font-bold text-primary group">
                        <div className="flex items-center gap-3">
                          <tool.icon className="w-5 h-5" />
                          <div className="text-left">
                            <p className="font-black text-xs">{tool.label}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{tool.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Showing {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} you teach
                  </p>
                  <button className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-xl flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" /> Upload New
                  </button>
                </div>

                {myCourses.length === 0 ? (
                  <div className="p-16 bg-primary/5 border border-primary/10 rounded-[2.5rem] text-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center mx-auto">
                      <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-black text-lg">No lessons uploaded yet</p>
                    <p className="text-sm text-muted-foreground font-medium">Click "Upload New" to add your first lesson.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myCourses.map((course, i) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-primary/5 border border-primary/10 rounded-3xl overflow-hidden hover:shadow-md transition-all group"
                      >
                        <div className="h-2 bg-primary" />
                        <div className="p-7 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black leading-tight">{course.title}</p>
                              <p className="text-xs text-muted-foreground font-medium mt-1">{course.instrument} · {course.genre}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary/30 text-primary shrink-0">
                              {course.level}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                              <img src={course.instructorAvatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-bold">{course.instructor}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">{course.lessons?.length ?? 0} lessons</span>
                            <span className="text-primary">{course.price}</span>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-border">
                            <button
                              onClick={() => toast.info(`Editing: ${course.title}`)}
                              className="flex-1 py-2.5 bg-muted text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setShowGoLive(true);
                              }}
                              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                            >
                              <Radio className="w-3 h-3" /> Go Live
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" /> Student Directory
                  </h3>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Find student…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-muted rounded-xl text-xs font-bold outline-none border border-transparent focus:border-primary/20 w-56"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progress</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Active</th>
                        <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredStudents.map((student, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <img src={student.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={student.name} />
                              <span className="font-bold text-sm">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-primary uppercase tracking-wider">{student.level}</span>
                              <span className="text-[10px] font-bold text-muted-foreground">{student.instrument}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4 w-40">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-secondary" style={{ width: `${student.progress}%` }} />
                              </div>
                              <span className="text-[10px] font-black text-primary">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-xs font-medium text-muted-foreground">{student.lastActive}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-muted text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setShowGoLive(true);
                                }}
                                className="p-2 bg-muted text-primary rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                title="Invite to live session"
                              >
                                <Radio className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground font-medium">
                    Students enroll when they sign up. This list shows demo data for your preview.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
