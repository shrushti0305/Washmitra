import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  IndianRupee, 
  GraduationCap, 
  Flame, 
  Wrench, 
  ShieldAlert, 
  X
} from 'lucide-react';
import { toast } from 'sonner';

// Import our new sub-page modular layouts
import InvoiceSummary from './InvoiceSummary';
import PaymentSelector from './PaymentSelector';

import { useStore } from '../store/useStore';
import { getSupabase } from '../lib/supabase';
import { openRazorpayCheckout } from '../lib/razorpay';
import { SHOW_TRANSACTIONAL_FEATURES } from '../lib/featureFlags';
import { CheckCircle2 } from 'lucide-react';

const programs = [
  { id: 1, name: "Electrical Technician", desc: "Basic electrical wiring, installation, repair and maintenance of household and community electrical systems, safety practices, and troubleshooting.", duration: "10 Days", fee: "2,000", icon: Flame },
  { id: 2, name: "Plumbing Technician", desc: "Water supply systems, pipe fitting, leakage repair, sanitation systems, installation and maintenance of plumbing fixtures.", duration: "10 Days", fee: "2,500", icon: Wrench },
  { id: 3, name: "Solar Technician", desc: "Solar PV system installation, operation, maintenance, troubleshooting, and safety measures.", duration: "4 Days", fee: "1,500", icon: GraduationCap },
  { id: 4, name: "Mason Technician", desc: "Basic construction techniques, masonry work, toilet construction, plastering, brickwork, and rural infrastructure development.", duration: "10 Days", fee: "1,500", icon: Wrench },
  { id: 5, name: "CCTV Installation Technician", desc: "CCTV camera installation, wiring, configuration, monitoring systems, and basic troubleshooting.", duration: "2 Days", fee: "1,000", icon: ShieldAlert },
  { id: 6, name: "Water Filter & Water Testing Technician", desc: "Installation and maintenance of water filtration systems, water quality testing methods, and reporting procedures.", duration: "4 Days", fee: "1,800", icon: Wrench },
  { id: 7, name: "Comprehensive WASH Mitra Program", desc: "Integrated training covering Electrical, Plumbing, Solar, Masonry, CCTV, Water Filter & Water Testing along with WASH awareness, soft skills, entrepreneurship, and field practical exposure.", duration: "18 Days", fee: "18,000", featured: true, icon: GraduationCap }
];

type FlowStep = 'IDLE' | 'REGISTRATION_FORM' | 'CHECKOUT_PREVIEW' | 'ENROLLMENT_SUCCESS';

export default function TrainingCatalogue() {
  const { user, isFirstTimeMitra, isProcessingPayment, setIsProcessingPayment } = useStore();
  const supabase = getSupabase();

  const [currentStep, setCurrentStep] = useState<FlowStep>('IDLE');
  const [selectedCourse, setSelectedCourse] = useState<typeof programs[number] | null>(null);

  // Local transient states for form management
  const [formData, setFormData] = useState({ fullName: '', mobile: '', location: '' });
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NETBANKING'>('UPI');
  const [selectedBank, setSelectedBank] = useState('');

  const courseFee = selectedCourse ? parseFloat(selectedCourse.fee.replace(',', '')) : 0;
  const registrationFee = isFirstTimeMitra ? 500 : 0;
  const totalAmount = courseFee + registrationFee;

  const handleEnrollInit = (course: typeof programs[number]) => {
    if (!SHOW_TRANSACTIONAL_FEATURES) {
      toast.info('Enrollment opens soon — reach out via our Contact page to be notified.');
      return;
    }
    setSelectedCourse(course);
    // If already signed in, skip re-collecting name/mobile
    if (user) {
      setFormData({ fullName: user.full_name, mobile: user.phone || '', location: user.district || '' });
      setCurrentStep('CHECKOUT_PREVIEW');
    } else {
      setCurrentStep('REGISTRATION_FORM');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('CHECKOUT_PREVIEW');
  };

  // Opens the real Razorpay checkout. Bank/UPI selection happens inside
  // Razorpay's own hosted UI; `paymentMethod`/`selectedBank` are kept only
  // as a prefill hint for which tab Razorpay opens to.
  const handleInitiatePayment = () => {
    setIsProcessingPayment(true);
    openRazorpayCheckout({
      amount: totalAmount,
      purpose: selectedCourse ? 'TRAINING_ENROLLMENT' : 'REGISTRATION',
      name: formData.fullName,
      contact: formData.mobile,
      onSuccess: async (result) => {
        try {
          if (!supabase) throw new Error('Database connection not available.');

          const { error: txnError } = await supabase
            .from('transactions')
            .insert([{
              user_id: user?.id ?? null,
              full_name: formData.fullName,
              mobile_number: formData.mobile,
              amount: totalAmount,
              payment_type: selectedCourse ? 'TRAINING' : 'REGISTRATION',
              payment_method: paymentMethod,
              bank_name: paymentMethod === 'NETBANKING' ? selectedBank : null,
              course_name: selectedCourse?.name ?? null,
              razorpay_order_id: result.razorpay_order_id,
              razorpay_payment_id: result.razorpay_payment_id,
              status: 'SUCCESS',
            }]);

          if (txnError) throw txnError;

          setCurrentStep('ENROLLMENT_SUCCESS');
          toast.success('Payment successful — you are enrolled!');
        } catch (err: any) {
          toast.error(`Payment succeeded but saving your enrollment failed: ${err.message || 'please contact support.'}`);
        } finally {
          setIsProcessingPayment(false);
        }
      },
      onFailure: (reason) => {
        setIsProcessingPayment(false);
        toast.error(reason);
      },
      onDismiss: () => {
        setIsProcessingPayment(false);
      },
    });
  };

  const handleFinishAndClose = () => {
    setCurrentStep('IDLE');
    setSelectedCourse(null);
    setFormData({ fullName: '', mobile: '', location: '' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 py-4">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-black text-[#062D27] tracking-tight">Skill Certification Hub</h2>
        <p className="text-slate-500 font-medium">
          Professional trade modules for rural infrastructure management and technician livelihood development.
        </p>
      </div>

      {/* Grid of Courses */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {programs.map((p) => {
          const IconComponent = p.icon;
          return (
            <Card key={p.id} className={`rounded-[32px] border-none shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white group ${p.featured ? 'ring-4 ring-[#F26522] lg:col-span-3 max-w-none' : ''}`}>
              <div>
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl shadow-sm ${p.featured ? 'bg-[#F26522] text-white' : 'bg-[#062D27]/5 text-[#F26522]'}`}>
                      <IconComponent size={24} />
                    </div>
                    {p.featured && (
                      <Badge className="bg-[#F26522] text-white font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                        Master Specialization
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-black text-[#062D27] tracking-tight">{p.name}</CardTitle>
                  <CardDescription className="font-medium text-slate-500 leading-relaxed text-sm mt-2">{p.desc}</CardDescription>
                </CardHeader>
              </div>
              
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Duration: {p.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee size={16} className="text-slate-400" />
                    <span className="text-xs font-black text-[#062D27] uppercase tracking-wider">Fee: ₹{p.fee}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleEnrollInit(p)}
                  className="w-full h-12 bg-[#062D27] hover:bg-[#F26522] text-white font-black rounded-xl uppercase tracking-wider text-xs shadow-md transition-all active:scale-98"
                >
                  Select & Enroll Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MASTER WIZARD OVERLAY MODAL */}
      <AnimatePresence>
        {currentStep !== 'IDLE' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#062D27]/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-lg p-8 md:p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {currentStep !== 'ENROLLMENT_SUCCESS' && (
                <button 
                  onClick={() => setCurrentStep('IDLE')} 
                  disabled={isProcessingPayment}
                  className="absolute top-6 right-6 p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={18} />
                </button>
              )}

              {/* STEP 1: REGISTRATION ENTRY */}
              {currentStep === 'REGISTRATION_FORM' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#F26522] tracking-widest block">Step 1 of 3</span>
                    <h3 className="text-2xl font-black text-[#062D27] tracking-tight">Applicant Information</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      Module: <span className="text-[#062D27] font-black">{selectedCourse?.name}</span>
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input 
                      required value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 h-12 bg-slate-50 border-none rounded-xl font-bold text-[#062D27] outline-none focus:ring-2 focus:ring-[#F26522]/20 text-sm" 
                      placeholder="Full Legal Name" 
                    />
                    <input 
                      required type="tel" pattern="[0-9]{10}" value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 h-12 bg-slate-50 border-none rounded-xl font-bold text-[#062D27] outline-none focus:ring-2 focus:ring-[#F26522]/20 text-sm" 
                      placeholder="10-Digit Mobile Number" 
                    />
                    <input 
                      required value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 h-12 bg-slate-50 border-none rounded-xl font-bold text-[#062D27] outline-none focus:ring-2 focus:ring-[#F26522]/20 text-sm" 
                      placeholder="Residential District (e.g. Pune)" 
                    />
                    <Button type="submit" className="w-full h-12 bg-[#F26522] text-white rounded-xl font-black uppercase text-xs tracking-wider">
                      Generate Payment Invoice
                    </Button>
                  </form>
                </div>
              )}

              {/* STEP 2: INVOICE BREAKDOWN & METHOD SELECTION */}
              {currentStep === 'CHECKOUT_PREVIEW' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#F26522] tracking-widest block">Step 2 of 3</span>
                    <h3 className="text-2xl font-black text-[#062D27] tracking-tight">Review Tuition Allocation</h3>
                  </div>

                  {/* Modular Invoice Render */}
                  <InvoiceSummary 
                    courseName={selectedCourse?.name} 
                    courseFee={courseFee} 
                    isFirstTime={isFirstTimeMitra} 
                  />

                  {/* Modular Selector Render */}
                  <PaymentSelector 
                    paymentMethod={paymentMethod} 
                    setPaymentMethod={setPaymentMethod}
                    selectedBank={selectedBank} 
                    setSelectedBank={setSelectedBank} 
                  />

                  <Button 
                    onClick={handleInitiatePayment}
                    disabled={isProcessingPayment}
                    className="w-full h-14 bg-[#062D27] hover:bg-[#0c4038] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl disabled:opacity-60"
                  >
                    {isProcessingPayment ? 'Processing...' : `Pay ₹${totalAmount} with Razorpay`}
                  </Button>
                </div>
              )}

              {/* STEP 3: SUCCESS */}
              {currentStep === 'ENROLLMENT_SUCCESS' && (
                <div className="text-center space-y-6 py-2 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={44} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#062D27] tracking-tight">Slot Reserved!</h2>
                    <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto leading-relaxed">
                      Welcome, <span className="font-bold text-slate-800">{formData.fullName}</span>. Your allocation for{' '}
                      {selectedCourse ? <span className="font-bold text-slate-800">{selectedCourse.name}</span> : 'WASH Mitra Membership'} is confirmed.
                      {!user && ' Create an account with this same mobile number any time to track your enrollment from your dashboard.'}
                    </p>
                  </div>
                  <Button
                    onClick={handleFinishAndClose}
                    className="w-full h-12 bg-[#062D27] hover:bg-[#F26522] text-white rounded-xl font-black uppercase text-xs tracking-wider max-w-md mx-auto"
                  >
                    Done
                  </Button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}