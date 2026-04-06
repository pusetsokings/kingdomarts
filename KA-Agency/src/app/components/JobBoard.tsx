import React, { useState } from 'react';
import { Briefcase, MapPin, Calendar, DollarSign, Users, ChevronRight, Search, Star, Clock, Plus, X } from 'lucide-react';
import { useJobs, Job, JobCategory } from '@/app/stores/useJobStore';
import { useAuth } from '@/app/stores/useAuthStore';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const CATEGORY_COLORS: Record<JobCategory, string> = {
  'Cruise Ship': 'bg-blue-100 text-blue-700',
  'Band': 'bg-purple-100 text-purple-700',
  'Concert/Festival': 'bg-orange-100 text-orange-700',
  'Stable': 'bg-green-100 text-green-700',
  'Movie Project': 'bg-red-100 text-red-700',
  'Live Recording': 'bg-yellow-100 text-yellow-700',
  'Other': 'bg-gray-100 text-gray-700',
};

const ALL_CATEGORIES: JobCategory[] = ['Cruise Ship', 'Band', 'Concert/Festival', 'Stable', 'Movie Project', 'Live Recording', 'Other'];

function JobDetailModal({ job, onClose, onApply, applied }: { job: Job; onClose: () => void; onApply: () => void; applied: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-white w-full sm:max-w-2xl rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="bg-primary p-6 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${CATEGORY_COLORS[job.category]}`}>{job.category}</span>
              <h2 className="text-xl font-black text-white leading-tight">{job.title}</h2>
              <p className="text-white/60 text-sm mt-1 font-medium">{job.clientName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">✕</button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: MapPin, label: 'Location', value: job.location },
              { icon: DollarSign, label: 'Rate', value: `${job.rate} / ${job.rateType}` },
              { icon: Calendar, label: 'Start Date', value: new Date(job.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { icon: Users, label: 'Slots', value: `${job.slots} position${job.slots > 1 ? 's' : ''}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-muted rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
                </div>
                <p className="text-sm font-black text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Description</h3>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">{job.description}</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Required Instruments</h3>
            <div className="flex flex-wrap gap-2">{job.instruments.map(i => <span key={i} className="bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">{i}</span>)}</div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">{job.genres.map(g => <span key={g} className="bg-secondary/20 text-secondary-foreground text-[10px] font-black px-3 py-1.5 rounded-xl">{g}</span>)}</div>
          </div>
          <div className="flex items-center gap-2 bg-accent border border-primary/10 rounded-2xl p-4">
            <Star className="w-4 h-4 text-secondary fill-current" />
            <p className="text-xs font-black text-primary">Level {job.levelRequired}+ required · {job.applicants} applicants so far</p>
          </div>
        </div>
        <div className="p-4 border-t border-border flex-shrink-0">
          {applied ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-green-700 font-black text-sm">✓ Application Submitted</p>
              <p className="text-green-600 text-xs mt-1">We'll notify you when there's an update</p>
            </div>
          ) : (
            <button onClick={onApply} className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
              Apply for This Gig
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Post New Gig Modal ─────────────────────────────────────────────────────────
function PostJobModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (job: Job) => void }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Concert/Festival' as JobCategory,
    description: '',
    location: '',
    startDate: '',
    rate: '',
    rateType: 'project' as Job['rateType'],
    instruments: '',
    genres: '',
    levelRequired: 3,
    slots: 1,
    clientName: 'Kingdom Arts Agency',
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.startDate || !form.rate) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const newJob: Job = {
      id: `j${Date.now()}`,
      title: form.title,
      category: form.category,
      description: form.description || 'No description provided.',
      location: form.location,
      startDate: form.startDate,
      rate: form.rate,
      rateType: form.rateType,
      instruments: form.instruments.split(',').map(s => s.trim()).filter(Boolean),
      genres: form.genres.split(',').map(s => s.trim()).filter(Boolean),
      levelRequired: form.levelRequired,
      status: 'open',
      postedAt: new Date().toISOString().slice(0, 10),
      clientName: form.clientName,
      clientAvatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${Date.now()}`,
      applicants: 0,
      slots: form.slots,
    };
    setLoading(false);
    onSubmit(newJob);
  };

  const inputCls = 'w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all';
  const labelCls = 'block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
        className="bg-white w-full sm:max-w-2xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="bg-primary p-6 rounded-t-[2rem] sm:rounded-t-[2rem] flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-white">Post New Gig</h2>
            <p className="text-white/60 text-sm mt-0.5">Fill in the details to publish a new opportunity</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Gig Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Resident Guitarist — Grand Palm Hotel" className={inputCls} required />
            </div>
            {/* Category */}
            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Client Name */}
            <div>
              <label className={labelCls}>Client / Organisation *</label>
              <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="e.g. MSC Cruises" className={inputCls} required />
            </div>
            {/* Location */}
            <div>
              <label className={labelCls}>Location *</label>
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Gaborone, Botswana" className={inputCls} required />
            </div>
            {/* Start Date */}
            <div>
              <label className={labelCls}>Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputCls} required />
            </div>
            {/* Rate */}
            <div>
              <label className={labelCls}>Rate *</label>
              <input value={form.rate} onChange={e => set('rate', e.target.value)} placeholder="e.g. BWP 5,000" className={inputCls} required />
            </div>
            {/* Rate Type */}
            <div>
              <label className={labelCls}>Rate Type *</label>
              <select value={form.rateType} onChange={e => set('rateType', e.target.value)} className={inputCls}>
                {(['daily', 'weekly', 'monthly', 'project'] as const).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {/* Level */}
            <div>
              <label className={labelCls}>Min Level Required (1–10) *</label>
              <input type="number" min={1} max={10} value={form.levelRequired}
                onChange={e => set('levelRequired', parseInt(e.target.value) || 1)} className={inputCls} />
            </div>
            {/* Slots */}
            <div>
              <label className={labelCls}>Number of Slots *</label>
              <input type="number" min={1} max={20} value={form.slots}
                onChange={e => set('slots', parseInt(e.target.value) || 1)} className={inputCls} />
            </div>
            {/* Instruments */}
            <div>
              <label className={labelCls}>Instruments (comma-separated)</label>
              <input value={form.instruments} onChange={e => set('instruments', e.target.value)} placeholder="Guitar, Piano, Violin" className={inputCls} />
            </div>
            {/* Genres */}
            <div>
              <label className={labelCls}>Genres (comma-separated)</label>
              <input value={form.genres} onChange={e => set('genres', e.target.value)} placeholder="Jazz, Afrobeat, Gospel" className={inputCls} />
            </div>
            {/* Description */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                placeholder="Describe the gig, requirements, and what you're looking for..." className={`${inputCls} resize-none`} />
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-border flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-border text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-xs transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? 'Publishing…' : <><Plus className="w-4 h-4" />Publish Gig</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function JobBoard() {
  const { state, dispatch } = useJobs();
  const { state: authState } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<JobCategory | 'All'>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const isAdmin = authState.user.role === 'agency_admin';

  const filtered = state.jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase()) || j.instruments.some(i => i.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'All' || j.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleApply = (job: Job) => {
    if (authState.user.role === 'guest') {
      toast.error('Sign in required', { description: 'Create an account to apply for gigs.' });
      return;
    }
    dispatch({ type: 'APPLY', jobId: job.id });
    toast.success('Application submitted!', { description: `You've applied for "${job.title}"` });
    setSelectedJob(null);
  };

  const handlePostJob = (job: Job) => {
    dispatch({ type: 'ADD_JOB', job });
    setShowPostModal(false);
    toast.success('Gig published!', { description: `"${job.title}" is now live on the job board.` });
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-4">
              <Briefcase className="w-3 h-3" />
              Live Opportunities
            </div>
            <h1 className="text-3xl font-black leading-tight mb-2">Find Your Next Gig</h1>
            <p className="text-white/70 font-medium text-sm">Cruise ships, concerts, studios, and more. All in one place.</p>
          </div>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-xl flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Post New Gig
            </motion.button>
          )}
        </div>
        <Briefcase className="absolute -bottom-6 -right-6 w-48 h-48 text-white/5" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, instrument, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-muted border border-border text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(['All', ...ALL_CATEGORIES] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{filtered.length} opportunities</p>

      {/* Job cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(job => {
          const applied = state.myApplicationIds.includes(job.id);
          return (
            <motion.div
              key={job.id}
              whileHover={{ y: -3 }}
              className="bg-white border-2 border-border hover:border-primary/20 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={job.clientAvatar} alt={job.clientName} className="w-10 h-10 rounded-xl bg-muted object-cover" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{job.clientName}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_COLORS[job.category]}`}>{job.category}</span>
                    </div>
                  </div>
                  {applied && (
                    <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0">Applied</span>
                  )}
                </div>

                <h3 className="font-black text-foreground text-sm leading-tight mb-3">{job.title}</h3>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{job.location.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <DollarSign className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{job.rate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>{new Date(job.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Users className="w-3 h-3 flex-shrink-0" />
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {job.instruments.slice(0, 2).map(i => (
                      <span key={i} className="bg-accent text-primary text-[9px] font-black px-2 py-1 rounded-lg">{i}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-[10px] font-black">View</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-muted/50 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-muted-foreground">Level {job.levelRequired}+ required</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{job.slots} slot{job.slots > 1 ? 's' : ''}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-black text-lg">No gigs found</p>
          <p className="text-sm mt-1">Try adjusting your search or category filter</p>
        </div>
      )}

      <AnimatePresence>
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={() => handleApply(selectedJob)}
            applied={state.myApplicationIds.includes(selectedJob.id)}
          />
        )}
        {showPostModal && (
          <PostJobModal
            onClose={() => setShowPostModal(false)}
            onSubmit={handlePostJob}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
