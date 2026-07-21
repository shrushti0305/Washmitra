import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import mainImgWomen from '../assets/images/mainimgWOMEN.jpg';

const womenProfiles = [
  {
    name: "Anjali Deshmukh",
    role: "Senior WASH Technician",
    location: "Satara, Maharashtra",
    bio: "Specializes in solar pump restorations, household water purification assets, and community water supply grid management.",
    image: mainImgWomen
  },
  {
    name: "Sunita Patil",
    role: "Hydro-Mechanical Specialist",
    location: "Wai Region",
    bio: "Leads an all-women rapid response maintenance team managing clean drinking water filtration systems and school toilet blocks.",
    image: mainImgWomen
  }
];

export default function WomenWashMitra() {
  return (
    <section id="women-washmitra" className="py-24 bg-[#062D27] text-white overflow-hidden rounded-[60px] my-12 mx-auto max-w-7xl">
      <div className="container px-4 sm:px-8 mx-auto">
        
        {/* Section Title Header */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-20">
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]"
            >
              Women Empowerment
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter"
            >
              Women <span className="font-serif italic text-slate-400 font-normal tracking-normal lowercase">in</span> <br />
              Technical Leadership
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-medium text-lg max-w-md lg:justify-self-end leading-relaxed"
          >
            Breaking traditional barriers in rural mechanical engineering. We train local women to become primary operators and mechanical caretakers of critical water infrastructure.
          </motion.p>
        </div>

        {/* Profiles Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {womenProfiles.map((profile, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center group hover:bg-white/10 transition-all duration-500"
            >
              {/* Profile Image View */}
              <div className="w-full md:w-48 aspect-square rounded-[30px] overflow-hidden shadow-2xl shrink-0 relative bg-[#041F1B]">
                <img 
                  src={profile.image} 
                  alt={profile.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#F26522]/10 mix-blend-multiply group-hover:opacity-0 transition-opacity" />
              </div>

              {/* Information text side */}
              <div className="space-y-4 w-full">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-[#F26522] uppercase bg-[#F26522]/10 px-3 py-1 rounded-full">
                    {profile.location}
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tight mt-3">{profile.name}</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-0.5">{profile.role}</p>
                </div>
                
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  {profile.bio}
                </p>

                {/* Badges / Metrics Indicators */}
                <div className="flex gap-4 pt-2 text-slate-400 group-hover:text-white transition-colors">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <ShieldCheck size={16} className="text-[#2EB67D]" />
                    <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider">Certified</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Award size={16} className="text-[#F26522]" />
                    <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider">Operator</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}