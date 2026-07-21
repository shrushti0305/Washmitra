import React from 'react';
import { motion } from 'motion/react';
import { Play, QrCode, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import washmitraQrCode from '../assets/images/WASHMITRA.jpeg';

export default function VideoShowcase() {
  const VIDEO_URL = "https://www.youtube.com/watch?v=tWa4Q-Zp1WI";

  return (
    <div className="py-24 space-y-16">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Video Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.015 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 relative aspect-[16/10] md:aspect-auto md:h-[500px] rounded-[40px] overflow-hidden group cursor-pointer bg-slate-200 shadow-2xl transition-all"
          onClick={() => window.open(VIDEO_URL, '_blank')}
        >
          {/* Background Illustration/Image Placeholder */}
          <div className="absolute inset-x-0 bottom-0 top-0 opacity-20 bg-gradient-to-br from-brand-primary to-brand-accent" />
          
          {/* Play Button Overlay (Visible on Hover) */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-brand-primary/20 backdrop-blur-[2px]">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
               <Play className="h-10 w-10 text-brand-accent fill-current ml-1" />
            </div>
          </div>
          
          {/* Logo Watermark like the mockup */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
             <h4 className="text-[20vw] font-black tracking-tighter uppercase whitespace-nowrap">WASH MITRA</h4>
          </div>

          <div className="relative z-10 p-12 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em]">Watch Our Story</p>
            </div>

            <div className="max-w-2xl">
              <div className="flex items-center gap-6 mb-8 group">
                <div className="w-20 h-20 rounded-full bg-brand-accent flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Play className="h-8 w-8 fill-current ml-1" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Click to play on YouTube</p>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-brand-primary leading-[0.95] md:leading-[0.9] tracking-tighter">
                See the WASH Mitra <span className="font-serif italic text-brand-accent font-normal tracking-normal">movement</span> in action.
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-brand-accent transition-colors">
               <ExternalLink className="h-4 w-4" />
               <span>youtube.com/watch?v=tWa4Q-Zp1WI</span>
            </div>
          </div>
        </motion.div>

        {/* QR Code Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-[40px] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-xl border border-slate-50"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-brand-accent">
              <QrCode className="h-4 w-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Scan to Watch</p>
            </div>
          </div>

          <div className="w-56 h-56 bg-brand-background rounded-[32px] p-4 border border-slate-100 shadow-inner flex items-center justify-center">
            <img
              src={washmitraQrCode}
              alt="Scan to watch the WashMitra story on YouTube"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-brand-primary">Scan with your phone</h3>
            <p className="text-sm text-slate-500 max-w-[200px] font-medium leading-relaxed">
              Point your camera at the QR code to watch the WASH Mitra story on YouTube.
            </p>
          </div>

          <Button 
            variant="default" 
            className="bg-brand-primary hover:bg-brand-primary-light text-white rounded-full px-8 py-6 font-black uppercase tracking-widest text-[10px] gap-2 transition-all"
            onClick={() => window.open(VIDEO_URL, '_blank')}
          >
            <Play className="h-4 w-4 fill-current" />
            Open Video
          </Button>
        </motion.div>

      </div>
    </div>
  );
}