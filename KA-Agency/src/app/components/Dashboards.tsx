import React from 'react';
import { Briefcase, CheckCircle2, Clock, DollarSign, TrendingUp, Star, Users, Globe, Sparkles, ArrowRight, Music, Calendar } from 'lucide-react';
import { useAuth } from '@/app/stores/useAuthStore';
import { useJobs } from '@/app/stores/useJobStore';
import { useMusicians } from '@/app/stores/useMusicianStore';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// ─── Musician Dashboard ─────────────────────────────────────────────────────
export function MusicianDashboard({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { state: authState } = useAuth();
  const { state: jobState } = useJobs();
  const user = authState.user;

  const myApps = jobState.applications.filter(a => a.musicianId === user.id);
  const openJobs = jobState.jobs.filter(j => j.status === 'open').length;

  const earningsData = [
    { month: 'Oct', amount: 2800 },
    { month: 'Nov', amount: 4200 },
    { month: 'Dec', amount: 3600 },
    { month: 'Jan', amount: 5100 },
    { month: 'Feb', amount: 4800 },
    { month: 'Mar', amount: 6200 },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Hero */}
      <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3 fill-current" />
              Welcome back
            </div>
            <h1 className="text-2xl font-black leading-tight">Hi, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-white/60 text-sm font-medium mt-1">You have {openJobs} gigs waiting for you</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-secondary">7</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-0.5">Level</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-secondary">14</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-0.5">Gigs Done</p>
            </div>
          </div>
        </div>
        <Music className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: 'Open Gigs', value: openJobs, color: 'text-primary', bg: 'bg-accent' },
          { icon: Clock, label: 'Applications', value: myApps.length, color: 'text-orange-600', bg: 'bg-orange-50' },
          { icon: CheckCircle2, label: 'Bookings', value: 2, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Star, label: 'My Rating', value: '4.9★', color: 'text-secondary', bg: 'bg-secondary/10' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white border-2 border-border rounded-[1.5rem] p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-black text-foreground">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings chart */}
        <div className="lg:col-span-2 bg-white border-2 border-border rounded-[2rem] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-foreground">Earnings Overview</h3>
              <p className="text-xs text-muted-foreground font-medium">Last 6 months · BWP</p>
            </div>
            <p className="text-2xl font-black text-primary">BWP 26,700</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={earningsData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#522d80', border: 'none', borderRadius: 8, color: '#fff', fontSize: 10, fontWeight: 700 }}
                cursor={{ fill: '#f8f4ff' }}
                formatter={(val: number) => [`BWP ${val.toLocaleString()}`, 'Earnings']}
              />
              <Bar dataKey="amount" fill="#522d80" radius={[4, 4, 0, 0]} isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Quick Actions</h3>
          {[
            { label: 'Browse Job Board', icon: Briefcase, view: 'job-board', color: 'bg-primary text-white' },
            { label: 'My Applications', icon: Clock, view: 'my-applications', color: 'bg-secondary text-primary' },
            { label: 'Update Profile', icon: Star, view: 'profile', color: 'bg-accent text-primary border-2 border-primary/10' },
            { label: 'View Earnings', icon: DollarSign, view: 'earnings', color: 'bg-muted text-foreground' },
          ].map(({ label, icon: Icon, view, color }) => (
            <motion.button
              key={view}
              whileHover={{ x: 4 }}
              onClick={() => onNavigate(view)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl ${color} transition-all`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Agency Admin Dashboard ──────────────────────────────────────────────────
export function AgencyAdminDashboard({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { state: jobState } = useJobs();
  const { state: musicianState } = useMusicians();

  const totalApplications = jobState.applications.length;
  const openJobs = jobState.jobs.filter(j => j.status === 'open').length;
  const available = musicianState.roster.filter(m => m.availability === 'available').length;
  const onGig = musicianState.roster.filter(m => m.availability === 'on-gig').length;

  const gigData = [
    { name: 'Cruise Ship', value: 4 },
    { name: 'Concert', value: 8 },
    { name: 'Recording', value: 6 },
    { name: 'Band', value: 3 },
    { name: 'Hotel', value: 5 },
    { name: 'Film', value: 2 },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-primary">Agency Analytics</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Kingdom Arts Agency · March 2026</p>
        </div>
        <div className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
          Admin View
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Musicians', value: musicianState.roster.length, color: 'text-primary', bg: 'bg-accent', delta: '+2 this month' },
          { icon: Briefcase, label: 'Open Gigs', value: openJobs, color: 'text-orange-600', bg: 'bg-orange-50', delta: '3 closing soon' },
          { icon: Clock, label: 'Applications', value: totalApplications, color: 'text-blue-600', bg: 'bg-blue-50', delta: '4 need review' },
          { icon: TrendingUp, label: 'Active Bookings', value: onGig, color: 'text-green-600', bg: 'bg-green-50', delta: `${available} available` },
        ].map(({ icon: Icon, label, value, color, bg, delta }) => (
          <div key={label} className="bg-white border-2 border-border rounded-[1.5rem] p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-black text-foreground">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gigs by category chart */}
        <div className="lg:col-span-2 bg-white border-2 border-border rounded-[2rem] p-6">
          <h3 className="font-black text-foreground mb-1">Bookings by Category</h3>
          <p className="text-xs text-muted-foreground font-medium mb-6">This financial year</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gigData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#666' }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={80} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#522d80', border: 'none', borderRadius: 8, color: '#fff', fontSize: 10, fontWeight: 700 }} cursor={{ fill: '#f8f4ff' }} />
              <Bar dataKey="value" fill="#fdb913" radius={[4, 4, 0, 0]} isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick manage */}
        <div className="space-y-3">
          <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Manage</h3>
          {[
            { label: 'Talent Roster', icon: Users, view: 'talent-roster', color: 'bg-primary text-white' },
            { label: 'Applications Queue', icon: Clock, view: 'applications-queue', color: 'bg-secondary text-primary' },
            { label: 'Job Listings', icon: Briefcase, view: 'job-listings', color: 'bg-accent text-primary border-2 border-primary/10' },
            { label: 'Client Directory', icon: Globe, view: 'client-directory', color: 'bg-muted text-foreground' },
          ].map(({ label, icon: Icon, view, color }) => (
            <motion.button
              key={view}
              whileHover={{ x: 4 }}
              onClick={() => onNavigate(view)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl ${color} transition-all`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white border-2 border-border rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-black text-foreground">Recent Applications</h3>
          <button onClick={() => onNavigate('applications-queue')} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-border">
          {jobState.applications.slice(0, 3).map(app => (
            <div key={app.id} className="px-6 py-4 flex items-center gap-4">
              <img src={app.musicianAvatar} alt={app.musicianName} className="w-9 h-9 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-foreground truncate">{app.musicianName}</p>
                <p className="text-xs text-muted-foreground truncate">{jobState.jobs.find(j => j.id === app.jobId)?.title}</p>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{app.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Client Dashboard ────────────────────────────────────────────────────────
export function ClientDashboard({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { state: authState } = useAuth();
  const { state: musicianState } = useMusicians();
  const user = authState.user;

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-3">
            <Globe className="w-3 h-3" />
            Client Portal
          </div>
          <h1 className="text-2xl font-black">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="text-white/60 font-medium text-sm mt-1">{musicianState.roster.filter(m => m.availability === 'available').length} musicians available for your next event</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => onNavigate('musicians')} className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-xl">
              Find Musicians
            </button>
            <button onClick={() => onNavigate('my-requests')} className="bg-white/10 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl border border-white/20">
              My Requests
            </button>
          </div>
        </div>
        <Calendar className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Requests', value: 3, icon: Briefcase, bg: 'bg-accent', color: 'text-primary' },
          { label: 'Confirmed Bookings', value: 1, icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Musicians Contacted', value: 5, icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white border-2 border-border rounded-[1.5rem] p-6">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-black text-foreground">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Guest Explore View ──────────────────────────────────────────────────────
export function GuestExplore({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { state: musicianState } = useMusicians();
  const { state: jobState } = useJobs();

  return (
    <div className="p-6 lg:p-10 space-y-16">
      <div className="bg-primary p-12 rounded-[3rem] text-white relative overflow-hidden">
        <div className="max-w-lg relative z-10">
          <div className="flex items-center gap-2 text-secondary mb-4">
            <Sparkles className="w-5 h-5 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Botswana's Premier Music Agency</span>
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight">Connecting World-Class Musicians with Global Opportunities</h2>
          <p className="text-white/70 font-medium mb-8">Cruise ships, concerts, film scores, and more. Certified talent, professional placements.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => onNavigate('login')} className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl shadow-xl">
              Join the Agency
            </button>
            <button onClick={() => onNavigate('job-board')} className="bg-white/10 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl border border-white/20">
              Browse Gigs
            </button>
          </div>
        </div>
        <Music className="absolute -bottom-10 -right-10 w-80 h-80 opacity-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Users, label: `${musicianState.roster.length}+ Musicians`, desc: 'Certified, auditioned, and ready for professional bookings.' },
          { icon: Briefcase, label: `${jobState.jobs.length} Active Gigs`, desc: 'From cruise ships to film studios — real opportunities posted weekly.' },
          { icon: Globe, label: 'International Reach', desc: 'Placements across Africa, Europe, and beyond.' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-white border-4 border-primary/10 p-8 rounded-[2.5rem] space-y-4">
            <Icon className="w-10 h-10 text-primary" />
            <h3 className="text-xl font-black">{label}</h3>
            <p className="text-muted-foreground text-sm font-medium">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
