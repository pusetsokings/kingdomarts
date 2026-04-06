import React, { useState, useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Sidebar } from '@/app/components/Sidebar';
import { LoginModal } from '@/app/components/LoginModal';
import { JobBoard } from '@/app/components/JobBoard';
import { TalentRoster } from '@/app/components/TalentRoster';
import { MusicianDashboard, AgencyAdminDashboard, ClientDashboard, GuestExplore } from '@/app/components/Dashboards';
import {
  MyApplications, MyBookings, Earnings, ApplicationsQueue,
  Messages, AgencySettings, AgencyHelp, MusicianProfile,
  ClientDirectory, OnboardingFlow
} from '@/app/components/MiscViews';
import { useAuth, AgencyRole } from '@/app/stores/useAuthStore';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { ShieldCheck, Eye } from 'lucide-react';

type View =
  | 'home'
  | 'job-board'
  | 'musicians'
  | 'my-applications'
  | 'my-bookings'
  | 'earnings'
  | 'messages'
  | 'profile'
  | 'talent-roster'
  | 'job-listings'
  | 'applications-queue'
  | 'bookings-manage'
  | 'client-directory'
  | 'payments'
  | 'my-requests'
  | 'onboarding'
  | 'settings'
  | 'help'
  | 'login';

const VALID_VIEWS = new Set<View>([
  'home', 'job-board', 'musicians', 'my-applications', 'my-bookings', 'earnings',
  'messages', 'profile', 'talent-roster', 'job-listings', 'applications-queue',
  'bookings-manage', 'client-directory', 'payments', 'my-requests', 'onboarding',
  'settings', 'help',
]);

function getViewFromHash(): View {
  const hash = window.location.hash.replace('#', '').replace('/', '') as View;
  return VALID_VIEWS.has(hash) ? hash : 'home';
}

function AccessDenied({ requiredRole }: { requiredRole?: string }) {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center">
        <ShieldCheck className="w-12 h-12 text-primary/30" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h2 className="text-2xl font-black text-primary">Access Restricted</h2>
        <p className="text-muted-foreground font-medium">
          {requiredRole ? `This section is only accessible to ${requiredRole}.` : 'You do not have permission to view this page.'}
        </p>
      </div>
      <div className="flex items-center gap-2 px-5 py-3 bg-muted rounded-2xl border border-border text-xs font-bold text-muted-foreground">
        <Eye className="w-4 h-4" />
        Use the "Switch Account" option to change your role.
      </div>
    </div>
  );
}

const App = () => {
  const { state: authState, dispatch: authDispatch } = useAuth();
  const role = authState.user.role as AgencyRole;
  const [currentView, setCurrentView] = useState<View>(getViewFromHash);
  const [showLoginModal, setShowLoginModal] = useState(!localStorage.getItem('kaa_agency_user'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentView !== 'login') {
      window.location.hash = '#' + currentView;
    }
  }, [currentView]);

  useEffect(() => {
    const onHashChange = () => {
      const v = getViewFromHash();
      setCurrentView(v);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (v: string) => {
    if (v === 'login') {
      setShowLoginModal(true);
      return;
    }
    setCurrentView(v as View);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (selectedRole: AgencyRole) => {
    authDispatch({ type: 'SET_ROLE', role: selectedRole });
    localStorage.setItem('kaa_agency_user', selectedRole);
    setShowLoginModal(false);
    if (selectedRole === 'agency_admin') setCurrentView('home');
    else setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      // ── Home (role-based) ────────────────────────────────────────────────
      case 'home':
        if (role === 'musician') return <MusicianDashboard onNavigate={handleNavigate} />;
        if (role === 'agency_admin') return <AgencyAdminDashboard onNavigate={handleNavigate} />;
        if (role === 'client') return <ClientDashboard onNavigate={handleNavigate} />;
        return <GuestExplore onNavigate={handleNavigate} />;

      // ── Job Board (all roles) ────────────────────────────────────────────
      case 'job-board':
      case 'job-listings':
        return <JobBoard />;

      // ── Musicians / Talent ───────────────────────────────────────────────
      case 'musicians':
        return <TalentRoster isClientView={role === 'client' || role === 'guest'} />;
      case 'talent-roster':
        return role === 'agency_admin'
          ? <TalentRoster isClientView={false} />
          : <AccessDenied requiredRole="Agency Admin" />;

      // ── Musician views ───────────────────────────────────────────────────
      case 'my-applications':
        return role !== 'guest' ? <MyApplications /> : <AccessDenied requiredRole="musician" />;
      case 'my-bookings':
      case 'bookings-manage':
        return role !== 'guest' ? <MyBookings /> : <AccessDenied requiredRole="registered user" />;
      case 'earnings':
      case 'payments':
        return role === 'musician' || role === 'agency_admin'
          ? <Earnings />
          : <AccessDenied requiredRole="musician or admin" />;

      // ── Admin views ──────────────────────────────────────────────────────
      case 'applications-queue':
        return role === 'agency_admin'
          ? <ApplicationsQueue />
          : <AccessDenied requiredRole="Agency Admin" />;
      case 'client-directory':
        return role === 'agency_admin'
          ? <ClientDirectory />
          : <AccessDenied requiredRole="Agency Admin" />;

      // ── Shared views ─────────────────────────────────────────────────────
      case 'messages':
        return role !== 'guest' ? <Messages /> : <AccessDenied requiredRole="registered user" />;
      case 'profile':
        return role !== 'guest' ? <MusicianProfile /> : <AccessDenied requiredRole="registered user" />;
      case 'onboarding':
        return <OnboardingFlow onNavigate={handleNavigate} />;
      case 'settings':
        return <AgencySettings />;
      case 'help':
        return <AgencyHelp />;
      case 'my-requests':
        return role === 'client' ? <MyBookings /> : <AccessDenied requiredRole="client" />;

      default:
        return <GuestExplore onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary font-sans">
      <Toaster richColors position="bottom-right" />

      <AnimatePresence>
        {showLoginModal && <LoginModal onLogin={handleLogin} />}
      </AnimatePresence>

      <Navbar
        onNavigate={handleNavigate}
        currentView={currentView}
        onToggleMobileMenu={() => setIsMobileMenuOpen(v => !v)}
      />

      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          role={role}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
          onSwitchAccount={() => setShowLoginModal(true)}
        />

        <main className="flex-1 min-w-0 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
