/**
 * ParentDashboard — Read-only progress dashboard for parents
 *
 * Parents are linked to one or more children (students).
 * They can see:
 *   - Overall progress across enrolled courses
 *   - Attendance / lesson completion streaks
 *   - Upcoming lessons
 *   - Recent feedback from instructors
 *   - Certificates earned
 *   - Song requests submitted
 *   - Practice time (self-reported from student sessions)
 *
 * Parents CANNOT:
 *   - Enroll in lessons themselves
 *   - Modify any student data
 *   - Access Jitsi rooms
 */

import React, { useMemo, useState } from 'react';
import {
  Crown, BookOpen, Calendar, Star, Award,
  TrendingUp, Clock, Music2, CheckCircle2, ChevronRight,
  Users, ListMusic, MessageSquare, Flame, Target,
  BarChart3, Activity,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCourses } from '@/app/stores/useCourseStore';
import { useSongRequests } from '@/app/stores/useSongRequestStore';
import { ACADEMY_USERS } from '@/app/stores/useAuthStore';

// ── Demo linked children ──────────────────────────────────────────────────────
// In production: fetched from Supabase parent_student_links table

const LINKED_CHILDREN = [
  {
    id: 'user-001',
    name: 'Lerato Dube',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    instrument: 'Piano',
    level: 5,
    xp: 850,
    xpToNext: 1000,
    crowns: 12,
    streak: 7,
    joinDate: '2026-01-15',
    practiceMinutesWeek: 145,
  },
];

// ── Mock attendance (last 7 days) ─────────────────────────────────────────────
const ATTENDANCE = [
  { day: 'Mon', present: true },
  { day: 'Tue', present: true },
  { day: 'Wed', present: false },
  { day: 'Thu', present: true },
  { day: 'Fri', present: true },
  { day: 'Sat', present: true },
  { day: 'Sun', present: false },
];

// ── Mock instructor feedback ──────────────────────────────────────────────────
const FEEDBACK = [
  {
    id: 'fb1',
    instructorName: 'Naledi Moremi',
    instructorAvatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=60&h=60&fit=crop',
    text: 'Lerato has been making excellent progress on the Chopin étude. Consistent practice is showing — her left hand independence is much improved this week.',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    rating: 5,
  },
  {
    id: 'fb2',
    instructorName: 'Naledi Moremi',
    instructorAvatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=60&h=60&fit=crop',
    text: 'Please remind Lerato to practise scales for 10 minutes before each session — it makes a big difference in the lesson quality.',
    date: new Date(Date.now() - 9 * 86400000).toISOString(),
    rating: 4,
  },
];

// ── Upcoming lessons ──────────────────────────────────────────────────────────
const UPCOMING = [
  {
    id: 'ul1',
    title: 'Classical Piano — Lesson 4',
    instructor: 'Naledi Moremi',
    date: new Date(Date.now() + 2 * 86400000).toISOString(),
    duration: '45 min',
    type: 'Live 1-on-1',
  },
  {
    id: 'ul2',
    title: 'Theory: Chord Inversions',
    instructor: 'Naledi Moremi',
    date: new Date(Date.now() + 5 * 86400000).toISOString(),
    duration: '30 min',
    type: 'Theory Session',
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 86400) return 'today';
  if (secs < 2 * 86400) return 'yesterday';
  return `${Math.floor(secs / 86400)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 flex items-start gap-4 ${accent ? 'bg-primary/20 border border-primary/30' : 'bg-white/[0.03] border border-white/8'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-secondary/20' : 'bg-white/5'}`}>
        <Icon className={`w-5 h-5 ${accent ? 'text-secondary' : 'text-white/40'}`} />
      </div>
      <div>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-white font-black text-2xl leading-none">{value}</p>
        {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export const ParentDashboard = () => {
  const { state: courseState } = useCourses();
  const { state: songState } = useSongRequests();
  const [selectedChildIdx, setSelectedChildIdx] = useState(0);
  const child = LINKED_CHILDREN[selectedChildIdx];

  // Child's enrollments
  const enrollments = useMemo(() => {
    return courseState.enrollments
      .filter(e => e.courseId)  // all enrollments in demo belong to the linked student
      .map(e => ({ ...e, course: courseState.courses.find(c => c.id === e.courseId) }))
      .filter(e => e.course);
  }, [courseState.enrollments, courseState.courses]);

  // Child's song requests
  const childRequests = useMemo(() => {
    return songState.requests.filter(r => r.studentId === child.id || r.studentId === 'stu-1');
  }, [songState.requests, child.id]);

  const completedCourses = enrollments.filter(e => e.progress >= 100).length;
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;

  const attendancePct = Math.round(ATTENDANCE.filter(d => d.present).length / ATTENDANCE.length * 100);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="px-6 lg:px-10 pt-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-secondary fill-secondary/30" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl">Parent Dashboard</h1>
            <p className="text-white/40 text-sm">Monitoring your child's musical journey</p>
          </div>
        </div>

        {/* Child selector (if multiple children) */}
        {LINKED_CHILDREN.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            {LINKED_CHILDREN.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildIdx(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                  i === selectedChildIdx
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-8">
        {/* ── Child card ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/40 to-purple-900/30 border border-primary/30 rounded-3xl p-6 flex items-center justify-between gap-6 flex-wrap"
        >
          <div className="flex items-center gap-5">
            <img
              src={child.avatar}
              alt={child.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-secondary/50"
            />
            <div>
              <h2 className="text-white font-black text-xl">{child.name}</h2>
              <p className="text-white/50 text-sm">{child.instrument} · Level {child.level}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-secondary text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  {child.streak} day streak
                </div>
                <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                  <Crown className="w-3.5 h-3.5 fill-yellow-400/30" />
                  {child.crowns} crowns
                </div>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="flex-1 min-w-[180px] max-w-xs">
            <div className="flex justify-between text-xs text-white/40 font-bold mb-2">
              <span>XP Progress</span>
              <span>{child.xp} / {child.xpToNext}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(child.xp / child.xpToNext * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-secondary rounded-full"
              />
            </div>
            <p className="text-white/25 text-[10px] mt-1">{Math.round(child.xp / child.xpToNext * 100)}% to Level {child.level + 1}</p>
          </div>
        </motion.div>

        {/* ── Quick stats ────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Avg Progress" value={`${avgProgress}%`} sub="across all courses" icon={TrendingUp} accent />
          <StatCard label="Attendance" value={`${attendancePct}%`} sub="this week (7 days)" icon={Activity} />
          <StatCard label="Practice Time" value={`${child.practiceMinutesWeek}m`} sub="this week" icon={Clock} />
          <StatCard label="Completed" value={completedCourses} sub={`of ${enrollments.length} courses`} icon={Award} />
        </div>

        {/* ── Attendance strip ────────────────────────────── */}
        <div>
          <h3 className="text-white font-black text-base mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" /> This Week
          </h3>
          <div className="flex items-center gap-2">
            {ATTENDANCE.map(({ day, present }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full aspect-square max-w-[44px] rounded-xl flex items-center justify-center ${
                  present ? 'bg-green-500/20 border border-green-500/40' : 'bg-white/5 border border-white/10'
                }`}>
                  {present
                    ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                    : <span className="w-3 h-3 rounded-full bg-white/10" />}
                </div>
                <span className="text-white/30 text-[10px] font-bold uppercase">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Enrolled courses ───────────────────────────── */}
        <div>
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-white/40" /> Enrolled Courses
            <span className="text-white/30 font-normal text-sm">({enrollments.length})</span>
          </h3>
          {enrollments.length === 0 ? (
            <p className="text-white/30 text-sm">No courses enrolled yet.</p>
          ) : (
            <div className="space-y-3">
              {enrollments.map(({ courseId, progress, course }) => course && (
                <div key={courseId} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm truncate">{course.title}</p>
                    <p className="text-white/40 text-xs">{course.level} · with {course.instructor}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-black ${progress >= 100 ? 'text-green-400' : 'text-white/40'}`}>
                        {progress >= 100 ? '✓ Done' : `${progress}%`}
                      </span>
                    </div>
                  </div>
                  {progress >= 100 && (
                    <div className="px-2.5 py-1.5 bg-secondary/15 border border-secondary/30 rounded-lg text-secondary text-[9px] font-black uppercase tracking-widest shrink-0">
                      Certificate Earned
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Upcoming lessons ───────────────────────────── */}
        <div>
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" /> Upcoming Lessons
          </h3>
          <div className="space-y-3">
            {UPCOMING.map(lesson => (
              <div key={lesson.id} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-black text-sm">{lesson.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{lesson.instructor} · {lesson.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-secondary text-sm font-black">{formatDate(lesson.date)}</p>
                  <p className="text-white/30 text-xs">{lesson.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Instructor feedback ─────────────────────────── */}
        <div>
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-white/40" /> Instructor Feedback
          </h3>
          <div className="space-y-3">
            {FEEDBACK.map(fb => (
              <div key={fb.id} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src={fb.instructorAvatar} alt={fb.instructorName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-white/70 text-sm font-black">{fb.instructorName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < fb.rating ? 'text-secondary fill-secondary' : 'text-white/10'}`} />
                      ))}
                    </div>
                    <span className="text-white/25 text-xs">{timeAgo(fb.date)}</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic">"{fb.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Song requests summary ───────────────────────── */}
        {childRequests.length > 0 && (
          <div>
            <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-white/40" /> Song Requests
            </h3>
            <div className="space-y-2">
              {childRequests.slice(0, 3).map(req => (
                <div key={req.id} className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold truncate">{req.songTitle}</p>
                    <p className="text-white/30 text-xs">{req.artistName}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                    req.status === 'accepted'  ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                    req.status === 'declined'  ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                    req.status === 'completed' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                    'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer note ─────────────────────────────────── */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center">
          <p className="text-white/25 text-xs">
            This dashboard shows live data from your child's Kingdom Arts Academy account.
            Contact your instructor via the Messages section for direct communication.
          </p>
        </div>
      </div>
    </div>
  );
};
