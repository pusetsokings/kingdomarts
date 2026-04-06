import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayer } from '@/app/stores/usePlayerStore';
import { useAudioPlayer } from '@/app/hooks/useAudioPlayer';

export const GlobalPlayer = () => {
  const { state, dispatch } = usePlayer();
  const { seek, formatTime, currentTrack } = useAudioPlayer();

  if (!state.isVisible || !currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-black/90 backdrop-blur-3xl text-white shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
      >
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3 flex items-center gap-4">

          {/* Album Art + Info */}
          <div className="flex items-center gap-3 min-w-0 w-48 flex-shrink-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="object-cover w-full h-full" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black ${state.isPlaying ? 'bg-green-400' : 'bg-gray-500'}`} />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="font-black text-sm truncate leading-tight">{currentTrack.title}</p>
              <p className="text-[11px] text-white/50 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Main Controls + Progress */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <div className="flex items-center gap-5 mb-2">
              <button onClick={() => dispatch({ type: 'PREV_TRACK' })} className="text-white/50 hover:text-white transition-colors">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
                className="w-9 h-9 rounded-full bg-[#fdb913] text-[#522d80] flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                {state.isPlaying
                  ? <Pause className="w-4 h-4 fill-current" />
                  : <Play className="w-4 h-4 fill-current ml-0.5" />
                }
              </button>
              <button onClick={() => dispatch({ type: 'NEXT_TRACK' })} className="text-white/50 hover:text-white transition-colors">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>
            {/* Progress */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] text-white/40 font-mono w-8 text-right flex-shrink-0">
                {formatTime(state.progress)}
              </span>
              <div
                className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group relative"
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seek(((e.clientX - rect.left) / rect.width) * 100);
                }}
              >
                <div className="h-full bg-[#fdb913] rounded-full relative transition-all" style={{ width: `${state.progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-[10px] text-white/40 font-mono w-8 flex-shrink-0">
                {formatTime(100)}
              </span>
            </div>
          </div>

          {/* Volume + Track Dots + Close */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={() => dispatch({ type: 'TOGGLE_MUTE' })} className="text-white/50 hover:text-white transition-colors">
                {state.isMuted || state.volume === 0
                  ? <VolumeX className="w-4 h-4" />
                  : <Volume2 className="w-4 h-4" />
                }
              </button>
              <input
                type="range" min="0" max="1" step="0.05"
                value={state.isMuted ? 0 : state.volume}
                onChange={e => dispatch({ type: 'SET_VOLUME', value: parseFloat(e.target.value) })}
                className="w-20 accent-[#fdb913] cursor-pointer"
              />
            </div>

            {/* Track selector dots */}
            <div className="hidden xl:flex items-center gap-1.5">
              {state.tracks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => dispatch({ type: 'SET_TRACK', index: i })}
                  className={`rounded-full transition-all ${i === state.currentIndex ? 'w-4 h-1.5 bg-[#fdb913]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'}`}
                />
              ))}
            </div>

            <button
              onClick={() => dispatch({ type: 'HIDE_PLAYER' })}
              className="text-white/40 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
