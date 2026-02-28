import React, { useState } from 'react';
import { 
  Users, MessageSquare, Share2, Music, Crown, 
  Heart, PlayCircle, Video, UserPlus, Zap, 
  ArrowRight, X, Calendar, MapPin, Search, 
  Plus, Users2, Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const Community = () => {
  const [activeFilter, setActiveFilter] = useState('All Activity');
  const [isDuetLobbyOpen, setIsDuetLobbyOpen] = useState(false);
  const [activePartners, setActivePartners] = useState([
    { name: 'Kabo L.', instrument: 'Guitar', level: 'Level 5', status: 'Available' },
    { name: 'Lerato K.', instrument: 'Segaba', level: 'Level 8', status: 'In Session' },
    { name: 'Neo S.', instrument: 'Piano', level: 'Level 10', status: 'Available' },
  ]);

  const allContent = [
    {
      id: 1,
      user: "Thabo M.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      content: "Just mastered the polyrhythmic cycle for the Setinkane! Anyone want to jam this weekend in Phakalane?",
      time: "2h ago",
      likes: 24,
      comments: 5,
      type: "Discussions"
    },
    {
      id: 2,
      user: "Lerato K.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      content: "Check out my new Segaba cover of 'Mmamotse'. The instructor Neo's tips really helped with the bowing technique.",
      time: "5h ago",
      likes: 56,
      comments: 12,
      video: true,
      type: "Performances"
    },
    {
      id: 3,
      user: "Academy Events",
      avatar: "https://images.unsplash.com/photo-1514320298574-255c5df03df8?auto=format&fit=crop&w=100&q=80",
      content: "Upcoming: Botswana Traditional Music Gala 2026. Join us for a night of royal performances and cultural celebration.",
      time: "1d ago",
      date: "March 15, 2026",
      location: "Thusanyo House, Gaborone",
      likes: 120,
      comments: 45,
      type: "Events",
      isEvent: true
    },
    {
      id: 4,
      user: "Gaborone Jazz Group",
      avatar: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=100&q=80",
      content: "Our weekly practice session is now open for Level 6+ students. Come learn how to blend jazz with Tswana rhythms.",
      time: "2d ago",
      members: 156,
      likes: 89,
      comments: 14,
      type: "Groups",
      isGroup: true
    }
  ];

  const filteredContent = activeFilter === 'All Activity' 
    ? allContent 
    : allContent.filter(item => item.type === activeFilter);

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Academy Community</h1>
          <p className="text-muted-foreground font-medium">Connect and perform with fellow musicians across Botswana.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsDuetLobbyOpen(true)}
            className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg hover:bg-white transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Live Duet
          </button>
          <button onClick={() => toast.info("Post feature coming soon!")} className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg hover:bg-secondary hover:text-primary transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {/* Live Duet Callout */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary shadow-xl animate-pulse">
              <Video className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-secondary">Live Duet Partner Search</h3>
              <p className="text-white/70 font-bold text-sm">Find someone at your level to practice synchronicity in real-time.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsDuetLobbyOpen(true)}
            className="bg-white text-primary font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full shadow-xl hover:bg-secondary transition-all"
          >
            Find a Partner
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {/* Feed Filters */}
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {['All Activity', 'Discussions', 'Performances', 'Events', 'Groups'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-border transition-all ${
                activeFilter === filter ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-muted-foreground hover:bg-muted'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Posts */}
        <AnimatePresence mode="popLayout">
          {filteredContent.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                    <img src={post.avatar} className="w-full h-full object-cover" alt={post.user} />
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      {post.user}
                      {post.isEvent && <Calendar className="w-3.5 h-3.5 text-primary" />}
                      {post.isGroup && <Users2 className="w-3.5 h-3.5 text-primary" />}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    post.type === 'Performances' ? 'bg-secondary/20 text-primary' : 
                    post.type === 'Events' ? 'bg-primary text-white' :
                    post.type === 'Groups' ? 'bg-green-100 text-green-700' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {post.type === 'Discussions' ? 'Discussion' : 
                     post.type === 'Performances' ? 'Performance' : 
                     post.type === 'Events' ? 'Event' : 'Group'}
                  </span>
                </div>
              </div>

              <p className="text-lg font-medium leading-relaxed mb-6">{post.content}</p>

              {/* Event Specific Card */}
              {post.isEvent && (
                <div className="bg-muted/50 border border-border rounded-2xl p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
                   <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-border shadow-sm">
                         <span className="text-[8px] font-black uppercase text-primary">Mar</span>
                         <span className="text-xl font-black">15</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-1">
                           <MapPin className="w-3 h-3" /> {post.location}
                        </div>
                        <p className="text-sm font-black text-primary">Academy Grand Ballroom</p>
                      </div>
                   </div>
                   <button onClick={() => toast.success("Ticket reserved!")} className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Reserve Seat</button>
                </div>
              )}

              {/* Group Specific Info */}
              {post.isGroup && (
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 mb-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-sm">
                              <img src={`https://i.pravatar.cc/150?u=group${i}`} alt="member" />
                           </div>
                         ))}
                      </div>
                      <div>
                         <p className="text-xs font-black text-green-800">{post.members} Members Online</p>
                         <p className="text-[10px] font-bold text-green-700/70">Join for Level 6+ Rehearsals</p>
                      </div>
                   </div>
                   <button onClick={() => toast.info("Membership application sent")} className="px-6 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Request Access</button>
                </div>
              )}

              {post.video && (
                <div className="aspect-video bg-muted rounded-2xl relative overflow-hidden mb-6 group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80" alt="Video cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-8 pt-6 border-t border-border">
                <button onClick={() => toast.success("Added to your favorites")} className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors group">
                  <Heart className="w-5 h-5 group-hover:fill-current" />
                  <span className="text-xs font-black">{post.likes}</span>
                </button>
                <button onClick={() => toast.info("Opening thread...")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs font-black">{post.comments}</span>
                </button>
                <button onClick={() => toast.success("Community link copied to clipboard")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live Duet Lobby Modal */}
      <AnimatePresence>
        {isDuetLobbyOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDuetLobbyOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="bg-primary p-8 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Live Duet Lobby</h2>
                  <p className="text-white/70 font-medium italic">Synchronized Practice Room • Botswana Central</p>
                </div>
                <button onClick={() => setIsDuetLobbyOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="bg-muted p-6 rounded-3xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary shadow-lg">
                      <Zap className="w-6 h-6 fill-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Your Status</p>
                      <p className="text-lg font-black text-primary">Searching for Partner...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Available Musicians</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {activePartners.map((partner, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white border border-border rounded-3xl hover:border-primary/20 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?u=${partner.name}`} alt={partner.name} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold">{partner.name}</p>
                              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">{partner.level}</span>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">{partner.instrument}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${partner.status === 'Available' ? 'text-green-500' : 'text-amber-500'}`}>
                            {partner.status}
                          </span>
                          <button 
                            disabled={partner.status !== 'Available'}
                            onClick={() => {
                              toast.success(`Request sent to ${partner.name}`, { description: "Establishing encrypted peer-to-peer connection..." });
                            }}
                            className={`p-3 rounded-xl transition-all ${
                              partner.status === 'Available' 
                                ? 'bg-primary text-white hover:bg-secondary hover:text-primary shadow-lg' 
                                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                            }`}
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 p-6 bg-secondary/10 rounded-3xl border border-secondary/20">
                   <div className="flex items-center gap-4">
                     <Music className="w-6 h-6 text-primary" />
                     <p className="text-xs font-bold text-primary italic">"Music is the tool that can build a kingdom."</p>
                   </div>
                   <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 group">
                     Invite Friend <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
