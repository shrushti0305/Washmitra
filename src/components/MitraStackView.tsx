import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Star, Award, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MITRA_PICS = [
  {
    id: 1,
    name: 'Suresh Kumar',
    trade: 'Master Plumber',
    batch: 'Batch 04',
    rating: 4.9,
    location: 'Pune District',
    img: 'https://images.unsplash.com/photo-1540560085022-b8b28a211931?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    name: 'Anjali Pawar',
    trade: 'Solar Technician',
    batch: 'Batch 02',
    rating: 4.8,
    location: 'Satara District',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    name: 'Rahul Meshram',
    trade: 'RO Specialist',
    batch: 'Batch 05',
    rating: 4.7,
    location: 'Gadchiroli',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    name: 'Priya Shinde',
    trade: 'Electrical Audit',
    batch: 'Batch 03',
    rating: 4.9,
    location: 'Wai Tahsil',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800'
  }
];

export default function MitraStackView() {
  const [cards, setCards] = useState(MITRA_PICS);

  const shuffle = () => {
    setCards((prev) => {
      const newArray = [...prev];
      const first = newArray.shift()!;
      newArray.push(first);
      return newArray;
    });
  };

  const activeIndex = MITRA_PICS.findIndex(m => m.id === cards[0].id);

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="relative h-[440px] w-full flex items-center justify-center perspective-1000">
        <div className="relative w-[320px] h-full">
          <AnimatePresence>
          {cards.map((mitra, index) => {
            const isTop = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <motion.div
                key={mitra.id}
                style={{ zIndex: cards.length - index }}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{
                  opacity: index > 2 ? 0 : 1,
                  scale: 1 - index * 0.05,
                  y: index * 12,
                  rotate: index === 0 ? 0 : index === 1 ? -2 : 2,
                }}
                exit={{ 
                  x: 300, 
                  opacity: 0, 
                  rotate: 20,
                  transition: { duration: 0.4, ease: 'easeOut' } 
                }}
                onClick={isTop ? shuffle : undefined}
                className={`absolute inset-0 bg-white rounded-[40px] shadow-2xl border-none overflow-hidden cursor-pointer selection-none`}
              >
                {/* Background Image */}
                <div className="h-[60%] relative overflow-hidden">
                  <img 
                    src={mitra.img} 
                    alt={mitra.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                    <div>
                      <Badge className="bg-[#F26522] text-white border-none font-black text-[8px] px-2 mb-1">
                        {mitra.batch}
                      </Badge>
                      <h3 className="text-xl font-black text-white">{mitra.name}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-lg p-1 px-2 flex items-center gap-1 text-white border border-white/20">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-black">{mitra.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#062D27]/5 flex items-center justify-center text-[#062D27]">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Trade Certification</p>
                      <p className="text-sm font-black text-[#062D27] leading-tight">{mitra.trade}</p>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={12} />
                      <span className="text-xs font-bold">{mitra.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Award size={12} />
                      <span className="text-xs font-bold">Verified Professional</span>
                    </div>
                  </div>

                  {isTop && (
                    <div className="mt-6 text-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">
                        Click to Shuffle Mitra
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
    <div className="flex gap-2">
        {MITRA_PICS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === activeIndex ? 24 : 8,
              backgroundColor: i === activeIndex ? '#F26522' : '#CBD5E1'
            }}
            className="h-2 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
