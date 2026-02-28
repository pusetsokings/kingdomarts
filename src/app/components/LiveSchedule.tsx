import React from 'react';
import { Calendar, Clock, MapPin, Users, Video, ArrowRight, Music, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const LiveSchedule = () => {
  const sessions = [
    {
      title: "Marimba workshop",
      instructor: "Mooketsi Thabo",
      type: "In-Person",
      location: "Gaborone Central Campus",
      date: "Monday, Feb 2",
      time: "10:00 AM - 12:00 PM",
      spots: 5,
      price: "Free",
      image: "https://images.unsplash.com/photo-1514320298322-2bb6c775a53e?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Advanced Segaba Technique",
      instructor: "Neo Sebego",
      type: "Live Stream",
      location: "Virtual Stage",
      date: "Wednesday, Feb 4",
      time: "2:00 PM - 3:30 PM",
      spots: 12,
      price: "P150",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Rhythm & Percussion Masterclass",
      instructor: "Lerato Kgosi",
      type: "In-Person",
      location: "Phakalane Studio",
      date: "Friday, Feb 6",
      time: "4:00 PM - 6:00 PM",
      spots: 3,
      price: "P200",
      image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Live Workshops
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Weekly Schedule</h1>
          <p className="text-muted-foreground font-medium max-w-xl">Join live interactive sessions with our master instructors and grow your craft in real-time.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-2xl border border-border">
          <button className="px-6 py-2.5 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">Upcoming</button>
          <button className="px-6 py-2.5 text-muted-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Recorded</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sessions.map((session, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col md:flex-row"
          >
            <div className="md:w-72 shrink-0 relative overflow-hidden">
              <img src={session.image} alt={session.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                {session.type}
              </div>
            </div>

            <div className="flex-1 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                  <Calendar className="w-3.5 h-3.5" />
                  {session.date}
                </div>
                <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{session.title}</h3>
                <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {session.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {session.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    {session.spots} spots left
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                <div className="flex flex-col text-center md:text-right flex-1 md:flex-none">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Fee</span>
                  <span className="text-xl font-black text-primary">{session.price}</span>
                </div>
                <button 
                  onClick={() => toast.success(`Reserved!`, { description: `You have secured a spot for ${session.title}.` })}
                  className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 group-hover:translate-x-1"
                >
                  Book Seat <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-muted p-10 rounded-[2.5rem] text-center border border-border border-dashed">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Music className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-2">Want a Private Session?</h3>
        <p className="text-muted-foreground font-medium mb-8 max-w-md mx-auto">Book a 1-on-1 session with any of our instructors for personalized coaching at your preferred time.</p>
        <button className="text-xs font-black uppercase tracking-widest px-8 py-4 bg-primary text-white rounded-full hover:bg-secondary hover:text-primary transition-all shadow-xl">Book Private Lesson</button>
      </div>
    </div>
  );
};
