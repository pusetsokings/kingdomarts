import React from 'react';
import {
  LayoutDashboard, Briefcase, Users, BookOpen, Wallet,
  MessageSquare, Settings, HelpCircle, Star, ClipboardList,
  UserCheck, BarChart3, Globe, X, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth, AgencyRole } from '@/app/stores/useAuthStore';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  role: AgencyRole;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onSwitchAccount?: () => void;
}

export function Sidebar({ currentView, onNavigate, role, isMobileOpen = false, onMobileClose, onSwitchAccount }: SidebarProps) {
  const { state: authState } = useAuth();
  const user = authState.user;

  const navigate = (view: string) => {
    onNavigate(view);
    onMobileClose?.();
  };

  const getMenuItems = () => {
    switch (role) {
      case 'musician':
        return [
          { id: 'home', icon: LayoutDashboard, label: 'My Dashboard' },
          { id: 'job-board', icon: Briefcase, label: 'Job Board' },
          { id: 'my-applications', icon: ClipboardList, label: 'My Applications' },
          { id: 'my-bookings', icon: BookOpen, label: 'My Bookings' },
          { id: 'earnings', icon: Wallet, label: 'Earnings' },
          { id: 'messages', icon: MessageSquare, label: 'Messages' },
          { id: 'profile', icon: UserCheck, label: 'My Profile' },
        ];
      case 'client':
        return [
          { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'musicians', icon: Users, label: 'Find Musicians' },
          { id: 'my-requests', icon: ClipboardList, label: 'My Requests' },
          { id: 'my-bookings', icon: BookOpen, label: 'My Bookings' },
          { id: 'messages', icon: MessageSquare, label: 'Messages' },
          { id: 'profile', icon: UserCheck, label: 'Profile' },
        ];
      case 'agency_admin':
        return [
          { id: 'home', icon: BarChart3, label: 'Analytics' },
          { id: 'talent-roster', icon: Users, label: 'Talent Roster' },
          { id: 'job-listings', icon: Briefcase, label: 'Job Listings' },
          { id: 'applications-queue', icon: ClipboardList, label: 'Applications' },
          { id: 'bookings-manage', icon: BookOpen, label: 'Bookings' },
          { id: 'client-directory', icon: Globe, label: 'Clients' },
          { id: 'payments', icon: Wallet, label: 'Payments' },
        ];
      case 'guest':
        return [
          { id: 'home', icon: Globe, label: 'Explore Agency' },
          { id: 'job-board', icon: Briefcase, label: 'Browse Jobs' },
          { id: 'musicians', icon: Users, label: 'Find Musicians' },
        ];
      default:
        return [];
    }
  };

  const secondaryItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
  ];

  const menuItems = getMenuItems();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User card */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 p-3 bg-accent rounded-2xl">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover bg-primary/10" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{role.replace('_', ' ')}</p>
            {role === 'musician' && user.certified && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-2.5 h-2.5 text-secondary fill-current" />
                <span className="text-[9px] font-black text-secondary uppercase tracking-widest">KAA Certified</span>
              </div>
            )}
          </div>
        </div>

        {role === 'musician' && (
          <div className="mt-3 px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Level {user.level}</span>
              <span className="text-[9px] text-muted-foreground">{user.xp}/{user.xpToNext} XP</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${Math.round((user.xp / user.xpToNext) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.map(item => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-secondary' : ''}`} />
              <span className="text-[11px] font-black uppercase tracking-widest flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-secondary" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-0.5">
        {secondaryItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              currentView === item.id ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        {user.role !== 'guest' && (
          <button
            onClick={onSwitchAccount}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-accent transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">Switch Account</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <p className="font-black text-primary uppercase tracking-widest text-xs">Navigation</p>
                <button onClick={onMobileClose} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
