import React, { useState } from 'react';
import { BookOpen, Upload, Clock, CheckCircle2, XCircle, Users, ChevronRight, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';
import { useCourses } from '@/app/stores/useCourseStore';

const STATUS_CONFIG = {
  approved: { label: 'Live', color: 'bg-green-500/10 text-green-700 border-green-200', dot: 'bg-green-500', Icon: CheckCircle2 },
  pending:  { label: 'Pending Review', color: 'bg-amber-500/10 text-amber-700 border-amber-200', dot: 'bg-amber-500', Icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-700 border-red-200', dot: 'bg-red-500', Icon: XCircle },
};

export const InstructorLessons = ({ onUpload }: { onUpload?: () => void }) => {
  const { state: authState } = useAuth();
  const { state: courseState } = useCourses();
  const user = authState.user;

  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  // Approved courses from the main catalog
  const approvedCourses = courseState.courses
    .filter((c) => c.instructorId === user.id)
    .map((c) => ({ ...c, status: 'approved' as const }));

  // Pending / rejected from the pending queue
  const pendingCourses = courseState.pendingCourses.filter((c) => c.instructorId === user.id);

  const allLessons = [...pendingCourses, ...approvedCourses];

  const filtered = filter === 'all' ? allLessons : allLessons.filter((c) => c.status === filter);

  const counts = {
    all: allLessons.length,
    approved: approvedCourses.length,
    pending: pendingCourses.filter((c) => c.status === 'pending').length,
    rejected: pendingCourses.filter((c) => c.status === 'rejected').length,
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">My Lessons</h1>
          <p className="text-muted-foreground font-medium">
            All courses and lessons you have created for the Academy.
          </p>
        </div>
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Upload className="w-4 h-4" /> Upload New Lesson
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(Object.entries(counts) as [string, number][]).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`p-5 rounded-[2rem] border text-center transition-all ${
              filter === key
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white border-border hover:border-primary/30'
            }`}
          >
            <p className={`text-3xl font-black mb-1 ${filter === key ? 'text-white' : 'text-primary'}`}>{count}</p>
            <p className={`text-[9px] font-black uppercase tracking-widest ${filter === key ? 'text-white/70' : 'text-muted-foreground'}`}>
              {key === 'all' ? 'Total' : key}
            </p>
          </button>
        ))}
      </div>

      {/* Lesson list */}
      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-[2.5rem] p-16 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-white border border-border rounded-[2rem] flex items-center justify-center shadow-sm">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="font-black text-xl text-muted-foreground">No lessons yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Upload your first lesson to start building your course catalogue.
            </p>
          </div>
          <button
            onClick={onUpload}
            className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload First Lesson
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((course, i) => {
            const cfg = STATUS_CONFIG[course.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-border rounded-[2rem] p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:border-primary/20 hover:shadow-md transition-all group"
              >
                {/* Thumbnail / icon */}
                <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10">
                  <Music className="w-10 h-10 text-primary/50" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    {course.level && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                        {course.level}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-primary text-lg leading-tight truncate">{course.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {course.instrument}
                    </span>
                    {course.genre && (
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {course.genre}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {course.price}
                    </span>
                  </div>
                  {course.uploadedAt && (
                    <p className="text-[9px] font-bold text-muted-foreground/60 mt-1">
                      Uploaded {course.uploadedAt}
                    </p>
                  )}
                </div>

                {/* Stats + action */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-center hidden sm:block">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="font-black text-sm text-primary">{course.students ?? 0}</span>
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">enrolled</p>
                  </div>
                  <button
                    onClick={() => toast.info(`Viewing lesson: ${course.title}`)}
                    className="p-3 bg-muted hover:bg-primary hover:text-white text-muted-foreground rounded-xl transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
