import React, { useState } from 'react';
import { Crown, GraduationCap, ShieldCheck, Music, ArrowRight, LogOut, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/app/stores/useAuthStore';
import type { UserRole } from '@/app/stores/useAuthStore';

interface Account {
  role: UserRole;
  name: string;
  title: string;
  email: string;
  avatar: string;
  icon: React.ElementType;
  accent: string;         // Tailwind bg class for icon circle
  description: string;
}

const ACCOUNTS: Account[] = [
  {
    role: 'student',
    name: 'Lerato Dube',
    title: 'Level 5 Student',
    email: 'lerato@kingdomarts.bw',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    icon: GraduationCap,
    accent: 'bg-secondary',
    description: 'Browse courses, attend live sessions, track progress.',
  },
  {
    role: 'instructor',
    name: 'Naledi Moremi',
    title: 'Head Instructor · Saxophone',
    email: 'naledi@kingdomarts.bw',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop',
    icon: Music,
    accent: 'bg-primary',
    description: 'Manage lessons, upload content, go live, view royalties.',
  },
  {
    role: 'admin',
    name: 'Academy Admin',
    title: 'System Administrator',
    email: 'admin@kingdomarts.bw',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    icon: ShieldCheck,
    accent: 'bg-primary/80',
    description: 'Full platform control — users, approvals, analytics.',
  },
  {
    role: 'parent',
    name: 'Mpho Dube',
    title: 'Parent · Lerato\'s Guardian',
    email: 'mpho.dube@example.bw',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    icon: Baby,
    accent: 'bg-green-600/40',
    description: 'Monitor your child\'s progress, attendance, and lesson schedule.',
  },
  {
    role: 'guest',
    name: 'Guest Artist',
    title: 'Invited Guest',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    icon: Crown,
    accent: 'bg-muted',
    description: 'Explore the academy without an account.',
  },
];

interface LoginModalProps {
  onLogin: (role: UserRole) => void;
}

export const LoginModal = ({ onLogin }: LoginModalProps) => {
  const [hovered, setHovered] = useState<UserRole | null>(null);

  return (
    <div className="fixed inset-0 z-[200] bg-primary flex items-center justify-center p-4 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-2xl"
      >
        {/* Logo + heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl shadow-2xl mb-6">
            <Crown className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Kingdom Arts Academy</h1>
          <p className="text-white/60 font-medium">Select your account to continue</p>
        </div>

        {/* Account cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACCOUNTS.map((account) => {
            const Icon = account.icon;
            const isHovered = hovered === account.role;
            return (
              <motion.button
                key={account.role}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHovered(account.role)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onLogin(account.role)}
                className="relative bg-white/10 hover:bg-white/20 border border-white/10 hover:border-secondary/50 rounded-[2rem] p-6 text-left transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20"
                    />
                    <div className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 ${account.accent} rounded-full flex items-center justify-center border-2 border-primary shadow-lg`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white truncate">{account.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/80 mt-0.5">
                      {account.title}
                    </p>
                    {account.email && (
                      <p className="text-[10px] text-white/40 font-medium mt-1 truncate">{account.email}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-white/50 font-medium leading-relaxed mb-4">
                  {account.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    account.role === 'guest' ? 'bg-white/10 text-white/50' : 'bg-secondary/20 text-secondary'
                  }`}>
                    {account.role}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-all ${isHovered ? 'text-secondary translate-x-1' : 'text-white/30'}`} />
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest mt-8">
          Kingdom Arts Academy · Botswana
        </p>
      </motion.div>
    </div>
  );
};

// ── Switch Account button shown in sidebar ─────────────────────────────────────
export const SwitchAccountButton = ({ onSwitch }: { onSwitch: () => void }) => (
  <button
    onClick={onSwitch}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-primary transition-all group"
  >
    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
    Switch Account
  </button>
);
