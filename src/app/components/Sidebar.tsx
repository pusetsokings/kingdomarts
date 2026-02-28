import React from 'react';
import { 
  LayoutDashboard, BookOpen, User, Users, Settings, Trophy, 
  HelpCircle, Calendar, Music, Brain, Tv, ShieldCheck, 
  ClipboardCheck, BarChart3, GraduationCap, Video, Upload,
  Wallet, FileCheck, HelpCircle as HelpIcon, Info
} from 'lucide-react';
import { motion } from 'motion/react';

export type UserRole = 'student' | 'guest' | 'instructor' | 'admin';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  role: UserRole;
}

export const Sidebar = ({ currentView, onNavigate, role }: SidebarProps) => {
  // Navigation mapping by role
  const getMenuItems = () => {
    switch (role) {
      case 'student':
        return [
          { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'courses', icon: BookOpen, label: 'My Courses' },
          { id: 'instructors', icon: Users, label: 'Faculty' },
          { id: 'schedule', icon: Calendar, label: 'Schedule' },
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
          { id: 'feedback-review', icon: ClipboardCheck, label: 'Video Reviews' },
          { id: 'royalties', icon: Wallet, label: 'Royalties' },
          { id: 'courses', icon: GraduationCap, label: 'My Lessons' },
          { id: 'schedule', icon: Calendar, label: 'Teaching Schedule' },
        ];
      case 'admin':
        return [
          { id: 'admin-dash', icon: BarChart3, label: 'System Analytics' },
          { id: 'users-manage', icon: Users, label: 'User Directory' },
          { id: 'content-approve', icon: ShieldCheck, label: 'Approvals' },
          { id: 'settings', icon: Settings, label: 'Settings' },
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

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r border-border min-h-[calc(100vh-4.5rem)] sticky top-18 bg-white overflow-y-auto">
      <div className="p-8 space-y-10">
        {/* User Stats/Role Card */}
        <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img 
                src={role === 'instructor' ? "https://images.unsplash.com/photo-1656313836297-0cd072f08f43?auto=format&fit=crop&w=100&q=80" : role === 'admin' ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" : "https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=100&q=80"} 
                alt="Profile" 
              />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-primary uppercase tracking-widest truncate">
                {role === 'student' ? 'Level 12 Musician' : role === 'guest' ? 'Invited Guest' : role.toUpperCase()}
              </p>
              <p className="text-sm font-bold truncate">
                {role === 'instructor' ? 'Blessing Moyo' : role === 'admin' ? 'K. Arts Admin' : 'Lerato Molefe'}
              </p>
            </div>
          </div>
          {role === 'student' && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Exp Progress</span>
                <span>85%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[85%]"></div>
              </div>
            </div>
          )}
          {role === 'instructor' && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-600">
               <Video className="w-3 h-3" /> 4 Pending Reviews
            </div>
          )}
        </div>

        {/* Main Menu */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 mb-4">Core Center</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
                currentView === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1' 
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${currentView === item.id ? 'text-secondary' : ''}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Tools Menu */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 mb-4">Academy Tools</p>
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
                currentView === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1' 
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
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
    </aside>
  );
};
