import React from 'react';
import { motion, Variants } from 'motion/react';
import { ArrowUpRight, Wrench, Zap, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookingStore } from '../store/useBookingStore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};

export default function BentoGrid() {
  const { openBookingFor } = useBookingStore();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 -mx-4 sm:mx-0"
    >
      {/* Featured Card: Plumbing */}
      <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
        <Card 
          onClick={() => openBookingFor('Plumbing')}
          className="group relative h-[450px] bg-[#062D27] rounded-[40px] border-none overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-wm-primary/20"
        >
          <div className="absolute top-8 left-8 z-20">
            <Badge className="bg-[#F26522] text-white border-none px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg">
              Featured Service
            </Badge>
          </div>
          <div className="absolute top-8 right-8 z-20">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#F26522]">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>

          <div className="absolute inset-0 z-10 p-12 flex flex-col justify-end text-white">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-[#F26522] group-hover:scale-110 transition-transform duration-500">
               <Wrench className="h-8 w-8" />
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Plumbing & <br />Water Solutions</h3>
            <p className="text-white/60 font-medium max-w-sm leading-relaxed">
              From pipeline repairs to modern filtration systems. Professional service delivered by certified WASH Mitras.
            </p>
          </div>

          {/* Decorative background element */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#F26522] rounded-full blur-[120px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />
        </Card>
      </motion.div>

      {/* Standard Card: Electrical */}
      <motion.div variants={itemVariants}>
        <Card 
          onClick={() => openBookingFor('Electrical')}
          className="group relative h-[450px] bg-white rounded-[40px] border-border/50 overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-[#F26522]/30"
        >
          <div className="absolute top-8 left-8 z-20">
            <Badge variant="secondary" className="bg-[#f1f5f9] text-slate-500 border-none px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase">
              Electrical
            </Badge>
          </div>
          <div className="absolute top-8 right-8 z-20">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#062D27] group-hover:text-white">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>

          <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-[#F26522] group-hover:scale-110 transition-transform duration-500">
               <Zap className="h-7 w-7" />
            </div>
            <h3 className="text-3xl font-black text-[#062D27] tracking-tight mb-3">Electrical <br />Maintenance</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Safe, certified electrical work for clinics, schools, and homesteads.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Standard Card: Training */}
      <motion.div variants={itemVariants} className="lg:col-start-3">
        <Card 
          onClick={() => openBookingFor('Training')}
          className="group relative h-[450px] bg-white rounded-[40px] border-border/50 overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-[#F26522]/30"
        >
          <div className="absolute top-8 left-8 z-20">
            <Badge variant="secondary" className="bg-[#f1f5f9] text-slate-500 border-none px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase">
              Empowerment
            </Badge>
          </div>
          <div className="absolute top-8 right-8 z-20">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#062D27] group-hover:text-white">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>

          <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-[#F26522] group-hover:scale-110 transition-transform duration-500">
               <GraduationCap className="h-7 w-7" />
            </div>
            <h3 className="text-3xl font-black text-[#062D27] tracking-tight mb-3">Technical <br />Training</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Empowering rural youth with certified livelihood skills.
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
