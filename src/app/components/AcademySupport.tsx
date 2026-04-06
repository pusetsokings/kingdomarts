import React from 'react';
import {
  FileText, Video, Wallet, CheckCircle2,
  HelpCircle, Download, ExternalLink,
  ChevronRight, Music, TrendingUp, Info, Rocket
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/app/stores/useAuthStore';
import { useCourses } from '@/app/stores/useCourseStore';

export const GradingRubrics = () => {
  const rubrics = [
    {
      level: 'Beginner (Levels 1–3)',
      barColor: 'bg-secondary',
      standards: [
        'Correct instrument posture and hand/body positioning',
        'Consistent clear tone production without squeaks or distortion',
        'Steady simple 4/4 rhythm — no rushing or dragging',
        'Memorisation of basic fingering chart or chord shapes',
        'Completion of all required beginner exercises in the syllabus',
      ],
    },
    {
      level: 'Intermediate (Levels 4–7)',
      barColor: 'bg-primary',
      standards: [
        'Dynamic expression range — pianissimo to fortissimo',
        'Fluid scale transitions at ♩=80+ BPM',
        'Sight-reading of simple Botswana folk melodies',
        'Basic improvisation within a given key or mode',
        'Articulation and stylistic markings observed in performance',
      ],
    },
    {
      level: 'Advanced / Professional (Levels 8–10)',
      barColor: 'bg-secondary',
      standards: [
        'Advanced polyrhythmic mastery — 3:2, 4:3 cross-rhythms',
        'Performance-level improvisational fluency over chord changes',
        'Technical speed and precision in repertoire at concert tempo',
        'Deep knowledge: modes, extended harmony, and musical form',
        'Stage presence, ensemble awareness, and professional conduct',
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">Grading Rubrics</h1>
        <p className="text-muted-foreground font-medium">Academic standards for performance evaluation at Kingdom Arts Academy.</p>
      </div>

      <div className="space-y-6">
        {rubrics.map((rubric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-primary/5 border border-primary/10 rounded-[2.5rem] overflow-hidden shadow-sm"
          >
            <div className={`h-1.5 ${rubric.barColor}`} />
            <div className="p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-primary">
                  <Music className="w-5 h-5" />
                </div>
                {rubric.level} Standards
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {rubric.standards.map((std, j) => (
                  <div key={j} className="flex items-start gap-4 p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm font-bold text-primary/80">{std}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-primary rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h4 className="text-xl font-black mb-2">Detailed Scoring Guide</h4>
          <p className="text-white/70 text-sm font-medium">Download the full academic grading handbook for all instruments and levels.</p>
        </div>
        <button className="whitespace-nowrap bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl shadow-xl hover:bg-white transition-all">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export const RecordingGuide = ({ role = 'student' }: { role?: string }) => (
  <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
    <div>
      <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">
        {role === 'instructor' ? 'Content Upload Guide' : 'Recording & Submission Guide'}
      </h1>
      <p className="text-muted-foreground font-medium">
        {role === 'instructor'
          ? 'Professional standards for high-quality masterclass lessons and demonstrations.'
          : 'Guidelines for high-quality rehearsal and assignment submissions.'}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white border border-border rounded-[3rem] p-10 shadow-sm space-y-8">
        <div className="w-16 h-16 bg-secondary rounded-[2rem] flex items-center justify-center text-primary">
          <Video className="w-8 h-8" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black">Visual Quality</h3>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Ensure your instrument is the primary focus. For piano/Setinkane, position the camera at a 45° angle showing both hands clearly.
          </p>
          <ul className="space-y-2">
            {['1080p Resolution minimum', 'Natural or ring-light', 'Clean, uncluttered background'].map(tip => (
              <li key={tip} className="flex items-center gap-2 text-xs font-bold text-primary">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white border border-border rounded-[3rem] p-10 shadow-sm space-y-8">
        <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-white">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black">Audio Quality</h3>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Avoid internal microphone clipping. Ensure your environment is silent and your instrument is tuned to A440Hz before recording.
          </p>
          <ul className="space-y-2">
            {['No background noise', 'Check tuning — A440Hz', 'Balanced levels — no clipping'].map(tip => (
              <li key={tip} className="flex items-center gap-2 text-xs font-bold text-primary">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-muted p-10 rounded-[3rem] border border-border flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Info className="w-10 h-10 text-primary" />
        <div>
          <p className="font-black text-lg">Still stuck?</p>
          <p className="text-sm font-medium text-muted-foreground">Book a tech support session at North Wing Offices.</p>
        </div>
      </div>
      <button className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl">Book Support</button>
    </div>
  </div>
);

export const RoyaltyStatements = () => {
  const { state: authState } = useAuth();
  const { state: courseState } = useCourses();
  const user = authState.user;

  // My published courses
  const myCourses = courseState.courses.filter(c => c.instructorId === user.id);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">Royalty Statements</h1>
          <p className="text-muted-foreground font-medium">
            Earnings account for <span className="font-black text-primary">{user.name}</span> — {user.instrument}
          </p>
        </div>

        {/* Next Payout Card */}
        <div className="bg-secondary p-8 rounded-[2rem] text-primary shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Next Payout</p>
          <p className="text-3xl font-black">P0.00</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
            <Rocket className="w-3 h-3" /> New Academy — Awaiting Students
          </div>
        </div>
      </div>

      {/* Launch Banner */}
      <div className="bg-secondary/20 border-2 border-secondary rounded-[2rem] p-6 flex items-start gap-4">
        <Rocket className="w-8 h-8 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-black">No Transactions Yet — Academy Just Launched</p>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            All royalty figures will update automatically once students enroll in your courses.
            Split: <span className="font-black text-primary">70% to you · 30% Academy</span>.
          </p>
        </div>
      </div>

      {/* Per-course breakdown */}
      <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg">Course Revenue Breakdown</h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} published
            </p>
          </div>
          <button className="text-muted-foreground font-black uppercase tracking-widest text-[10px] flex items-center gap-2 cursor-not-allowed opacity-40">
            Export CSV <Download className="w-4 h-4" />
          </button>
        </div>

        {myCourses.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-14 h-14 bg-muted rounded-3xl flex items-center justify-center mx-auto">
              <Wallet className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-black text-muted-foreground">No courses published yet</p>
            <p className="text-xs text-muted-foreground">Upload a course to start tracking revenue.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myCourses.map((course, i) => (
              <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/20 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-sm">{course.title}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {course.instrument} · {course.level} · Listed at {course.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xl font-black text-muted-foreground">P0.00</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                      {course.students} enrolled · No payout yet
                    </p>
                  </div>
                  <button className="p-3 bg-muted rounded-xl text-muted-foreground hover:bg-primary hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[2.5rem] p-8 text-center">
        <p className="text-xs font-bold text-primary max-w-md mx-auto leading-relaxed">
          Royalty calculations follow the 70/30 split agreement for all Kingdom Arts instructors.
          Contact <span className="underline cursor-pointer">finance@kingdomarts.bw</span> for disputes or payout queries.
        </p>
      </div>
    </div>
  );
};
