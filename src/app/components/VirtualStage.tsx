import React, { useState, useEffect } from 'react';
import { Play, Users, Crown, Star, Calendar, Music, Video, Share2, Heart, Award, Trophy, MessageSquare, Flame, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useRealtime } from '@/app/contexts/RealtimeContext';

export const VirtualStage = () => {
  const { data } = useRealtime();
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');

  const livePerformers = [
    { name: 'Lerato Molefe', instrument: 'Saxophone', viewers: 124, piece: 'Jazz on Luthuli', streak: 42 },
    { name: 'Kabo Letsholo', instrument: 'Setinkane', viewers: 89, piece: 'Desert Rain Rhythms', streak: 15 },
  ];

  const upcomingRecitals = [
    { name: 'Mothusi Segokgo', instrument: 'Saxophone', date: 'Feb 15, 2026', time: '18:00 CAT', piece: 'Kalahari Blues', level: 7 },
    { name: 'Amantle Kenosi', instrument: 'Piano', date: 'Feb 18, 2026', time: '16:30 CAT', piece: 'Okavango Serenade', level: 9 },
    { name: 'Tebogo Modise', instrument: 'Drums', date: 'Feb 22, 2026', time: '19:00 CAT', piece: 'Moshito wa Botswana', level: 6 },
    { name: 'Lesedi Phiri', instrument: 'Saxophone', date: 'Feb 25, 2026', time: '17:45 CAT', piece: 'Jazz on Luthuli 2', level: 8 },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-12">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
            <Trophy className="w-3 h-3 text-primary" />
            Monthly Academy Showcase
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            The <span className="text-primary italic">Royal</span> Virtual Stage
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Where talent meets excellence. Watch monthly recitals, vote for your peers, and earn the "Showcase Star" badge.
          </p>
        </div>
        <div className="flex bg-muted p-1.5 rounded-2xl border border-border">
          {['live', 'upcoming'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-primary'
                }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'live' && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-10"
          >
            {/* Featured Live Stream */}
            <div className="xl:col-span-2 space-y-6">
              <div className="aspect-video bg-black rounded-[3rem] overflow-hidden relative shadow-2xl border-8 border-primary group">
                <img
                  src="https://images.unsplash.com/photo-1578912996919-482f3ef7f052?auto=format&fit=crop&w=1200&q=80"
                  className="w-full h-full object-cover opacity-60"
                  alt="Live Recital"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                {/* Overlay Controls */}
                <div className="absolute top-8 left-8 flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    Live Recital
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                    <Users className="w-3 h-3" />
                    {data.activeUsers} Watching
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
                      <img src="https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=150&q=80" alt="Performer" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{livePerformers[0].name}</h3>
                      <p className="text-secondary text-xs font-black uppercase tracking-widest">{livePerformers[0].piece}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => toast.success("Heart sent!")} className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors border border-white/20">
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                    <button className="px-8 py-4 bg-secondary text-primary rounded-full font-black uppercase tracking-widest text-xs shadow-xl transform hover:scale-105 transition-transform">
                      Vote For Star
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat/Engagement */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-white border border-border rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                    <Flame className="w-8 h-8 fill-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Practice Streak</p>
                    <p className="text-2xl font-black text-primary">{livePerformers[0].streak} Days Hot</p>
                  </div>
                </div>
                <div className="p-8 bg-white border border-border rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white">
                    <Star className="w-8 h-8 fill-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Community Votes</p>
                    <p className="text-2xl font-black text-primary">2.4k Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side List */}
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Up Next On Stage</h4>
              <div className="space-y-4">
                {livePerformers.slice(1).map((p, i) => (
                  <div key={i} className="p-6 bg-white border border-border rounded-3xl hover:border-primary/20 transition-all group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-xl overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${p.name}`} alt={p.name} />
                      </div>
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{p.instrument}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-foreground/70 line-clamp-1 italic">"{p.piece}"</p>
                    <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>Waiting in Wings</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}

                <div className="p-8 bg-primary text-white rounded-[2.5rem] relative overflow-hidden shadow-xl mt-8">
                  <div className="relative z-10">
                    <h5 className="font-black text-xl mb-2">Perform Next Month</h5>
                    <p className="text-xs opacity-70 mb-6 font-medium">Submit your Level 5+ rehearsal to qualify for the April showcase.</p>
                    <button className="w-full py-4 bg-secondary text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-white transition-all">
                      Apply For Stage
                    </button>
                  </div>
                  <Crown className="w-32 h-32 absolute -bottom-8 -right-8 opacity-10" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'upcoming' && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {upcomingRecitals.map((recital, i) => (
              <div key={i} className="p-8 bg-white border border-border rounded-[2.5rem] space-y-6 shadow-sm group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${recital.name}`} alt={recital.name} />
                  </div>
                  <div className="px-3 py-1 bg-secondary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    Level {recital.level}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-primary">{recital.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{recital.instrument}</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-2xl space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Performing</p>
                    <p className="text-sm font-bold text-primary italic">"{recital.piece}"</p>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">{recital.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Play className="w-4 h-4" />
                    <span className="text-xs font-bold">{recital.time}</span>
                  </div>
                </div>
                <button onClick={() => toast.success(`Reminder set for ${recital.name}'s recital!`)} className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all">
                  Set Reminder
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
