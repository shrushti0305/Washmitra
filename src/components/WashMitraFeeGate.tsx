import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { openRazorpayCheckout } from '../lib/razorpay';
import { useStore } from '../store/useStore';

export default function WashMitraFeeGate() {
  const { user, setUser } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    if (!user) {
      toast.error('You need to be signed in to pay the platform fee.');
      return;
    }
    setIsProcessing(true);

    openRazorpayCheckout({
      amount: 500,
      purpose: 'PLATFORM_FEE',
      name: user.full_name,
      email: user.email,
      contact: user.phone,
      onSuccess: async (result) => {
        const { error: txError } = await supabase.from('transactions').insert([{
          user_id: user.id,
          full_name: user.full_name,
          mobile_number: user.phone,
          amount: 500,
          payment_type: 'PLATFORM_FEE',
          payment_method: 'RAZORPAY',
          razorpay_order_id: result.razorpay_order_id,
          razorpay_payment_id: result.razorpay_payment_id,
          status: 'SUCCESS',
        }]);
        if (txError) {
          console.error('Failed to record transaction:', txError);
        }

        const { error } = await supabase
          .from('profiles')
          .update({ is_paid: true })
          .eq('id', user.id);

        setIsProcessing(false);

        if (error) {
          toast.error('Payment succeeded but we could not update your account. Please contact support.');
          return;
        }

        setUser({ ...user, is_paid: true });
        toast.success('Payment verified! Welcome to the WashMitra network.');
      },
      onFailure: (reason) => {
        setIsProcessing(false);
        toast.error(reason);
      },
      onDismiss: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <Card className="max-w-md w-full p-8 rounded-[2rem] text-center shadow-2xl border-2 border-orange-100 mx-auto">
      <div className="space-y-6">
        <div className="w-20 h-20 bg-orange-50 text-[#F16622] flex items-center justify-center rounded-3xl mx-auto">
          <CreditCard size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#062D27]">Platform Fee Required</h2>
          <p className="text-slate-500 mt-2">To access the WashMitra network, a yearly platform fee of ₹500 is required.</p>
        </div>

        <Button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full h-14 bg-[#F16622] hover:bg-[#d95d1f] rounded-xl font-black uppercase tracking-widest disabled:opacity-60"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Processing...</span>
          ) : (
            <span className="flex items-center gap-2"><ShieldCheck size={18} /> Pay ₹500 Now</span>
          )}
        </Button>
        <p className="text-[10px] font-medium text-slate-400">Secured by Razorpay. Cards, UPI, and netbanking supported.</p>
      </div>
    </Card>
  );
}
