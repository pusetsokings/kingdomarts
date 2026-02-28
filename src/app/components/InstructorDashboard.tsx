import React, { useState } from 'react';
import { 
  Users, Video, MessageSquare, Clock, ArrowRight, 
  Play, Star, CheckCircle2, AlertCircle, TrendingUp, 
  Calendar, Award, Search, Filter, ClipboardCheck, Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'students'>('overview');

  const stats = [
    { label: 'Active Students', value: '156', icon: Users, trend: '+12' },
    { label: 'Feedback Pending', value: '4', icon: AlertCircle, color: 'text-amber-500' },
    { label: 'Monthly Earnings', value: 'P8,450', icon: TrendingUp, trend: '+P1,200' },
    { label: 'Course Rating', value: '4.95', icon: Star, color: 'text-secondary' },
  ];

  const studentSubmissions = [
    { name: 'Lerato Molefe', course: 'Piano Level 2', time: '2h ago', status: 'pending', piece: 'Major Scales G', avatar: 'https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=150&q=80' },
    { name: 'Kabo Letsholo', course: 'Setinkane Intro', time: '5h ago', status: 'pending', piece: 'Basic Rhythms', avatar: 'https://i.pravatar.cc/150?u=Kabo' },
    { name: 'Thabo M.', course: 'Segaba Techniques', time: '1d ago', status: 'reviewed', piece: 'Bowing Exercise', avatar: 'https://i.pravatar.cc/150?u=Thabo' },
  ];

  const students = [
    { name: 'Lerato Molefe', level: 'Level 2', instrument: 'Piano', progress: 85, lastActive: '2h ago', avatar: 'https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=150&q=80' },
    { name: 'Kabo Letsholo', level: 'Level 1', instrument: 'Setinkane', progress: 45, lastActive: '5h ago', avatar: 'https://i.pravatar.cc/150?u=Kabo' },
    { name: 'Masego T.', level: 'Level 4', instrument: 'Saxophone', progress: 92, lastActive: '1d ago', avatar: 'https://i.pravatar.cc/150?u=Masego' },
    { name: 'Dumela K.', level: 'Level 3', instrument: 'Guitar', progress: 60, lastActive: '3d ago', avatar: 'https://i.pravatar.cc/150?u=Dumela' },
    { name: 'Palesa R.', level: 'Level 2', instrument: 'Drums', progress: 75, lastActive: 'Just now', avatar: 'https://i.pravatar.cc/150?u=Palesa' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-primary shadow-xl">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Instructor" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-1">Dumela, Blessing Moyo!</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-secondary" /> Head Instructor • Kingdom Arts Academy
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <button className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
             <Video className="w-4 h-4" /> Go Live
           </button>
           <button className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg">
             New Lesson
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-muted rounded-2xl flex items-center justify-center ${stat.color || 'text-primary'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend && (
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
              )}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Student Submissions Portal */}
        <div className="xl:col-span-2 bg-white border border-border rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-primary" />
              Student Feedback Portal
            </h3>
            <div className="flex bg-muted p-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}>All</button>
              <button onClick={() => setActiveTab('submissions')} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'submissions' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}>Pending</button>
            </div>
          </div>

          <div className="p-4 space-y-4">
             {studentSubmissions.map((sub, i) => (
               <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-border rounded-3xl hover:border-primary/20 transition-all group">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden">
                     <img src={(sub as any).avatar || `https://i.pravatar.cc/150?u=${sub.name}`} alt={sub.name} className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <p className="font-bold">{sub.name}</p>
                       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${sub.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                         {sub.status}
                       </span>
                     </div>
                     <p className="text-xs text-muted-foreground font-medium">{sub.course} • <span className="italic">{sub.piece}</span></p>
                   </div>
                 </div>
                 <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submitted</p>
                      <p className="text-xs font-bold">{sub.time}</p>
                    </div>
                    <button 
                      onClick={() => toast.info(`Opening review for ${sub.name}`)}
                      className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-secondary group-hover:text-primary transition-all"
                    >
                      {sub.status === 'pending' ? 'Review Now' : 'View Feedback'} <Play className="w-3 h-3 fill-current" />
                    </button>
                 </div>
               </div>
             ))}
          </div>

          <button className="w-full py-6 border-t border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
            View All History <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* My Students Directory */}
        <div className="xl:col-span-3 bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
           <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                    <Users className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black">My Student Directory</h3>
                    <p className="text-xs font-medium text-muted-foreground">Manage and track progress of your 156 active learners.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Find student..." className="pl-9 pr-4 py-2 bg-muted rounded-xl text-xs font-bold outline-none border border-transparent focus:border-primary/20 w-48" />
                 </div>
                 <button className="p-2 bg-muted rounded-xl text-primary hover:bg-primary hover:text-white transition-all">
                    <Filter className="w-4 h-4" />
                 </button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-border bg-muted/30">
                       <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student</th>
                       <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level / Instrument</th>
                       <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course Progress</th>
                       <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Active</th>
                       <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                    {students.map((student, i) => (
                       <tr key={i} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <img src={student.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={student.name} />
                                <span className="font-bold text-sm">{student.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-primary uppercase tracking-wider">{student.level}</span>
                                <span className="text-[10px] font-bold text-muted-foreground">{student.instrument}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-4 w-40">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                   <div className="h-full bg-secondary" style={{ width: `${student.progress}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-primary">{student.progress}%</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <span className="text-xs font-medium text-muted-foreground">{student.lastActive}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-muted text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                                   <MessageSquare className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-muted text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                                   <Eye className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 border-t border-border text-center">
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2 mx-auto">
                 View Full Enrollment Directory <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Teaching Side Tools */}
        <div className="space-y-8">
           <div className="p-8 bg-secondary rounded-[2.5rem] text-primary relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-black text-xl mb-2">Teaching Schedule</h4>
                <div className="space-y-4 mt-6">
                  {[
                    { time: '14:00', task: 'Level 5 Piano Group' },
                    { time: '16:30', task: 'Private Segaba Session' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/20 p-3 rounded-xl">
                      <Clock className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-black">{s.time}</p>
                        <p className="text-[10px] font-bold opacity-80">{s.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">View Full Calendar</button>
              </div>
              <Calendar className="w-32 h-32 absolute -bottom-8 -right-8 opacity-10 group-hover:rotate-12 transition-transform" />
           </div>

           <div className="p-8 bg-white border border-border rounded-[2.5rem] space-y-6">
             <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Instructor Resources</h4>
             <div className="space-y-3">
               {[
                 { label: 'Grading Rubrics', icon: ClipboardCheck },
                 { label: 'Video Upload Guide', icon: Video },
                 { label: 'Royalty Statements', icon: TrendingUp },
               ].map((tool, i) => (
                 <button key={i} className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted transition-colors rounded-2xl text-xs font-bold text-primary">
                    <div className="flex items-center gap-3">
                      <tool.icon className="w-4 h-4" />
                      {tool.label}
                    </div>
                    <ArrowRight className="w-4 h-4" />
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
