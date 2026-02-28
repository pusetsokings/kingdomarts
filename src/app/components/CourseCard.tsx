import React from 'react';
import { Star, Clock, User, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface CourseCardProps {
  title: string;
  instructor: string;
  instructorImg: string;
  thumbnail: string;
  duration: string;
  rating: number;
  reviews: number;
  level: string;
  price?: string;
  progress?: number;
  onEnroll: (title: string, price?: string) => void;
}

export const CourseCard = ({ 
  title, 
  instructor, 
  instructorImg, 
  thumbnail, 
  duration, 
  rating, 
  reviews, 
  level,
  price,
  progress,
  onEnroll
}: CourseCardProps) => {

  const isPremium = price && !progress;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-card rounded-3xl overflow-hidden border border-border group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full relative"
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
            {level}
          </div>
          {isPremium && (
            <div className="bg-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm flex items-center gap-1">
              <Lock className="w-3 h-3" /> Premium
            </div>
          )}
        </div>

        {progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-secondary"
            />
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-sm font-bold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground text-xs font-medium">({reviews} reviews)</span>
        </div>

        <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-primary transition-colors flex-1">{title}</h3>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3">
            <img src={instructorImg} alt={instructor} className="w-8 h-8 rounded-full border border-border" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Instructor</span>
              <span className="text-xs font-bold">{instructor}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">{duration}</span>
          </div>
        </div>
        
        <button 
          onClick={() => onEnroll(title, price)}
          className={`mt-6 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            isPremium 
              ? 'bg-secondary text-primary hover:bg-white border border-transparent hover:border-secondary shadow-lg shadow-secondary/20' 
              : 'bg-muted hover:bg-primary hover:text-white'
          }`}
        >
          {progress ? 'Continue Learning' : isPremium ? `Unlock for ${price}` : 'Enroll Now'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
