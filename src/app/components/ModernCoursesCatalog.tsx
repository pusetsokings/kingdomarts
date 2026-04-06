import React, { useState } from 'react';
import {
  Music, Search, Filter, Play,
  ChevronRight, Star, Clock, Layers,
  Flame, Trophy, Users, ArrowRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { useCourses } from '@/app/stores/useCourseStore';
import { useAuth } from '@/app/stores/useAuthStore';

export const ModernCoursesCatalog = ({ onEnroll }: { onEnroll: (title: string, instrument: string, genre: string, instructor: string) => void }) => {
  const { state, dispatch } = useCourses();
  const { state: authState, dispatch: authDispatch } = useAuth();
  const user = authState.user;

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGenre, setActiveGenre] = useState('All');

  const instruments = ['Piano', 'Guitar', 'Violin', 'Voice', 'Drums', 'Flute', 'Music Production'];
  const genres = ['Classical', 'Jazz', 'Blues & R&B', 'Folk & Acoustic', 'Afrobeat', 'Gospel & Worship'];

  const filteredCourses = state.courses.filter(course => {
    const matchesInstrument = activeCategory === 'All' || course.instrument === activeCategory;
    const matchesGenre = activeGenre === 'All' || course.genre === activeGenre;
    const matchesSearch = !state.searchQuery ||
      course.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      course.instrument.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesInstrument && matchesGenre && matchesSearch;
  });

  const isEnrolled = (courseId: string) => state.enrollments.some(e => e.courseId === courseId);

  const handleEnrollClick = (course: typeof state.courses[0]) => {
    if (user.role === 'guest') {
      toast.error('Account Required', { description: 'Please register to enroll in courses.' });
      return;
    }
    if (isEnrolled(course.id)) {
      // Already enrolled — go to lesson player
      onEnroll(course.title, course.instrument, course.genre, course.instructor);
      return;
    }
    dispatch({ type: 'ENROLL', courseId: course.id });
    authDispatch({ type: 'ADD_XP', amount: 20 });
    toast.success(`Enrolled in ${course.title}!`, {
      description: `${course.instrument} · ${course.genre} · ${course.level}`,
    });
    onEnroll(course.title, course.instrument, course.genre, course.instructor);
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Explore Modern <span className="text-primary underline decoration-secondary">Courses</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl">
            From Jazz Piano to Rock Guitar, discover premium education across all instruments and genres.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-border shadow-sm">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <input
            type="text"
            placeholder="Search courses, instructors..."
            className="bg-transparent border-none outline-none text-sm font-bold w-64"
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', query: e.target.value })}
          />
          {state.searchQuery && (
            <button onClick={() => dispatch({ type: 'CLEAR_FILTERS' })} className="text-muted-foreground hover:text-foreground mr-2">✕</button>
          )}
        </div>
      </div>

      {/* Filter Bars */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-primary" />
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCategory === 'All' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              All Instruments
            </button>
            {instruments.map(inst => (
              <button
                key={inst}
                onClick={() => setActiveCategory(inst)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeCategory === inst ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Layers className="w-4 h-4 text-secondary" />
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveGenre('All')}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeGenre === 'All' ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              All Genres
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeGenre === genre ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground hover:bg-border'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enrolled count banner */}
      {state.enrollments.length > 0 && (
        <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 border border-primary/20 rounded-2xl">
          <Check className="w-4 h-4 text-primary" />
          <p className="text-sm font-black text-primary">
            You're enrolled in {state.enrollments.length} course{state.enrollments.length > 1 ? 's' : ''}.
            Enrolled courses are highlighted below.
          </p>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={course.id}
                className={`group bg-white rounded-[2.5rem] border overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col ${
                  enrolled ? 'border-primary/40 shadow-lg shadow-primary/5' : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {course.genre}
                    </span>
                    <span className="px-3 py-1 bg-secondary text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {course.level}
                    </span>
                  </div>
                  {enrolled && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                        <Check className="w-3 h-3" /> Enrolled
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-sm font-medium text-muted-foreground mt-1">by {course.instructor}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-black text-sm">
                      <Star className="w-4 h-4 fill-primary" />
                      {course.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-border">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Clock className="w-4 h-4" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Users className="w-4 h-4" /> {course.students}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Music className="w-4 h-4" /> {course.instrument}
                    </div>
                  </div>

                  {/* Enrollment progress bar if enrolled */}
                  {enrolled && (() => {
                    const enr = state.enrollments.find(e => e.courseId === course.id);
                    return enr ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>Progress</span>
                          <span>{enr.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${enr.progress}%` }} />
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => handleEnrollClick(course)}
                      className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 group/btn ${
                        enrolled
                          ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                          : 'bg-primary text-white shadow-primary/20 hover:bg-secondary hover:text-primary'
                      }`}
                    >
                      {enrolled ? (
                        <>Continue Learning <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Start Learning <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <div className="py-20 text-center space-y-6 bg-muted/30 rounded-[3rem] border border-dashed border-border">
          <Music className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
          <div className="space-y-2">
            <h3 className="text-2xl font-black">No courses found</h3>
            <p className="text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
          </div>
          <button
            onClick={() => { setActiveCategory('All'); setActiveGenre('All'); dispatch({ type: 'CLEAR_FILTERS' }); }}
            className="px-8 py-3 bg-white border border-border rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Featured Banner */}
      <div className="bg-primary rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
              <Flame className="w-3 h-3 fill-primary" /> Trending Masterclass
            </div>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight">Kwaito & Amapiano Rhythms</h2>
            <p className="text-white/70 font-medium text-lg leading-relaxed">
              Master the signature grooves of South African dance music with Mpho Tau. Intermediate · 5 Weeks.
            </p>
            <button
              onClick={() => {
                const course = state.courses.find(c => c.id === 'c10');
                if (course) handleEnrollClick(course);
              }}
              className="bg-white text-primary font-black uppercase tracking-widest text-[10px] px-10 py-5 rounded-full shadow-2xl hover:bg-secondary transition-all"
            >
              View Masterclass
            </button>
          </div>
          <div className="relative">
            <div className="aspect-square bg-white/10 rounded-[4rem] backdrop-blur-3xl p-8 border border-white/20">
              <div className="w-full h-full rounded-[3rem] overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1571974599782-87624638275e?w=800&h=800&fit=crop"
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-[2rem] text-primary shadow-2xl animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
        </div>
        <Music className="w-96 h-96 absolute -top-20 -right-20 opacity-5 rotate-45" />
      </div>
    </div>
  );
};
