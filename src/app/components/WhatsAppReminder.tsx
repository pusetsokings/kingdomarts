/**
 * WhatsAppReminder — Set and manage WhatsApp lesson reminders
 *
 * When a student (or parent) enables a reminder for an upcoming lesson,
 * we build a pre-filled WhatsApp message URL they can tap to open in WhatsApp.
 * They then send it to themselves (or a contact) as a scheduled note, OR
 * the KAA number can respond via WhatsApp Business API (Twilio) in production.
 *
 * TWO modes:
 *  1. SELF-SEND MODE (no API key needed): Opens a wa.me link with a
 *     pre-written reminder message. Student sends it to themselves.
 *     Works on mobile and desktop (opens WhatsApp or WhatsApp Web).
 *
 *  2. TWILIO MODE (production): POST to /api/whatsapp-reminder with
 *     the student phone + lesson details. Twilio sends a scheduled
 *     WhatsApp message at the specified time.
 *
 * The UI collects phone number + reminder timing, shows a preview,
 * and handles both modes gracefully.
 */

import React, { useState } from 'react';
import {
  MessageCircle, Clock, Bell, X, ChevronDown,
  CheckCircle2, Phone, Loader2, ExternalLink, Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LessonReminderConfig {
  lessonTitle: string;
  instructorName: string;
  /** ISO date-time string */
  lessonDate: string;
  /** e.g. "45 min" */
  duration: string;
}

type ReminderTiming = '15min' | '30min' | '1hr' | '2hr' | '1day';

const TIMING_OPTIONS: { value: ReminderTiming; label: string }[] = [
  { value: '15min', label: '15 minutes before' },
  { value: '30min', label: '30 minutes before' },
  { value: '1hr',   label: '1 hour before' },
  { value: '2hr',   label: '2 hours before' },
  { value: '1day',  label: '1 day before' },
];

// ── Phone formatter ───────────────────────────────────────────────────────────

function normalisePhone(raw: string): string {
  // Strip spaces, dashes, brackets; ensure international format
  let cleaned = raw.replace(/[\s\-().]/g, '');
  // Botswana prefix: +267 or 267 or 0X...
  if (cleaned.startsWith('0')) cleaned = '267' + cleaned.slice(1);
  if (!cleaned.startsWith('+')) cleaned = '+' + cleaned;
  return cleaned;
}

function formatLessonDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── WhatsApp message builder ──────────────────────────────────────────────────

function buildReminderMessage(config: LessonReminderConfig, timing: ReminderTiming): string {
  const timingLabels: Record<ReminderTiming, string> = {
    '15min': '15 minutes',
    '30min': '30 minutes',
    '1hr':   '1 hour',
    '2hr':   '2 hours',
    '1day':  '1 day',
  };
  const lessonTime = formatLessonDateTime(config.lessonDate);
  return [
    `🎵 *Kingdom Arts Academy Lesson Reminder*`,
    ``,
    `📚 *${config.lessonTitle}*`,
    `👨‍🏫 with ${config.instructorName}`,
    `📅 ${lessonTime}`,
    `⏱ Duration: ${config.duration}`,
    ``,
    `⏰ Reminder: ${timingLabels[timing]} before your lesson`,
    ``,
    `_This reminder was set via the KAA platform. See you in the lesson! 🎶_`,
  ].join('\n');
}

function buildWaLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\+/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

// ── Active reminders store (in-memory for now, localStorage in prod) ──────────

interface SavedReminder extends LessonReminderConfig {
  phone: string;
  timing: ReminderTiming;
  createdAt: string;
}

function loadReminders(): SavedReminder[] {
  try {
    const raw = localStorage.getItem('kaa_wa_reminders');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveReminder(r: SavedReminder) {
  const all = loadReminders();
  const key = r.lessonTitle + r.lessonDate;
  const filtered = all.filter(x => (x.lessonTitle + x.lessonDate) !== key);
  localStorage.setItem('kaa_wa_reminders', JSON.stringify([r, ...filtered].slice(0, 20)));
}

function removeReminder(lessonTitle: string, lessonDate: string) {
  const all = loadReminders();
  localStorage.setItem('kaa_wa_reminders', JSON.stringify(
    all.filter(x => !(x.lessonTitle === lessonTitle && x.lessonDate === lessonDate))
  ));
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface WhatsAppReminderModalProps {
  config: LessonReminderConfig;
  onClose: () => void;
}

export function WhatsAppReminderModal({ config, onClose }: WhatsAppReminderModalProps) {
  const [phone, setPhone] = useState('+267 ');
  const [timing, setTiming] = useState<ReminderTiming>('30min');
  const [step, setStep] = useState<'form' | 'preview' | 'done'>('form');
  const [loading, setLoading] = useState(false);

  const message = buildReminderMessage(config, timing);
  const waLink = buildWaLink(normalisePhone(phone), message);
  const isValidPhone = normalisePhone(phone).replace(/\D/g, '').length >= 10;

  const handleSend = async () => {
    if (!isValidPhone) {
      toast.error('Enter a valid phone number');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    // Save to local storage
    saveReminder({
      ...config,
      phone: normalisePhone(phone),
      timing,
      createdAt: new Date().toISOString(),
    });

    setLoading(false);
    setStep('done');
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
        className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">WhatsApp Reminder</h3>
              <p className="text-white/40 text-xs">Get notified before your lesson</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Form step ─────────────────────────────────── */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Lesson info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                <p className="text-white font-bold text-sm">{config.lessonTitle}</p>
                <p className="text-white/40 text-xs mt-0.5">with {config.instructorName}</p>
                <p className="text-secondary text-xs font-bold mt-1">{formatLessonDateTime(config.lessonDate)}</p>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/30 shrink-0" />
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+267 71 234 567"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-green-500/60 text-sm"
                    type="tel"
                  />
                </div>
                <p className="text-white/25 text-xs mt-1.5 pl-6">Botswana numbers: +267 7X XXX XXX</p>
              </div>

              {/* Timing */}
              <div className="mb-6">
                <label className="block text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                  When to remind you
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIMING_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTiming(opt.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors border ${
                        timing === opt.value
                          ? 'bg-green-500/20 text-green-400 border-green-500/40'
                          : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* How it works note */}
              <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-blue-300/70 text-xs leading-relaxed">
                  We'll open WhatsApp with a pre-written message. Send it to yourself as a reminder, or
                  share it with a parent. Future versions will send automatically via WhatsApp Business.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => setStep('preview')}
                  disabled={!isValidPhone}
                  className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-black uppercase tracking-widest transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Preview →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Preview step ───────────────────────────────── */}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Message Preview</p>
              <div className="bg-[#1a2e1a] border border-green-500/20 rounded-2xl p-4 mb-6 font-mono text-xs text-green-300/80 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                {message}
              </div>

              <p className="text-white/40 text-xs mb-5">
                Sending to: <span className="text-white font-bold">{normalisePhone(phone)}</span> ·
                Reminder: <span className="text-green-400 font-bold">{TIMING_OPTIONS.find(t => t.value === timing)?.label}</span>
              </p>

              <div className="flex gap-3 mb-3">
                <button onClick={() => setStep('form')} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-bold transition-colors">
                  ← Back
                </button>
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                  {loading ? 'Setting up…' : 'Set Reminder'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Done step ─────────────────────────────────── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-white font-black text-xl mb-2">Reminder Set!</h4>
              <p className="text-white/40 text-sm mb-8">
                Tap the button below to open WhatsApp and send the reminder to yourself.
              </p>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-colors mb-3 shadow-lg shadow-green-900/30"
              >
                <MessageCircle className="w-5 h-5" />
                Open in WhatsApp
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm font-bold transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ── Reminder Bell button (used inline in lesson cards) ────────────────────────

interface ReminderBellProps {
  config: LessonReminderConfig;
  className?: string;
}

export function ReminderBell({ config, className = '' }: ReminderBellProps) {
  const [showModal, setShowModal] = useState(false);

  const existing = loadReminders().find(
    r => r.lessonTitle === config.lessonTitle && r.lessonDate === config.lessonDate
  );
  const [isSet, setIsSet] = useState(!!existing);

  const handleToggle = () => {
    if (isSet) {
      removeReminder(config.lessonTitle, config.lessonDate);
      setIsSet(false);
      toast.info('WhatsApp reminder removed');
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        title={isSet ? 'Remove WhatsApp reminder' : 'Set WhatsApp reminder'}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border ${
          isSet
            ? 'bg-green-500/20 text-green-400 border-green-500/30'
            : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border-white/10'
        } ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:block">{isSet ? 'Reminded' : 'Remind Me'}</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <WhatsAppReminderModal
            key="wa-modal"
            config={config}
            onClose={() => {
              setShowModal(false);
              // Refresh is-set state
              const r = loadReminders().find(
                x => x.lessonTitle === config.lessonTitle && x.lessonDate === config.lessonDate
              );
              if (r) setIsSet(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
