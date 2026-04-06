import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Video, ArrowRight, Music, PlayCircle, Lock, Radio, Edit2, Trash2, Eye, UserCheck } from 'lucide-react';
import { ReminderBell } from '@/app/components/WhatsAppReminder';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';
import { LiveLessonRoom, type SessionType } from '@/app/components/LiveLessonRoom';

/**
 * Generate a deterministic room name for a SCHEDULED session.
 * Both instructor and student arrive at the same name independently.
 * Format: KAA_SCHEDULED_[slug]_[dateHash]
 */
function scheduledRoomName(title: string, date: string): string {
  const slug = title.replace(/[^a-zA-Z0-9]/g, '').slice(0, 14).toUpperCase();
  const dateSlug = date.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
  return `KAA_SCHEDULED_${slug}_${dateSlug}`;
}

interface ActiveRoom {
  roomName: string;
  lessonTitle: string;
  instructorName: string;
  sessionType: SessionType;
}

// Sessions the instructor teaches — shown in instructor schedule view
const INSTRUCTOR_UPCOMING = [
  {
    title: 'Saxophone Foundations — Breath Control',
    type: 'In-Person',
    location: 'Gaborone Central Campus',
    date: 'Monday, Mar 16',
    time: '10:00 AM – 12:00 PM',
    enrolled: 8,
    capacity: 12,
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Intermediate Saxophone Mastery',
    type: 'Live Stream',
    location: 'Virtual Stage',
    date: 'Thursday, Mar 19',
    time: '2:00 PM – 3:30 PM',
    enrolled: 5,
    capacity: 20,
    price: 'P180',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
];

const INSTRUCTOR_RECORDED = [
  {
    title: 'Saxophone Fundamentals — Breath Control',
    duration: '1h 22m',
    date: 'Recorded Mar 5, 2026',
    views: 47,
    students: 8,
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
    level: 'Beginner',
  },
  {
    title: 'Tone & Embouchure Masterclass',
    duration: '48m',
    date: 'Recorded Feb 18, 2026',
    views: 31,
    students: 5,
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80',
    level: 'Beginner',
  },
];

const UPCOMING_SESSIONS = [
  {
    title: 'Marimba Workshop',
    instructor: 'Mooketsi Thabo',
    type: 'In-Person',
    location: 'Gaborone Central Campus',
    date: 'Monday, Mar 16',
    time: '10:00 AM – 12:00 PM',
    spots: 5,
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1514320298322-2bb6c775a53e?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Advanced Segaba Technique',
    instructor: 'Neo Sebego',
    type: 'Live Stream',
    location: 'Virtual Stage',
    date: 'Wednesday, Mar 18',
    time: '2:00 PM – 3:30 PM',
    spots: 12,
    price: 'P150',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Rhythm & Percussion Masterclass',
    instructor: 'Lerato Kgosi',
    type: 'In-Person',
    location: 'Phakalane Studio',
    date: 'Friday, Mar 20',
    time: '4:00 PM – 6:00 PM',
    spots: 3,
    price: 'P200',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80',
  },
];

const RECORDED_SESSIONS = [
  {
    title: 'Saxophone Fundamentals — Breath Control',
    instructor: 'Naledi Moremi',
    duration: '1h 22m',
    date: 'Recorded Mar 5, 2026',
    views: 47,
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
    level: 'Beginner',
  },
  {
    title: 'Piano Chord Progressions Workshop',
    instructor: 'Tshiamo Kgosi',
    duration: '58m',
    date: 'Recorded Feb 28, 2026',
    views: 83,
    thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80',
    level: 'Intermediate',
  },
  {
    title: 'Setinkane — Traditional Botswana Tunes',
    instructor: 'Oratile Dithebe',
    duration: '45m',
    date: 'Recorded Feb 20, 2026',
    views: 132,
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80',
    level: 'Beginner',
  },
];

export const LiveSchedule = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded'>('upcoming');
  const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null);
  const { state: authState } = useAuth();
  const role = authState.user.role;
  const userName = authState.user.name;
  const isInstructor = role === 'instructor';

  const handleJoinLive = (session: { title: string; date: string; instructor?: string }) => {
    if (role === 'guest') {
      toast.info('Sign up to join live sessions.', { description: 'Create a student account to attend workshops.' });
      return;
    }
    const roomName = scheduledRoomName(session.title, session.date);
    setActiveRoom({
      roomName,
      lessonTitle: session.title,
      instructorName: (session as any).instructor ?? 'Instructor',
      sessionType: isInstructor ? 'group' : 'group',
    });
  };

  // Which data set to use
  const upcomingSessions = isInstructor ? INSTRUCTOR_UPCOMING : UPCOMING_SESSIONS;
  const recordedSessions = isInstructor ? INSTRUCTOR_RECORDED : RECORDED_SESSIONS;

  return (
    <>
    {/* ── Jitsi Room Overlay ── */}
    <AnimatePresence>
      {activeRoom && (
        <LiveLessonRoom
          key="schedule-room"
          roomName={activeRoom.roomName}
          displayName={authState.user.name}
          email={authState.user.email}
          avatarUrl={authState.user.avatar}
          lessonTitle={activeRoom.lessonTitle}
          subject={activeRoom.lessonTitle}
          instructorName={activeRoom.instructorName}
          sessionType={activeRoom.sessionType}
          role={isInstructor ? 'instructor' : 'student'}
          onLeave={() => {
            setActiveRoom(null);
            toast.info('You have left the session.');
          }}
        />
      )}
    </AnimatePresence>

    <div className="p-6 lg:p-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {isInstructor ? 'Teaching Schedule' : 'Live Workshops'}
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {isInstructor ? 'My Sessions' : 'Weekly Schedule'}
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl">
            {isInstructor
              ? `Manage your upcoming sessions and review your recorded workshops, ${userName}.`
              : 'Join live interactive sessions with our master instructors and grow your craft in real-time.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-muted p-1 rounded-2xl border border-border">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('recorded')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'recorded'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Recorded
          </button>
        </div>
      </div>

      {/* Instructor — Go Live / add session banner */}
      {isInstructor && (
        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-primary">Ready to go live?</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Start a live session now from your Teacher Hub, or schedule a new upcoming workshop below.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                // Instructors can start any scheduled Live Stream session from here
                const liveSession = INSTRUCTOR_UPCOMING.find(s => s.type === 'Live Stream');
                if (liveSession) {
                  handleJoinLive(liveSession);
                } else {
                  toast.info('Use the Go Live button in your Teacher Hub to start a new session.');
                }
              }}
              className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:bg-primary/90 transition-all"
            >
              Go Live Now
            </button>
            <button
              onClick={() => toast.info('Session scheduling coming soon.')}
              className="bg-white border border-border text-primary font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:border-primary/30 transition-all"
            >
              + Add Session
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'upcoming' ? (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {upcomingSessions.map((session, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-border rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col md:flex-row"
              >
                <div className="md:w-72 shrink-0 relative overflow-hidden">
                  <img
                    src={session.image}
                    alt={session.title}
                    className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                    {session.type}
                  </div>
                </div>

                <div className="flex-1 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                      {session.title}
                    </h3>
                    {/* Show instructor name only for student/guest view */}
                    {'instructor' in session && (
                      <p className="text-xs font-bold text-muted-foreground">with {(session as any).instructor}</p>
                    )}
                    <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {session.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {isInstructor
                          ? `${(session as any).enrolled} / ${(session as any).capacity} enrolled`
                          : `${(session as any).spots} spots left`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                    <div className="flex flex-col text-center md:text-right flex-1 md:flex-none">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Fee
                      </span>
                      <span className="text-xl font-black text-primary">{session.price}</span>
                    </div>

                    {/* ── Instructor management buttons ── */}
                    {isInstructor ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.success(`Viewing attendees for ${session.title}`)}
                          className="p-3 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all border border-primary/10"
                          title="View attendees"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.info(`Edit session: ${session.title}`)}
                          className="p-3 bg-muted text-muted-foreground rounded-xl hover:bg-secondary hover:text-primary transition-all border border-border"
                          title="Edit session"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.error(`Cancel session: ${session.title}`, { description: 'Students will be notified.' })}
                          className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                          title="Cancel session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : role === 'guest' ? (
                      <button
                        onClick={() => toast.info('Sign up to book sessions.', { description: 'Create a student account to reserve your spot.' })}
                        className="bg-muted text-muted-foreground font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" /> Sign In
                      </button>
                    ) : session.type === 'Live Stream' ? (
                      // Live Stream → open Jitsi room directly
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleJoinLive(session)}
                          className="bg-red-600 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all flex items-center gap-2 group-hover:translate-x-1 animate-pulse hover:animate-none"
                        >
                          <Radio className="w-4 h-4" /> Join Live
                        </button>
                        <ReminderBell config={{
                          lessonTitle: session.title,
                          instructorName: (session as any).instructor ?? 'Instructor',
                          lessonDate: new Date().toISOString(),
                          duration: session.time,
                        }} />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            toast.success('Reserved!', {
                              description: `You have secured a spot for ${session.title}.`,
                            })
                          }
                          className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 group-hover:translate-x-1"
                        >
                          Book Seat <ArrowRight className="w-4 h-4" />
                        </button>
                        <ReminderBell config={{
                          lessonTitle: session.title,
                          instructorName: (session as any).instructor ?? 'Instructor',
                          lessonDate: new Date().toISOString(),
                          duration: session.time,
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="recorded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recordedSessions.map((session, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-border rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={session.thumbnail}
                    alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {session.level}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-2.5 h-2.5" /> {session.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <h3 className="font-black text-primary group-hover:text-secondary transition-colors leading-tight">
                    {session.title}
                  </h3>
                  {'instructor' in session && (
                    <p className="text-xs font-bold text-muted-foreground">with {(session as any).instructor}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {session.date}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <Eye className="w-3 h-3" /> {session.views} views
                    </div>
                  </div>

                  {/* ── Instructor: manage recorded session ── */}
                  {isInstructor ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => toast.success('Opening recording…', { description: session.title })}
                        className="flex-1 bg-primary/5 hover:bg-primary hover:text-white text-primary font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all border border-primary/10 hover:border-primary flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" /> Preview
                      </button>
                      <button
                        onClick={() => toast.info(`Edit metadata for: ${session.title}`)}
                        className="p-3 bg-muted text-muted-foreground rounded-xl hover:bg-secondary hover:text-primary transition-all border border-border"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        role === 'guest'
                          ? toast.info('Sign up to watch recordings.')
                          : toast.success('Opening recording…', { description: session.title })
                      }
                      className="w-full mt-2 bg-primary/5 hover:bg-primary hover:text-white text-primary font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all border border-primary/10 hover:border-primary flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" /> Watch Recording
                    </button>
                  )}

                  {/* Instructor stats row */}
                  {isInstructor && (
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {(session as any).students} students watched
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA — different per role */}
      {isInstructor ? (
        <div className="bg-muted p-10 rounded-[2.5rem] text-center border border-border border-dashed">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Radio className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-2">Launch a Private 1-on-1</h3>
          <p className="text-muted-foreground font-medium mb-8 max-w-md mx-auto">
            Offer personalised sessions to individual students outside the group schedule.
          </p>
          <button
            onClick={() => toast.info('Private session scheduling coming soon.')}
            className="text-xs font-black uppercase tracking-widest px-8 py-4 bg-primary text-white rounded-full hover:bg-secondary hover:text-primary transition-all shadow-xl"
          >
            Offer Private Lesson
          </button>
        </div>
      ) : (
        <div className="bg-muted p-10 rounded-[2.5rem] text-center border border-border border-dashed">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Music className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-2">Want a Private Session?</h3>
          <p className="text-muted-foreground font-medium mb-8 max-w-md mx-auto">
            Book a 1-on-1 session with any of our instructors for personalized coaching at your preferred time.
          </p>
          <button
            onClick={() => {
              if (role === 'guest') {
                toast.info('Sign up for a student account to book private lessons.');
                return;
              }
              // Open a private 1-on-1 room with a unique name
              const roomName = `KAA_PRIVATE_${authState.user.id.slice(0, 8).toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;
              setActiveRoom({
                roomName,
                lessonTitle: 'Private Lesson',
                instructorName: 'Your Instructor',
                sessionType: 'private',
              });
            }}
            className="text-xs font-black uppercase tracking-widest px-8 py-4 bg-primary text-white rounded-full hover:bg-secondary hover:text-primary transition-all shadow-xl"
          >
            Start Private Session
          </button>
        </div>
      )}
    </div>
    </>
  );
};
