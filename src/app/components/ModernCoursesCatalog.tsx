import React, { useState } from 'react';
import { 
  Music, Search, Filter, Play, 
  ChevronRight, Star, Clock, Layers,
  ChevronDown, Flame, Sparkles, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Course {
  id: string;
  title: string;
  instrument: string;
  genre: string;
  instructor: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  thumbnail: string;
}

export const ModernCoursesCatalog = ({ onEnroll }: { onEnroll: (title: string, instrument: string, genre: string, instructor: string) => void }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const instruments = [
    "Piano", "Saxophone", "Guitar", "Traditional", "Drums", "Violin", "Trumpet", "Vocals", "Cello"
  ];

  const genres = [
    "Jazz", "Classical", "Pop", "Rock", "Blues", "Contemporary", "Afro-Jazz", "Gospel", "Botswana Traditional"
  ];

  const courses: Course[] = [
    // Piano
    { id: 'p1', title: 'Jazz Piano Improvisation', instrument: 'Piano', genre: 'Jazz', instructor: 'Blessing Moyo', level: 'Level 7', duration: '12h', rating: 4.9, students: 850, thumbnail: 'https://images.unsplash.com/photo-1520529612392-6294d37536d5?auto=format&fit=crop&w=800&q=80' },
    { id: 'p2', title: 'Classical Technique & Articulation', instrument: 'Piano', genre: 'Classical', instructor: 'Blessing Moyo', level: 'Level 4', duration: '8h', rating: 4.8, students: 420, thumbnail: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=800&q=80' },
    
    // Saxophone
    { id: 's1', title: 'Smooth Saxophone Mastery', instrument: 'Saxophone', genre: 'Contemporary', instructor: 'Akhu Kgosing', level: 'Level 6', duration: '15h', rating: 4.7, students: 310, thumbnail: 'https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?auto=format&fit=crop&w=800&q=80' },
    { id: 's2', title: 'Bebop Language for Tenor', instrument: 'Saxophone', genre: 'Jazz', instructor: 'Akhu Kgosing', level: 'Level 8', duration: '20h', rating: 4.9, students: 150, thumbnail: 'https://images.unsplash.com/photo-1573871669414-010dbf73ca84?auto=format&fit=crop&w=800&q=80' },

    // Botswana Traditional
    { id: 'tr1', title: 'Segaba Mastery & Tswana Scales', instrument: 'Traditional', genre: 'Botswana Traditional', instructor: 'Mma Tshepo', level: 'Level 5', duration: '18h', rating: 5.0, students: 450, thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80' },
    { id: 'tr2', title: 'Setinkane Rhythms: The Soul of the Kalimba', instrument: 'Traditional', genre: 'Botswana Traditional', instructor: 'Rre Molefi', level: 'Level 3', duration: '10h', rating: 4.9, students: 280, thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80' },

    // Guitar
    { id: 'g1', title: 'Electric Blues Soloing', instrument: 'Guitar', genre: 'Blues', instructor: 'Kopano Molefe', level: 'Level 5', duration: '9h', rating: 4.8, students: 680, thumbnail: 'https://images.unsplash.com/photo-1525201548942-d8b8967d0f5c?auto=format&fit=crop&w=800&q=80' },
    { id: 'g2', title: 'Modern Rock Chords', instrument: 'Guitar', genre: 'Rock', instructor: 'Kopano Molefe', level: 'Level 3', duration: '6h', rating: 4.6, students: 940, thumbnail: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=800&q=80' },

    // Drums
    { id: 'd1', title: 'Drum Kit Fundamentals', instrument: 'Drums', genre: 'Contemporary', instructor: 'Kagiso Tlou', level: 'Level 2', duration: '14h', rating: 4.9, students: 530, thumbnail: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80' },
    { id: 'd2', title: 'Afro-Jazz Polyrhythms', instrument: 'Drums', genre: 'Afro-Jazz', instructor: 'Kagiso Tlou', level: 'Level 9', duration: '18h', rating: 5.0, students: 110, thumbnail: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?auto=format&fit=crop&w=800&q=80' },




    // Violin
    { id: 'v1', title: 'Romantic Period Violin', instrument: 'Violin', genre: 'Classical', instructor: 'Elena V.', level: 'Level 8', duration: '22h', rating: 4.8, students: 240, thumbnail: 'https://images.unsplash.com/photo-1460039230329-eb070fc6c77c?auto=format&fit=crop&w=800&q=80' },

    // Trumpet
    { id: 't1', title: 'Lead Trumpet Mastery', instrument: 'Trumpet', genre: 'Jazz', instructor: 'Roy H.', level: 'Level 7', duration: '11h', rating: 4.7, students: 190, thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'All' || course.instrument === activeCategory;
    const matchesGenre = activeGenre === 'All' || course.genre === activeGenre;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesGenre && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">Explore Modern <span className="text-primary underline decoration-secondary">Courses</span></h1>
          <p className="text-muted-foreground font-medium max-w-xl">
            From Jazz Piano to Rock Guitar, discover premium education across all instruments and genres. 
            Levels 1-10 paths designed by master instructors.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-border shadow-sm">
           <Search className="w-5 h-5 text-muted-foreground ml-2" />
           <input 
             type="text" 
             placeholder="Search courses, instructors..." 
             className="bg-transparent border-none outline-none text-sm font-bold w-64"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Filter Bars */}
      <div className="space-y-6">
        {/* Instruments Scroll */}
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-primary" />
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
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

        {/* Genres Scroll */}
        <div className="flex items-center gap-4">
          <Layers className="w-4 h-4 text-secondary" />
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
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

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={course.id} 
              className="group bg-white rounded-[2.5rem] border border-border overflow-hidden hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col"
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
                    <p className="text-sm font-medium text-muted-foreground mt-1">Instructor: {course.instructor}</p>
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
                    <Users className="w-4 h-4" /> {course.students} Learners
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Music className="w-4 h-4" /> {course.instrument}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <button 
                    onClick={() => onEnroll(course.title, course.instrument, course.genre, course.instructor)}
                    className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-secondary hover:text-primary transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Start Learning <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
             onClick={() => { setActiveCategory('All'); setActiveGenre('All'); setSearchQuery(''); }}
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
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">Advanced Modern Jazz with Kelvin S.</h2>
              <p className="text-white/70 font-medium text-lg leading-relaxed">
                Join our most popular course for Saxophone. Master the altissimo register and modern rhythmic displacement techniques.
              </p>
              <button className="bg-white text-primary font-black uppercase tracking-widest text-[10px] px-10 py-5 rounded-full shadow-2xl hover:bg-secondary transition-all">
                View Masterclass
              </button>
           </div>
           <div className="relative">
              <div className="aspect-square bg-white/10 rounded-[4rem] backdrop-blur-3xl p-8 border border-white/20">
                 <div className="w-full h-full rounded-[3rem] overflow-hidden">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1573871669414-010dbf73ca84?auto=format&fit=crop&w=800&q=80" 
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

// Update helper icons not imported in local scope
import { Users, ArrowRight } from 'lucide-react';
