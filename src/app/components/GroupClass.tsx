import React, { useState, useEffect } from 'react';
import { 
  Users, Video, Mic, MicOff, VideoOff, 
  Hand, MessageSquare, Share2, MoreVertical, 
  X, Music, Heart, Play, Users2, 
  Settings, Monitor, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const GroupClass = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('participants');

  const participants = [
    { name: 'Teacher Neo', role: 'Instructor', active: true, avatar: 'https://i.pravatar.cc/150?u=neo' },
    { name: 'Lerato M.', role: 'Student', active: false, avatar: 'https://i.pravatar.cc/150?u=lerato' },
    { name: 'Kabo L.', role: 'Student', active: false, avatar: 'https://i.pravatar.cc/150?u=kabo' },
    { name: 'Thabo M.', role: 'Student', active: false, avatar: 'https://i.pravatar.cc/150?u=thabo' },
    { name: 'Neo S.', role: 'Student', active: false, avatar: 'https://i.pravatar.cc/150?u=neostud' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-black rounded-[2.5rem] overflow-hidden m-6 lg:m-10 shadow-2xl border-4 border-primary/20">
      {/* Main Video Grid */}
      <div className="flex-1 flex gap-4 p-6 overflow-hidden">
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
          {/* Main Instructor View */}
          <div className="col-span-1 row-span-2 relative bg-muted/10 rounded-[2rem] overflow-hidden border-2 border-secondary/50">
            <img 
              src="https://images.unsplash.com/photo-1514320298574-255c5df03df8?auto=format&fit=crop&w=1200&q=80" 
              className="w-full h-full object-cover" 
              alt="Instructor"
            />
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-secondary text-primary rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
              <Crown className="w-3 h-3 fill-primary" />
              Teacher Neo (Live)
            </div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl">
                 <Music className="w-5 h-5 animate-pulse" />
               </div>
               <div className="text-white drop-shadow-md">
                 <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Demonstrating</p>
                 <p className="text-xs font-bold italic">"Desert Rain Rhythms" on Segaba</p>
               </div>
            </div>
          </div>

          {/* Student Grid */}
          <div className="relative bg-muted/10 rounded-[2rem] overflow-hidden border border-white/10 group">
             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-60" alt="Student 1" />
             <div className="absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded-lg backdrop-blur-md">Lerato M.</div>
             {isHandRaised && (
               <div className="absolute top-4 right-4 animate-bounce">
                 <Hand className="w-6 h-6 text-secondary fill-secondary" />
               </div>
             )}
          </div>
          <div className="relative bg-muted/10 rounded-[2rem] overflow-hidden border border-white/10">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-60" alt="Student 2" />
             <div className="absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded-lg backdrop-blur-md">Kabo L.</div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-80 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex flex-col overflow-hidden">
          <div className="flex p-2 border-b border-white/10">
            <button 
              onClick={() => setActiveTab('participants')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'participants' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              <Users2 className="w-4 h-4" /> Enrolled ({participants.length})
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'chat' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Session Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'participants' ? (
                <motion.div 
                  key="part"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {participants.map((p, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20">
                          <img src={p.avatar} alt={p.name} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{p.name}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-secondary/70">{p.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-white/40 hover:text-red-500"><MicOff className="w-3 h-3" /></button>
                         <button className="text-white/40 hover:text-red-500"><VideoOff className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 h-full flex flex-col"
                >
                   <div className="flex-1 space-y-4">
                      <div className="p-3 bg-white/10 rounded-2xl">
                         <p className="text-[8px] font-black uppercase tracking-widest text-secondary mb-1">Teacher Neo</p>
                         <p className="text-[10px] text-white/80 font-medium">Please focus on the thumb placement during the slide.</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl ml-4">
                         <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Lerato M.</p>
                         <p className="text-[10px] text-white/80 font-medium">Is the slide from D# or D natural?</p>
                      </div>
                   </div>
                   <div className="relative mt-auto">
                      <input 
                        type="text" 
                        placeholder="Say something..." 
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-10 py-3 text-[10px] text-white font-medium focus:outline-none"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white/5 backdrop-blur-2xl px-10 py-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Session Title</span>
              <span className="text-sm font-black text-white italic">Traditional Ensemble Rehearsal</span>
           </div>
           <div className="h-8 w-px bg-white/10" />
           <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border-2 border-black overflow-hidden">
                     <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                   </div>
                 ))}
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">+12 Watching</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
          >
            {!isVideoOn ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isHandRaised ? 'bg-secondary text-primary' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
          >
            <Hand className="w-6 h-6" />
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 border border-white/10 transition-all">
            <Monitor className="w-6 h-6" />
          </button>
          <button className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 border border-white/10 transition-all">
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={() => toast.info("Leaving ensemble session...")}
            className="px-10 h-14 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
          >
            Leave Stage
          </button>
        </div>
      </div>
    </div>
  );
};
