import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "WASH Mitra has created livelihood opportunities while improving maintenance systems in our schools and communities.",
      author: "Gram Panchayat Member",
      location: "Satara, Maharashtra",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=gp1"
    },
    {
      quote: "The training helped us gain confidence and technical skills for sustainable income. Now I lead a team of 4.",
      author: "Pooja Patil",
      location: "WashMitra Batch 03",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=pp1"
    },
    {
      quote: "Their annual maintenance contract has solved all our plumbing and electrical issues in the ashramshala.",
      author: "School Principal",
      location: "Pune District",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=sp1"
    }
  ];

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container px-4 sm:px-8 mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#F16622] uppercase tracking-[0.2em]">Social Proof</h3>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.8] tracking-tighter">
              Voice of the <br /> 
              <span className="text-slate-400 italic font-serif lowercase tracking-normal">community.</span>
            </h2>
          </div>
          <div className="flex gap-4">
             <button className="h-14 w-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:border-[#F16622] hover:text-[#F16622] transition-all">
                <ArrowLeft className="h-6 w-6" />
             </button>
             <button className="h-14 w-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:border-[#F16622] hover:text-[#F16622] transition-all">
                <ArrowRight className="h-6 w-6" />
             </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="group bg-white p-12 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-8">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="relative">
                   <Quote className="absolute -top-6 -left-6 h-12 w-12 text-[#F16622]/5 group-hover:text-[#F16622]/10 transition-colors" />
                   <p className="text-xl md:text-2xl font-medium text-slate-900 leading-[1.4] tracking-tight relative z-10 italic">
                     "{t.quote}"
                   </p>
                </div>
              </div>
              
              <div className="pt-10 mt-10 border-t border-slate-50 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 grayscale hover:grayscale-0 transition-all">
                   <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                </div>
                <div>
                   <p className="font-black text-slate-900 leading-none">{t.author}</p>
                   <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2B4B9B]/5 -skew-x-12 translate-x-1/2" />
    </section>
  );
}
