/**
 * SongRequest — Student/Instructor song request board
 *
 * Students can submit songs they'd like to learn.
 * Instructors can accept, decline, set priority, and leave notes.
 * Other students can upvote popular requests.
 *
 * Helps instructors plan repertoire and shows students they're heard.
 */

import React, { useState, useMemo, useReducer } from 'react';
import {
  Music2, Plus, ThumbsUp, Check, X, ChevronDown,
  Clock, Star, Filter, SortAsc, Search, Crown,
  AlertCircle, MessageSquare, Trash2, ExternalLink,
  ListMusic, CheckCircle2, XCircle, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';
import {
  useSongRequests,
  SongRequest as SongRequestType,
  RequestStatus,
  RequestPriority,
} from '@/app/stores/useSongRequestStore';

// ── Status configs ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RequestStatus, { label: string; cls: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',  icon: Clock },
  accepted:  { label: 'Accepted',  cls: 'bg-green-500/15 text-green-400 border-green-500/30',     icon: CheckCircle2 },
  declined:  { label: 'Declined',  cls: 'bg-red-500/15 text-red-400 border-red-500/30',           icon: XCircle },
  completed: { label: 'Completed', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30',        icon: Star },
};

const PRIORITY_CONFIG: Record<RequestPriority, { label: string; cls: string }> = {
  low:    { label: 'Low',    cls: 'text-white/30' },
  normal: { label: 'Normal', cls: 'text-secondary/70' },
  high:   { label: 'High',   cls: 'text-orange-400' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function youtubeSearchUrl(title: string, artist: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${artist}`)}`;
}

// ── Submit Form ───────────────────────────────────────────────────────────────

interface SubmitFormProps {
  instructorId: string;
  instructorName: string;
  studentId: string;
  studentName: string;
  onSubmit: (data: {
    songTitle: string; artistName: string; genre: string; reason: string;
    instructorId: string; instructorName: string;
    studentId: string; studentName: string; priority: RequestPriority;
  }) => void;
  onClose: () => void;
}

function SubmitForm({ instructorId, instructorName, studentId, studentName, onSubmit, onClose }: SubmitFormProps) {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [genre, setGenre] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const GENRES = ['Jazz', 'Classical', 'Blues & R&B', 'Gospel', 'Afrobeat', 'Kwaito', 'Amapiano', 'Folk', 'Pop', 'Rock', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !artistName.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600)); // simulate async
    onSubmit({ songTitle: songTitle.trim(), artistName: artistName.trim(), genre, reason: reason.trim(),
               instructorId, instructorName, studentId, studentName, priority: 'normal' });
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <Music2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">Request a Song</h3>
              <p className="text-white/40 text-xs">Ask {instructorName} to teach you a specific piece</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Song title */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              Song Title <span className="text-red-400">*</span>
            </label>
            <input
              value={songTitle}
              onChange={e => setSongTitle(e.target.value)}
              placeholder="e.g. Careless Whisper"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/60 text-sm"
              required
            />
          </div>

          {/* Artist name */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              Artist / Band <span className="text-red-400">*</span>
            </label>
            <input
              value={artistName}
              onChange={e => setArtistName(e.target.value)}
              placeholder="e.g. George Michael"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/60 text-sm"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Genre</label>
            <select
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/60 text-sm appearance-none"
            >
              <option value="">Select a genre (optional)</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              Why do you want to learn this? <span className="text-white/30 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. I want to play it at my sister's wedding..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/60 text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!songTitle.trim() || !artistName.trim() || submitting}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music2 className="w-4 h-4" />}
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Instructor Note Modal ─────────────────────────────────────────────────────

function InstructorNoteModal({
  request,
  action,
  onConfirm,
  onClose,
}: {
  request: SongRequestType;
  action: 'accepted' | 'declined';
  onConfirm: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState('');
  const isAccept = action === 'accepted';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className={`w-12 h-12 ${isAccept ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-2xl flex items-center justify-center mb-4`}>
          {isAccept
            ? <CheckCircle2 className="w-6 h-6 text-green-400" />
            : <XCircle className="w-6 h-6 text-red-400" />}
        </div>
        <h3 className="text-white font-black text-lg mb-1">
          {isAccept ? 'Accept Request' : 'Decline Request'}
        </h3>
        <p className="text-white/50 text-sm mb-6">
          "{request.songTitle}" by {request.artistName} — requested by {request.studentName}
        </p>

        <div className="mb-6">
          <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
            Leave a note for the student <span className="text-white/30 font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={isAccept
              ? "e.g. Great choice! We'll start this next Tuesday…"
              : "e.g. Let's build your fundamentals first — request again in 4 weeks…"}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/60 text-sm resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-bold transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note)}
            className={`flex-1 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-colors ${
              isAccept ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAccept ? 'Accept' : 'Decline'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Song Request Card ─────────────────────────────────────────────────────────

function RequestCard({
  request,
  currentUserId,
  isInstructor,
  onUpvote,
  onAccept,
  onDecline,
  onComplete,
  onDelete,
  onSetPriority,
}: {
  request: SongRequestType;
  currentUserId: string;
  isInstructor: boolean;
  onUpvote: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onSetPriority: (p: RequestPriority) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const hasUpvoted = request.upvotes.includes(currentUserId);
  const { label: statusLabel, cls: statusCls, icon: StatusIcon } = STATUS_CONFIG[request.status];
  const { cls: priorityCls } = PRIORITY_CONFIG[request.priority];
  const isOwner = request.studentId === currentUserId;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 rounded-2xl p-5 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-white font-black text-base truncate">{request.songTitle}</h4>
            {isInstructor && request.priority === 'high' && (
              <span className={`text-[9px] font-black uppercase tracking-widest ${priorityCls}`}>● High Priority</span>
            )}
          </div>
          <p className="text-white/50 text-sm">by {request.artistName}{request.genre && <span className="text-white/30"> · {request.genre}</span>}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusCls}`}>
            <StatusIcon className="w-3 h-3" />
            {statusLabel}
          </span>
          {/* YouTube search link */}
          <a
            href={youtubeSearchUrl(request.songTitle, request.artistName)}
            target="_blank"
            rel="noopener noreferrer"
            title="Search on YouTube"
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Reason */}
      {request.reason && (
        <p className="text-white/40 text-sm italic mb-3 line-clamp-2">"{request.reason}"</p>
      )}

      {/* Instructor note (accepted/declined) */}
      {request.instructorNote && (
        <div className={`flex items-start gap-2 mb-3 px-3 py-2.5 rounded-xl ${
          request.status === 'accepted' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
        }`}>
          <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-white/40 shrink-0" />
          <p className="text-white/60 text-xs leading-relaxed">{request.instructorNote}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 mt-3">
        {/* Left: student + time */}
        <div className="flex items-center gap-2 text-white/30 text-xs font-bold min-w-0">
          <div className="w-6 h-6 bg-primary/30 rounded-full flex items-center justify-center shrink-0">
            <span className="text-[8px] text-white/60 font-black">{request.studentName[0]}</span>
          </div>
          <span className="truncate">{isOwner ? 'You' : request.studentName}</span>
          <span className="shrink-0 text-white/20">·</span>
          <span className="shrink-0">{timeAgo(request.createdAt)}</span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Upvote (for other students, or instructor to see popularity) */}
          {!isOwner && request.status === 'pending' && (
            <button
              onClick={onUpvote}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                hasUpvoted
                  ? 'bg-secondary/20 text-secondary border border-secondary/30'
                  : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              {request.upvotes.length > 0 && <span>{request.upvotes.length}</span>}
            </button>
          )}
          {(isOwner || isInstructor) && request.upvotes.length > 0 && (
            <span className="flex items-center gap-1 text-white/30 text-[10px] font-bold">
              <ThumbsUp className="w-3 h-3" />
              {request.upvotes.length}
            </span>
          )}

          {/* Instructor controls */}
          {isInstructor && (
            <div className="relative">
              <button
                onClick={() => setShowActions(v => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10"
              >
                Actions <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-full mt-1 bg-[#1a1030] border border-white/10 rounded-2xl py-2 z-50 shadow-2xl min-w-[170px]"
                    onMouseLeave={() => setShowActions(false)}
                  >
                    {request.status === 'pending' && (
                      <>
                        <button onClick={() => { onAccept(); setShowActions(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-green-400 hover:bg-white/5 text-xs font-bold transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button onClick={() => { onDecline(); setShowActions(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-white/5 text-xs font-bold transition-colors">
                          <XCircle className="w-3.5 h-3.5" /> Decline
                        </button>
                        <div className="border-t border-white/5 my-1" />
                        <button onClick={() => { onSetPriority('high'); setShowActions(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-orange-400 hover:bg-white/5 text-xs font-bold transition-colors">
                          <Star className="w-3.5 h-3.5" /> Mark High Priority
                        </button>
                      </>
                    )}
                    {request.status === 'accepted' && (
                      <button onClick={() => { onComplete(); setShowActions(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-blue-400 hover:bg-white/5 text-xs font-bold transition-colors">
                        <Check className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    )}
                    <div className="border-t border-white/5 my-1" />
                    <button onClick={() => { onDelete(); setShowActions(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400/60 hover:bg-white/5 text-xs font-bold transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Owner can delete their own pending request */}
          {isOwner && request.status === 'pending' && !isInstructor && (
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-400 transition-colors"
              title="Delete this request"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export const SongRequest = () => {
  const { state: authState } = useAuth();
  const { state, dispatch } = useSongRequests();
  const user = authState.user;
  const isInstructor = user.role === 'instructor' || user.role === 'admin';

  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [noteModal, setNoteModal] = useState<{ request: SongRequestType; action: 'accepted' | 'declined' } | null>(null);
  const [search, setSearch] = useState('');

  // ── Filter + sort ───────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = state.requests;

    // Instructors see requests directed to them; students see their own + all others
    if (isInstructor) {
      list = list.filter(r => r.instructorId === user.id || r.instructorId === 'instr-001');
    }

    if (state.filterStatus !== 'all') {
      list = list.filter(r => r.status === state.filterStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.songTitle.toLowerCase().includes(q) ||
        r.artistName.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q)
      );
    }

    if (state.sortBy === 'popular') {
      list = [...list].sort((a, b) => b.upvotes.length - a.upvotes.length);
    } else if (state.sortBy === 'status') {
      const order: RequestStatus[] = ['pending', 'accepted', 'completed', 'declined'];
      list = [...list].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [state.requests, state.filterStatus, state.sortBy, search, isInstructor, user.id]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    pending: state.requests.filter(r => r.status === 'pending').length,
    accepted: state.requests.filter(r => r.status === 'accepted').length,
    completed: state.requests.filter(r => r.status === 'completed').length,
  }), [state.requests]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSubmit = (data: Parameters<typeof dispatch>[0] extends { type: 'SUBMIT_REQUEST' } ? Parameters<typeof dispatch>[0]['request'] : never) => {
    dispatch({ type: 'SUBMIT_REQUEST', request: data });
    setShowSubmitForm(false);
    toast.success('Song request submitted!', {
      description: 'Your instructor will be notified. Other students can upvote your request too.',
    });
  };

  const handleAcceptConfirm = (note: string) => {
    if (!noteModal) return;
    dispatch({ type: 'UPDATE_STATUS', requestId: noteModal.request.id, status: 'accepted', instructorNote: note || undefined });
    setNoteModal(null);
    toast.success('Request accepted', { description: `Student will be notified about "${noteModal.request.songTitle}"` });
  };

  const handleDeclineConfirm = (note: string) => {
    if (!noteModal) return;
    dispatch({ type: 'UPDATE_STATUS', requestId: noteModal.request.id, status: 'declined', instructorNote: note || undefined });
    setNoteModal(null);
    toast.info('Request declined', { description: 'A note has been sent to the student.' });
  };

  const FILTER_TABS: { label: string; value: 'all' | RequestStatus }[] = [
    { label: 'All', value: 'all' },
    { label: `Pending (${stats.pending})`, value: 'pending' },
    { label: `Accepted (${stats.accepted})`, value: 'accepted' },
    { label: `Completed (${stats.completed})`, value: 'completed' },
    { label: 'Declined', value: 'declined' },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="px-6 lg:px-10 pt-8 pb-6 border-b border-white/5">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <ListMusic className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-white font-black text-2xl">Song Requests</h1>
                <p className="text-white/40 text-sm">
                  {isInstructor
                    ? 'Manage what your students want to learn'
                    : "Tell your instructor which songs you'd like to learn"}
                </p>
              </div>
            </div>
          </div>

          {!isInstructor && (
            <button
              onClick={() => setShowSubmitForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-colors shadow-lg shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:block">Request a Song</span>
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          {[
            { label: 'Pending', value: stats.pending, cls: 'text-yellow-400' },
            { label: 'Accepted', value: stats.accepted, cls: 'text-green-400' },
            { label: 'Completed', value: stats.completed, cls: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <span className={`text-lg font-black ${s.cls}`}>{s.value}</span>
              <span className="text-white/40 text-xs font-bold">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => dispatch({ type: 'SET_FILTER', status: tab.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${
                state.filterStatus === tab.value
                  ? 'bg-primary text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="px-6 lg:px-10 py-4 flex items-center gap-3 border-b border-white/5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search songs, artists…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-primary/60 text-sm"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {([['newest', 'New'], ['popular', '🔥 Popular'], ['status', 'Status']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => dispatch({ type: 'SET_SORT', by: val })}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                state.sortBy === val ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Instructor: add request on behalf of student */}
        {isInstructor && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>

      {/* ── List ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <Music2 className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-white/40 font-black text-lg mb-2">No requests here yet</h3>
            <p className="text-white/20 text-sm max-w-xs">
              {!isInstructor
                ? 'Be the first to request a song — your instructor wants to know what you\'re passionate about!'
                : 'No song requests match your current filters.'}
            </p>
            {!isInstructor && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="mt-6 flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-colors"
              >
                <Plus className="w-4 h-4" /> Request a Song
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  currentUserId={user.id}
                  isInstructor={isInstructor}
                  onUpvote={() => dispatch({ type: 'UPVOTE', requestId: request.id, studentId: user.id })}
                  onAccept={() => setNoteModal({ request, action: 'accepted' })}
                  onDecline={() => setNoteModal({ request, action: 'declined' })}
                  onComplete={() => {
                    dispatch({ type: 'UPDATE_STATUS', requestId: request.id, status: 'completed' });
                    toast.success('Marked as completed!');
                  }}
                  onDelete={() => {
                    dispatch({ type: 'DELETE_REQUEST', requestId: request.id });
                    toast.info('Request removed');
                  }}
                  onSetPriority={(p) => dispatch({ type: 'SET_PRIORITY', requestId: request.id, priority: p })}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Submit form modal ─────────────────────────── */}
      <AnimatePresence>
        {showSubmitForm && (
          <SubmitForm
            instructorId={isInstructor ? user.id : 'instr-001'}
            instructorName={isInstructor ? user.name : 'Naledi Moremi'}
            studentId={user.id}
            studentName={user.name}
            onSubmit={(data: any) => handleSubmit(data)}
            onClose={() => setShowSubmitForm(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Instructor note modal ─────────────────────── */}
      <AnimatePresence>
        {noteModal && (
          <InstructorNoteModal
            request={noteModal.request}
            action={noteModal.action}
            onConfirm={noteModal.action === 'accepted' ? handleAcceptConfirm : handleDeclineConfirm}
            onClose={() => setNoteModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
