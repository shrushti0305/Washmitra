import React from 'react';
import Hero from './Hero';
import BentoGrid from './BentoGrid';
import Partners from './Partners';
import BookingModal from './BookingModal';
import Showcase from './Showcase';
import VideoShowcase from './VideoShowcase';
import ServiceMap from './ServiceMap';
import TrackingOverlay from './TrackingOverlay';

export default function Landing() {
  return (
    <div className="bg-[#F9F9F7] selection:bg-[#F26522]/30">
      {/* 1. Hero Introduction */}
      <Hero />
      
      {/* 2. Video Story Section */}
      <section className="py-24 bg-white/30">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
          <VideoShowcase />
        </div>
      </section>

      {/* 3. Bento Grid Services */}
      <section id="services" className="py-24">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]">Our Services</h3>
            <h2 className="text-4xl md:text-6xl font-black text-[#062D27] tracking-tighter">
              Professional scale, <br />
              <span className="font-serif italic text-slate-400 font-normal tracking-normal lowercase">village roots.</span>
            </h2>
          </div>
          <BentoGrid />
        </div>
      </section>

      {/* 4. Showcase Overviews */}
      <section className="py-24 bg-white/50">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
          <Showcase />
        </div>
      </section>

      {/* 5. Interactive Service Map Grid */}
      <section id="service-map" className="py-24 bg-[#010D0C] overflow-hidden rounded-[60px] mx-4 sm:mx-8 my-12">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 max-w-2xl">
            <p className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]">Interactive Journey</p>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
              Explore our <br />
              <span className="text-slate-400 italic font-serif">ground-level impact.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-md font-medium">
              Click on the markers to see real stories of transformation powered by WASH Mitra technicians.
            </p>
          </div>
          <ServiceMap />
        </div>
      </section>

      {/* 6. Network Partners */}
      <section className="py-24">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
          <Partners />
        </div>
      </section>

      {/* Global Utilities */}
      <BookingModal />
      <TrackingOverlay />
    </div>
  );
}