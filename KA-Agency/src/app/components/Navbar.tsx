import React from 'react';
import { Music2, Bell, Menu, ExternalLink } from 'lucide-react';
import { useAuth } from '@/app/stores/useAuthStore';
import { motion } from 'motion/react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onToggleMobileMenu: () => void;
}

export function Navbar({ onNavigate, currentView, onToggleMobileMenu }: NavbarProps) {
  const { state: authState } = useAuth();
  const user = authState.user;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Music2 className="w-5 h-5 text-secondary fill-current" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 leading-none">Kingdom Arts</p>
            <p className="text-sm font-black text-primary leading-tight">Agency</p>
          </div>
        </div>

        {/* Center nav pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-muted rounded-2xl p-1">
          {[
            { id: 'home', label: 'Home' },
            { id: 'job-board', label: 'Job Board' },
            { id: 'musicians', label: 'Find Musicians' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                currentView === item.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* School app link */}
          <a
            href="https://school.kingdomarts.org.bw"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary border border-border hover:border-primary/30 px-3 py-2 rounded-xl transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            Academy
          </a>

          {user.role !== 'guest' && (
            <button className="relative w-9 h-9 rounded-xl bg-muted hover:bg-accent transition-colors flex items-center justify-center">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border border-white" />
            </button>
          )}

          {user.role !== 'guest' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl bg-muted hover:bg-accent transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover bg-primary/10"
              />
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-black text-foreground leading-none">{user.name.split(' ')[0]}</p>
                <p className="text-[9px] text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </motion.button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
          >
            <Menu className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
