import React, { useState, useMemo } from 'react';
import {
  Music, Crown
} from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { toast } from 'sonner';
import { useAuth } from '@/app/stores/useAuthStore';

// Stable ensemble room — same every week so bookmarked students find it easily.
// Instructors can start a private session from the Teacher Hub for dedicated rooms.
const ROOM_NAME = 'KAA_ENSEMBLE_OpenRehearsalWeekly';

export const GroupClass = () => {
  const { state: authState } = useAuth();
  const user = authState.user;
  const [isJoined, setIsJoined] = useState(false);

  const currentUser = useMemo(() => ({
    displayName: user.name,
    email: user.email || `${user.id}@kingdomarts.bw`,
  }), [user.name, user.email, user.id]);

  const handleAPIReady = (apiObj: any) => {
    // We can hook into Jitsi events here
    apiObj.addListener('videoConferenceJoined', () => {
      setIsJoined(true);
      toast.success('Successfully joined the Ensemble Room');
    });
    apiObj.addListener('videoConferenceLeft', () => {
      setIsJoined(false);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-black rounded-[2.5rem] overflow-hidden m-6 lg:m-10 shadow-2xl border-4 border-primary/20 relative">

      {/* Custom Academy Header overlay (only visible till fully loaded/immersed or at top) */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-none flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-secondary text-primary font-black uppercase tracking-widest text-[10px] rounded-lg shadow-lg flex items-center gap-2">
            <Crown className="w-3 h-3" /> Live Ensemble Rehearsal
          </div>
          <div className="px-3 py-1.5 bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-lg backdrop-blur-md">
            Level 5-10
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative bg-muted/10">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={ROOM_NAME}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            enableEmailInStats: false,
            prejoinPageEnabled: true, // Let them test mic/cam first
            toolbarButtons: [
              'camera', 'chat', 'closedcaptions', 'desktop',
              'download', 'fullscreen', 'hangup', 'highlight', 'microphone', 'mute-everyone',
              'participants-pane', 'profile', 'raisehand', 'security', 'select-background', 'settings',
              'shareaudio', 'toggle-camera', 'whiteboard'
            ]
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_CHROME_EXTENSION_BANNER: false
          }}
          userInfo={currentUser}
          onApiReady={handleAPIReady}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
            iframeRef.style.border = 'none';
          }}
        />
      </div>
    </div>
  );
};
