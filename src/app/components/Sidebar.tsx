import React from 'react';
import {
  LayoutDashboard, BookOpen, User, Users, Settings, Trophy,
  HelpCircle, Calendar, Music, Brain, Tv, ShieldCheck,
  ClipboardCheck, BarChart3, GraduationCap, Video, Upload,
  Wallet, FileCheck, X, LogOut, ListMusic, Award, Baby
} from 'lucide-react';
import { SwitchAccountButton } from '@/app/components/LoginModal';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/app/stores/useAuthStore';
import { useCourses } from '@/app/stores/useCourseStore';

export type UserRole = 'student' | 'guest' | 'instructor' | 'admin' | 'parent';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  role: UserRole;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onSwitchAccount?: () => void;
}

export const Sidebar = ({ currentView, onNavigate, role, isMobileOpen = false, onMobileClose, onSwitchAccount }: SidebarProps) => {
  const { state: authState } = useAuth();
  const { state: courseState } = useCourses();
  const user = authState.user;

  const enrollmentCount = courseState.enrollments.length;
  const xpPercent = Math.round((user.xp / user.xpToNext) * 100);

  const navigate = (view: any) => {
    onNavigate(view);
    onMobileClose?.();
  };

  const getMenuItems = () => {
    switch (role) {
      case 'student':
        return [
          { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'courses', icon: BookOpen, label: 'My Courses', badge: enrollmentCount > 0 ? String(enrollmentCount) : null },
          { id: 'instructors', icon: Users, label: 'Faculty' },
          { id: 'schedule', icon: Calendar, label: 'Schedule' },
          { id: 'song-requests', icon: ListMusic, label: 'Song Requests' },
          { id: 'certificates', icon: Award, label: 'My Certificates' },
          { id: 'messages', icon: Music, label: 'Messages' },
          { id: 'profile', icon: User, label: 'My Profile' },
        ];
      case 'guest':
        return [
          { id: 'home', icon: LayoutDashboard, label: 'Explore Academy' },
          { id: 'instructors', icon: Users, label: 'Our Teachers' },
          { id: 'stage', icon: Tv, label: 'Virtual Stage' },
          { id: 'community', icon: Music, label: 'Join Community' },
        ];
      case 'instructor':
        return [
          { id: 'instructor-dash', icon: LayoutDashboard, label: 'Teacher Hub' },
          { id: 'upload-lesson', icon: Upload, label: 'Upload Content' },
          { id: 'instructor-lessons', icon: GraduationCap, label: 'My Lessons' },
          { id: 'song-requests', icon: ListMusic, label: 'Song Requests' },
          { id: 'teacher-reviews', icon: ClipboardCheck, label: 'Student Reviews' },
          { id: 'royalties', icon: Wallet, label: 'Royalties' },
          { id: 'schedule', icon: Calendar, label: 'Teaching Schedule' },
        ];
      case 'admin':
        return [
          { id: 'admin-dash', icon: BarChart3, label: 'System Analytics' },
          { id: 'users-manage', icon: Users, label: 'User Directory' },
          { id: 'content-approve', icon: ShieldCheck, label: 'Approvals' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ];
      case 'parent':
        return [
          { id: 'parent-dash', icon: LayoutDashboard, label: 'My Child\'s Progress' },
          { id: 'schedule', icon: Calendar, label: 'Upcoming Lessons' },
          { id: 'messages', icon: Music, label: 'Contact Instructor' },
          { id: 'profile', icon: User, label: 'My Profile' },
        ];
      default:
        return [];
    }
  };

  const getSecondaryItems = () => {
    if (role === 'guest') return [
      { id: 'hall-of-fame', icon: Trophy, label: 'Hall of Fame' },
      { id: 'help', icon: HelpCircle, label: 'Join Academy' }
    ];

    const items = [
      { id: 'hall-of-fame', icon: Trophy, label: 'Hall of Fame' },
      { id: 'community', icon: Music, label: 'Community' },
      { id: 'stage', icon: Tv, label: 'Virtual Stage' },
      { id: 'rubrics', icon: FileCheck, label: 'Rubrics' },
      { id: 'upload-guide', icon: Video, label: 'Recording Guide' },
      { id: 'scanner', icon: Brain, label: 'AI Scanner' },
    ];

    if (role === 'student') {
      items.push({ id: 'achievements', icon: Trophy, label: 'My Milestones' });
    }

    return items;
  };

  const menuItems = getMenuItems();
  const secondaryItems = getSecondaryItems();

  const sidebarContent = (
    <div className="p-8 space-y-10">
      {/* Close button - mobile only */}
      {isMobileOpen && (
        <div className="flex justify-end lg:hidden">
          <button
            onClick={onMobileClose}
            className="p-2 rounded-full bg-muted hover:bg-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* User Card */}
      <div className="bg-primary rounded-3xl overflow-hidden shadow-lg shadow-primary/20">
        {/* Top strip — avatar + name */}
        <div className="p-5 pb-4 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-secondary shadow-md">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-primary rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-black text-secondary uppercase tracking-widest truncate">
              {role === 'student' ? `Level ${user.level} Musician` : role === 'guest' ? 'Guest Artist' : role.toUpperCase()}
            </p>
            <p className="text-sm font-black text-white truncate">{user.name}</p>
          </div>
        </div>

        {/* Progress bar (student only) */}
        {role === 'student' && (
          <div className="px-5 pb-3">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5">
              <span>XP Progress</span>
              <span className="text-secondary">{xpPercent}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        )}
        {role === 'instructor' && (
          <div className="px-5 pb-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-secondary">
            <ClipboardCheck className="w-3 h-3" /> Student Reviews Active
          </div>
        )}

        {/* Switch Account — always visible at the bottom of the card */}
        {onSwitchAccount && (
          <button
            onClick={onSwitchAccount}
            className="w-full flex items-center justify-center gap-2 py-3 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-secondary border-t border-white/10 hover:bg-white/5 transition-all"
          >
            <LogOut className="w-3 h-3" /> Switch Account
          </button>
        )}
      </div>

      {/* Main Menu */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="h-px flex-1 bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Core Center</p>
          <div className="h-px flex-1 bg-border" />
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
              currentView === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 shrink-0 ${currentView === item.id ? 'text-secondary' : ''}`} />
            <span className="flex-1 text-left">{item.label}</span>
            {'badge' in item && item.badge && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                currentView === item.id ? 'bg-secondary text-primary' : 'bg-primary/10 text-primary'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tools Menu */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="h-px flex-1 bg-border" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Academy Tools</p>
          <div className="h-px flex-1 bg-border" />
        </div>
        {secondaryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
              currentView === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
            }`}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110 shrink-0" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Support Banner */}
      {role !== 'admin' && (
        <div className="relative mt-auto pt-10 pb-4">
          <div className="p-6 bg-secondary rounded-3xl text-primary overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest mb-2">Academy Help</p>
              <p className="text-[10px] font-bold leading-relaxed opacity-80 mb-4">
                {role === 'instructor' ? 'Instructor Portal Guide' : 'Need guidance on your level?'}
              </p>
              <button className="w-full py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Contact Us</button>
            </div>
            <Music className="w-20 h-20 absolute -bottom-4 -right-4 opacity-10" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-border min-h-[calc(100vh-4.5rem)] sticky top-18 bg-white overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[90] w-80 bg-white border-r border-border overflow-y-auto shadow-2xl"
            >
              {/* Logo in mobile drawer */}
              <div className="flex items-center justify-between px-8 pt-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-secondary fill-secondary" />
                  </div>
                  <div className="flex flex-col -space-y-0.5">
                    <span className="font-bold text-lg tracking-tight">Kingdom Arts</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-secondary">Academy</span>
                  </div>
                </div>
                <button onClick={onMobileClose} className="p-2 rounded-full bg-muted hover:bg-border transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
