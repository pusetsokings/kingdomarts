import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Globe, Award, GraduationCap, Medal, Sparkles } from 'lucide-react';

const achievements = [
  {
    category: 'International Excellence',
    description: 'Students performing on the global stage representing Botswana.',
    icon: Globe,
    color: 'bg-blue-500',
    items: [
      { name: 'Lerato Molefe', achievement: 'Featured Soloist at London Royal Hall', date: 'Dec 2025', image: 'https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=150&q=80' },
      { name: 'Kabo Letsholo', achievement: 'Botswana-USA Cultural Exchange Lead', date: 'Jan 2026', image: 'https://i.pravatar.cc/150?u=Kabo' },
    ]
  },
  {
    category: 'Level 10 Graduates',
    description: 'The elite few who have mastered their craft through all 10 levels.',
    icon: GraduationCap,
    color: 'bg-primary',
    items: [
      { name: 'Masego T.', achievement: 'Saxophone Mastery (Level 10)', date: 'Oct 2025', image: 'https://i.pravatar.cc/150?u=Masego' },
      { name: 'Thabo M.', achievement: 'Traditional Segaba Mastery', date: 'Nov 2025', image: 'https://i.pravatar.cc/150?u=Thabo' },
    ]
  },
  {
    category: 'Perfect Scores',
    description: 'Students who achieved 100% in their technical assessments.',
    icon: Star,
    color: 'bg-secondary',
    items: [
      { name: 'Palesa R.', achievement: 'Grade A+ in Advanced Polyrhythms', date: 'Jan 2026', image: 'https://i.pravatar.cc/150?u=Palesa' },
      { name: 'Dumela K.', achievement: 'Perfect Score: Classical Theory IV', date: 'Feb 2026', image: 'https://i.pravatar.cc/150?u=Dumela' },
    ]
  }
];

export const HallOfFame = () => {
  return (
    <div className="p-6 lg:p-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-secondary/30">
          <Trophy className="w-4 h-4" />
          Prestige & Excellence
        </div>
        <h1 className="text-5xl font-black tracking-tight text-primary">Academy Hall of Fame</h1>
        <p className="text-muted-foreground font-medium text-lg">
          Celebrating the exceptional milestones and global achievements of our royal musicians.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {achievements.map((section, idx) => (
          <div key={idx} className="space-y-8">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className={`w-14 h-14 ${section.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                <section.icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-primary">{section.category}</h2>
                <p className="text-muted-foreground text-sm font-medium">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-20 h-20 text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-2 ring-primary/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-primary">{item.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{item.date}</p>
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
        ))}
      </div>

      {/* Historical Milestones */}
      <div className="bg-primary p-12 rounded-[3rem] text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black">Academy Milestone</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-bold">100% Pass Rate</p>
                  <p className="text-xs text-white/60">Our students consistently achieve distinction in international board exams.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-bold">Global Presence</p>
                  <p className="text-xs text-white/60">Alumni performing in 12+ countries including South Africa, UK, and USA.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
              <p className="text-4xl font-black text-secondary">500+</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Distinctions</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
              <p className="text-4xl font-black text-secondary">15</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Gold Medals</p>
            </div>
          </div>
        </div>
        <Globe className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10" />
      </div>
    </div>
  );
};
