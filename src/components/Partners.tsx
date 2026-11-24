import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// 1. Local Partner Logo Imports
import logoUnicef from '../assets/images/Unicef.png';
import logoAsk from '../assets/images/ask.png';
import logoAtlasCopco from '../assets/images/atlas copo.png';
import logoBajaj from '../assets/images/BAJAJFINSV.NS_BIG.png';
import logoBritannia from '../assets/images/Britannia_Industries_logo.svg.png';
import logoCie from '../assets/images/cie.png';
import logoCyda from '../assets/images/CYDA.png';
import logoPwc from '../assets/images/pwc.png';
import logoSnwf from '../assets/images/snwf.png';
import logoTdd from '../assets/images/TDD.jpg';
import logoTdk from '../assets/images/TDK.png';

export default function Partners() {
  const { t } = useLanguage();

  const partners = [
    { name: "UNICEF", logo: logoUnicef },
    { name: "ASK", logo: logoAsk },
    { name: "Atlas Copco", logo: logoAtlasCopco },
    { name: "Bajaj Finserv", logo: logoBajaj },
    { name: "Britannia", logo: logoBritannia },
    { name: "CIE Automotive", logo: logoCie },
    { name: "CYDA", logo: logoCyda },
    { name: "PwC", logo: logoPwc },
    { name: "SNWF", logo: logoSnwf },
    { name: "TDD", logo: logoTdd },
    { name: "TDK", logo: logoTdk },
    { name: "UNICEF Global", logo: logoUnicef },
  ];

  return (
    <div className="space-y-16 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">{t('partners.subtitle')}</h3>
          <h2 className="text-4xl md:text-5xl font-black text-[#062D27] tracking-tighter">{t('partners.title')}</h2>
        </div>
        <p className="text-slate-500 font-medium max-w-xs text-sm">
          {t('partners.desc')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {partners.map((p, idx) => (
          <div 
            key={idx} 
            className="group p-6 bg-slate-50 hover:bg-white rounded-[2rem] transition-all duration-300 flex items-center justify-center h-28 border border-transparent 
                       /* Interaction Effects */
                       active:scale-95 active:shadow-2xl active:bg-white active:border-[#F26522]/20 
                       hover:shadow-xl hover:border-slate-100"
          >
             <img 
               src={p.logo} 
               alt={p.name} 
               /* Removed opacity-40 and grayscale so logos are colorful and vibrant */
               className="h-10 w-auto object-contain transition-all duration-300 transform group-hover:scale-110 group-active:scale-125" 
               referrerPolicy="no-referrer"
             />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center pt-8">
         <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#062D27] transition-colors cursor-pointer">
            <span>{t('partners.footer.others')}</span>
            <div className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-900">{t('partners.footer.partnerWithUs')}</span>
         </div>
      </div>
    </div>
  );
}