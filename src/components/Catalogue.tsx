import type { ComponentType } from 'react';
import { useStore } from '../store/useStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceCategory } from '../types';
import {
  ArrowRight, ArrowUpRight,
  // Curated icon set for service_categories.icon lookups. Using a wildcard
  // `import * as Icons from 'lucide-react'` here previously pulled the
  // ENTIRE icon library (1000+ components, ~800KB) into this chunk because
  // the icon is picked by name at runtime and tree-shaking can't see which
  // ones are used. This explicit map covers the icons currently in the
  // database plus a generous set of likely future ones; anything not
  // listed falls back to Circle.
  Circle, Sun, Hammer, Droplets, Zap, Wrench, Filter, ShowerHead, Waves,
  Recycle, Trash2, Home, Building2, Truck, ShieldCheck, HeartPulse,
} from 'lucide-react';

const ICON_MAP: Record<string, ComponentType<{ className?: string; size?: number | string }>> = {
  Circle, Sun, Hammer, Droplets, Zap, Wrench, Filter, ShowerHead, Waves,
  Recycle, Trash2, Home, Building2, Truck, ShieldCheck, HeartPulse,
};

export default function Catalogue({ onSelect }: { onSelect?: (cat: ServiceCategory) => void }) {
  const { categories } = useStore();

  if (!categories || categories.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Loading services...</p>
      </div>
    );
  }

  const servicesMap: Record<string, string[]> = {
    "Plumbing": [
      "Tap & pipeline repair",
      "Bathroom fitting installation",
      "Water leakage repair",
      "Tank maintenance",
      "School plumbing"
    ],
    "Electrical": [
      "Internal wiring",
      "Switchboards & lighting",
      "Fan & appliance repair",
      "School maintenance"
    ],
    "Hygiene": [
      "Waste management",
      "Disinfection services",
      "Sanitary napkin dispensers",
      "Awareness programs"
    ]
  };

  return (
    <div className="space-y-24 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-6xl md:text-8xl font-black text-[#0A2540] tracking-tighter leading-[0.9]">
            Services that <span className="font-serif italic text-[#1A4D4D] font-normal tracking-normal">show up,</span> <br />
            on time, every time.
          </h2>
        </div>
        <div className="max-w-md ml-auto">
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            From single repairs to institutional AMCs — a verified WASH Mitra is one tap away.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {categories.slice(0, 2).map((cat, idx) => {
          const IconComponent = ICON_MAP[cat.icon] || Circle;
          const isDark = idx === 0;
          return (
            <div 
              key={cat.id} 
              className={`group relative p-12 rounded-[3.5rem] transition-all duration-500 cursor-pointer overflow-hidden ${
                isDark ? 'bg-[#052E28] text-white' : 'bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-slate-900'
              }`}
              onClick={() => onSelect?.(cat)}
            >
              <div className="absolute top-10 right-10 opacity-20 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-8 w-8" />
              </div>

              <div className="relative z-10 space-y-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark ? 'text-orange-400' : 'text-[#1A4D4D]'
                }`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black tracking-tight">{cat.name}</h3>
                
                <ul className="space-y-4">
                  {(servicesMap[cat.name] || ["General maintenance"]).map((service, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-orange-500' : 'bg-[#1A4D4D]'}`} />
                      <span className={`text-lg font-medium ${isDark ? 'text-white/80' : 'text-slate-500'}`}>
                        {service}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Remaining categories */}
      <div className="grid gap-8 md:grid-cols-3">
         {categories.slice(2).map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Circle;
            return (
               <div 
                  key={cat.id}
                  className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500"
               >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#F16622] mb-6">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{cat.name}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">{cat.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#F16622] uppercase tracking-[0.2em] group cursor-pointer">
                    <span>Learn More</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            );
         })}
      </div>

      <div className="bg-[#0A2540] p-12 rounded-[3.5rem] mt-24 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 blur-[100px] opacity-20 -ml-32 -mt-32" />
         <div className="relative z-10 space-y-2">
            <h3 className="text-3xl font-black tracking-tight">Need a customized AMC?</h3>
            <p className="text-white/60 font-medium">We design specific maintenance plans for schools, hospitals, and corporate facilities.</p>
         </div>
         <Button className="h-14 px-10 rounded-full bg-[#F16622] hover:bg-white hover:text-slate-900 border-none font-black uppercase tracking-widest relative z-10 transition-all">
            Get a Quote
         </Button>
      </div>
    </div>
  );
}
