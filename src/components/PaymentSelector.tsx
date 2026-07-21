import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Landmark, Smartphone } from 'lucide-react';

interface PaymentSelectorProps {
  paymentMethod: 'UPI' | 'NETBANKING';
  setPaymentMethod: (method: 'UPI' | 'NETBANKING') => void;
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
}

const indianBanks = [
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'pnb', name: 'Punjab National Bank' }
];

export default function PaymentSelector({ 
  paymentMethod, 
  setPaymentMethod, 
  selectedBank, 
  setSelectedBank 
}: PaymentSelectorProps) {
  return (
    <div className="space-y-4 text-left">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider block">
        Select Payment Method
      </label>

      <div className="grid grid-cols-2 gap-3">
        {/* UPI Option Card */}
        <button
          type="button"
          onClick={() => setPaymentMethod('UPI')}
          className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
            paymentMethod === 'UPI' 
              ? 'border-[#F26522] bg-orange-50/40 text-[#F26522]' 
              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
          }`}
        >
          <Smartphone size={22} className={paymentMethod === 'UPI' ? 'text-[#F26522]' : 'text-slate-400'} />
          <span className="font-black text-xs uppercase tracking-wider text-[#062D27]">UPI / QR</span>
        </button>

        {/* Netbanking Option Card */}
        <button
          type="button"
          onClick={() => setPaymentMethod('NETBANKING')}
          className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
            paymentMethod === 'NETBANKING' 
              ? 'border-[#F26522] bg-orange-50/40 text-[#F26522]' 
              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
          }`}
        >
          <Landmark size={22} className={paymentMethod === 'NETBANKING' ? 'text-[#F26522]' : 'text-slate-400'} />
          <span className="font-black text-xs uppercase tracking-wider text-[#062D27]">Netbanking</span>
        </button>
      </div>

      {/* Dropdown Container for Indian Banking List */}
      {paymentMethod === 'NETBANKING' && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 mt-2"
        >
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider block">
            Choose Your Banking Institution
          </label>
          <div className="relative">
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[#062D27] px-4 outline-none appearance-none focus:ring-2 focus:ring-[#F26522]/20 text-sm"
            >
              <option value="">-- Select Bank --</option>
              {indianBanks.map(bank => (
                <option key={bank.id} value={bank.name}>{bank.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <CreditCard size={16} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}