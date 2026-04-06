/**
 * LiveLessonRoom — Jitsi-powered live video lesson component
 *
 * Handles all three session types for Kingdom Arts Academy:
 *  1. Private 1-on-1 lesson       — instructor + one student
 *  2. Group class / ensemble       — instructor + multiple students
 *  3. Theory lesson               — screen-share focused, whiteboard enabled
 *
 * Room naming strategy:
 *   KAA_[sanitised-course-id]_[YYYYMMDD]_[shortId]
 *   Long enough to be effectively private on meet.jit.si.
 *   Same room name is shared between instructor and student via LiveStreamState.
 *
 * Upgrade path: swap domain to "8x8.vc" and add JWT for authenticated rooms.
 */

import React, { useState, useCallback, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import {
  Crown, X, Mic, MicOff, Video, VideoOff, MonitorUp,
  Users, BookOpen, Music, Radio, PhoneOff, Maximize2, Minimize2,
  MessageSquare, Loader2, Circle, Square, Download, AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SessionType = 'private' | 'group' | 'theory';

export interface LiveLessonConfig {
  /** Unique stable room name — generated once by instructor, shared to students */
  roomName: string;
  /** Full name shown in Jitsi UI */
  displayName: string;
  /** Email — used for Jitsi avatar and stats */
  email: string;
  /** Avatar shown in Jitsi participant panel */
  avatarUrl?: string;
  /** Human-readable lesson title shown in overlay */
  lessonTitle: string;
  /** Instrument or subject */
  subject: string;
  /** Instructor name — shown in overlay */
  instructorName: string;
  /** Type determines available tools and toolbar */
  sessionType: SessionType;
  /** 'instructor' gets moderator-level toolbar; 'student' gets simplified set */
  role: 'instructor' | 'student';
  /** Callback when user leaves / instructor ends the session */
  onLeave: () => void;
}

type RecordingState = 'idle' | 'requesting' | 'recording' | 'processing' | 'done';

// ── Room name generator ───────────────────────────────────────────────────────

/**
 * Generate a unique, stable, effectively-private room name.
 * Call this ONCE when instructor starts a session.
 * Store in LiveStreamState and share to students.
 */
export function generateRoomName(courseId: string, sessionType: SessionType): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const safe = courseId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  return `KAA_${sessionType.toUpperCase()}_${safe}_${date}_${rand}`;
}

// ── Toolbar configs per role + session type ───────────────────────────────────

const INSTRUCTOR_TOOLBAR = [
  'microphone', 'camera', 'desktop', 'chat',
  'raisehand', 'whiteboard', 'participants-pane',
  'mute-everyone', 'kick-everyone',
  'fullscreen', 'settings', 'hangup',
];

const THEORY_INSTRUCTOR_TOOLBAR = [
  'microphone', 'camera', 'desktop', 'chat',
  'whiteboard', 'closedcaptions',
  'participants-pane', 'mute-everyone',
  'fullscreen', 'settings', 'hangup',
];

const STUDENT_TOOLBAR = [
  'microphone', 'camera', 'chat',
  'raisehand', 'select-background',
  'fullscreen', 'hangup',
];

// ── Recording hook ────────────────────────────────────────────────────────────

/**
 * useScreenRecorder — wraps the browser's MediaRecorder + getDisplayMedia APIs.
 *
 * Strategy:
 *  1. Ask for screen + system audio capture via getDisplayMedia
 *  2. Mix in microphone audio so instructor voice is also captured
 *  3. Record as WebM (VP9 + Opus) which every Chromium-based browser supports
 *  4. On stop, assemble a Blob and trigger a download
 *
 * This gives a local recording — no server cost, works offline.
 * The resulting .webm can be uploaded to YouTube/Drive/Vimeo for video lessons.
 */
function useScreenRecorder(lessonTitle: string) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    if (recordingState !== 'idle') return;

    setRecordingState('requesting');

    try {
      // 1. Capture screen (and optionally tab/system audio)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true,          // captures system/tab audio if browser supports it
      });

      // 2. Try to mix in microphone so voice commentary is recorded too
      let combinedStream = screenStream;
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const ctx = new AudioContext();
        const dest = ctx.createMediaStreamDestination();

        // Screen audio (if any)
        screenStream.getAudioTracks().forEach(track => {
          const src = ctx.createMediaStreamSource(new MediaStream([track]));
          src.connect(dest);
        });

        // Mic audio
        micStream.getAudioTracks().forEach(track => {
          const src = ctx.createMediaStreamSource(new MediaStream([track]));
          src.connect(dest);
        });

        combinedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...dest.stream.getAudioTracks(),
        ]);
      } catch {
        // Mic unavailable or denied — record screen-only audio track
        // combinedStream remains screenStream
      }

      // 3. Pick best supported MIME type
      const mimeType = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ].find(t => MediaRecorder.isTypeSupported(t)) ?? '';

      const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        setRecordingState('processing');

        // Stop all tracks
        combinedStream.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        // Build blob and trigger download
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeTitle = lessonTitle.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
        a.href = url;
        a.download = `KAA_Lesson_${safeTitle}_${timestamp}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Clear timer
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingDuration(0);
        setRecordingState('done');

        toast.success('Recording saved!', {
          description: 'Your lesson video has been downloaded. Upload it to video lessons when ready.',
          duration: 8000,
        });

        // Reset to idle after 4s so user can record again
        setTimeout(() => setRecordingState('idle'), 4000);
      };

      // Handle user stopping screen share from browser UI
      screenStream.getVideoTracks()[0]?.addEventListener('ended', () => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      });

      // 4. Start recording — collect a chunk every 1 s for lower memory pressure
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      streamRef.current = combinedStream;
      setRecordingState('recording');
      setRecordingDuration(0);

      // Tick duration counter
      timerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);

      toast.success('Recording started', {
        description: 'Your screen + audio is being captured. Press Stop when you\'re done.',
      });

    } catch (err: any) {
      // User cancelled or permissions denied
      if (err?.name !== 'NotAllowedError' && err?.name !== 'AbortError') {
        toast.error('Recording failed', { description: err?.message ?? 'Could not access screen capture.' });
      }
      setRecordingState('idle');
    }
  }, [recordingState, lessonTitle]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return { recordingState, recordingDuration, startRecording, stopRecording };
}

// ── Duration formatter ────────────────────────────────────────────────────────
function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Loading overlay ───────────────────────────────────────────────────────────
function LoadingOverlay({ lessonTitle, instructorName }: { lessonTitle: string; instructorName: string }) {
  return (
    <div className="absolute inset-0 bg-primary flex flex-col items-center justify-center z-20 rounded-[2.5rem]">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl shadow-2xl mb-6">
        <Crown className="w-8 h-8 text-primary fill-primary" />
      </div>
      <h2 className="text-white font-black text-2xl mb-2">{lessonTitle}</h2>
      <p className="text-white/50 text-sm mb-8">with {instructorName}</p>
      <div className="flex items-center gap-3 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-bold">Connecting to your lesson room…</span>
      </div>
    </div>
  );
}

// ── Session type badge ────────────────────────────────────────────────────────
function SessionTypeBadge({ type }: { type: SessionType }) {
  const configs: Record<SessionType, { icon: React.ElementType; label: string; cls: string }> = {
    private: { icon: Music, label: '1-on-1 Lesson', cls: 'bg-secondary text-primary' },
    group:   { icon: Users, label: 'Group Class', cls: 'bg-blue-500 text-white' },
    theory:  { icon: BookOpen, label: 'Theory Lesson', cls: 'bg-purple-600 text-white' },
  };
  const { icon: Icon, label, cls } = configs[type];
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
}

// ── Recording button ──────────────────────────────────────────────────────────
function RecordButton({
  state,
  duration,
  onStart,
  onStop,
}: {
  state: RecordingState;
  duration: number;
  onStart: () => void;
  onStop: () => void;
}) {
  if (state === 'idle') {
    return (
      <button
        onClick={onStart}
        title="Record this lesson"
        className="flex items-center gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10"
      >
        <Circle className="w-3.5 h-3.5 text-red-400" />
        <span className="hidden sm:block">Record</span>
      </button>
    );
  }

  if (state === 'requesting') {
    return (
      <button disabled className="flex items-center gap-2 px-3 py-2.5 bg-white/10 rounded-xl text-white/50 text-[10px] font-black uppercase tracking-widest border border-white/10 cursor-not-allowed">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden sm:block">Starting…</span>
      </button>
    );
  }

  if (state === 'recording') {
    return (
      <button
        onClick={onStop}
        title="Stop recording and download"
        className="flex items-center gap-2 px-3 py-2.5 bg-red-600/80 hover:bg-red-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-colors border border-red-400/50 animate-pulse"
      >
        <Square className="w-3.5 h-3.5 fill-white" />
        <span className="font-mono tabular-nums">{formatDuration(duration)}</span>
      </button>
    );
  }

  if (state === 'processing') {
    return (
      <button disabled className="flex items-center gap-2 px-3 py-2.5 bg-yellow-600/60 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-yellow-400/30 cursor-not-allowed">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden sm:block">Saving…</span>
      </button>
    );
  }

  if (state === 'done') {
    return (
      <button disabled className="flex items-center gap-2 px-3 py-2.5 bg-green-600/60 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-green-400/30 cursor-not-allowed">
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:block">Saved!</span>
      </button>
    );
  }

  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
export function LiveLessonRoom({
  roomName,
  displayName,
  email,
  avatarUrl,
  lessonTitle,
  subject,
  instructorName,
  sessionType,
  role,
  onLeave,
}: LiveLessonConfig) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);

  const { recordingState, recordingDuration, startRecording, stopRecording } = useScreenRecorder(lessonTitle);

  const toolbarButtons = role === 'instructor'
    ? (sessionType === 'theory' ? THEORY_INSTRUCTOR_TOOLBAR : INSTRUCTOR_TOOLBAR)
    : STUDENT_TOOLBAR;

  const handleApiReady = useCallback((apiObj: any) => {
    setIsLoading(false);

    // ── Participant tracking ─────────────────────────────
    apiObj.addListener('participantJoined', () => {
      setParticipantCount(prev => prev + 1);
    });
    apiObj.addListener('participantLeft', () => {
      setParticipantCount(prev => Math.max(1, prev - 1));
    });
    apiObj.addListener('videoConferenceJoined', () => {
      setIsLoading(false);
      const greeting = role === 'instructor'
        ? `Your live ${sessionType} lesson has started. Invite your student(s)!`
        : `You've joined the lesson with ${instructorName}`;
      toast.success('Connected!', { description: greeting });
    });

    // ── When session ends, stop any active recording first ─
    apiObj.addListener('videoConferenceLeft', () => {
      stopRecording();
      onLeave();
    });
    apiObj.addListener('readyToClose', () => {
      stopRecording();
      onLeave();
    });

    // ── Theory mode: auto-prompt screen share ────────────
    if (sessionType === 'theory' && role === 'instructor') {
      setTimeout(() => {
        toast.info('Theory Lesson', {
          description: 'Use the Screen Share button to show slides or music notation to your students.',
          duration: 6000,
        });
      }, 2000);
    }
  }, [role, sessionType, instructorName, onLeave, stopRecording]);

  const handleLeave = useCallback(() => {
    if (recordingState === 'recording') {
      const confirmed = window.confirm('You have an active recording. Stop recording and leave?');
      if (!confirmed) return;
      stopRecording();
    }
    if (role === 'instructor') {
      const confirmed = recordingState === 'recording'
        ? true  // already confirmed above
        : window.confirm('End this session for everyone?');
      if (!confirmed) return;
    }
    onLeave();
  }, [role, recordingState, stopRecording, onLeave]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed z-[400] bg-black shadow-2xl overflow-hidden transition-all duration-300 ${
        isExpanded
          ? 'inset-0 rounded-none'
          : 'inset-4 md:inset-6 rounded-[2.5rem] border-4 border-primary/30'
      }`}
    >
      {/* ── Top overlay bar ────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none">
        <div className="flex items-center justify-between p-4 md:p-6 pointer-events-auto">
          {/* Left: branding + info */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
              <Crown className="w-4 h-4 text-secondary fill-secondary" />
              <span className="text-white font-black text-[11px] uppercase tracking-widest hidden sm:block">KAA Live</span>
            </div>
            <SessionTypeBadge type={sessionType} />
            <div className="hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
              <span className="text-white/70 text-xs font-bold truncate max-w-[200px]">{lessonTitle}</span>
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-red-600 rounded-xl px-3 py-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-[10px] font-black uppercase tracking-widest hidden sm:block">Live</span>
              {participantCount > 1 && (
                <span className="text-white/80 text-[10px] font-bold">· {participantCount}</span>
              )}
            </div>

            {/* ── Record button — available to both roles ── */}
            <RecordButton
              state={recordingState}
              duration={recordingDuration}
              onStart={startRecording}
              onStop={stopRecording}
            />

            {/* Expand / minimise */}
            <button
              onClick={() => setIsExpanded(v => !v)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors border border-white/10"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Leave / End */}
            <button
              onClick={handleLeave}
              className="flex items-center gap-2 px-3 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-colors border border-red-500"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{role === 'instructor' ? 'End' : 'Leave'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Recording banner (visible while recording) ── */}
      <AnimatePresence>
        {recordingState === 'recording' && (
          <motion.div
            key="rec-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-[72px] md:top-[84px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-red-700/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-red-400/50 shadow-lg"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Recording · {formatDuration(recordingDuration)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading overlay ─────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20"
          >
            <LoadingOverlay lessonTitle={lessonTitle} instructorName={instructorName} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Jitsi Meeting iframe ────────────────────────── */}
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          // ── Audio/video defaults ──────────────────────────
          startWithAudioMuted: role === 'student',
          startWithVideoMuted: false,

          // Skip the prejoin page entirely — KAA shows its own
          // loading overlay so users never see the provider UI
          prejoinPageEnabled: false,
          prejoinConfig: { enabled: false },

          // ── Quality (important for live music) ────────────
          resolution: 720,
          constraints: {
            video: {
              height: { ideal: 720, max: 1080, min: 240 },
              frameRate: { max: 30 },
            },
          },

          // ── Hide all provider-identifiable features ────────
          disableModeratorIndicator: true,
          enableEmailInStats: false,
          disableDeepLinking: true,
          disableInviteFunctions: true,
          fileRecordingsEnabled: false,
          // Remove "Powered by Jitsi" / "meet.jit.si" from header
          disableBrandWatermark: true,
          disableProfile: false,        // keep profile (shows KAA display name)
          brandingRoomAlias: null,

          // Hide the Jitsi logo in the top-left corner
          logoClickUrl: '',
          // Remove "Jitsi Meet" from browser tab title
          appName: 'Kingdom Arts Academy',

          // ── Whiteboard / screenshare ──────────────────────
          disableWhiteboard: sessionType !== 'theory',
          desktopSharingEnabled: true,
          autoCaptionOnRecord: sessionType === 'theory',

          // ── Subject (shown in participant panel) ──────────
          // Shows KAA branding — NOT "meet.jit.si" — in the room header
          subject: `${lessonTitle} · Kingdom Arts Academy`,

          // ── Toolbar ───────────────────────────────────────
          toolbarButtons,

          // Moderator — auto-mute students on join
          ...(role === 'instructor' && sessionType !== 'group'
            ? { startAudioMuted: 9 }
            : {}),
        }}
        interfaceConfigOverwrite={{
          // ── Strip all Jitsi / "powered by" branding ───────
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          HIDE_INVITE_MORE_HEADER: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,

          // ── Hide the deep-link / open-in-app bar ──────────
          MOBILE_APP_PROMO: false,
          HIDE_DEEP_LINKING_LOGO: true,

          // ── Customise remaining UI to match KAA ───────────
          DEFAULT_BACKGROUND: '#1a0a2e',       // KAA dark purple
          DEFAULT_LOGO_URL: '',                // removes Jitsi logo
          BRAND_WATERMARK_LINK: '',

          // App name in any remaining Jitsi-generated strings
          APP_NAME: 'Kingdom Arts Academy',
          NATIVE_APP_NAME: 'Kingdom Arts Academy',
          PROVIDER_NAME: 'Kingdom Arts Academy',

          TOOLBAR_BUTTONS: toolbarButtons,
        }}
        userInfo={{
          displayName,
          email: email || `${displayName.replace(/\s/g, '').toLowerCase()}@kingdomarts.bw`,
        }}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
          iframeRef.style.border = 'none';
          iframeRef.style.display = 'block';
        }}
      />

      {/* ── Bottom info bar (instructor only) ──────────── */}
      {role === 'instructor' && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <div className="flex items-center justify-between px-6 py-4 pointer-events-auto">
            <div className="flex items-center gap-3 text-white/50 text-xs font-bold">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              Room: <span className="font-mono text-white/30 text-[10px]">{roomName.slice(-12)}</span>
            </div>
            <div className="flex items-center gap-4">
              {recordingState === 'idle' && (
                <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                  Tip: Press Record to save this lesson
                </span>
              )}
              <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                Students join via their invite notification
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
