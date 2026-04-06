import React from 'react';
import { motion } from 'motion/react';
import { Music2, Mic2, Building2, ShieldCheck, User } from 'lucide-react';
import { AgencyRole } from '@/app/stores/useAuthStore';

interface LoginModalProps {
  onLogin: (role: AgencyRole) => void;
}

const ROLES: { role: AgencyRole; icon: React.ElementType; label: string; desc: string; color: string }[] = [
  { role: 'musician', icon: Mic2, label: 'Musician', desc: 'Browse gigs, apply for bookings, manage your career', color: 'bg-primary text-white' },
  { role: 'client', icon: Building2, label: 'Client / Promoter', desc: 'Find talent, post gigs, manage bookings', color: 'bg-secondary text-primary' },
  { role: 'agency_admin', icon: ShieldCheck, label: 'Agency Admin', desc: 'Manage roster, bookings, and platform operations', color: 'bg-foreground text-white' },
  { role: 'guest', icon: User, label: 'Browse as Guest', desc: 'Explore available gigs and musicians without signing in', color: 'bg-muted text-muted-foreground' },
];

export function LoginModal({ onLogin }: LoginModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-2xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Music2 className="w-8 h-8 text-primary fill-current" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Kingdom Arts Agency</h1>
          <p className="text-white/60 font-medium text-sm">Botswana's Premier Musician Placement Agency</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Select your role to continue</span>
          </div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map(({ role, icon: Icon, label, desc, color }) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLogin(role)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-[1.5rem] p-5 text-left transition-all group"
            >
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-black text-white mb-1">{label}</p>
              <p className="text-xs text-white/50 font-medium leading-relaxed">{desc}</p>
            </motion.button>
          ))}
        </div>

        <p className="text-center mt-6 text-white/30 text-xs font-medium">
          This is a prototype. Select any role to explore the interface.
        </p>
      </motion.div>
    </motion.div>
  );
}
