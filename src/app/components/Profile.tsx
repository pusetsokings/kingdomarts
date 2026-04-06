import React, { useState } from 'react';
import {
  Award, BookOpen, Clock, Heart, Settings, LogOut,
  ChevronRight, Music, Crown, Target, Zap, TrendingUp, Edit2, Check, X
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';
import { useCourses } from '@/app/stores/useCourseStore';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
];

export const Profile = () => {
  const { state: authState, dispatch: authDispatch } = useAuth();
  const { state: courseState } = useCourses();
  const user = authState.user;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const enrollments = courseState.enrollments;
  const enrolledCourses = enrollments.map(enr => {
    const course = courseState.courses.find(c => c.id === enr.courseId);
    return course ? { ...course, enrollment: enr } : null;
  }).filter(Boolean) as any[];

  const xpPercent = Math.round((user.xp / user.xpToNext) * 100);

  const practiceData = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.3 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 2.1 },
    { day: 'Sat', hours: 4.2 },
    { day: 'Sun', hours: 2.8 },
  ];

  const milestones = [
    { label: 'Joined Kingdom Arts Academy', status: 'completed', date: user.joinDate || 'Jan 2026' },
    {
      label: 'Reached Level ' + user.level,
      status: user.level >= 5 ? 'completed' : 'in-progress',
      progress: user.level >= 5 ? null : Math.round((user.level / 10) * 100)
    },
    { label: 'Earn 1,000 Crowns', status: user.crowns >= 1000 ? 'completed' : 'in-progress', progress: user.crowns >= 1000 ? null : Math.round((user.crowns / 1000) * 100) },
  ];

  const stats = [
    { label: 'Courses Enrolled', value: String(enrollments.length), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Skill Level', value: `Level ${user.level}`, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Day Streak', value: String(user.streak), icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Crowns Earned', value: String(user.crowns), icon: Crown, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const handleSaveProfile = () => {
    authDispatch({
      type: 'UPDATE_PROFILE',
      updates: { name: editName, bio: editBio, avatar: editAvatar },
    });
    setIsEditing(false);
    setShowAvatarPicker(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    authDispatch({ type: 'SET_ROLE', role: 'guest' });
    toast.info('Logged out. Switched to Guest view.');
  };

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-border pb-10">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img src={isEditing ? editAvatar : user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {isEditing && (
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-5 h-5 text-white" />
              </button>
            )}
            <div className="absolute -bottom-2 -right-2 p-2 bg-secondary text-primary rounded-full shadow-lg border-2 border-white">
              <Crown className="w-4 h-4 fill-primary" />
            </div>
          </div>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute mt-28 ml-0 z-50 bg-white border border-border rounded-2xl p-4 shadow-xl grid grid-cols-3 gap-2"
            >
              {AVATAR_OPTIONS.map((av, i) => (
                <button
                  key={i}
                  onClick={() => { setEditAvatar(av); setShowAvatarPicker(false); }}
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${editAvatar === av ? 'border-primary scale-110' : 'border-transparent'}`}
                >
                  <img src={av} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </motion.div>
          )}

          <div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="text-2xl font-black bg-muted border border-border rounded-xl px-3 py-1 outline-none focus:ring-2 focus:ring-primary/20 w-48"
                />
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-muted border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tight text-foreground">{user.name}</h1>
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full capitalize">{user.role}</span>
                </div>
                <p className="text-muted-foreground font-medium mt-1">{user.bio}</p>
              </>
            )}

            <div className="flex gap-4 mt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-primary text-white rounded-full flex items-center gap-2"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setShowAvatarPicker(false); }}
                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-muted rounded-full flex items-center gap-2"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsEditing(true); setEditName(user.name); setEditBio(user.bio); setEditAvatar(user.avatar); }}
                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-muted hover:bg-primary hover:text-white transition-colors rounded-full flex items-center gap-2"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 text-red-600 border border-red-100 hover:bg-red-50 transition-colors rounded-full flex items-center gap-2"
                  >
                    <LogOut className="w-3 h-3" /> Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-5 bg-white border border-border rounded-3xl shadow-sm text-center min-w-28 border-b-4 border-b-secondary">
            <span className="block text-3xl font-black text-primary">{user.crowns}</span>
            <div className="flex items-center justify-center gap-1 text-secondary">
              <Crown className="w-3 h-3 fill-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Crowns</span>
            </div>
          </div>
          <div className="p-5 bg-white border border-border rounded-3xl shadow-sm text-center min-w-28 border-b-4 border-b-primary">
            <span className="block text-3xl font-black text-secondary">{user.streak}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Day Streak</span>
          </div>
        </div>
      </div>

      {/* XP Progress Banner */}
      <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-secondary fill-secondary" />
              <span className="text-xs font-black uppercase tracking-widest">Level {user.level} Progress</span>
            </div>
            <h3 className="text-3xl font-black mb-4">
              {user.xpToNext - user.xp} XP to <span className="text-secondary">Level {user.level + 1}</span>
            </h3>
            <p className="text-white/70 text-sm font-medium mb-6">
              {user.xp} / {user.xpToNext} XP — Keep practicing to level up and unlock new content!
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>XP Progress</span>
                <span>{xpPercent}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-secondary shadow-[0_0_15px_rgba(253,185,19,0.5)]"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary shadow-xl">
              <Crown className="w-10 h-10 fill-primary" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Next Tier</p>
              <p className="text-xl font-black">Level {user.level + 1}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Practice Chart */}
          <div className="p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Rehearsal History
                </h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Weekly Practice Hours</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={practiceData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#522d80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#522d80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#666' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="hours" stroke="#522d80" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="p-6 bg-white border border-border rounded-3xl shadow-sm flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className={`w-6 h-6 ${stat.label === 'Crowns Earned' ? 'fill-secondary' : ''}`} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">{stat.label}</span>
                  <span className="text-xl font-black">{stat.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enrolled Courses */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight">Active Learning</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{enrolledCourses.length} Enrolled</span>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="p-10 bg-muted/30 rounded-3xl border border-dashed border-border text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="font-black">No courses enrolled yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Head to Courses to start your journey!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course: any) => (
                  <div key={course.id} className="p-6 bg-white border border-border rounded-3xl shadow-sm hover:border-primary/20 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{course.title}</h4>
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-muted-foreground">
                          {course.enrollment.completedLessons.length} / {course.lessons.length} lessons
                        </span>
                        <span className="text-sm font-black text-primary">{course.enrollment.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.enrollment.progress}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>{course.instrument} · {course.genre}</span>
                        <span>{course.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="p-8 bg-muted rounded-3xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black tracking-tight">Milestones</h3>
            </div>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    m.status === 'completed' ? 'bg-primary border-primary text-secondary' : 'border-primary'
                  }`}>
                    {m.status === 'completed' && <Crown className="w-3 h-3 fill-secondary" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{m.label}</p>
                    {m.date && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{m.date}</p>}
                    {m.progress != null && (
                      <div className="mt-2 w-32 h-1 bg-white/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${m.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-secondary/10 rounded-3xl border border-secondary/20 border-dashed">
            <h3 className="text-lg font-black tracking-tight mb-2">Invite Friends</h3>
            <p className="text-xs font-medium text-muted-foreground mb-6">Earn 100 crowns for every friend who joins the Academy.</p>
            {user.inviteCode ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={user.inviteCode}
                  className="flex-1 bg-white border border-border rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest"
                />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(user.inviteCode).catch(() => {});
                    toast.success('Invite code copied!');
                  }}
                  className="p-2 bg-primary text-white rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">Register to get your invite code.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
