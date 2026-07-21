import React from 'react';
import { CheckCircle2, Users } from 'lucide-react';
import { Leadership } from './Leadership';


export default function About() {
  const scrollToLeadership = () => {
    document.getElementById('leadership')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Introduction Grid */}
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
           <h3 className="text-sm font-black text-brand-accent uppercase tracking-[0.2em]">Who We Are</h3>
           <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-brand-primary leading-[0.95] md:leading-[0.9] tracking-tighter">
             A social enterprise <br className="hidden sm:block" />
             <span className="font-serif italic text-brand-primary-light font-normal tracking-normal lowercase"> building India's village-level O&M workforce.</span>
           </h2>
           <p className="text-xl text-slate-600 font-medium">
             WASH Mitra Private Limited transforms marginalized youth into certified micro-entrepreneurs to sustain rural water, sanitation, and hygiene infrastructure.
           </p>
           
           {/* Jump-to link - Leadership content is always shown below, this just scrolls to it */}
           <button 
             onClick={scrollToLeadership}
             className="flex items-center gap-2 bg-brand-accent text-white px-8 py-4 rounded-2xl font-black hover:bg-brand-accent-hover transition-all"
           >
             <Users className="h-5 w-5" />
             Meet Our Leadership
           </button>
        </div>

        {/* Vision & Mission Cards */}
        <div className="space-y-6">
           <div className="bg-brand-primary p-10 rounded-[2.5rem] text-white">
             <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-4">Our Vision</h3>
             <p className="text-2xl sm:text-3xl font-serif italic font-light leading-snug">
               "To build a sustainable and inclusive WASH ecosystem through a nationwide network of skilled WASH Mitras, ensuring safe water, sanitation, hygiene, and reliable maintenance services for every community — while growing WASH Mitra Private Limited into a ₹10 Crore impact-driven company by 2030."
             </p>
           </div>
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-6">Our Mission</h3>
             <ul className="space-y-4">
               {[
                 'Train & empower rural, tribal, and underserved youth as professional WASH service providers.',
                 'Promote entrepreneurship & livelihood through WASH-based enterprises and service centres.',
                 'Provide quality Operations & Maintenance (O&M) services for water and sanitation infrastructure.',
                 'Strengthen community ownership & access to safe WASH services through technology.',
                 'Support Government, NGO, school, and CSR initiatives with sustainable WASH solutions.',
               ].map((point) => (
                 <li key={point} className="flex items-start gap-3 text-slate-600 font-medium">
                   <CheckCircle2 className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                   <span>{point}</span>
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </div>

      {/* Leadership Section - always shown, the button above scrolls straight to
          the "people making it happen" team cards inside it (id="leadership") */}
      <div className="border-t-4 border-brand-primary pt-12">
        <Leadership />
      </div>
    </div>
  );
}