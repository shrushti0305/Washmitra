import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import washMitraLogo from '../assets/images/WASH Mitra logo.png';

const ROLES = [
  { key: "customer", label: "User", fullLabel: "Citizen / Household", badgeCls: "bg-sky-100 text-sky-800" },
  { key: "washmitra", label: "WashMitra", fullLabel: "WashMitra Operator", badgeCls: "bg-green-100 text-green-800" },
  { key: "institution", label: "Inst", fullLabel: "School / ZP / NGO", badgeCls: "bg-yellow-100 text-yellow-800" },
  { key: "admin", label: "Adm", fullLabel: "Admin Access", badgeCls: "bg-pink-100 text-pink-800" },
];

export default function Auth() {
  const { setUser } = useStore();
  const [role, setRole] = useState("customer");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [formData, setFormData] = useState({ fullName: '', mobile: '', email: '' });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const getFormattedPhone = () => {
    const cleaned = formData.mobile.replace(/\D/g, '');
    return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
  };

  const handleSendOtp = async () => {
    if (timer > 0) return;
    if (formData.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      phone: getFormattedPhone(),
      options: { shouldCreateUser: true }
    });
    
    if (error) {
      console.error("Auth Send Error:", error);
      toast.error(error.message);
    } else {
      toast.success("OTP sent to your mobile!");
      setStep(1);
      setTimer(60);
    }
  };

  const handleVerifyOtp = async () => {
    // 1. Verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
      phone: getFormattedPhone(),
      token: otp,
      type: 'sms' 
    });

    if (error) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    // 2. Only attempt profile update if session exists
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name: formData.fullName,
          role: role.toUpperCase(),
          email: formData.email || null 
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Profile update failed:", profileError);
        // We continue anyway so the user can still log in
      }

      setUser({
        id: data.user.id,
        full_name: formData.fullName,
        email: formData.email,
        role: role.toUpperCase() as UserRole,
        is_paid: role !== 'washmitra',
        avatar_url: '',
        created_at: new Date().toISOString()
      });
      
      toast.success("Account verified successfully!");
      setStep(2);
    }
  };

  const roleMeta = ROLES.find((r) => r.key === role);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4 bg-slate-50">
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="text-center px-10 pt-10 pb-6">
          <img src={washMitraLogo} alt="WASH Mitra Logo" className="w-auto h-16 mx-auto mb-4 object-contain" />
          <h2 className="text-[1.25rem] font-black text-[#062D27] tracking-tight">Create your WASH Mitra account</h2>
        </div>

        <div className="mx-10 mb-6 grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
          {ROLES.map((r) => (
            <button key={r.key} onClick={() => { setRole(r.key); setStep(0); }} className={`py-2 text-[9px] font-black uppercase rounded-lg transition-all ${role === r.key ? 'bg-white shadow-sm text-[#062D27]' : 'text-slate-500'}`}>
              {r.label}
            </button>
          ))}
        </div>

        <div className="px-10 pb-8">
          <div className="flex gap-2 justify-center mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1.5 w-12 rounded-full ${step >= i ? 'bg-[#062D27]' : 'bg-slate-200'}`} />
            ))}
          </div>

          <span className={`inline-block px-3 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-wide mb-4 ${roleMeta?.badgeCls}`}>
            {roleMeta?.fullLabel}
          </span>

          {step === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <Input placeholder="Full Name" maxLength={50} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              <Input placeholder="Mobile Number" type="tel" maxLength={10} value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})} />
              <Input placeholder="Email Address (Optional)" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <Button onClick={handleSendOtp} className="w-full bg-[#F16622] h-12 rounded-xl font-black">Send Verification Code</Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <Input placeholder="Enter 6-Digit OTP" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
              <Button onClick={handleVerifyOtp} className="w-full bg-[#062D27] h-12 rounded-xl font-black">Verify & Activate</Button>
              <button onClick={handleSendOtp} disabled={timer > 0} className={`w-full text-xs font-bold ${timer > 0 ? 'text-slate-400' : 'text-[#F16622] hover:underline'}`}>
                {timer > 0 ? `Resend code in ${timer}s` : "Resend Verification Code"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-4 animate-in zoom-in">
              <div className="text-5xl">✅</div>
              <h3 className="font-black text-[#062D27]">Welcome to WASH Mitra!</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}