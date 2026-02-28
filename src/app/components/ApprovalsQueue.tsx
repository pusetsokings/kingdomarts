import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, Filter, MoreVertical, Play, FileText, User } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const ApprovalsQueue = () => {
  const [filter, setFilter] = useState<'all' | 'content' | 'instructor'>('all');

  const pendingItems = [
    { id: 1, title: 'Traditional Piano: Level 4', user: 'Thapelo Kemo', type: 'Course Content', date: '2h ago', preview: 'https://images.unsplash.com/photo-1514320298574-255c5df03df8?auto=format&fit=crop&w=100&q=80' },
    { id: 2, title: 'Segaba Techniques Mastery', user: 'Neo Sebego', type: 'Course Content', date: '5h ago', preview: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=100&q=80' },
    { id: 3, title: 'K. Moremi Instructor Application', user: 'Kelebogile Moremi', type: 'Instructor Onboarding', date: '1d ago', preview: null },
    { id: 4, title: 'Setinkane Basics Level 1', user: 'Mooketsi Thabo', type: 'Course Content', date: '1d ago', preview: 'https://images.unsplash.com/photo-1629235483011-82d27f308871?auto=format&fit=crop&w=100&q=80' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 text-primary">Approval Queue</h2>
          <p className="text-muted-foreground font-medium">Review and verify new content and instructor applications.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}>All Items</button>
          <button onClick={() => setFilter('content')} className={`px-4 py-2 rounded-lg transition-all ${filter === 'content' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}>Courses</button>
          <button onClick={() => setFilter('instructor')} className={`px-4 py-2 rounded-lg transition-all ${filter === 'instructor' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}>Applicants</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingItems.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white border border-border p-6 rounded-[2rem] hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden flex items-center justify-center text-primary relative">
                {item.preview ? (
                  <img src={item.preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <User className="w-8 h-8" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Play className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-primary/5 text-primary px-2 py-0.5 rounded-full border border-primary/10">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.date}
                  </span>
                </div>
                <h3 className="text-lg font-black text-primary">{item.title}</h3>
                <p className="text-sm font-medium text-muted-foreground">Submitted by <span className="text-primary font-bold">{item.user}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                 onClick={() => toast.info(`Viewing details for ${item.title}`)}
                 className="px-5 py-3 bg-muted text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
               >
                 <FileText className="w-3.5 h-3.5" /> Full Review
               </button>
               <button 
                 onClick={() => toast.success(`Approved: ${item.title}`)}
                 className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all border border-green-100"
               >
                 <CheckCircle2 className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => toast.error(`Rejected: ${item.title}`)}
                 className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
               >
                 <XCircle className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 bg-primary/5 border border-dashed border-primary/20 rounded-[2.5rem] flex flex-col items-center text-center space-y-4">
         <ShieldCheck className="w-12 h-12 text-primary opacity-20" />
         <div>
           <p className="text-sm font-bold text-primary">End of Queue</p>
           <p className="text-xs text-muted-foreground">You have reviewed all pending high-priority items for today.</p>
         </div>
      </div>
    </div>
  );
};
