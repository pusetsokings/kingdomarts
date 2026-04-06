import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Globe, Award, GraduationCap, Medal, Sparkles, Lock, ShieldCheck } from 'lucide-react';

// Hall of Fame is admin-curated. Entries are published by the admin.
// This file ships with 1 founder entry as a template demo.
// Real student entries will be added once students earn milestones.

const ADMIN_FEATURED = {
  category: 'Academy Founders & Faculty',
  description: 'Honoring the founder and founding instructors of Kingdom Arts Academy.',
  icon: ShieldCheck,
  color: 'bg-primary',
  items: [
    {
      name: 'Naledi Moremi',
      achievement: 'Founder & Head Saxophone Instructor — Kingdom Arts Academy, Gaborone, Botswana',
      date: 'Est. 2023',
      image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop',
      badge: 'Founder',
    },
  ],
};

const EMPTY_CATEGORIES = [
  {
    category: 'International Excellence',
    description: 'Students performing on the global stage representing Botswana.',
    icon: Globe,
    color: 'bg-blue-500',
  },
  {
    category: 'Level 10 Graduates',
    description: 'The elite few who have mastered their craft through all 10 levels.',
    icon: GraduationCap,
    color: 'bg-secondary',
  },
  {
    category: 'Perfect Scores',
    description: 'Students who achieved 100% in their technical assessments.',
    icon: Star,
    color: 'bg-green-500',
  },
];

export const HallOfFame = () => {
  return (
    <div className="p-6 lg:p-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-secondary/30">
          <Trophy className="w-4 h-4" />
          Prestige & Excellence
        </div>
        <h1 className="text-5xl font-black tracking-tight text-primary">Academy Hall of Fame</h1>
        <p className="text-muted-foreground font-medium text-lg">
          Celebrating the exceptional milestones and global achievements of our royal musicians.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-full text-xs font-medium border border-border">
          <ShieldCheck className="w-3.5 h-3.5" />
          Entries are curated and published by the Academy admin
        </div>
      </div>

      {/* Admin-featured Founder Entry */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className={`w-14 h-14 ${ADMIN_FEATURED.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
            <ADMIN_FEATURED.icon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black text-primary">{ADMIN_FEATURED.category}</h2>
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Admin Featured
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">{ADMIN_FEATURED.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADMIN_FEATURED.items.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white border-2 border-primary/10 rounded-[2.5rem] p-8 shadow-md relative overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-20 h-20 text-primary" />
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-2 ring-primary/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-primary">{item.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{item.date}</p>
                  <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-secondary/20 text-primary rounded-full border border-secondary/30">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 relative">
                <Medal className="w-5 h-5 text-secondary absolute -top-2.5 -right-2.5 bg-white rounded-full p-0.5 shadow-sm" />
                <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">
                  "{item.achievement}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty categories */}
      {EMPTY_CATEGORIES.map((section, idx) => (
        <div key={idx} className="space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className={`w-14 h-14 ${section.color} text-white rounded-2xl flex items-center justify-center shadow-lg opacity-40`}>
              <section.icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-primary">{section.category}</h2>
              <p className="text-muted-foreground text-sm font-medium">{section.description}</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-[2.5rem] p-14 flex flex-col items-center justify-center gap-4 text-center bg-muted/20">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-border">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-black text-lg text-muted-foreground">No entries yet</p>
              <p className="text-sm text-muted-foreground font-medium mt-1 max-w-xs">
                This section fills as students earn milestones. The admin nominates and publishes each entry.
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Vision Banner */}
      <div className="bg-primary p-12 rounded-[3rem] text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black">Academy Vision</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-bold">Excellence Goal: 100% Pass Rate</p>
                  <p className="text-xs text-white/60">We aim for every student to achieve distinction in international board exams.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-bold">Global Presence</p>
                  <p className="text-xs text-white/60">Target: alumni performing in 12+ countries within 5 years of launch.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
              <p className="text-4xl font-black text-secondary">0</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Distinctions</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
              <p className="text-4xl font-black text-secondary">0</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Gold Medals</p>
            </div>
          </div>
        </div>
        <Globe className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10" />
      </div>
    </div>
  );
};
