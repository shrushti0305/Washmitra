import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Booking, Service } from '../types';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { openRazorpayCheckout } from '../lib/razorpay';
import { format } from 'date-fns';
import { Printer, Download, MapPin, User, Calendar, ShieldCheck, Receipt, CreditCard, ArrowLeft, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateServiceSummaryPDF } from '../lib/pdfGenerator';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface InvoicePreviewProps {
  booking: Booking | null;
  services: Service[];
  onClose: () => void;
}

export default function InvoicePreview({ booking, services, onClose }: InvoicePreviewProps) {
  const { user } = useStore();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!booking) return null;

  const service = services.find(s => s.id === booking.service_id);
  const serviceTitle = booking.service || service?.title || 'General Maintenance';
  const isPaid = booking.status === 'BILLED' || booking.status === 'COMPLETED';

  const handleClose = () => {
    setShowPayment(false);
    setPaymentDone(false);
    onClose();
  };

  const handlePayNow = () => {
    if (!user) {
      toast.error('Please sign in to pay this invoice.');
      return;
    }
    setIsProcessing(true);
    openRazorpayCheckout({
      amount: booking.total_price || 0,
      purpose: 'BOOKING_INVOICE',
      name: user.full_name,
      email: user.email,
      contact: user.phone,
      onSuccess: async (result) => {
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'BILLED' })
          .eq('id', booking.id);

        await supabase.from('transactions').insert([{
          user_id: user.id,
          full_name: user.full_name,
          mobile_number: user.phone,
          amount: booking.total_price || 0,
          payment_type: 'BOOKING_INVOICE',
          payment_method: 'RAZORPAY',
          razorpay_order_id: result.razorpay_order_id,
          razorpay_payment_id: result.razorpay_payment_id,
          status: 'SUCCESS',
        }]);

        setIsProcessing(false);
        if (error) {
          toast.error('Payment succeeded but updating the booking failed. Contact support.');
          return;
        }
        setPaymentDone(true);
        toast.success('Payment successful!');
      },
      onFailure: (reason) => {
        setIsProcessing(false);
        toast.error(reason);
      },
      onDismiss: () => setIsProcessing(false),
    });
  };

  const handleViewReceipt = () => {
    toast.success('Receipt saved to your transaction history.');
    handleClose();
  };

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-[32px] bg-white">
        <AnimatePresence mode="wait">
          {!showPayment ? (
            <motion.div
              key="invoice"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full"
            >
              <div className="bg-[#062D27] p-8 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Receipt size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-black italic font-serif">WASH Mitra</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F26522]">Invoice Preview</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold opacity-60">Booking No.</p>
                      <p className="text-lg font-black tracking-tighter">#{booking.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Billed To</p>
                      <div className="flex items-start gap-2">
                        <User size={14} className="mt-1 opacity-60" />
                        <div>
                          <p className="font-black leading-tight">{booking.name || 'Customer'}</p>
                          <p className="text-xs opacity-60 mt-1 flex items-center gap-1">
                            <MapPin size={10} /> {booking.address || booking.location || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Service Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="opacity-60" />
                        <p className="font-black">{format(new Date(booking.created_at), 'MMMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white" id="preview-content">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#062D27]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Service Type</p>
                      <p className="text-lg font-black text-[#062D27]">{serviceTitle}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-12 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
                      <div className="col-span-8">Description</div>
                      <div className="col-span-4 text-right">Amount</div>
                    </div>

                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-8">
                        <p className="font-black text-[#062D27]">{serviceTitle}</p>
                        {booking.notes && <p className="text-xs text-slate-500">{booking.notes}</p>}
                      </div>
                      <div className="col-span-4 text-right">
                        <p className="font-mono text-sm font-bold">₹{(booking.labor_charge || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2 border-t border-slate-100 border-dashed">
                      <div className="flex justify-between text-sm">
                        <p className="text-slate-500 font-medium">Standard Visit Charge</p>
                        <p className="font-mono text-slate-900">₹{(booking.visit_charge || 0).toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p className="text-slate-500 font-medium">Logistic & Travel Charge</p>
                        <p className="font-mono text-slate-900">₹{(booking.travel_charge || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Payable Amount</p>
                    <p className="text-sm text-slate-500 font-medium italic">Inclusive of all local taxes</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-4xl font-black text-[#F26522] tracking-tighter">₹{(booking.total_price || 0).toFixed(2)}</p>
                    {!isPaid && (
                      <Button
                        onClick={() => setShowPayment(true)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 h-10 font-bold text-xs uppercase tracking-widest gap-2 shadow-lg transition-all"
                      >
                        <CreditCard size={14} />
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 h-14 rounded-2xl bg-[#062D27] hover:bg-[#0A3D36] text-white font-black uppercase tracking-widest gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                    onClick={() => generateServiceSummaryPDF(booking, serviceTitle)}
                  >
                    <Download size={18} />
                    Download Official PDF Invoice
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-10 flex flex-col items-center text-center relative"
            >
              <button
                onClick={() => setShowPayment(false)}
                disabled={isProcessing}
                className="absolute top-8 left-8 text-slate-400 hover:text-[#062D27] flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
              >
                <ArrowLeft size={16} /> Back to Invoice
              </button>

              <div className="mt-12 mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                    <CreditCard size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-[#062D27] tracking-tighter">Secure Payment</h3>
                <p className="text-slate-500 font-medium max-w-[280px] mx-auto mt-2">
                  Pay via UPI, card, or netbanking through Razorpay's secure checkout.
                </p>
              </div>

              <div className="w-full max-w-[320px] bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-left">Recipient</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="font-black text-[#062D27]">WASH Mitra HQ</p>
                  <p className="text-2xl font-black text-[#F26522]">₹{(booking.total_price || 0).toFixed(2)}</p>
                </div>
              </div>

              {!paymentDone ? (
                <Button
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="w-full max-w-[320px] h-14 rounded-2xl bg-[#F26522] hover:bg-[#d5581e] text-white font-black uppercase tracking-widest gap-2 shadow-xl transition-all disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2"><CreditCard size={18} /> Pay ₹{(booking.total_price || 0).toFixed(2)}</span>
                  )}
                </Button>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex flex-col items-center text-green-600 mb-2">
                    <CheckCircle2 size={40} />
                    <p className="font-black text-lg mt-2 text-[#062D27]">Payment Success!</p>
                  </div>
                  <Button
                    onClick={handleViewReceipt}
                    className="w-full h-14 rounded-2xl bg-[#F26522] hover:bg-[#d5581e] text-white font-black uppercase tracking-widest gap-2 shadow-xl transition-all"
                  >
                    <ExternalLink size={18} />
                    Done
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
