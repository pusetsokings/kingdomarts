import React, { useState } from 'react';
import { Camera, Upload, FileText, Music, CheckCircle2, ChevronRight, X, Sparkles, Brain, Download, Play, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const MusicScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState<'upload' | 'scanning' | 'result'>('upload');
  const [scannedData, setScannedData] = useState<{title: string, difficulty: string} | null>(null);

  const handleStartScan = () => {
    setStep('scanning');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep('result');
      setScannedData({
        title: "Tswana Folk Suite No. 1",
        difficulty: "Level 4 (Intermediate)"
      });
      toast.success("AI Transcription Complete!", {
        description: "Your sheet music has been converted to interactive MIDI format.",
      });
    }, 4000);
  };

  return (
    <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="bg-primary p-8 text-white relative">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-secondary" />
          <h3 className="text-2xl font-black tracking-tight">AI Sheet Music Scanner</h3>
        </div>
        <p className="text-white/70 font-medium">Convert physical scores into interactive digital formats instantly.</p>
        <Sparkles className="w-24 h-24 absolute -bottom-4 -right-4 opacity-10" />
      </div>

      <div className="p-10">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={handleStartScan}
                  className="p-10 border-2 border-dashed border-border rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-black uppercase tracking-widest text-[10px]">Take Photo</p>
                    <p className="text-xs text-muted-foreground mt-1">Use mobile camera</p>
                  </div>
                </button>
                <button 
                  onClick={handleStartScan}
                  className="p-10 border-2 border-dashed border-border rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-black uppercase tracking-widest text-[10px]">Upload PDF/IMG</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 10MB per page</p>
                  </div>
                </button>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl flex items-start gap-4 border border-border">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1">How it works</p>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Our AI scans the notes, dynamics, and rhythms of your physical score and converts it into a digital sheet that you can play back, slow down, and use with the Key Visualizer.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'scanning' && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12 space-y-8"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center">
                   <Music className="w-12 h-12 text-primary animate-bounce" />
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-secondary rounded-full"
                />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-black text-primary">Analysing Score...</h4>
                <div className="flex gap-2 mt-4 justify-center">
                  {['Detecting Staves', 'Recognizing Rhythms', 'Encoding MIDI'].map((t, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ delay: i * 0.5, duration: 1.5, repeat: Infinity }}
                      className="text-[8px] font-black uppercase tracking-widest bg-muted px-3 py-1 rounded-full"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'result' && scannedData && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="p-8 bg-green-50 border border-green-100 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-20 bg-white shadow-md rounded-lg flex items-center justify-center border border-border p-2">
                    <div className="w-full h-full border-t-2 border-b-2 border-primary flex flex-col justify-center gap-1">
                      <div className="h-0.5 bg-primary w-full" />
                      <div className="h-0.5 bg-primary w-full" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-primary leading-tight">{scannedData.title}</h4>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest mt-1">Ready for Practice</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Complexity</p>
                  <p className="text-sm font-black text-primary">{scannedData.difficulty}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-primary transition-all shadow-xl shadow-primary/20">
                  <Play className="w-4 h-4" /> Start Interactive Session
                </button>
                <button className="flex items-center justify-center gap-3 py-4 bg-white border border-border rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-muted transition-all">
                  <Download className="w-4 h-4" /> Export MIDI/XML
                </button>
              </div>

              <button 
                onClick={() => setStep('upload')}
                className="w-full text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Scan Another Page
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
