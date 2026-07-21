import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBookingStore } from '../store/useBookingStore';
import { X, Navigation } from 'lucide-react';
import TrackingMap from './TrackingMap';

export default function TrackingOverlay() {
  const { isTrackingOpen, setTrackingOpen, selectedService } = useBookingStore();

  return (
    <AnimatePresence>
      {isTrackingOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#062D27]/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            className="bg-white w-full max-w-7xl h-full max-h-[900px] rounded-[50px] shadow-2xl overflow-hidden relative flex flex-col"
          >
            <div className="absolute top-10 right-10 z-50">
               <button 
                 onClick={() => setTrackingOpen(false)}
                 className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-[#F26522] text-white flex items-center justify-center transition-all group border border-white/20 backdrop-blur-md"
               >
                  <X className="h-6 w-6 group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            <div className="p-10 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 bg-white">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                     </span>
                     <p className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]">Live Tracking Active</p>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-[#062D27] tracking-tighter leading-none italic font-serif">
                     Technician <span className="text-slate-300 not-italic">on the way.</span>
                  </h2>
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl flex items-center gap-4 border border-slate-100">
                  <div className="w-12 h-12 bg-[#062D27] rounded-xl flex items-center justify-center">
                     <Navigation className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tracking for</p>
                     <p className="text-lg font-black text-[#062D27]">{selectedService || 'Service'}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 min-h-0">
               <TrackingMap />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
