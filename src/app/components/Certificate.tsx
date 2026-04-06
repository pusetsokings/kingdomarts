/**
 * Certificate — Auto-generated course completion certificate
 *
 * Generates a beautiful downloadable certificate when a student
 * completes a course (100% progress).
 *
 * Download strategy:
 *  1. Renders the certificate in a hidden div using canvas-friendly styles
 *  2. Uses html2canvas (if available) OR a pure-CSS printable version
 *     as fallback — no external dependency required for core functionality.
 *  3. A "Print / Save as PDF" button opens the browser's native print dialog
 *     with a certificate-only print stylesheet — works everywhere.
 *
 * Accessible from:
 *  - StudentDashboard / MyCourses when enrollment.progress === 100
 *  - A dedicated /certificates route (id-based)
 */

import React, { useRef, useState, useMemo } from 'react';
import {
  Crown, Download, Share2, Printer, Star,
  Award, CheckCircle2, Music2, Loader2, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';
import { useCourses } from '@/app/stores/useCourseStore';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CertificateData {
  studentName: string;
  courseName: string;
  instrument: string;
  instructorName: string;
  completedDate: string;    // ISO date string
  level: string;
  /** 5-character alphanumeric credential ID for verification */
  credentialId: string;
}

// ── Credential ID generator ───────────────────────────────────────────────────

function generateCredentialId(studentId: string, courseId: string): string {
  const base = (studentId + courseId).replace(/[^a-zA-Z0-9]/g, '');
  const hash = Array.from(base).reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  return hash.toString(36).toUpperCase().padStart(8, '0').slice(0, 8);
}

// ── Certificate visual component ──────────────────────────────────────────────

function CertificateCanvas({ data, printRef }: { data: CertificateData; printRef: React.RefObject<HTMLDivElement | null> }) {
  const formattedDate = new Date(data.completedDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div
      ref={printRef}
      id="kaa-certificate"
      className="certificate-print-area"
      style={{
        width: '794px',           // A4 landscape width at 96dpi
        minHeight: '562px',
        background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1060 50%, #1a0a2e 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Georgia, "Times New Roman", serif',
        color: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* Gold border frame */}
      <div style={{
        position: 'absolute', inset: '12px',
        border: '2px solid #fdb913',
        borderRadius: '8px',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: '16px',
        border: '1px solid #fdb913',
        borderRadius: '6px',
        opacity: 0.2,
        pointerEvents: 'none',
      }} />

      {/* Decorative circles */}
      {[
        { size: 300, top: -100, right: -100, opacity: 0.06 },
        { size: 200, bottom: -80, left: -60, opacity: 0.06 },
        { size: 120, top: 40, left: 40, opacity: 0.04 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: c.size, height: c.size,
          borderRadius: '50%',
          border: '1px solid #fdb913',
          top: c.top, right: c.right, bottom: c.bottom, left: c.left,
          opacity: c.opacity,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 64px', textAlign: 'center' }}>
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '44px', height: '44px',
            background: '#fdb913',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '22px' }}>♛</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 900, letterSpacing: '0.15em', color: '#fdb913', lineHeight: 1 }}>KINGDOM ARTS ACADEMY</div>
            <div style={{ fontSize: '9px', fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>BOTSWANA'S PREMIER MUSIC SCHOOL</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '0.3em', color: '#fdb913', marginBottom: '8px', textTransform: 'uppercase' }}>
          Certificate of Completion
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
          This certifies that
        </div>

        {/* Student name */}
        <div style={{
          fontSize: '42px',
          fontStyle: 'italic',
          fontWeight: 400,
          color: '#ffffff',
          letterSpacing: '0.02em',
          marginBottom: '8px',
          textShadow: '0 2px 20px rgba(253,185,19,0.3)',
          lineHeight: 1.2,
        }}>
          {data.studentName}
        </div>

        {/* Has successfully completed line */}
        <div style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
          has successfully completed
        </div>

        {/* Course name */}
        <div style={{
          fontSize: '22px',
          fontFamily: 'sans-serif',
          fontWeight: 900,
          color: '#fdb913',
          letterSpacing: '0.04em',
          marginBottom: '4px',
        }}>
          {data.courseName}
        </div>

        {/* Level + Instrument */}
        <div style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
          {data.level} · {data.instrument}
        </div>

        {/* Divider */}
        <div style={{
          width: '120px', height: '1px',
          background: 'linear-gradient(90deg, transparent, #fdb913, transparent)',
          margin: '0 auto 32px',
        }} />

        {/* Bottom row: instructor + date + credential */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {/* Instructor */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ width: '160px', height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '6px' }} />
            <div style={{ fontSize: '13px', fontFamily: 'sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{data.instructorName}</div>
            <div style={{ fontSize: '9px', fontFamily: 'sans-serif', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: '2px' }}>Lead Instructor</div>
          </div>

          {/* Seal */}
          <div style={{
            width: '72px', height: '72px',
            borderRadius: '50%',
            border: '2px solid #fdb913',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(253,185,19,0.1)',
          }}>
            <span style={{ fontSize: '20px' }}>★</span>
            <div style={{ fontSize: '7px', fontFamily: 'sans-serif', fontWeight: 900, letterSpacing: '0.1em', color: '#fdb913', textTransform: 'uppercase', marginTop: '2px' }}>KAA</div>
            <div style={{ fontSize: '6px', fontFamily: 'sans-serif', color: 'rgba(255,255,255,0.4)' }}>{new Date(data.completedDate).getFullYear()}</div>
          </div>

          {/* Date + Credential */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ width: '160px', height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '6px', marginLeft: 'auto' }} />
            <div style={{ fontSize: '13px', fontFamily: 'sans-serif', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{formattedDate}</div>
            <div style={{ fontSize: '9px', fontFamily: 'sans-serif', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: '2px' }}>Date of Completion</div>
            <div style={{ fontSize: '8px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', marginTop: '6px' }}>ID: {data.credentialId}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Certificate Modal ─────────────────────────────────────────────────────────

interface CertificateModalProps {
  data: CertificateData;
  onClose: () => void;
}

function CertificateModal({ data, onClose }: CertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    // Build a print-only window with just the certificate
    const certHtml = printRef.current?.outerHTML ?? '';
    const printWindow = window.open('', '_blank', 'width=860,height=620');
    if (!printWindow) {
      toast.error('Pop-up blocked', { description: 'Allow pop-ups and try again.' });
      return;
    }
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>KAA Certificate — ${data.studentName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    @media print {
      body { margin: 0; }
      #kaa-certificate { border-radius: 0 !important; box-shadow: none !important; }
    }
  </style>
</head>
<body>
  ${certHtml}
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  <\/script>
</body>
</html>`);
    printWindow.document.close();
    toast.success('Print dialog opened', { description: 'Choose "Save as PDF" to keep a copy.' });
  };

  const handleShare = async () => {
    const text = `🎓 I just completed "${data.courseName}" at Kingdom Arts Academy! Credential ID: ${data.credentialId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'KAA Certificate', text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!', { description: 'Share your achievement wherever you like.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        className="flex flex-col items-center gap-6 max-w-[860px] w-full"
      >
        {/* Close */}
        <div className="flex items-center justify-between w-full px-2">
          <h2 className="text-white font-black text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-secondary" /> Your Certificate
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate preview (scrollable on small screens) */}
        <div className="overflow-x-auto w-full">
          <CertificateCanvas data={data} printRef={printRef} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={handlePrint}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-colors shadow-lg shadow-primary/30"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            Print / Save PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 rounded-2xl text-sm font-black uppercase tracking-widest transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share Achievement
          </button>
        </div>

        {/* Credential ID */}
        <p className="text-white/20 text-xs font-mono">Credential ID: {data.credentialId}</p>
      </motion.div>
    </motion.div>
  );
}

// ── CompletedCourseCard (with certificate button) ─────────────────────────────

interface CompletedCourseCardProps {
  courseName: string;
  instrument: string;
  instructorName: string;
  level: string;
  completedDate: string;
  courseId: string;
}

export function CompletedCourseCard({
  courseName, instrument, instructorName, level, completedDate, courseId,
}: CompletedCourseCardProps) {
  const { state: authState } = useAuth();
  const [showCert, setShowCert] = useState(false);

  const certData: CertificateData = {
    studentName: authState.user.name,
    courseName,
    instrument,
    instructorName,
    completedDate,
    level,
    credentialId: generateCredentialId(authState.user.id, courseId),
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.03] border border-secondary/20 rounded-2xl p-5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-secondary" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-black text-sm truncate">{courseName}</p>
            <p className="text-white/40 text-xs">{level} · {instrument} · with {instructorName}</p>
            <p className="text-white/25 text-[10px] mt-0.5">
              Completed {new Date(completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCert(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 rounded-xl text-secondary text-[10px] font-black uppercase tracking-widest transition-colors shrink-0"
        >
          <Award className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Certificate</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {showCert && (
          <CertificateModal
            key="cert-modal"
            data={certData}
            onClose={() => setShowCert(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main Certificate Gallery view ─────────────────────────────────────────────

/**
 * Full certificates gallery page — shows all earned certificates.
 * Navigate to this via sidebar or profile page.
 */
export const CertificateGallery = () => {
  const { state: authState } = useAuth();
  const { state: courseState } = useCourses();
  const [activeCert, setActiveCert] = useState<CertificateData | null>(null);

  const completedEnrollments = useMemo(() => {
    return courseState.enrollments.filter(e => e.progress >= 100).map(e => {
      const course = courseState.courses.find(c => c.id === e.courseId);
      if (!course) return null;
      return {
        enrollment: e,
        course,
        certData: {
          studentName: authState.user.name,
          courseName: course.title,
          instrument: course.instrument,
          instructorName: course.instructor,
          completedDate: e.enrolledAt,  // use enrolledAt as proxy — real app would track completedAt
          level: course.level,
          credentialId: generateCredentialId(authState.user.id, course.id),
        } as CertificateData,
      };
    }).filter(Boolean);
  }, [courseState.enrollments, courseState.courses, authState.user]);

  if (completedEnrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
          <Award className="w-10 h-10 text-secondary/40" />
        </div>
        <h3 className="text-white font-black text-xl mb-2">No certificates yet</h3>
        <p className="text-white/30 text-sm max-w-xs">
          Complete a course to earn your first Kingdom Arts Academy certificate.
          Each one is yours to download, print, and share.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
          <Award className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h1 className="text-white font-black text-2xl">My Certificates</h1>
          <p className="text-white/40 text-sm">{completedEnrollments.length} certificate{completedEnrollments.length !== 1 ? 's' : ''} earned</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {completedEnrollments.map((item) => {
          if (!item) return null;
          const { certData, course } = item;
          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -3 }}
              onClick={() => setActiveCert(certData)}
              className="cursor-pointer bg-gradient-to-br from-primary/30 to-purple-900/20 border border-secondary/20 hover:border-secondary/50 rounded-2xl p-6 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-secondary fill-secondary/30" />
                </div>
                <span className="text-[9px] font-mono text-white/20">ID: {certData.credentialId}</span>
              </div>
              <h3 className="text-white font-black text-lg mb-1 group-hover:text-secondary transition-colors">{certData.courseName}</h3>
              <p className="text-white/40 text-sm mb-3">{certData.level} · {certData.instrument}</p>
              <div className="flex items-center justify-between">
                <p className="text-white/25 text-xs">
                  {new Date(certData.completedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
                <div className="flex items-center gap-1.5 text-secondary/70 text-[10px] font-black uppercase tracking-widest">
                  <Download className="w-3 h-3" /> View & Download
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeCert && (
          <CertificateModal
            key="cert-modal"
            data={activeCert}
            onClose={() => setActiveCert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
