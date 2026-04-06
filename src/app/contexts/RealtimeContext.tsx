import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface RealtimeData {
  activeUsers: number;
  liveStreams: number;
  trendingCourse: string;
  globalNowPlaying: {
    title: string;
    artist: string;
    coverUrl: string;
  } | null;
}

interface RealtimeContextType {
  data: RealtimeData;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

const COURSE_NAMES = [
  'Advanced Jazz Piano',
  'Vocal Techniques Masterclass',
  'Music Production 101',
  'Classical Guitar Fundamentals',
  'Songwriting Bootcamp'
];

const MOCK_TRACKS = [
  { title: "Midnight Sonata", artist: "Julian Keys", coverUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=200" },
  { title: "Urban Beats", artist: "DJ Pro", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=200" },
  { title: "Acoustic Sunset", artist: "Sarah Strings", coverUrl: "https://images.unsplash.com/photo-1460036521480-c16762ab6fa9?auto=format&fit=crop&q=80&w=200" },
  { title: "Symphony No. 9", artist: "Philharmonic Orchestra", coverUrl: "https://images.unsplash.com/photo-1507838153406-d53f5b97c883?auto=format&fit=crop&q=80&w=200" },
];

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<RealtimeData>({
    activeUsers: 1420,
    liveStreams: 12,
    trendingCourse: 'Advanced Jazz Piano',
    globalNowPlaying: MOCK_TRACKS[0],
  });

  useEffect(() => {
    // Simulate real-time active users fluctuation
    const usersInterval = setInterval(() => {
      setData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 11) - 5
      }));
    }, 3000);

    // Simulate events like enrollments or live stream starts
    const eventsInterval = setInterval(() => {
      const isEnrollment = Math.random() > 0.5;
      if (isEnrollment) {
        const course = COURSE_NAMES[Math.floor(Math.random() * COURSE_NAMES.length)];
        toast(`New joining in ${course}!`, {
          description: 'A new student just enrolled.',
        });
      } else {
        toast('Live Practice Session Started!', {
          description: 'Join the community hub to watch.',
        });
      }
    }, 45000);

    // Simulate global radio/now playing changing
    const trackInterval = setInterval(() => {
      const nextTrack = MOCK_TRACKS[Math.floor(Math.random() * MOCK_TRACKS.length)];
      setData(prev => ({
        ...prev,
        globalNowPlaying: nextTrack
      }));
      toast('Global Stage Update', {
        description: `Now playing: ${nextTrack.title} by ${nextTrack.artist}`
      });
    }, 90000); // 1.5 minutes

    return () => {
      clearInterval(usersInterval);
      clearInterval(eventsInterval);
      clearInterval(trackInterval);
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ data }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
