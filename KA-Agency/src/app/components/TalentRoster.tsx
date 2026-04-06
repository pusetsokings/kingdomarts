import React, { useState } from 'react';
import { Search, Star, MapPin, Music, CheckCircle2, Clock, Mic2, X, Play, ExternalLink } from 'lucide-react';
import { useMusicians, Musician } from '@/app/stores/useMusicianStore';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const AVAILABILITY_COLORS = {
  available: 'bg-green-100 text-green-700',
  booked: 'bg-yellow-100 text-yellow-700',
  'on-gig': 'bg-blue-100 text-blue-700',
};

const AVAILABILITY_LABELS = {
  available: 'Available',
  booked: 'Booked',
  'on-gig': 'On Gig',
};

const CERT_LABELS = {
  kaa: 'KAA Certified',
  external: 'Ext. Certified',
  pending: 'Pending',
};

// ── Musician Detail Modal ─────────────────────────────────────────────────────
function MusicianDetailModal({ musician, isClientView, onClose }: { musician: Musician; isClientView: boolean; onClose: () => void }) {
  const CERT_BADGE = {
    kaa: { label: 'KAA Certified', color: 'bg-secondary/20 text-secondary-foreground' },
    external: { label: 'Externally Certified', color: 'bg-blue-100 text-blue-700' },
    pending: { label: 'Certification Pending', color: 'bg-yellow-100 text-yellow-700' },
  };
  const cert = CERT_BADGE[musician.certSource];

  const handleRequest = () => {
    toast.success(`Booking request sent for ${musician.name}`, { description: 'The agency will follow up within 24 hours.' });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
        className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Hero banner */}
        <div className="bg-gradient-to-br from-primary to-primary/80 p-6 relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-4">
            <img src={musician.avatar} alt={musician.name} className="w-20 h-20 rounded-[1.25rem] border-4 border-white/30 object-cover" />
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${AVAILABILITY_COLORS[musician.availability]}`}>
                  {AVAILABILITY_LABELS[musician.availability]}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cert.color}`}>
                  {cert.label}
                </span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{musician.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-white/50" />
                <span className="text-xs text-white/60 font-medium">{musician.location}</span>
              </div>
            </div>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              { label: 'Level', value: musician.level },
              { label: 'Gigs', value: musician.gigsCompleted },
              { label: 'Rating', value: `${musician.rating.toFixed(1)}★` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                <p className="text-base font-black text-secondary">{value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Bio */}
          {musician.bio && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">About</h3>
              <p className="text-sm text-foreground/80 font-medium leading-relaxed">{musician.bio}</p>
            </div>
          )}

          {/* Instruments */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Instruments</h3>
            <div className="flex flex-wrap gap-2">
              {musician.instruments.map(i => (
                <span key={i} className="bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">{i}</span>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {musician.genres.map(g => (
                <span key={g} className="border border-border text-foreground/70 text-[10px] font-medium px-3 py-1.5 rounded-xl">{g}</span>
              ))}
            </div>
          </div>

          {/* Samples */}
          {musician.samples.length > 0 ? (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Audio / Video Samples</h3>
              <div className="space-y-2">
                {musician.samples.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted rounded-2xl p-4">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Play className="w-4 h-4 text-secondary fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-foreground truncate">{s.title}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{s.type}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-2xl p-5 text-center text-muted-foreground">
              <Music className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">No samples uploaded yet</p>
            </div>
          )}

          {/* Joined */}
          <p className="text-[10px] text-muted-foreground font-medium">
            Member since {new Date(musician.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-border flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-border text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-xs transition-colors">
            Close
          </button>
          {isClientView ? (
            <button
              onClick={handleRequest}
              disabled={musician.availability !== 'available'}
              className="flex-1 py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {musician.availability === 'available' ? 'Request This Musician' : 'Not Available'}
            </button>
          ) : (
            <button
              onClick={() => { toast.info(`Viewing ${musician.name}'s full admin profile`); onClose(); }}
              className="flex-1 py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
            >
              View Admin Profile
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface Props {
  isClientView?: boolean;
}

export function TalentRoster({ isClientView = false }: Props) {
  const { state } = useMusicians();
  const [search, setSearch] = useState('');
  const [filterAvail, setFilterAvail] = useState<'all' | Musician['availability']>('all');
  const [selectedMusician, setSelectedMusician] = useState<Musician | null>(null);

  const filtered = state.roster.filter(m => {
    const s = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(s) || m.instruments.some(i => i.toLowerCase().includes(s)) || m.genres.some(g => g.toLowerCase().includes(s)) || m.location.toLowerCase().includes(s);
    const matchAvail = filterAvail === 'all' || m.availability === filterAvail;
    return matchSearch && matchAvail;
  });

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary">{isClientView ? 'Find Musicians' : 'Talent Roster'}</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            {isClientView ? 'Browse certified musicians available for hire' : `${state.roster.length} certified musicians in your roster`}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-accent border border-primary/10 rounded-2xl px-4 py-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-black text-primary">{state.roster.filter(m => m.certified).length} Certified</span>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, instrument, genre, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-muted border border-border text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'available', 'booked', 'on-gig'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterAvail(f)}
              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterAvail === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            >
              {f === 'all' ? 'All' : AVAILABILITY_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Musician grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(musician => (
          <motion.div
            key={musician.id}
            whileHover={{ y: -4 }}
            className="bg-white border-2 border-border hover:border-primary/20 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            {/* Top section */}
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <img src={musician.avatar} alt={musician.name} className="w-14 h-14 rounded-[1rem] border-2 border-white/30 object-cover" />
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${AVAILABILITY_COLORS[musician.availability]}`}>
                  {AVAILABILITY_LABELS[musician.availability]}
                </span>
              </div>
              <h3 className="font-black text-white text-base leading-tight">{musician.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-white/50" />
                <span className="text-xs text-white/60 font-medium">{musician.location}</span>
              </div>
              <Mic2 className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5" />
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
              {/* Cert badge */}
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-secondary fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{CERT_LABELS[musician.certSource]}</span>
                <span className="ml-auto text-[10px] font-black text-muted-foreground">Level {musician.level}</span>
              </div>

              {/* Instruments */}
              <div className="flex flex-wrap gap-1.5">
                {musician.instruments.map(i => (
                  <span key={i} className="bg-accent text-primary text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">{i}</span>
                ))}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5">
                {musician.genres.slice(0, 3).map(g => (
                  <span key={g} className="text-[9px] font-medium text-muted-foreground border border-border px-2 py-0.5 rounded-lg">{g}</span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-base font-black text-primary">{musician.gigsCompleted}</p>
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Gigs</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-black text-primary">{musician.rating.toFixed(1)}</p>
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Rating</p>
                </div>
                <button
                  onClick={() => setSelectedMusician(musician)}
                  className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                >
                  {isClientView ? 'Request' : 'View'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="font-black text-lg text-muted-foreground">No musicians found</p>
        </div>
      )}

      <AnimatePresence>
        {selectedMusician && (
          <MusicianDetailModal
            musician={selectedMusician}
            isClientView={isClientView}
            onClose={() => setSelectedMusician(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
