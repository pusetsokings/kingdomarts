/**
 * AuthModal — Real Supabase-backed Login & Registration
 * Replaces the demo-only LoginModal for production use.
 *
 * Features:
 *  - Email + Password Login (Supabase Auth)
 *  - New student registration with profile creation
 *  - "Continue as Guest" for browsing without account
 *  - "Dev Mode" toggle to use demo role-switcher (development only)
 *  - Beautiful branded design matching KAA purple/gold palette
 */

import React, { useState } from 'react';
import {
  Crown, GraduationCap, Music, ArrowRight, Eye, EyeOff,
  Mail, Lock, User, Guitar, Loader2, AlertCircle, CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn, signUp } from '@/lib/supabase';

const INSTRUMENTS = [
  'Piano', 'Guitar', 'Violin', 'Saxophone', 'Drums', 'Bass Guitar',
  'Trumpet', 'Flute', 'Cello', 'Voice / Vocals', 'Segaba', 'Marimba', 'Other',
];

type AuthView = 'login' | 'register' | 'success';

interface AuthModalProps {
  onGuestEntry: () => void;
  onAuthSuccess: (userId: string) => void;
  /** Dev only — show the role switcher instead */
  onDevMode?: () => void;
}

export function AuthModal({ onGuestEntry, onAuthSuccess, onDevMode }: AuthModalProps) {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInstrument, setRegInstrument] = useState('');
  const [regCity, setRegCity] = useState('');

  const clearError = () => setError(null);

  // ── Login ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!loginEmail || !loginPassword) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const { data, error: authError } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Incorrect email or password. Please try again.'
        : authError.message);
      return;
    }
    if (data.user) onAuthSuccess(data.user.id);
  };

  // ── Register ─────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!regName || !regEmail || !regPassword || !regInstrument) {
      setError('Please fill in all required fields.');
      return;
    }
    if (regPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { error: authError } = await signUp(regEmail, regPassword, regName, regInstrument);
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    setView('success');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-primary flex items-center justify-center p-4 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl shadow-2xl mb-4">
            <Crown className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Kingdom Arts Academy</h1>
          <p className="text-white/50 text-sm mt-1">Botswana's Premier Online Music School</p>
        </div>

        {/* Tab toggle */}
        <AnimatePresence mode="wait">
          {view !== 'success' && (
            <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
              {(['login', 'register'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setView(tab); clearError(); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                    view === tab
                      ? 'bg-secondary text-primary shadow-lg'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 mb-4"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Login Form ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-secondary/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-secondary/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-primary font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 disabled:opacity-60 transition-all text-sm mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </motion.form>
          )}

          {/* ── Register Form ──────────────────────────────── */}
          {view === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5 block">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-secondary/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-secondary/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5 block">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-secondary/60 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5 block">Instrument *</label>
                  <div className="relative">
                    <Guitar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <select
                      value={regInstrument}
                      onChange={e => setRegInstrument(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-3 py-3 text-white text-sm focus:outline-none focus:border-secondary/60 appearance-none transition-colors"
                    >
                      <option value="" className="bg-primary">Select…</option>
                      {INSTRUMENTS.map(i => (
                        <option key={i} value={i} className="bg-primary">{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5 block">City</label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={e => setRegCity(e.target.value)}
                    placeholder="e.g. Gaborone"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-secondary/60 transition-colors"
                  />
                </div>
              </div>

              <p className="text-white/30 text-xs">
                Your account will be reviewed by our team before being activated. You'll receive a confirmation email.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-primary font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 disabled:opacity-60 transition-all text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                {loading ? 'Creating Account…' : 'Create Student Account'}
              </button>
            </motion.form>
          )}

          {/* ── Success State ──────────────────────────────── */}
          {view === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Application Submitted!</h2>
              <p className="text-white/50 text-sm mb-6">
                Check your email to verify your account. Our team will review and activate it shortly.
              </p>
              <button
                onClick={() => setView('login')}
                className="text-secondary font-bold text-sm hover:text-secondary/80 transition-colors"
              >
                Back to Sign In →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        {view !== 'success' && (
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/25 text-xs font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        )}

        {/* Guest + Dev actions */}
        {view !== 'success' && (
          <div className="space-y-3">
            <button
              onClick={onGuestEntry}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-bold text-sm transition-all"
            >
              <Music className="w-4 h-4" />
              Continue as Guest (browse only)
            </button>

            {onDevMode && (
              <button
                onClick={onDevMode}
                className="w-full text-center text-white/20 hover:text-white/40 text-xs font-bold py-2 transition-colors"
              >
                ⚙ Dev: Use Role Switcher
              </button>
            )}
          </div>
        )}

        <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-widest mt-8">
          Kingdom Arts Academy · Botswana
        </p>
      </motion.div>
    </div>
  );
}
