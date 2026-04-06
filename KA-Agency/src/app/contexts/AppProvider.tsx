import React from 'react';
import { AuthProvider } from '@/app/stores/useAuthStore';
import { JobProvider } from '@/app/stores/useJobStore';
import { MusicianProvider } from '@/app/stores/useMusicianStore';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JobProvider>
        <MusicianProvider>
          {children}
        </MusicianProvider>
      </JobProvider>
    </AuthProvider>
  );
}
