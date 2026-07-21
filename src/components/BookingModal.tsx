import React, { useState } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function BookingModal() {
  const { isModalOpen, setModalOpen, selectedService, selectedServiceId, setTrackingOpen } = useBookingStore();
  const { user } = useStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const bookingData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      service: selectedService,
      service_id: selectedServiceId,
      user_id: user?.id ?? null,
      status: 'PENDING' as const,
    };

    const { error } = await supabase.from('bookings').insert([bookingData]);
    setLoading(false);

    if (error) {
      console.error('Booking submission failed:', error);
      toast.error('Something went wrong submitting your booking. Please try again.');
      return;
    }

    toast.success(`Booking request for ${selectedService} submitted!`);
    setModalOpen(false);

    setTimeout(() => {
      setTrackingOpen(true);
    }, 1000);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-[40px] border-none shadow-2xl p-8 bg-[#F9F9F7]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#062D27] tracking-tight">
            Book <span className="text-[#F26522]">{selectedService}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Fill in the details below and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" className="h-12 rounded-2xl bg-white border-slate-100" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile Number</Label>
            <Input id="phone" name="phone" placeholder="+91" className="h-12 rounded-2xl bg-white border-slate-100" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</Label>
            <Input id="location" name="location" placeholder="Village / City" className="h-12 rounded-2xl bg-white border-slate-100" required />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#F26522] hover:bg-[#d95d1f] text-white font-black uppercase tracking-widest gap-3 shadow-xl shadow-orange-200 mt-4 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Confirm Booking'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
