import React from 'react';
import { X, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account Created!", {
      description: "Welcome to the Kingdom Arts family. Let's start your journey!",
      position: 'top-center',
    });
    setTimeout(onClose, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl pointer-events-auto relative"
            >
              {/* Decorative Header */}
              <div className="bg-primary p-8 text-white relative">
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-black tracking-tight mb-2">Join the Kingdom</h2>
                <p className="text-white/70 text-sm font-medium">Start your musical journey with Botswana's premier arts academy.</p>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        required
                        type="text" 
                        placeholder="Full Name"
                        className="w-full bg-muted border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        required
                        type="email" 
                        placeholder="Email Address"
                        className="w-full bg-muted border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        required
                        type="password" 
                        placeholder="Password"
                        className="w-full bg-muted border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                  >
                    Create Account <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-8 space-y-6">
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-2 text-muted-foreground">Or connect with</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => toast.info("Google login coming soon")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-xs font-bold"
                    >
                      <Github className="w-4 h-4" /> Google
                    </button>
                    <button 
                      onClick={() => toast.info("Facebook login coming soon")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-xs font-bold"
                    >
                      Facebook
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Already a member? <button onClick={() => toast.info("Login flow coming soon")} className="text-primary hover:text-secondary transition-colors ml-1">Log In</button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
