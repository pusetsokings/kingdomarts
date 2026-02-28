import React from 'react';
import { Play, Heart, MessageCircle, Share2, Music } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentPerformance {
  id: string;
  studentName: string;
  instrument: string;
  thumbnail: string;
  likes: string;
  comments: string;
}

const performances: StudentPerformance[] = [
  {
    id: '1',
    studentName: 'Thabo Mooketsi',
    instrument: 'Setinkane (Thumb Piano)',
    thumbnail: 'https://images.unsplash.com/photo-1629235483011-82d27f308871?auto=format&fit=crop&w=400&q=80',
    likes: '1.2k',
    comments: '45'
  },
  {
    id: '2',
    studentName: 'Neo Sebego',
    instrument: 'Classical Piano',
    thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80',
    likes: '850',
    comments: '32'
  },
  {
    id: '3',
    studentName: 'Lindiwe Dlamini',
    instrument: 'Segaba (Traditional Fiddle)',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80',
    likes: '2.1k',
    comments: '112'
  },
  {
    id: '4',
    studentName: 'Kabo Letsholo',
    instrument: 'Acoustic Guitar',
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80',
    likes: '940',
    comments: '28'
  }
];

export const StudentShowcase = () => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Music className="w-8 h-8 text-primary" />
            </motion.div>
            Student Showcase
          </h2>
          <p className="text-muted-foreground font-medium">Spotlight on our academy's rising stars from Botswana</p>
        </div>
        <button className="text-xs font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors underline decoration-2 underline-offset-4">
          View Gallery
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performances.map((perf) => (
          <motion.div
            key={perf.id}
            whileHover={{ y: -8 }}
            className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[3/4] cursor-pointer"
          >
            <img 
              src={perf.thumbnail} 
              alt={perf.studentName}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-primary-foreground shadow-2xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1 block">
                {perf.instrument}
              </span>
              <h4 className="font-bold text-lg mb-3">{perf.studentName}</h4>
              
              <div className="flex items-center gap-4 opacity-80">
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  <Heart className="w-3 h-3" /> {perf.likes}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  <MessageCircle className="w-3 h-3" /> {perf.comments}
                </div>
                <Share2 className="w-3 h-3 ml-auto hover:text-secondary transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
