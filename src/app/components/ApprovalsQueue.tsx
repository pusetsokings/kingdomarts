import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, XCircle, Clock, FileText, User,
  Music, BookOpen, Inbox, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useCourses } from '@/app/stores/useCourseStore';

type FilterTab = 'all' | 'content' | 'instructor';

export const ApprovalsQueue = () => {
  const { state: courseState, dispatch } = useCourses();
  const [filter, setFilter] = useState<FilterTab>('all');

  // All pending courses from the store
  const pendingCourses = courseState.pendingCourses.filter((c) => c.status === 'pending');
  const rejectedCourses = courseState.pendingCourses.filter((c) => c.status === 'rejected');

  // Map pending courses to display items
  const courseItems = pendingCourses.map((course) => ({
    id: course.id,
    title: course.title,
    user: course.instructor,
    type: 'Course Content' as const,
    date: course.uploadedAt || 'Just now',
    instrument: course.instrument,
    level: course.level,
    price: course.price,
    preview: null as string | null,
    source: 'real' as const,
  }));

  // Static instructor onboarding items (new applications — no real store for these yet)
  const instructorItems = [
    {
      id: 'app-001',
      title: 'K. Moremi Instructor Application',
      user: 'Kelebogile Moremi',
      type: 'Instructor Onboarding' as const,
      date: '1d ago',
      instrument: '',
      level: '',
      price: '',
      preview: null,
      source: 'static' as const,
    },
  ];

  const allItems = [
    ...(filter === 'all' || filter === 'content' ? courseItems : []),
    ...(filter === 'all' || filter === 'instructor' ? instructorItems : []),
  ];

  const handleApprove = (item: typeof allItems[0]) => {
    if (item.source === 'real') {
      dispatch({ type: 'APPROVE_COURSE', courseId: item.id });
      toast.success(`Approved: ${item.title}`, {
        description: 'The course is now live in the Academy catalog.',
      });
    } else {
      toast.success(`Approved: ${item.title}`);
    }
  };

  const handleReject = (item: typeof allItems[0]) => {
    if (item.source === 'real') {
      dispatch({ type: 'REJECT_COURSE', courseId: item.id });
      toast.error(`Rejected: ${item.title}`, {
        description: 'The instructor has been notified.',
      });
    } else {
      toast.error(`Rejected: ${item.title}`);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 text-primary">Approval Queue</h2>
          <p className="text-muted-foreground font-medium">
            Review and verify new content and instructor applications.
            <span className="ml-2 text-primary font-black">
              {pendingCourses.length} pending
            </span>
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}
          >
            All ({courseItems.length + instructorItems.length})
          </button>
          <button
            onClick={() => setFilter('content')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'content' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}
          >
            Courses ({courseItems.length})
          </button>
          <button
            onClick={() => setFilter('instructor')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'instructor' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'}`}
          >
            Applicants ({instructorItems.length})
          </button>
        </div>
      </div>

      {/* Queue items */}
      <AnimatePresence mode="popLayout">
        {allItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-border rounded-[2.5rem] p-16 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-black text-lg text-muted-foreground">Queue is clear</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                No items awaiting review. When instructors upload new content it will appear here.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group bg-white border border-border p-6 rounded-[2rem] hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
              >
                <div className="flex items-center gap-6">
                  {/* Icon / preview */}
                  <div className="w-20 h-20 rounded-2xl bg-primary/5 overflow-hidden flex items-center justify-center text-primary relative border border-primary/10 shrink-0">
                    {item.type === 'Course Content' ? (
                      <Music className="w-8 h-8 text-primary/50" />
                    ) : (
                      <User className="w-8 h-8 text-primary/50" />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-primary/5 text-primary px-2 py-0.5 rounded-full border border-primary/10">
                        {item.type}
                      </span>
                      {item.level && (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-secondary/20 text-primary px-2 py-0.5 rounded-full border border-secondary/30">
                          {item.level}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-primary">{item.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        By <span className="text-primary font-bold">{item.user}</span>
                      </p>
                      {item.instrument && (
                        <p className="text-sm font-medium text-muted-foreground">
                          Instrument: <span className="text-primary font-bold">{item.instrument}</span>
                        </p>
                      )}
                      {item.price && (
                        <p className="text-sm font-medium text-muted-foreground">
                          Price: <span className="text-primary font-bold">{item.price}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toast.info(`Viewing full details for "${item.title}"`)}
                    className="px-5 py-3 bg-muted text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" /> Review
                  </button>
                  <button
                    onClick={() => handleApprove(item)}
                    className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all border border-green-100"
                    title="Approve"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(item)}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                    title="Reject"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Recently rejected */}
      {rejectedCourses.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
            Recently Rejected ({rejectedCourses.length})
          </p>
          {rejectedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-red-50/50 border border-red-100 rounded-[2rem] p-6 flex items-center gap-4 opacity-60"
            >
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <p className="font-black text-sm text-red-700">{course.title}</p>
                <p className="text-xs text-red-500 font-medium">{course.instructor} · {course.instrument}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* End of queue banner */}
      <div className="p-10 bg-primary/5 border border-dashed border-primary/20 rounded-[2.5rem] flex flex-col items-center text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-primary opacity-20" />
        <div>
          <p className="text-sm font-bold text-primary">Moderation Panel Active</p>
          <p className="text-xs text-muted-foreground">
            All submitted courses go through this queue before appearing in the live Academy catalog.
          </p>
        </div>
      </div>
    </div>
  );
};
