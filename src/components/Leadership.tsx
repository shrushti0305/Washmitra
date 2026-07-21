import React from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, 
  GraduationCap
} from 'lucide-react';
// 1. Leadership Asset Imports
import mathewImg from '../assets/images/Mathew HD.png';
import ashishImg from '../assets/images/ASHISH.png';
import yogeshImg from '../assets/images/yogesh .jpeg';

// 2. Work Gallery Asset Imports
import womenSanitizing from '../assets/images/womenSanitizing.jpg';
import solar from '../assets/images/solar.jpeg';
import plumbing2 from '../assets/images/plumbing2.jpeg';
import women2 from '../assets/images/women2.jpg';
import roofRepair from '../assets/images/roof_repair.jpeg';
import pipelineRepair from '../assets/images/pipelineRepair.jpeg';

// 3. Section images (previously broken raw-string paths - now proper imports)
import drillImg from '../assets/images/drill.jpeg';
import mainWomenImg from '../assets/images/mainimgWOMEN.jpg';

const teamMembers = [
  {
    name: "Mr. Matthew Mattam", 
    role: "Lead — Strategy & Vision",
    image: mathewImg 
  },
  {
    name: "Mr. Yogesh Nerpagar",
    role: "Lead — India WASH Mitra Operations Network",
    image: yogeshImg
  },
  {
    name: "Mr. Ashish Ingole",
    role: "Lead — Operations",
    image: ashishImg
  }
];

const galleryItems = [
  { title: "Community Sanitization", category: "WASH Services", img: womenSanitizing },
  { title: "Solar Infrastructure", category: "Skill Development", img: solar },
  { title: "Advanced Plumbing Module", category: "Technical Training", img: plumbing2 },
  { title: "Women Empowerment Cohort", category: "Livelihoods", img: women2 },
  { title: "Residential Roof Restoration", category: "Infrastructure", img: roofRepair },
  { title: "Pipeline Network Repair", category: "Rural Maintenance", img: pipelineRepair }
];

export function Leadership() {
  return (
    <div className="bg-brand-background space-y-32 pb-32 pt-24">
      
      {/* ========================================== */}
      {/* 1. YOUTUBE VIDEO SPOTLIGHT                 */}
      {/* ========================================== */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] block">Media Spotlight</span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-primary tracking-tight">Our Journey in Action</h2>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl bg-brand-primary/5 border-4 border-white"
        >
          <iframe 
            className="w-full aspect-video rounded-[2.5rem] shadow-2xl border-8 border-brand-primary"
            src="https://www.youtube.com/embed/tWa4Q-Zp1WI?si=cCEHkCikGGLxRQGH" 
            title="WASHMITRA Video Player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          />
        </motion.div>
      </section>

      {/* ========================================== */}
      {/* 2. LIL BIT INFO ABOUT WASH MITRA           */}
      {/* ========================================== */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] block">Who We Are</span>
          <h3 className="text-5xl font-black text-brand-primary leading-tight tracking-tight">
            Building sustainable rural ecosystems through skilled resource networks.
          </h3>
          <p className="text-slate-600 font-medium leading-relaxed text-base">
            WASH Mitra Private Limited bridges the gap between rural infrastructure failure and technical livelihood execution. We operate as a decentralized marketplace and vocational hub, transforming rural youth into certified, highly specialized service technicians.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 bg-orange-50 text-brand-accent rounded-xl"><Wrench size={18}/></div>
              <div>
                <h4 className="font-black text-sm text-brand-primary">On-Demand Maintenance</h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">Instant delivery of plumbing, solar, and electrical services.</p>
              </div>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 bg-orange-50 text-brand-accent rounded-xl"><GraduationCap size={18}/></div>
              <div>
                <h4 className="font-black text-sm text-brand-primary">Certified Curriculum</h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">Immersive technical skills verified through field evaluation.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-brand-accent/10 rounded-[40px] transform translate-x-4 translate-y-4 -z-10" />
          <img 
            src={drillImg} 
            alt="Rural technician infrastructure overview" 
            className="rounded-[40px] w-full shadow-xl"
          />
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. WOMEN WASH MITRA EMPOWERMENT            */}
      {/* ========================================== */}
      <section className="bg-brand-primary text-white py-24 relative overflow-hidden rounded-[60px] mx-4 sm:mx-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-last lg:order-first">
            <img 
              src={mainWomenImg} 
              alt="Women technical leadership cohort" 
              className="rounded-[40px] shadow-2xl border-4 border-white/10 w-full"
            />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] block">Gender Inclusion</span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Empowering Women <br />as Certified Hydro-Technicians
            </h3>
            <p className="text-emerald-100/70 font-medium leading-relaxed">
              We proactively break traditional barriers by onboarding women into complex trade verticals. Our specialized Women WASH Mitra cohorts master water testing operations, distribution grid diagnostics, and community development logistics, positioning them as primary clean water guardians of their gram panchayats.
            </p>
            <div className="border-l-4 border-brand-accent pl-4 italic text-sm font-medium text-emerald-50 bg-emerald-950/40 py-3 pr-4 rounded-r-xl">
              "Over 40% of our registered localized service interventions are engineered and executed successfully by certified women technicians."
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. LEADERSHIP BOARD                        */}
      {/* ========================================== */}
      <section id="leadership" className="container max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-4 mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em]"
          >
            Leadership
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-8xl font-black text-brand-primary leading-[0.95] md:leading-[0.85] tracking-tighter"
          >
            The people <span className="font-serif italic text-slate-400 font-normal tracking-normal lowercase">making it</span> <br className="hidden sm:block" />
            happen.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl cursor-pointer bg-white"
            >
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110 select-none"
                referrerPolicy="no-referrer"
                draggable="false"
              />
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-brand-primary via-brand-primary/40 to-transparent">
                <p className="text-2xl font-black text-white">{member.name}</p>
                <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mt-1 opacity-80">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

           {/* ========================================== */}
      {/* 5. IMPACT STATISTICS SUMMARY               */}
      {/* ========================================== */}
      <section className="bg-white py-20 border-y border-slate-100 shadow-inner">
        <div className="container max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="aspect-square bg-brand-background rounded-[32px] flex flex-col items-center justify-center text-center p-4 sm:p-6 gap-2 sm:gap-3">
              <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-primary">15,000+</h4>
              <p className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider leading-tight">Service Interventions</p>
            </div>
            <div className="aspect-square bg-brand-background rounded-[32px] flex flex-col items-center justify-center text-center p-4 sm:p-6 gap-2 sm:gap-3">
              <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-accent">2,500+</h4>
              <p className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider leading-tight">Certified Mitras</p>
            </div>
            <div className="aspect-square bg-brand-background rounded-[32px] flex flex-col items-center justify-center text-center p-4 sm:p-6 gap-2 sm:gap-3">
              <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-primary">400+</h4>
              <p className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider leading-tight">Panchayats Enabled</p>
            </div>
            <div className="aspect-square bg-brand-background rounded-[32px] flex flex-col items-center justify-center text-center p-4 sm:p-6 gap-2 sm:gap-3">
              <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-accent">40%</h4>
              <p className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider leading-tight">Women Workforce Representation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 6. WORK GALLERY                            */}
      {/* ========================================== */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] block">Visual Ledger</span>
          <h2 className="text-4xl font-black text-brand-primary tracking-tight">Our Work Gallery</h2>
          <p className="text-slate-400 font-medium text-sm max-w-md mx-auto">Real imagery from our training workshops and local village maintenance loops.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div 
              key={idx} 
              className="group relative rounded-[28px] overflow-hidden aspect-square bg-slate-100 shadow-md border border-slate-100"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[9px] font-black tracking-widest text-brand-accent uppercase bg-orange-50 px-2.5 py-1 rounded-full w-max mb-2">{item.category}</span>
                <h5 className="text-base font-black text-white tracking-tight">{item.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}