import React from 'react';
import { Award, Trophy, Star, Crown, Lock, ChevronRight, Zap, Target, Music, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/app/stores/useAuthStore';

export const Achievements = () => {
  const achievements = [
    { title: "First Note", description: "Complete your first lesson", icon: Music, status: "unlocked", date: "Jan 1, 2026" },
    { title: "Royal Streak", description: "Maintain a 30-day practice streak", icon: Crown, status: "unlocked", date: "Jan 30, 2026" },
    { title: "Traditional Master", description: "Complete all traditional Botswana courses", icon: Award, status: "locked", progress: 60 },
    { title: "Stage Ready", description: "Attend a live workshop in Gaborone", icon: Star, status: "locked", progress: 0 },
    { title: "Rhythm King", description: "Perfect score on Rhythm basics", icon: Zap, status: "unlocked", date: "Jan 15, 2026" },
    { title: "Golden Ears", description: "Pass Advanced Ear Training", icon: Trophy, status: "locked", progress: 25 },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Achievements</h1>
          <p className="text-muted-foreground font-medium max-w-xl">Track your musical milestones and unlock royal rewards as you grow.</p>
        </div>
        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-primary shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Achievement Score</p>
            <p className="text-xl font-black">2,450 pts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {achievements.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`p-8 rounded-3xl border transition-all relative overflow-hidden ${
              item.status === 'unlocked' ? 'bg-white border-border shadow-sm' : 'bg-muted/50 border-border/50 grayscale'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
              item.status === 'unlocked' ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <item.icon className={`w-7 h-7 ${item.status === 'unlocked' ? 'fill-primary' : ''}`} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
              <p className="text-sm font-medium text-muted-foreground">{item.description}</p>
            </div>

            {item.status === 'unlocked' ? (
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Unlocked</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.date}</span>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
                </div>
              </div>
            )}

            {item.status === 'locked' && (
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Toggle component for settings
function SettingToggle({ label, description, checked, onChange }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-bold">{label}</p>
        {description && <p className="text-xs text-muted-foreground font-medium mt-0.5">{description}</p>}
      </div>
      <div
        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-primary' : 'bg-border'}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'right-1' : 'left-1'}`}
        />
      </div>
    </button>
  );
}

export const Settings = () => {
  const { state: authState } = useAuth();
  const user = authState.user;

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your Academy preferences and account.</p>
      </div>

      <div className="space-y-6">
        {/* Account Preferences */}
        <div className="p-6 bg-white border border-border rounded-3xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Account Preferences</h3>
          <SettingToggle
            label="Email Notifications"
            description="Receive updates about lessons, live sessions and community"
            checked={true}
            onChange={() => {}}
          />
          <SettingToggle
            label="Live Lesson Alerts"
            description="Get notified when an instructor invites you to a live session"
            checked={true}
            onChange={() => {}}
          />
          <SettingToggle
            label="Community Digest"
            description="Weekly highlights from the Academy community feed"
            checked={false}
            onChange={() => {}}
          />
        </div>

        {/* Appearance */}
        <div className="p-6 bg-white border border-border rounded-3xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Appearance</h3>
          <div className="flex items-center gap-4 p-5 bg-primary/5 border-2 border-primary rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border">
              <Sun className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-primary">Light Mode</p>
              <p className="text-xs text-muted-foreground font-medium">Kingdom Arts Academy — brand light theme</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-secondary/30 px-2.5 py-1 rounded-full">Active</span>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="p-6 bg-white border border-border rounded-3xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Privacy & Security</h3>
          <button className="w-full text-left p-4 hover:bg-muted rounded-2xl transition-colors font-bold text-sm flex items-center justify-between">
            Change Password <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full text-left p-4 hover:bg-muted rounded-2xl transition-colors font-bold text-sm flex items-center justify-between">
            Privacy Settings <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full text-left p-4 hover:bg-muted rounded-2xl transition-colors font-bold text-sm flex items-center justify-between">
            Connected Devices <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <button className="w-full py-4 bg-red-50 text-red-600 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-colors">
          Deactivate Account
        </button>
      </div>
    </div>
  );
};

export const Support = () => (
  <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-black tracking-tight">How can we help?</h1>
      <p className="text-muted-foreground font-medium">Search our help center or contact our royal support team.</p>
      <div className="relative max-w-xl mx-auto">
        <input type="text" placeholder="Search for help..." className="w-full bg-white border border-border rounded-2xl px-6 py-4 shadow-sm outline-none focus:ring-2 focus:ring-primary/20" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {['Billing & Payments', 'Technical Issues', 'Course Access', 'Instructor Interaction'].map((cat, i) => (
        <div key={i} className="p-8 bg-white border border-border rounded-3xl hover:border-primary transition-all cursor-pointer group">
          <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">{cat}</h3>
          <p className="text-sm text-muted-foreground font-medium mb-6">Find common questions and guides related to {cat.toLowerCase()}.</p>
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
            Read Articles <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-primary p-10 rounded-[2.5rem] text-white text-center">
      <h3 className="text-2xl font-black mb-4">Still need assistance?</h3>
      <p className="text-white/70 font-medium mb-8">Our team is available Mon-Fri, 8 AM - 6 PM Gaborone time.</p>
      <button className="bg-secondary text-primary font-black uppercase tracking-widest text-xs px-10 py-5 rounded-full shadow-xl hover:bg-white transition-all">Contact Support</button>
    </div>
  </div>
);
