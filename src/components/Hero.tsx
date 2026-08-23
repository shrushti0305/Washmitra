import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'motion/react';
import { Users2, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '../store/useBookingStore';
import { useLanguage } from '../contexts/LanguageContext';
import roofRepairImg from '../assets/images/roof_repair.jpeg';


const WashScene3D = lazy(() => import('./three/WashScene3D'));

const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

export default function Hero() {
  const navigate = useNavigate();
  const { openBookingFor } = useBookingStore();
  const { t } = useLanguage();

  return (
    <div className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-10 relative z-10 text-center lg:text-left">
            <div className="space-y-6">
              <motion.p 
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em] ml-1"
              >
                {t('tagline')}
              </motion.p>
              <motion.h1 
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl md:text-8xl font-black text-[#062D27] leading-[0.85] tracking-tighter"
              >
                {t('heroTitleLine1')} <br />
                <span className="font-serif italic text-slate-400 font-normal tracking-normal">{t('heroTitleLine2')}</span> <br />
                {t('heroTitleLine3')}
              </motion.h1>
              <motion.p 
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                {t('heroDesc')}
              </motion.p>
            </div>

            <motion.div 
              custom={4}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Button 
                onClick={() => navigate('/contact')}
                className="h-16 px-10 rounded-[20px] bg-[#F26522] hover:bg-[#d95d1f] text-white font-black uppercase tracking-widest gap-2 shadow-2xl shadow-orange-200 group transition-all w-full sm:w-auto text-xs"
              >
                {t('contactUs')} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => navigate('/training')}
                variant="outline"
                className="h-16 px-10 rounded-[20px] border-[#062D27]/20 text-[#062D27] hover:bg-[#062D27]/5 font-black uppercase tracking-widest transition-all w-full sm:w-auto text-xs"
              >
                {t('exploreTraining')}
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-gradient-to-br from-[#eef7f4] via-white to-[#f3f9f7] ring-1 ring-[#062D27]/5">
               <Suspense
                 fallback={
                   <img
                     src={roofRepairImg}
                     alt="Certified WASH Mitra Technician"
                     className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700"
                     referrerPolicy="no-referrer"
                   />
                 }
               >
                 <WashScene3D className="w-full h-full" interactive />
               </Suspense>

               {/* Caption chip explaining the 3D piece */}
               <div className="absolute top-5 left-5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                 <p className="text-[9px] font-black text-[#062D27] uppercase tracking-[0.25em]">Multi-skill cadre</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Drag to explore</p>
               </div>
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#062D27]/10 to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-6 rounded-[32px] shadow-2xl flex items-center gap-4 border border-slate-50"
            >
               <div className="w-14 h-14 rounded-2xl bg-[#062D27] flex items-center justify-center text-white">
                  <Users2 className="h-7 w-7" />
               </div>
               <div>
                  <p className="text-2xl font-black text-[#062D27]">500+</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Villages Served</p>
               </div>
            </motion.div>

            {/* Success indicator bubble */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#2EB67D] rounded-full blur-[40px] opacity-20" />
          </motion.div>
        </div>
      </div>

      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-200 rounded-full blur-[180px] -mr-96 -mt-96 opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F26522] rounded-full blur-[150px] -ml-64 -mb-64 opacity-[0.05] pointer-events-none" />
    </div>
  );
}
