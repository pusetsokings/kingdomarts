import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, User, BookOpen, Send, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';
import { useCourses } from '@/app/stores/useCourseStore';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}

// ── Persistence ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'kaa_teacher_reviews';

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {/* ignore */}
  // Seed data — realistic first reviews for Naledi Moremi (instructor)
  const seed: Review[] = [
    {
      id: 'rev-001',
      courseId: 'course-sax-001',
      courseTitle: 'Saxophone Foundations',
      instructorId: 'instr-001',
      instructorName: 'Naledi Moremi',
      studentId: 'user-001',
      studentName: 'Lerato Dube',
      studentAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
      rating: 5,
      comment:
        'Ms Moremi explains breath control in a way no other teacher has. My tone has improved dramatically after just 3 weeks. The exercises are well structured and I love how she connects theory to real Botswana music culture.',
      date: '2026-02-28',
      helpfulCount: 8,
    },
    {
      id: 'rev-002',
      courseId: 'course-sax-001',
      courseTitle: 'Saxophone Foundations',
      instructorId: 'instr-001',
      instructorName: 'Naledi Moremi',
      studentId: 'user-002',
      studentName: 'Tshiamo Bogosi',
      studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      rating: 5,
      comment:
        'Incredible patience and very detailed feedback. She noticed a posture issue I had no idea about and fixed it in one session. Highly recommend for any beginner.',
      date: '2026-03-01',
      helpfulCount: 5,
    },
    {
      id: 'rev-003',
      courseId: 'course-sax-002',
      courseTitle: 'Intermediate Saxophone Mastery',
      instructorId: 'instr-001',
      instructorName: 'Naledi Moremi',
      studentId: 'user-003',
      studentName: 'Mpho Segwane',
      studentAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop',
      rating: 4,
      comment:
        'The improvisation modules are excellent. I knocked off one star only because I wish there was more supplementary sheet music included. Otherwise a fantastic course.',
      date: '2026-03-05',
      helpfulCount: 3,
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// ── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  const display = readonly ? value : (hovered || value);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange?.(n)}
          className={`transition-transform ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
        >
          <Star
            className={`w-5 h-5 transition-colors ${n <= display ? 'text-secondary fill-secondary' : 'text-muted-foreground/40'}`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Average Rating ────────────────────────────────────────────────────────────
function avgRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

// ── Main Component ────────────────────────────────────────────────────────────
export const TeacherReviews = () => {
  const { state: authState } = useAuth();
  const { state: courseState } = useCourses();
  const user = authState.user;
  const role = user.role;

  const [reviews, setReviews] = useState<Review[]>(loadReviews);

  // For instructor: show reviews of their own courses
  // For student/admin: show all reviews + allow students to leave one
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('instr-001');
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Determine whose reviews to show
  const displayInstructorId = role === 'instructor' ? user.id : selectedInstructorId;
  const displayReviews = reviews.filter((r) => r.instructorId === displayInstructorId);

  // Instructors list from courses
  const instructorIds = [...new Set(courseState.courses.map((c) => c.instructorId))];
  const instructorCourses = courseState.courses.filter((c) => c.instructorId === displayInstructorId);
  const avg = avgRating(displayReviews);

  // Courses by instructor for review form
  const reviewableCourses = courseState.courses.filter((c) => c.instructorId === displayInstructorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }
    if (!newComment.trim() || newComment.trim().length < 15) {
      toast.error('Please write a comment (at least 15 characters).');
      return;
    }
    if (!selectedCourseId) {
      toast.error('Please select which course this review is for.');
      return;
    }

    const course = courseState.courses.find((c) => c.id === selectedCourseId);
    const instructorName = course?.instructor || 'Instructor';

    setSubmitting(true);
    setTimeout(() => {
      const review: Review = {
        id: `rev-${Date.now()}`,
        courseId: selectedCourseId,
        courseTitle: course?.title || selectedCourseId,
        instructorId: displayInstructorId,
        instructorName,
        studentId: user.id,
        studentName: user.name,
        studentAvatar: user.avatar,
        rating: newRating,
        comment: newComment.trim(),
        date: new Date().toISOString().slice(0, 10),
        helpfulCount: 0,
      };
      const updated = [review, ...reviews];
      setReviews(updated);
      saveReviews(updated);
      setNewRating(0);
      setNewComment('');
      setSelectedCourseId('');
      setSubmitting(false);
      toast.success('Review submitted!', { description: 'Thank you for your feedback.' });
    }, 800);
  };

  const handleHelpful = (id: string) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
    );
    setReviews(updated);
    saveReviews(updated);
    toast.success('Marked as helpful!');
  };

  // ── Instructor view ────────────────────────────────────────────────────────
  if (role === 'instructor') {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">My Reviews</h1>
          <p className="text-muted-foreground font-medium">See what students are saying about your lessons.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-border rounded-[2rem] p-8 text-center shadow-sm">
            <p className="text-5xl font-black text-primary mb-1">{avg > 0 ? avg.toFixed(1) : '—'}</p>
            <StarRating value={Math.round(avg)} readonly />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Overall Rating</p>
          </div>
          <div className="bg-white border border-border rounded-[2rem] p-8 text-center shadow-sm">
            <p className="text-5xl font-black text-primary mb-1">{displayReviews.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Total Reviews</p>
          </div>
          <div className="bg-white border border-border rounded-[2rem] p-8 text-center shadow-sm">
            <p className="text-5xl font-black text-primary mb-1">
              {displayReviews.filter((r) => r.rating >= 4).length}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
              Positive Reviews
            </p>
          </div>
        </div>

        {/* Review list */}
        {displayReviews.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-[2.5rem] p-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-black text-lg text-muted-foreground">No reviews yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Once students complete your courses, their reviews will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {displayReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-border rounded-[2rem] p-8 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.studentAvatar}
                      alt={review.studentName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
                    />
                    <div>
                      <p className="font-black text-primary">{review.studentName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {review.courseTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StarRating value={review.rating} readonly />
                    <p className="text-[9px] font-bold text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <ThumbsUp className="w-3.5 h-3.5" /> {review.helpfulCount} found this helpful
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Student / Admin / Guest view ───────────────────────────────────────────
  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">Teacher Reviews</h1>
        <p className="text-muted-foreground font-medium">
          Read honest student reviews and rate the lessons and instructors you have experienced.
        </p>
      </div>

      {/* Overall stats for shown instructor */}
      <div className="bg-white border border-border rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center gap-8 shadow-sm">
        <div className="flex flex-col items-center sm:border-r sm:border-border sm:pr-8">
          <p className="text-6xl font-black text-primary mb-2">{avg > 0 ? avg.toFixed(1) : '—'}</p>
          <StarRating value={Math.round(avg)} readonly />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
            Average Rating
          </p>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = displayReviews.filter((r) => r.rating === n).length;
            const pct = displayReviews.length > 0 ? (count / displayReviews.length) * 100 : 0;
            return (
              <div key={n} className="flex items-center gap-3">
                <span className="text-[10px] font-black text-muted-foreground w-4 text-right">{n}</span>
                <Star className="w-3 h-3 text-secondary fill-secondary" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground w-4">{count}</span>
              </div>
            );
          })}
        </div>
        <div className="text-center sm:border-l sm:border-border sm:pl-8">
          <p className="text-4xl font-black text-primary">{displayReviews.length}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Reviews</p>
        </div>
      </div>

      {/* Write a review — students only */}
      {role === 'student' && (
        <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-primary">Write a Review</h3>
              <p className="text-xs text-muted-foreground">Share your experience with a lesson or instructor.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Course selector */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Which course is this review for?
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a course…</option>
                {reviewableCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {c.instructor}
                  </option>
                ))}
              </select>
            </div>

            {/* Star rating */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Your Rating
              </label>
              <StarRating value={newRating} onChange={setNewRating} />
            </div>

            {/* Comment */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Your Review
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share what you learned, how the instructor helped you, and what could be improved…"
                rows={4}
                className="w-full px-4 py-3 bg-white border border-border rounded-2xl text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
              />
              <p className="text-right text-[9px] text-muted-foreground mt-1">{newComment.length} / 500</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                'Submitting…'
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Review
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Guest prompt */}
      {role === 'guest' && (
        <div className="border-2 border-dashed border-border rounded-[2.5rem] p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 bg-muted rounded-3xl flex items-center justify-center">
            <Lock className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-black text-lg text-muted-foreground">Sign up to leave a review</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Student accounts can rate and review lessons and instructors.
          </p>
        </div>
      )}

      {/* Review list */}
      {displayReviews.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-[2.5rem] p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-black text-lg text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Be the first to review a lesson or instructor.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {displayReviews.length} Student Review{displayReviews.length !== 1 ? 's' : ''}
          </p>
          {displayReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white border border-border rounded-[2rem] p-8 shadow-sm space-y-5"
            >
              {/* Reviewer info + course + date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={review.studentAvatar}
                    alt={review.studentName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <p className="font-black text-primary">{review.studentName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <BookOpen className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {review.courseTitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating value={review.rating} readonly />
                  <p className="text-[9px] font-bold text-muted-foreground">{review.date}</p>
                </div>
              </div>

              {/* Comment */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Helpful */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {review.helpfulCount} student{review.helpfulCount !== 1 ? 's' : ''} found this helpful
                </span>
                {role !== 'guest' && review.studentId !== user.id && (
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-primary/5"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
