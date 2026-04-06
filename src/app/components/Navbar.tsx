import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Crown, X, Menu, MessageCircle, Video, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/app/stores/useAuthStore';
import { ALL_COURSES } from '@/app/stores/useCourseStore';
import { useLiveStream } from '@/app/stores/useLiveStreamStore';
import { useMessages } from '@/app/stores/useMessageStore';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  onToggleMobileMenu?: () => void;
}

export const Navbar = ({ onOpenAuth, onNavigate, currentView, onToggleMobileMenu }: NavbarProps) => {
  const { state: authState } = useAuth();
  const user = authState.user;
  const { state: lsState } = useLiveStream();
  const { state: msgState } = useMessages();

  // Calculate unread message count
  const unreadMessageCount = msgState.contacts.reduce((count, contact) => {
    return count + contact.messages.filter(m => m.sender === 'them' && !m.read).length;
  }, 0);

  // Calculate total notification count
  const pendingInviteCount = lsState.pendingInvite ? 1 : 0;
  const notifCount = unreadMessageCount + pendingInviteCount;

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Global search: courses + navigation items
  const NAV_ITEMS = [
    { label: 'Home', view: 'home', type: 'page' },
    { label: 'Courses', view: 'courses', type: 'page' },
    { label: 'Instructors', view: 'instructors', type: 'page' },
    { label: 'Community', view: 'community', type: 'page' },
    { label: 'Messages', view: 'messages', type: 'page' },
    { label: 'Live Schedule', view: 'schedule', type: 'page' },
    { label: 'Virtual Stage', view: 'stage', type: 'page' },
    { label: 'Hall of Fame', view: 'hall-of-fame', type: 'page' },
    { label: 'Profile', view: 'profile', type: 'page' },
  ];

  const q = query.toLowerCase().trim();
  const results = q.length < 2 ? [] : [
    ...NAV_ITEMS.filter(item => item.label.toLowerCase().includes(q)).map(item => ({
      id: item.view,
      label: item.label,
      sub: 'Page',
      view: item.view,
    })),
    ...ALL_COURSES.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      c.instrument.toLowerCase().includes(q)
    ).slice(0, 5).map(c => ({
      id: c.id,
      label: c.title,
      sub: `${c.instructor} · ${c.instrument}`,
      view: 'courses',
    })),
  ].slice(0, 7);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = searchRef.current?.querySelector('input');
        input?.focus();
        setShowResults(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (view: string) => {
    onNavigate(view);
    setQuery('');
    setShowResults(false);
  };

  return (
    <header className="bg-white border-b border-border h-18 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Hamburger — mobile only */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted transition-colors mr-2"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg"
          >
            <Crown className="w-6 h-6 fill-secondary" />
          </motion.div>
          <div className="flex flex-col -space-y-1">
            <span className="font-bold text-xl tracking-tight text-foreground">Kingdom Arts</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Academy</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative" ref={searchRef}>
            <div className="flex items-center relative group">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <input
                type="text"
                placeholder="Search courses… ⌘K"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                className="bg-muted border-none rounded-full pl-10 pr-8 py-2 text-sm w-56 xl:w-72 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setShowResults(false); }}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Dropdown */}
            <AnimatePresence>
              {showResults && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 w-80 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-[200]"
                >
                  {results.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleSelect(r.view)}
                      className="w-full text-left px-5 py-3.5 hover:bg-muted transition-colors flex items-center gap-3 border-b border-border last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Search className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-black">{r.label}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{r.sub}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full border-2 border-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {notifCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 right-0 w-80 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-[200]"
                >
                  {notifCount === 0 ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary/30" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No notifications</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {/* Unread Messages */}
                      {unreadMessageCount > 0 && (
                        <>
                          <div className="px-5 py-3 bg-primary/5 border-b border-border flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Unread Messages</span>
                          </div>
                          {msgState.contacts
                            .filter(c => c.messages.some(m => m.sender === 'them' && !m.read))
                            .map(contact => {
                              const unreadCount = contact.messages.filter(m => m.sender === 'them' && !m.read).length;
                              const lastUnread = contact.messages.findLast(m => m.sender === 'them' && !m.read);
                              return (
                                <button
                                  key={contact.id}
                                  onClick={() => {
                                    onNavigate('messages');
                                    setShowNotifications(false);
                                  }}
                                  className="w-full text-left px-5 py-3 hover:bg-muted transition-colors border-b border-border last:border-0 group"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="relative shrink-0 mt-0.5">
                                      <img
                                        src={contact.avatar}
                                        alt={contact.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                                      />
                                      {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                                          {unreadCount}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{contact.name}</p>
                                      <p className="text-[12px] text-muted-foreground truncate">{lastUnread?.text || ''}</p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                        </>
                      )}

                      {/* Pending Live Invites */}
                      {pendingInviteCount > 0 && (
                        <>
                          <div className="px-5 py-3 bg-secondary/10 border-b border-border flex items-center gap-2">
                            <Video className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-black uppercase tracking-widest text-secondary">Live Session Invite</span>
                          </div>
                          {lsState.pendingInvite && (
                            <div className="px-5 py-3 border-b border-border">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                  <Video className="w-5 h-5 text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-foreground">{lsState.pendingInvite.instructorName}</p>
                                  <p className="text-[12px] text-muted-foreground">{lsState.pendingInvite.courseTitle} ({lsState.pendingInvite.instrument})</p>
                                  <p className="text-[11px] text-secondary font-semibold mt-1">Live now — Join session</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {notifCount > 0 && (
                    <div className="px-5 py-3 bg-muted/30 border-t border-border text-center">
                      <button
                        onClick={() => {
                          onNavigate('messages');
                          setShowNotifications(false);
                        }}
                        className="text-xs font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                      >
                        View all notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border ${currentView === 'profile' ? 'bg-muted border-border' : ''}`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-black hidden sm:block">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
