import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Droplets, Wrench, GraduationCap } from 'lucide-react';

// 1. IMPORT YOUR IMAGES HERE
import womenSanitizingImg from '../assets/images/womenSanitizing.jpg';
import trainingImg from '../assets/images/trainingwomen.jpg';
import plumbingImg from '../assets/images/plumbing.jpeg';

export default function Showcase() {
  const items = [
    {
      title: "Sanitation",
      label: "SANITATION",
      icon: Droplets,
      image: womenSanitizingImg,
      color: "bg-[#F26522]"
    },
    {
      title: "Training",
      label: "TRAINING",
      icon: GraduationCap,
      image: trainingImg,
      color: "bg-[#F26522]"
    },
    {
      title: "Plumbing",
      label: "PLUMBING",
      icon: Wrench,
      image: plumbingImg,
      color: "bg-[#F26522]"
    }
  ];

  return (
    <div className="py-24 space-y-16">
      {/* Header Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-end">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em] ml-1">Pages of WASH Mitra</p>
          <h2 className="text-6xl md:text-8xl font-black text-[#062D27] leading-[0.85] tracking-tighter">
            Certified, <br />
            <span className="font-serif italic text-slate-400 font-normal tracking-normal">Trained,</span> Trusted.
          </h2>
        </div>
        <div className="max-w-md ml-auto">
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Men and women from rural India — trained, certified and delivering trusted WASH services every day.
          </p>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="group relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            
            {/* Badge */}
            <div className="absolute top-8 left-8">
               <Badge className={`${item.color} text-white border-none px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[10px] tracking-widest uppercase shadow-lg`}>
                  <item.icon className="h-3 w-3" />
                  {item.label}
               </Badge>
            </div>

            {/* Title Display */}
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-3xl font-black tracking-tighter">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}