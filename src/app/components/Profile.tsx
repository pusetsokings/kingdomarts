import React from 'react';
import { Award, BookOpen, Clock, Heart, Settings, LogOut, ChevronRight, Music, Crown, Target, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Profile = () => {
  const stats = [
    { label: 'Hours Practiced', value: '124', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Courses Completed', value: '12', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Skill Level', value: 'Advanced', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Crowns Earned', value: '850', icon: Crown, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

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
    { label: 'Setinkane Beginner', status: 'completed', date: 'Jan 12, 2026' },
    { label: 'Polyrhythmic Cycles', status: 'in-progress', progress: 65 },
    { label: 'Gaborone Workshop 2026', status: 'upcoming', date: 'Feb 15, 2026' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-border pb-10">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img src="https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=200&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-secondary text-primary rounded-full shadow-lg border-2 border-white">
              <Crown className="w-4 h-4 fill-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-foreground">Lerato Molefe</h1>
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Pro Member</span>
            </div>
            <p className="text-muted-foreground font-medium">Aspiring Jazz Pianist from Gaborone</p>
            <div className="flex gap-4 mt-4">
              <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-muted hover:bg-primary hover:text-white transition-colors rounded-full">Edit Profile</button>
              <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 text-red-600 border border-red-100 hover:bg-red-50 transition-colors rounded-full flex items-center gap-2">
                <LogOut className="w-3 h-3" /> Log Out
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-5 bg-white border border-border rounded-3xl shadow-sm text-center min-w-28 border-b-4 border-b-secondary">
            <span className="block text-3xl font-black text-primary">850</span>
            <div className="flex items-center justify-center gap-1 text-secondary">
               <Crown className="w-3 h-3 fill-secondary" />
               <span className="text-[10px] font-black uppercase tracking-widest">Crowns</span>
            </div>
          </div>
          <div className="p-5 bg-white border border-border rounded-3xl shadow-sm text-center min-w-28 border-b-4 border-b-primary">
            <span className="block text-3xl font-black text-secondary">42</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Crowns Progress */}
      <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-secondary fill-secondary" />
              <span className="text-xs font-black uppercase tracking-widest">Weekly Goal Progress</span>
            </div>
            <h3 className="text-3xl font-black mb-4">Reach 1,000 Crowns for a <span className="text-secondary">Free Masterclass</span></h3>
            <p className="text-white/70 text-sm font-medium mb-6">You've earned 150 crowns this week. Practice 3 more days to hit your streak bonus!</p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>Progress</span>
                <span>85%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
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
              <p className="text-xl font-black">Royal Artist</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Rehearsal History Chart */}
          <div className="p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Rehearsal History
                </h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Weekly Practice Hours</p>
              </div>
              <select className="bg-muted border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={practiceData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#522d80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#522d80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#666'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#666'}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#522d80" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 bg-white border border-border rounded-3xl shadow-sm flex flex-col gap-4"
              >
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
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Courses</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Classical Piano: Masterclass', progress: 75, nextLesson: 'Chord Inversions' },
                { title: 'Traditional African Rhythm', progress: 30, nextLesson: 'Polyrhythmic Cycles' },
              ].map((course, i) => (
                <div key={i} className="p-6 bg-white border border-border rounded-3xl shadow-sm hover:border-primary/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{course.title}</h4>
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-muted-foreground">Next: {course.nextLesson}</span>
                      <span className="text-sm font-black text-primary">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <button className="w-full py-3 bg-primary/5 hover:bg-primary hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      Continue Lesson <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Milestones) */}
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
                    m.status === 'completed' ? 'bg-primary border-primary text-secondary' : 
                    m.status === 'in-progress' ? 'border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {m.status === 'completed' && <Crown className="w-3 h-3 fill-secondary" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${m.status === 'upcoming' ? 'text-muted-foreground' : ''}`}>{m.label}</p>
                    {m.date && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{m.date}</p>}
                    {m.progress && (
                      <div className="mt-2 w-32 h-1 bg-white/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[65%]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              View All Milestones
            </button>
          </div>

          <div className="p-8 bg-secondary/10 rounded-3xl border border-secondary/20 border-dashed">
            <h3 className="text-lg font-black tracking-tight mb-2">Invite Friends</h3>
            <p className="text-xs font-medium text-muted-foreground mb-6">Earn 100 crowns for every friend who joins the Academy.</p>
            <div className="flex gap-2">
              <input type="text" readOnly value="KINGDOM-2026" className="flex-1 bg-white border border-border rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest" />
              <button className="p-2 bg-primary text-white rounded-xl">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
