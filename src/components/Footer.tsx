import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import logoUrl from '../assets/images/WASH Mitra logo.png';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 pt-24 pb-12 text-white border-t border-white/5">
      <div className="container px-4 sm:px-8 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-3">
               <div className="bg-white p-2 rounded-xl">
                  <img 
                    src={logoUrl} 
                    alt="WashMitra Logo" 
                    className="h-10 w-auto"
                    referrerPolicy="no-referrer"
                  />
               </div>
               <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-black tracking-tighter text-white leading-tight uppercase">
                    WASH <span className="text-[#F26522]">Mitra</span>
                  </span>
                  <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">PVT. LTD.</span>
               </div>
            </div>
            <p className="text-white/40 font-medium max-w-sm leading-relaxed">
              Empowering rural communities through technical excellence and sustainable maintenance networks. Join our mission to build a better future.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/wash_mitra?igsh=MWJwa3R1eXU1dnFvbg==' },
                { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/share/19DSY3t7yP/?mibextid=wwXIfr' },
                { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@washmitra?si=7G_5IPkQxtZd65Go' },
                { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/919421528996' }
              ].map((social) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={social.label}
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:bg-[#F26522] hover:text-white hover:border-[#F26522] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.3em]">Company</h4>
             <ul className="space-y-4">
                {[
                  { name: 'About', path: '/about' },
                  { name: 'Services', path: '/services' },
                  { name: 'Training', path: '/training' },
                  { name: 'Impact', path: '/impact' },
                  { name: 'Contact', path: '/contact' },
                  { name: 'Admin Portal', path: '/admin' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-white/60 hover:text-[#F26522] transition-colors font-bold text-sm">
                      {item.name}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.3em]">Legal</h4>
             <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-white transition-colors font-bold text-sm">
                      {item}
                    </a>
                  </li>
                ))}
             </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
             © 2026 WASH Mitra Private Limited. All rights reserved.
           </p>
           <div className="flex gap-8">
              <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">Regional Offices</a>
              <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">Careers</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
