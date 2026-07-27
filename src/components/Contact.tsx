import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Honeypot check: real visitors never see or fill this field.
    // If it has a value, it's almost certainly a bot — silently drop it.
    if ((formData.get('company_website') as string)?.trim()) {
      setIsSubmitting(false);
      toast.success("Message received! Our team will get back to you shortly.");
      e.currentTarget.reset();
      return;
    }

    const { error } = await supabase.from('contact_messages').insert([{
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: (formData.get('email') as string) || null,
      message: formData.get('message') as string,
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error('Contact form submission failed:', error);
      toast.error('Could not send your message. Please try again.');
      return;
    }

    toast.success("Message received! Our team will get back to you shortly.");
    e.currentTarget.reset();
  };

  return (
    <div className="py-24">
      <div className="grid lg:grid-cols-2 gap-24 items-start">
        {/* Left Column: Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-orange-500 uppercase tracking-[0.2em]">Contact Us</h3>
            <h2 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.8] tracking-tighter">
              Let's build a <br />
              <span className="text-slate-300 italic font-serif lowercase tracking-normal">better rural future.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              Have questions about our training programs or need to book technical services? Reach out to our regional offices.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
               <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 border border-slate-200">
                  <MapPin className="h-5 w-5" />
               </div>
               <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Headquarters</p>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                 Plot No. 12, Tech Park, <br />
                 Pune, Maharashtra 411001
               </p>
            </div>
            <div className="space-y-3">
               <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 border border-slate-200">
                  <Phone className="h-5 w-5" />
               </div>
               <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Phone</p>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                 +91 96579 78896 <br />
                 +91 20 2567 8901
               </p>
            </div>
            <div className="space-y-3">
               <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 border border-slate-200">
                  <Mail className="h-5 w-5" />
               </div>
               <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Email</p>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                 washmitra.india@gmail.com <br />
                 support@washmitra.com
               </p>
            </div>
            <div className="space-y-3">
               <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-4">Social</p>
               <div className="flex gap-3">
                  {[Instagram, Facebook, Twitter, Linkedin].map((Icon, idx) => (
                    <a key={idx} href="#" className="w-10 h-10 bg-slate-50 hover:bg-[#F16622] hover:text-white rounded-xl flex items-center justify-center transition-all border border-slate-200 hover:border-none">
                       <Icon className="h-4 w-4" />
                    </a>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Honeypot field for spam bots — hidden from real visitors via
                CSS (not `type="hidden"`, which some bots skip) and pulled
                out of the tab order / screen-reader flow. Never rename
                this field without also updating the check in handleSubmit. */}
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

            <div className="grid sm:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                 <Input name="name" className="h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-2 focus-visible:ring-orange-500" placeholder="John Doe" required />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                 <Input name="phone" className="h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-2 focus-visible:ring-orange-500" placeholder="+91" required />
               </div>
            </div>
            
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
               <Input name="email" type="email" className="h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-2 focus-visible:ring-orange-500" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirement</label>
               <textarea 
                 name="message"
                 className="w-full min-h-[160px] rounded-[2rem] bg-slate-50 border-none p-6 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none font-medium"
                 placeholder="How can we help you?"
                 required
               />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-2xl bg-[#F16622] hover:bg-[#d95d1f] text-white font-black uppercase tracking-widest gap-3 shadow-xl shadow-orange-200 disabled:opacity-60">
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}