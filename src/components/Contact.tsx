import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Linkedin, Loader2, MessageSquare, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const SERVICE_INTERESTS = [
  'Plumbing & Pipeline Repair',
  'Water Filtration & RO Systems',
  'Electrical & Pump Maintenance',
  'Solar PV & Water Heaters',
  'Sanitation & Toilet Blocks',
  'Vocational Training & Skilling',
  'Institutional / School AMC',
  'CSR Partnership & Support',
  'General Inquiry'
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState('Plumbing & Pipeline Repair');
  const [submittedData, setSubmittedData] = useState<{ name: string; phone: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim() || 'Visitor';
    const phone = (formData.get('phone') as string)?.trim() || '';
    const email = (formData.get('email') as string)?.trim() || null;
    const message = (formData.get('message') as string)?.trim() || '';
    const formattedMessage = `[Interest: ${selectedInterest}] ${message}`;

    // Honeypot check: real visitors never see or fill this field.
    if ((formData.get('company_website') as string)?.trim()) {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedData({ name, phone });
      toast.success("Thank you! Your inquiry has been received.");
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase.from('contact_messages').insert([{
          name,
          phone,
          email,
          message: formattedMessage,
        }]);

        if (error) {
          console.warn('Database note on contact insert:', error.message);
        }
      }
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedData({ name, phone });
      toast.success("Inquiry received! Our team will contact you shortly.");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello WASH Mitra team, I would like to inquire about ${selectedInterest}. My name is ${submittedData?.name || ''}.`
  );

  return (
    <div className="py-24">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left Column: Information & Direct Channels */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#F26522] uppercase tracking-[0.2em]">Get in Touch</h3>
            <h2 className="text-5xl md:text-7xl font-black text-[#062D27] leading-[0.9] tracking-tighter">
              Let's build a <br />
              <span className="text-slate-400 italic font-serif lowercase tracking-normal">better rural future.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              Have questions about our multi-trade services, certified training batches, or institutional maintenance contracts? Reach out to our Pune headquarters.
            </p>
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://wa.me/919421528996" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
            <a 
              href="tel:+919657978896" 
              className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-[#062D27] font-black px-6 py-4 rounded-2xl text-xs uppercase tracking-wider border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Phone className="h-4 w-4 text-[#F26522]" /> Call Headquarters
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-slate-200/60">
            <div className="space-y-3">
               <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#062D27] border border-slate-200/60 shadow-sm">
                  <MapPin className="h-5 w-5 text-[#F26522]" />
               </div>
               <p className="font-black text-[#062D27] uppercase text-[10px] tracking-widest">Headquarters</p>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                 Plot No. 12, Tech Park, <br />
                 Pune, Maharashtra 411001
               </p>
            </div>
            <div className="space-y-3">
               <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#062D27] border border-slate-200/60 shadow-sm">
                  <Phone className="h-5 w-5 text-[#F26522]" />
               </div>
               <p className="font-black text-[#062D27] uppercase text-[10px] tracking-widest">Phone & Helpline</p>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                 +91 96579 78896 <br />
                 +91 20 2567 8901
               </p>
            </div>
            <div className="space-y-3">
               <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#062D27] border border-slate-200/60 shadow-sm">
                  <Mail className="h-5 w-5 text-[#F26522]" />
               </div>
               <p className="font-black text-[#062D27] uppercase text-[10px] tracking-widest">Email Inquiries</p>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                 washmitra.india@gmail.com <br />
                 support@washmitra.com
               </p>
            </div>
            <div className="space-y-3">
               <p className="font-black text-[#062D27] uppercase text-[10px] tracking-widest mb-4">Connect on Social</p>
               <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: '#' },
                    { icon: Facebook, href: '#' },
                    { icon: Twitter, href: '#' },
                    { icon: Linkedin, href: '#' }
                  ].map((item, idx) => (
                    <a 
                      key={idx} 
                      href={item.href} 
                      className="w-11 h-11 bg-white hover:bg-[#F26522] hover:text-white text-[#062D27] rounded-2xl flex items-center justify-center transition-all border border-slate-200/60 shadow-sm"
                    >
                       <item.icon className="h-4 w-4" />
                    </a>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Working Contact & Inquiry Form */}
        <div className="bg-white p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative">
          {isSuccess ? (
            <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-[#062D27] tracking-tight">Inquiry Received!</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm leading-relaxed">
                  Thank you, <span className="font-bold text-[#062D27]">{submittedData?.name}</span>. Our technical coordinator at Pune headquarters will review your inquiry and connect with you within 24 business hours.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-left max-w-md mx-auto">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">Interest Category</span>
                  <span className="text-[#062D27] font-black">{selectedInterest}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">Contact Number</span>
                  <span className="text-[#062D27] font-black">{submittedData?.phone}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`https://wa.me/9421528996?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  <MessageCircle className="h-4 w-4" /> Follow Up on WhatsApp
                </a>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="h-12 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-slate-600"
                >
                  Send Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field for spam bots */}
              <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                <label htmlFor="company_website">Company Website</label>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  What are you inquiring about?
                </label>
                <select
                  value={selectedInterest}
                  onChange={(e) => setSelectedInterest(e.target.value)}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#062D27] px-5 outline-none text-sm focus:ring-2 focus:ring-[#F26522]/30 cursor-pointer"
                >
                  {SERVICE_INTERESTS.map((interest) => (
                    <option key={interest} value={interest}>
                      {interest}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                  <Input 
                    name="name" 
                    className="h-14 rounded-2xl bg-slate-50 border border-slate-100 px-5 font-bold text-[#062D27] focus-visible:ring-2 focus-visible:ring-[#F26522]/30" 
                    placeholder="e.g. Ramesh Patil" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <Input 
                    name="phone" 
                    type="tel"
                    className="h-14 rounded-2xl bg-slate-50 border border-slate-100 px-5 font-bold text-[#062D27] focus-visible:ring-2 focus-visible:ring-[#F26522]/30" 
                    placeholder="e.g. +91 98765 43210" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (Optional)</label>
                <Input 
                  name="email" 
                  type="email" 
                  className="h-14 rounded-2xl bg-slate-50 border border-slate-100 px-5 font-bold text-[#062D27] focus-visible:ring-2 focus-visible:ring-[#F26522]/30" 
                  placeholder="name@organization.com" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Requirement / Message</label>
                <textarea 
                  name="message"
                  className="w-full min-h-[140px] rounded-2xl bg-slate-50 border border-slate-100 p-5 focus:ring-2 focus:ring-[#F26522]/30 outline-none transition-all resize-none font-medium text-sm text-[#062D27]"
                  placeholder="Describe your location, school/facility, or the repair/training support you need..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-16 rounded-2xl bg-[#F26522] hover:bg-[#d95d1f] text-white font-black uppercase tracking-widest gap-3 shadow-xl shadow-orange-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 text-xs"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} 
                {isSubmitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}