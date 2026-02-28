import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  price: string;
  onSuccess: () => void;
}

export const PaymentModal = ({ isOpen, onClose, courseTitle, price, onSuccess }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'success'>('details');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      toast.success("Payment Successful!", {
        description: `You now have lifetime access to ${courseTitle}.`,
      });
      onSuccess();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          />

          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[111] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl pointer-events-auto relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {step === 'details' ? (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Complete Enrollment</h2>
                      <p className="text-muted-foreground text-sm font-medium">Unlock lifetime access to this masterclass.</p>
                    </div>
                  </div>

                  <div className="bg-muted p-6 rounded-2xl mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Course</span>
                      <span className="text-sm font-black text-primary">{courseTitle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Price</span>
                      <span className="text-xl font-black text-primary">{price}</span>
                    </div>
                  </div>

                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cardholder Name</label>
                        <input required type="text" placeholder="LERATO MOLEFE" className="w-full bg-muted border-none rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none uppercase" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Card Number</label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input required type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-muted border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expiry Date</label>
                          <input required type="text" placeholder="MM/YY" className="w-full bg-muted border-none rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">CVV</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input required type="text" placeholder="•••" className="w-full bg-muted border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      disabled={isProcessing}
                      type="submit"
                      className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : `Pay ${price} & Enroll`} <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit encrypted payment</span>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Welcome Aboard!</h2>
                  <p className="text-muted-foreground font-medium mb-8">You have successfully enrolled in {courseTitle}. Your musical journey begins now.</p>
                  <button 
                    onClick={onClose}
                    className="w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl hover:bg-primary/90 transition-all"
                  >
                    Go to Course Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
