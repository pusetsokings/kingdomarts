import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, DollarSign, Wallet, Briefcase, Star, Settings, HelpCircle, MessageSquare, Send } from 'lucide-react';
import { useJobs } from '@/app/stores/useJobStore';
import { useAuth } from '@/app/stores/useAuthStore';
import { motion } from 'motion/react';
import { toast } from 'sonner';

// ─── Applications View ───────────────────────────────────────────────────────
export function MyApplications() {
  const { state } = useJobs();

  const STATUS_CONFIG = {
    pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending Review' },
    shortlisted: { icon: Star, color: 'bg-blue-100 text-blue-700', label: 'Shortlisted' },
    accepted: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Accepted' },
    rejected: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' },
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-primary">My Applications</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">{state.applications.length} applications submitted</p>
      </div>

      {state.applications.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="font-black text-lg text-muted-foreground">No applications yet</p>
          <p className="text-sm text-muted-foreground mt-1">Browse the job board and apply for gigs</p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.applications.map(app => {
            const job = state.jobs.find(j => j.id === app.jobId);
            const config = STATUS_CONFIG[app.status];
            const Icon = config.icon;
            return (
              <motion.div key={app.id} whileHover={{ x: 4 }} className="bg-white border-2 border-border rounded-[1.5rem] overflow-hidden">
                <div className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-black text-foreground text-sm leading-tight">{job?.title}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{job?.clientName} · {job?.location.split(',')[0]}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 flex-shrink-0 ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    {app.note && (
                      <p className="text-xs text-muted-foreground mt-2 bg-muted rounded-xl p-3 font-medium italic">"{app.note}"</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-2">Applied {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Bookings View ───────────────────────────────────────────────────────────
export function MyBookings() {
  const MOCK_BOOKINGS = [
    { id: 'b1', title: 'Jazz Night — Grand Palm Hotel', date: '2026-04-05', rate: 'BWP 3,000', status: 'confirmed' },
    { id: 'b2', title: 'Corporate Event — Pula Indaba', date: '2026-04-18', rate: 'BWP 4,500', status: 'upcoming' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-primary">My Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Confirmed gigs and upcoming engagements</p>
      </div>
      <div className="space-y-4">
        {MOCK_BOOKINGS.map(b => (
          <div key={b.id} className="bg-white border-2 border-border rounded-[1.5rem] p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-black text-foreground text-sm">{b.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · {b.rate}</p>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Earnings View ───────────────────────────────────────────────────────────
export function Earnings() {
  const TRANSACTIONS = [
    { id: 't1', desc: 'Grand Palm Hotel — Jazz Set', date: '2026-03-15', amount: 3000, type: 'credit' },
    { id: 't2', desc: 'Platform fee (5%)', date: '2026-03-15', amount: -150, type: 'debit' },
    { id: 't3', desc: 'BIMF Pre-event Rehearsal', date: '2026-03-01', amount: 800, type: 'credit' },
    { id: 't4', desc: 'Platform fee (5%)', date: '2026-03-01', amount: -40, type: 'debit' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-primary">Earnings</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Track your income from gigs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Earned', value: 'BWP 26,700', icon: DollarSign, bg: 'bg-primary', text: 'text-white' },
          { label: 'This Month', value: 'BWP 6,200', icon: TrendingUpIcon, bg: 'bg-secondary', text: 'text-primary' },
          { label: 'Pending', value: 'BWP 4,500', icon: Clock, bg: 'bg-accent', text: 'text-primary' },
        ].map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className={`${bg} rounded-[1.5rem] p-6`}>
            <Icon className={`w-6 h-6 ${text} mb-3 opacity-70`} />
            <p className={`text-2xl font-black ${text}`}>{value}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest ${text} opacity-60 mt-0.5`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-border rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-black text-foreground">Transaction History</h3>
        </div>
        <div className="divide-y divide-border">
          {TRANSACTIONS.map(t => (
            <div key={t.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                <DollarSign className={`w-4 h-4 ${t.type === 'credit' ? 'text-green-600' : 'text-red-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-foreground truncate">{t.desc}</p>
                <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className={`text-sm font-black ${t.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                {t.type === 'credit' ? '+' : ''}BWP {Math.abs(t.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return <DollarSign className={className} />;
}

// ─── Applications Queue (Admin) ──────────────────────────────────────────────
export function ApplicationsQueue() {
  const { state, dispatch } = useJobs();
  const [filter, setFilter] = useState<'all' | 'pending' | 'shortlisted' | 'accepted' | 'rejected'>('all');

  const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    shortlisted: { label: 'Shortlisted', color: 'bg-blue-100 text-blue-700' },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  };

  const filtered = filter === 'all' ? state.applications : state.applications.filter(a => a.status === filter);
  const pendingCount = state.applications.filter(a => a.status === 'pending').length;

  const handleAction = (id: string, status: 'accepted' | 'rejected' | 'shortlisted') => {
    dispatch({ type: 'UPDATE_APPLICATION', id, status });
    const labels = { accepted: 'Application accepted', rejected: 'Application declined', shortlisted: 'Moved to shortlist' };
    toast.success(labels[status]);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-primary">Applications Queue</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            {state.applications.length} total · {pendingCount} need review
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl">
            {pendingCount} Awaiting Review
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'shortlisted', 'accepted', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {f === 'all' ? `All (${state.applications.length})` : `${STATUS_CONFIG[f].label} (${state.applications.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white border-2 border-border rounded-[2rem] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <ClipboardListIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-black">No applications in this category</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(app => {
              const job = state.jobs.find(j => j.id === app.jobId);
              const cfg = STATUS_CONFIG[app.status];
              return (
                <motion.div key={app.id} whileHover={{ backgroundColor: '#f8f4ff' }} className="p-5 flex items-start gap-4 transition-colors">
                  <img src={app.musicianAvatar} alt={app.musicianName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-foreground text-sm">{app.musicianName}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{job?.title} · {job?.clientName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Level {app.level} · {app.instrument}</p>
                    {app.note && (
                      <p className="text-xs text-muted-foreground mt-2 bg-muted rounded-xl p-2.5 font-medium italic">"{app.note}"</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Applied {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {app.status === 'pending' || app.status === 'shortlisted' ? (
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleAction(app.id, 'shortlisted')}
                          className="bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-blue-200 transition-colors"
                        >
                          Shortlist
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(app.id, 'accepted')}
                        className="bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-green-200 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(app.id, 'rejected')}
                        className="bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-red-200 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl flex-shrink-0 ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ClipboardListIcon({ className }: { className?: string }) {
  return <Briefcase className={className} />;
}

// ─── Messages ────────────────────────────────────────────────────────────────
export function Messages() {
  const MOCK_THREADS = [
    { id: 'm1', name: 'MSC Cruises', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=msc', last: 'We\'ve shortlisted you for the guitarist position...', time: '2h ago', unread: 2 },
    { id: 'm2', name: 'BIMF Committee', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=bimf', last: 'Thank you for applying! Please send us a sample...', time: '1d ago', unread: 0 },
    { id: 'm3', name: 'Agency Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', last: 'Congratulations! You\'ve been confirmed for...', time: '2d ago', unread: 1 },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-primary">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">Your booking conversations</p>
      </div>
      <div className="bg-white border-2 border-border rounded-[2rem] overflow-hidden">
        <div className="divide-y divide-border">
          {MOCK_THREADS.map(t => (
            <motion.div key={t.id} whileHover={{ backgroundColor: '#f8f4ff' }} className="px-5 py-4 flex items-center gap-4 cursor-pointer transition-colors">
              <div className="relative">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-xl object-cover bg-muted" />
                {t.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">{t.unread}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${t.unread > 0 ? 'font-black text-foreground' : 'font-medium text-muted-foreground'}`}>{t.name}</p>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">{t.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{t.last}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input placeholder="Type a message..." className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings & Help ─────────────────────────────────────────────────────────
export function AgencySettings() {
  return (
    <div className="p-6 lg:p-10 space-y-6">
      <h1 className="text-2xl font-black text-primary">Settings</h1>
      <div className="bg-white border-2 border-border rounded-[2rem] p-8 text-center text-muted-foreground space-y-3">
        <Settings className="w-12 h-12 mx-auto opacity-20" />
        <p className="font-black">Settings coming soon</p>
        <p className="text-sm">Notification preferences, account security, and more.</p>
      </div>
    </div>
  );
}

export function AgencyHelp() {
  return (
    <div className="p-6 lg:p-10 space-y-6">
      <h1 className="text-2xl font-black text-primary">Help & Support</h1>
      <div className="bg-white border-2 border-border rounded-[2rem] p-8 text-center text-muted-foreground space-y-3">
        <HelpCircle className="w-12 h-12 mx-auto opacity-20" />
        <p className="font-black">Help centre coming soon</p>
        <p className="text-sm">FAQs, guides, and agency contact information.</p>
      </div>
    </div>
  );
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export function MusicianProfile() {
  const { state: authState } = useAuth();
  const user = authState.user;

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-2xl mx-auto">
      <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="flex items-center gap-5">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-[1.5rem] border-4 border-white/30 object-cover" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-secondary text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {user.role === 'musician' ? 'KAA Certified' : user.role.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            <p className="text-white/60 text-sm font-medium">{user.location || 'Gaborone, Botswana'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-border rounded-[2rem] p-6 space-y-4">
        <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Bio</h3>
        <p className="text-sm text-foreground/80 font-medium leading-relaxed">{user.bio || 'No bio added yet.'}</p>
      </div>

      {user.role === 'musician' && (
        <>
          <div className="bg-white border-2 border-border rounded-[2rem] p-6 space-y-4">
            <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Instruments</h3>
            <div className="flex flex-wrap gap-2">
              {user.instrument ? (
                <span className="bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">{user.instrument}</span>
              ) : <p className="text-sm text-muted-foreground">No instruments added</p>}
            </div>
          </div>
          <div className="bg-white border-2 border-border rounded-[2rem] p-6 space-y-4">
            <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Audio / Video Samples</h3>
            <div className="bg-muted rounded-2xl p-8 text-center text-muted-foreground">
              <p className="text-sm font-medium">Upload samples to showcase your talent</p>
              <button className="mt-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-primary/30">
                Upload Sample
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Client Directory (Admin) ─────────────────────────────────────────────────
export function ClientDirectory() {
  const CLIENTS = [
    { id: 'c1', name: 'MSC Cruises', type: 'Cruise Line', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=msc', bookings: 4, location: 'International' },
    { id: 'c2', name: 'BIMF Committee', type: 'Festival Organiser', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=bimf', bookings: 2, location: 'Gaborone' },
    { id: 'c3', name: 'Grand Palm Hotel', type: 'Hospitality', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=palm', bookings: 8, location: 'Gaborone' },
    { id: 'c4', name: 'Zebra Film Productions', type: 'Film / Media', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=zebra', bookings: 1, location: 'Gaborone' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-primary">Client Directory</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">{CLIENTS.length} registered clients</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CLIENTS.map(c => (
          <div key={c.id} className="bg-white border-2 border-border rounded-[1.5rem] p-5 flex items-center gap-4">
            <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-xl bg-muted" />
            <div className="flex-1 min-w-0">
              <p className="font-black text-foreground text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.type} · {c.location}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-primary">{c.bookings}</p>
              <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Onboarding CTA (for non-certified external musicians) ───────────────────
export function OnboardingFlow({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-2xl mx-auto">
      <div className="bg-primary p-10 rounded-[3rem] text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Star className="w-8 h-8 text-primary fill-current" />
          </div>
          <h2 className="text-3xl font-black mb-3">Get Agency Certified</h2>
          <p className="text-white/70 font-medium text-sm mb-8 max-w-sm mx-auto">
            Complete our 8-week Musician Certification Track at Kingdom Arts Academy and unlock professional gig placements.
          </p>
          <button
            onClick={() => window.open('https://school.kingdomarts.org.bw', '_blank')}
            className="bg-secondary text-primary font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl shadow-xl"
          >
            Start Certification at KAA
          </button>
        </div>
        <Star className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { step: '01', label: 'Enroll', desc: 'Sign up for the Musician Certification Track at Kingdom Arts Academy.' },
          { step: '02', label: 'Train', desc: 'Complete focused courses, live sessions, and skill assessments (8 weeks).' },
          { step: '03', label: 'Get Placed', desc: 'Receive your certification and access the full Agency job board.' },
        ].map(({ step, label, desc }) => (
          <div key={step} className="bg-white border-2 border-border rounded-[2rem] p-6 space-y-3">
            <span className="text-3xl font-black text-primary/20">{step}</span>
            <h3 className="font-black text-foreground">{label}</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
