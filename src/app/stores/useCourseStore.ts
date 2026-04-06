import { createContext, useContext } from 'react';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'active' | 'locked';
  videoUrl?: string;
  theoryContent?: string;
}

export interface Course {
  id: string;
  title: string;
  instrument: string;
  genre: string;
  instructor: string;
  instructorId: string;
  instructorAvatar: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  rating: number;
  price: string;
  thumbnail: string;
  description: string;
  lessons: Lesson[];
  tags: string[];
  // Upload workflow
  status: 'approved' | 'pending' | 'rejected';
  uploadedAt?: string;
  videoFileName?: string;
  notesFileName?: string;
}

export interface Enrollment {
  courseId: string;
  enrolledAt: string;
  progress: number;
  currentLessonId: string;
  completedLessons: string[];
}

export interface CourseState {
  courses: Course[];
  pendingCourses: Course[];   // awaiting admin approval
  enrollments: Enrollment[];
  searchQuery: string;
  filterInstrument: string;
  filterGenre: string;
}

export type CourseAction =
  | { type: 'ENROLL'; courseId: string }
  | { type: 'COMPLETE_LESSON'; courseId: string; lessonId: string }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_FILTER_INSTRUMENT'; value: string }
  | { type: 'SET_FILTER_GENRE'; value: string }
  | { type: 'ADD_COURSE'; course: Course }
  | { type: 'ADD_PENDING_COURSE'; course: Course }
  | { type: 'APPROVE_COURSE'; courseId: string }
  | { type: 'REJECT_COURSE'; courseId: string }
  | { type: 'CLEAR_FILTERS' };

function makeLessons(instrument: string): Lesson[] {
  return [
    { id: 'l1', title: 'Introduction & Instrument Care', duration: '15:00', status: 'completed', theoryContent: `${instrument} anatomy, cleaning, and maintenance essentials.` },
    { id: 'l2', title: 'Embouchure & Breath Control', duration: '20:30', status: 'active', theoryContent: `Proper air support and tone production on ${instrument}.` },
    { id: 'l3', title: 'Scales & Technical Exercises', duration: '22:15', status: 'locked', theoryContent: 'Major and minor scales, chromatic runs, and arpeggios.' },
    { id: 'l4', title: 'Music Theory Essentials', duration: '25:00', status: 'locked', theoryContent: 'Staff notation, key signatures, time signatures, and dynamics.' },
    { id: 'l5', title: 'Repertoire & Song Studies', duration: '30:10', status: 'locked', theoryContent: 'Authentic pieces from the genre tradition with stylistic markings.' },
    { id: 'l6', title: 'Improvisation & Performance', duration: '28:00', status: 'locked', theoryContent: 'Call-and-response, phrasing vocabulary, and stage presence.' },
  ];
}

// School owner profile — Saxophone instructor (id must match useAuthStore instr-001)
const SAX_INSTRUCTOR = {
  id: 'instr-001',
  name: 'Naledi Moremi',
  avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=60&h=60&fit=crop',
};

export const ALL_COURSES: Course[] = [
  // ── SAXOPHONE (school owner, uploaded by her) ─────────────
  {
    id: 'sax1', title: 'Saxophone Foundations', instrument: 'Saxophone', genre: 'Classical',
    instructor: SAX_INSTRUCTOR.name, instructorId: SAX_INSTRUCTOR.id, instructorAvatar: SAX_INSTRUCTOR.avatar,
    level: 'Beginner', duration: '5 weeks', students: 0, rating: 5.0, price: 'P750',
    thumbnail: 'https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=400&h=250&fit=crop',
    description: 'Start your saxophone journey: embouchure, breath support, fingering charts, and your first melodies.',
    lessons: makeLessons('Saxophone'), tags: ['saxophone', 'classical', 'beginner'],
  },
  {
    id: 'sax2', title: 'Jazz Saxophone & Blues Riffs', instrument: 'Saxophone', genre: 'Jazz',
    instructor: SAX_INSTRUCTOR.name, instructorId: SAX_INSTRUCTOR.id, instructorAvatar: SAX_INSTRUCTOR.avatar,
    level: 'Intermediate', duration: '6 weeks', students: 0, rating: 5.0, price: 'P950',
    thumbnail: 'https://images.unsplash.com/photo-1573871669414-010dbf73ca84?w=400&h=250&fit=crop',
    description: 'Jazz language, blues scales, swing phrasing, and improvisation on alto or tenor saxophone.',
    lessons: makeLessons('Saxophone'), tags: ['saxophone', 'jazz', 'blues', 'intermediate'],
  },
  {
    id: 'sax3', title: 'Alto Saxophone Mastery', instrument: 'Saxophone', genre: 'Jazz',
    instructor: SAX_INSTRUCTOR.name, instructorId: SAX_INSTRUCTOR.id, instructorAvatar: SAX_INSTRUCTOR.avatar,
    level: 'Advanced', duration: '8 weeks', students: 0, rating: 5.0, price: 'P1,200',
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=250&fit=crop',
    description: 'Advanced altissimo register, modern chord substitutions, and professional concert performance.',
    lessons: makeLessons('Saxophone'), tags: ['saxophone', 'jazz', 'advanced', 'altissimo'],
  },

  // ── TRUMPET ──────────────────────────────────────────────
  {
    id: 'tpt1', title: 'Trumpet Fundamentals', instrument: 'Trumpet', genre: 'Classical',
    instructor: 'Roy Hlatshwayo', instructorId: 'instr-tpt', instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '5 weeks', students: 0, rating: 4.9, price: 'P700',
    thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=250&fit=crop',
    description: 'Valve technique, lip buzzing, range building, and your first classical trumpet pieces.',
    lessons: makeLessons('Trumpet'), tags: ['trumpet', 'classical', 'beginner'],
  },
  {
    id: 'tpt2', title: 'Jazz Trumpet & Improvisation', instrument: 'Trumpet', genre: 'Jazz',
    instructor: 'Roy Hlatshwayo', instructorId: 'instr-tpt', instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop',
    level: 'Intermediate', duration: '6 weeks', students: 0, rating: 4.8, price: 'P900',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=250&fit=crop',
    description: 'Jazz articulation, mute techniques, bebop vocabulary, and playing over chord changes.',
    lessons: makeLessons('Trumpet'), tags: ['trumpet', 'jazz', 'intermediate'],
  },

  // ── RECORDER ─────────────────────────────────────────────
  {
    id: 'rec1', title: 'Recorder for Beginners', instrument: 'Recorder', genre: 'Classical',
    instructor: 'Seo Nthabi', instructorId: 'instr-flute', instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '3 weeks', students: 0, rating: 4.7, price: 'P450',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=250&fit=crop',
    description: 'Perfect for young learners — fingering basics, breath control, simple folk melodies and hymns.',
    lessons: makeLessons('Recorder'), tags: ['recorder', 'classical', 'beginner', 'kids'],
  },
  {
    id: 'rec2', title: 'Advanced Recorder Techniques', instrument: 'Recorder', genre: 'Classical',
    instructor: 'Seo Nthabi', instructorId: 'instr-flute', instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop',
    level: 'Intermediate', duration: '4 weeks', students: 0, rating: 4.8, price: 'P600',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
    description: 'Baroque ornamentation, cross-fingering, and ensemble playing on soprano and alto recorder.',
    lessons: makeLessons('Recorder'), tags: ['recorder', 'classical', 'baroque', 'intermediate'],
  },

  // ── PIANO ─────────────────────────────────────────────────
  {
    id: 'c1', title: 'Classical Piano Mastery', instrument: 'Piano', genre: 'Classical',
    instructor: 'Blessing Moyo', instructorId: 'instr-piano', instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    level: 'Intermediate', duration: '6 weeks', students: 342, rating: 4.9, price: 'P850',
    thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=250&fit=crop',
    description: 'Master classical piano technique from foundational exercises to full concerto performance.',
    lessons: makeLessons('Piano'), tags: ['piano', 'classical', 'intermediate'],
  },
  {
    id: 'c2', title: 'Jazz Piano & Improvisation', instrument: 'Piano', genre: 'Jazz',
    instructor: 'Blessing Moyo', instructorId: 'instr-piano', instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
    level: 'Advanced', duration: '8 weeks', students: 218, rating: 4.8, price: 'P1,100',
    thumbnail: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=250&fit=crop',
    description: 'Explore jazz harmony, chord voicings, and the art of improvisation.',
    lessons: makeLessons('Piano'), tags: ['piano', 'jazz', 'advanced'],
  },

  // ── GUITAR ────────────────────────────────────────────────
  {
    id: 'c3', title: 'Acoustic Guitar Foundations', instrument: 'Guitar', genre: 'Folk & Acoustic',
    instructor: 'Kagiso Sithole', instructorId: 'instr-guitar', instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '4 weeks', students: 567, rating: 4.7, price: 'P650',
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=250&fit=crop',
    description: 'Start your guitar journey with proper technique, chords, and strumming patterns.',
    lessons: makeLessons('Guitar'), tags: ['guitar', 'folk', 'beginner'],
  },
  {
    id: 'c4', title: 'Blues Guitar Masterclass', instrument: 'Guitar', genre: 'Blues & R&B',
    instructor: 'Kagiso Sithole', instructorId: 'instr-guitar', instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop',
    level: 'Intermediate', duration: '5 weeks', students: 189, rating: 4.9, price: 'P900',
    thumbnail: 'https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=400&h=250&fit=crop',
    description: 'Deep dive into blues scales, bends, vibrato, and authentic Southern blues phrasing.',
    lessons: makeLessons('Guitar'), tags: ['guitar', 'blues', 'intermediate'],
  },

  // ── VIOLIN ────────────────────────────────────────────────
  {
    id: 'c5', title: 'Classical Violin Technique', instrument: 'Violin', genre: 'Classical',
    instructor: 'Amara Diallo', instructorId: 'instr-violin', instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '6 weeks', students: 143, rating: 4.8, price: 'P950',
    thumbnail: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=250&fit=crop',
    description: 'Develop proper bow technique, intonation, and classical violin repertoire.',
    lessons: makeLessons('Violin'), tags: ['violin', 'classical', 'beginner'],
  },
  {
    id: 'c6', title: 'Afro-Jazz Violin', instrument: 'Violin', genre: 'Jazz',
    instructor: 'Amara Diallo', instructorId: 'instr-violin', instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
    level: 'Advanced', duration: '7 weeks', students: 87, rating: 5.0, price: 'P1,200',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=250&fit=crop',
    description: 'Blend classical violin with African jazz rhythms for a unique performance style.',
    lessons: makeLessons('Violin'), tags: ['violin', 'jazz', 'advanced', 'afro'],
  },

  // ── VOICE ─────────────────────────────────────────────────
  {
    id: 'c7', title: 'Vocal Jazz & Harmony', instrument: 'Voice', genre: 'Jazz',
    instructor: 'Naledi Kgosi', instructorId: 'instr-vocal', instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop',
    level: 'Intermediate', duration: '5 weeks', students: 294, rating: 4.7, price: 'P750',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=250&fit=crop',
    description: 'Explore jazz scat, chord tone singing, and harmony in a vocal ensemble setting.',
    lessons: makeLessons('Voice'), tags: ['voice', 'jazz', 'intermediate'],
  },
  {
    id: 'c8', title: 'Gospel Vocal Power', instrument: 'Voice', genre: 'Gospel & Worship',
    instructor: 'Naledi Kgosi', instructorId: 'instr-vocal', instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '4 weeks', students: 412, rating: 4.9, price: 'P600',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=250&fit=crop',
    description: 'Build vocal strength, breath control, and gospel runs for worship performance.',
    lessons: makeLessons('Voice'), tags: ['voice', 'gospel', 'beginner'],
  },

  // ── DRUMS ─────────────────────────────────────────────────
  {
    id: 'c9', title: 'Drum Kit Foundations', instrument: 'Drums', genre: 'Afrobeat',
    instructor: 'Mpho Tau', instructorId: 'instr-drums', instructorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '4 weeks', students: 231, rating: 4.6, price: 'P700',
    thumbnail: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=250&fit=crop',
    description: 'Master basic beats, fills, and coordination on the full drum kit.',
    lessons: makeLessons('Drums'), tags: ['drums', 'afrobeat', 'beginner'],
  },
  {
    id: 'c10', title: 'Kwaito & Amapiano Rhythms', instrument: 'Drums', genre: 'Afrobeat',
    instructor: 'Mpho Tau', instructorId: 'instr-drums', instructorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop',
    level: 'Intermediate', duration: '5 weeks', students: 318, rating: 4.8, price: 'P850',
    thumbnail: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=250&fit=crop',
    description: 'Learn the signature grooves of Kwaito, Amapiano, and South African dance music.',
    lessons: makeLessons('Drums'), tags: ['drums', 'afrobeat', 'kwaito', 'amapiano'],
  },

  // ── FLUTE ─────────────────────────────────────────────────
  {
    id: 'c11', title: 'Flute: Classical Foundations', instrument: 'Flute', genre: 'Classical',
    instructor: 'Seo Nthabi', instructorId: 'instr-flute', instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '5 weeks', students: 98, rating: 4.7, price: 'P800',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=250&fit=crop',
    description: 'Develop embouchure, breath control, and classical flute technique.',
    lessons: makeLessons('Flute'), tags: ['flute', 'classical', 'beginner'],
  },

  // ── MUSIC PRODUCTION ─────────────────────────────────────
  {
    id: 'c12', title: 'Music Production Basics', instrument: 'Music Production', genre: 'Afrobeat',
    instructor: 'Kago Letsie', instructorId: 'instr-prod', instructorAvatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=60&h=60&fit=crop',
    level: 'Beginner', duration: '6 weeks', students: 504, rating: 4.8, price: 'P1,000',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=250&fit=crop',
    description: 'Learn DAW fundamentals, beat-making, and mixing for modern Afrobeat production.',
    lessons: makeLessons('Production'), tags: ['production', 'afrobeat', 'beginner'],
  },
];

function loadEnrollments(): Enrollment[] {
  try {
    const raw = localStorage.getItem('kaa_enrollments');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEnrollments(enrollments: Enrollment[]) {
  localStorage.setItem('kaa_enrollments', JSON.stringify(enrollments));
}

function loadPendingCourses(): Course[] {
  try {
    const raw = localStorage.getItem('kaa_pending_courses');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function savePendingCourses(courses: Course[]) {
  localStorage.setItem('kaa_pending_courses', JSON.stringify(courses));
}

// Ensure all built-in courses have status: 'approved'
const APPROVED_COURSES: Course[] = ALL_COURSES.map(c => ({ ...c, status: 'approved' as const }));

export function getInitialCourseState(): CourseState {
  return {
    courses: APPROVED_COURSES,
    pendingCourses: loadPendingCourses(),
    enrollments: loadEnrollments(),
    searchQuery: '',
    filterInstrument: '',
    filterGenre: '',
  };
}

export function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'ENROLL': {
      if (state.enrollments.find(e => e.courseId === action.courseId)) return state;
      const course = state.courses.find(c => c.id === action.courseId);
      if (!course) return state;
      const enrollment: Enrollment = {
        courseId: action.courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        currentLessonId: course.lessons[0]?.id || '',
        completedLessons: [],
      };
      const updated = [...state.enrollments, enrollment];
      saveEnrollments(updated);
      return { ...state, enrollments: updated };
    }
    case 'COMPLETE_LESSON': {
      const updated = state.enrollments.map(e => {
        if (e.courseId !== action.courseId) return e;
        if (e.completedLessons.includes(action.lessonId)) return e;
        const course = state.courses.find(c => c.id === action.courseId);
        const completedLessons = [...e.completedLessons, action.lessonId];
        const progress = course
          ? Math.round((completedLessons.length / course.lessons.length) * 100)
          : e.progress;
        const nextIdx = course?.lessons.findIndex(l => !completedLessons.includes(l.id)) ?? -1;
        const currentLessonId = nextIdx >= 0 ? course!.lessons[nextIdx].id : e.currentLessonId;
        return { ...e, completedLessons, progress, currentLessonId };
      });
      saveEnrollments(updated);
      return { ...state, enrollments: updated };
    }
    case 'ADD_COURSE': {
      const updatedCourses = [action.course, ...state.courses];
      return { ...state, courses: updatedCourses };
    }
    case 'ADD_PENDING_COURSE': {
      const pending = [action.course, ...state.pendingCourses];
      savePendingCourses(pending);
      return { ...state, pendingCourses: pending };
    }
    case 'APPROVE_COURSE': {
      const course = state.pendingCourses.find(c => c.id === action.courseId);
      if (!course) return state;
      const approved = { ...course, status: 'approved' as const };
      const pending = state.pendingCourses.filter(c => c.id !== action.courseId);
      savePendingCourses(pending);
      return { ...state, pendingCourses: pending, courses: [approved, ...state.courses] };
    }
    case 'REJECT_COURSE': {
      const pending = state.pendingCourses.map(c =>
        c.id === action.courseId ? { ...c, status: 'rejected' as const } : c
      );
      savePendingCourses(pending);
      return { ...state, pendingCourses: pending };
    }
    case 'SET_SEARCH': return { ...state, searchQuery: action.query };
    case 'SET_FILTER_INSTRUMENT': return { ...state, filterInstrument: action.value };
    case 'SET_FILTER_GENRE': return { ...state, filterGenre: action.value };
    case 'CLEAR_FILTERS': return { ...state, searchQuery: '', filterInstrument: '', filterGenre: '' };
    default: return state;
  }
}

export interface CourseContextType {
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
}

export const CourseContext = createContext<CourseContextType | null>(null);

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourses must be used within AppProvider');
  return ctx;
}
