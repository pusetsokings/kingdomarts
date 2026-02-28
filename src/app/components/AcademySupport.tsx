import React from 'react';
import { 
  FileText, Video, Wallet, CheckCircle2, 
  HelpCircle, Download, ExternalLink, 
  ChevronRight, Music, TrendingUp, Info
} from 'lucide-react';
import { motion } from 'motion/react';

export const GradingRubrics = () => {
  const rubrics = [
    { level: "Beginner (1-3)", standards: ["Basic instrument posture", "Clear tone production", "Consistent simple rhythm (4/4)"] },
    { level: "Intermediate (4-7)", standards: ["Dynamic expression (p to f)", "Fluid transitions between scales", "Sight-reading basic Botswana folk melodies"] },
    { level: "Professional (8-10)", standards: ["Advanced polyrhythmic mastery", "Performance improvisational flow", "Technical speed & precision in royal court repertoires"] }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">Grading Rubrics</h1>
        <p className="text-muted-foreground font-medium">Academic standards for performance evaluation at Kingdom Arts Academy.</p>
      </div>

      <div className="space-y-6">
        {rubrics.map((rubric, i) => (
          <div key={i} className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-primary">
                 <Music className="w-5 h-5" />
              </div>
              {rubric.level} Standards
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {rubric.standards.map((std, j) => (
                <div key={j} className="flex items-center gap-4 p-5 bg-muted/30 rounded-2xl border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm font-bold text-primary/80">{std}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-primary rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <h4 className="text-xl font-black mb-2">Detailed Scoring Guide</h4>
          <p className="text-white/70 text-sm font-medium">Download the full 50-page academic grading handbook for all instruments.</p>
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
            Ensure your instrument is the primary focus. For piano/Setinkane, the camera should be positioned at a 45-degree angle showing both hands.
          </p>
          <ul className="space-y-2">
            {['1080p Resolution min', 'Natural lighting', 'Clean background'].map(tip => (
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
            {['No background noise', 'Check tuning', 'Balanced levels'].map(tip => (
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
  const transactions = [
    { month: "January 2026", revenue: "P12,450.00", status: "Paid", date: "Jan 30" },
    { month: "December 2025", revenue: "P10,890.00", status: "Paid", date: "Dec 28" },
    { month: "November 2025", revenue: "P9,120.00", status: "Paid", date: "Nov 25" }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-primary">Royalty Statements</h1>
          <p className="text-muted-foreground font-medium">Manage your earnings from course sales and premium masterclasses.</p>
        </div>
        <div className="bg-secondary p-8 rounded-[2rem] text-primary shadow-xl">
           <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Next Payout</p>
           <p className="text-3xl font-black">P14,200.50</p>
           <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-700 bg-white/40 px-3 py-1 rounded-full border border-white/50">
             <TrendingUp className="w-3 h-3" /> +15% from last month
           </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recent Statements</h3>
           <button className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
             Export CSV <Download className="w-4 h-4" />
           </button>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((t, i) => (
            <div key={i} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <Wallet className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black">{t.month}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Processed on {t.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-10">
                 <div className="text-right">
                    <p className="text-xl font-black text-primary">{t.revenue}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-green-600">Verified</p>
                 </div>
                 <button className="p-3 bg-muted text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[2.5rem] p-10 text-center">
         <p className="text-xs font-bold text-primary max-w-md mx-auto leading-relaxed">
           Royalty calculations are based on the 70/30 split agreement for all instructors at Thusanyo House. 
           Contact finance@kingdomarts.bw for disputes.
         </p>
      </div>
    </div>
  );
};
