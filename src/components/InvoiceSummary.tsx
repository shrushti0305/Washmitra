import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Plus, ShieldCheck } from 'lucide-react';

interface InvoiceSummaryProps {
  courseName?: string;
  courseFee: number;
  isFirstTime: boolean;
}

export default function InvoiceSummary({ courseName, courseFee, isFirstTime }: InvoiceSummaryProps) {
  const registrationFee = isFirstTime ? 500 : 0;
  const totalAmount = courseFee + registrationFee;

  return (
    <Card className="rounded-[24px] border border-slate-100 bg-slate-50/60 p-6 space-y-4 shadow-inner">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <FileText className="h-5 w-5 text-[#062D27]" />
        <h4 className="text-xs font-black uppercase tracking-widest text-[#062D27]">Invoice Breakdown</h4>
      </div>

      <div className="space-y-3 text-sm font-medium text-slate-600">
        {courseName && (
          <div className="flex justify-between items-start">
            <span className="max-w-[70%]">{courseName} Tuition</span>
            <span className="font-bold text-[#062D27]">₹{courseFee.toLocaleString('en-IN')}</span>
          </div>
        )}

        {isFirstTime && (
          <div className="flex justify-between items-center text-orange-600 bg-orange-50/50 p-2 rounded-xl border border-orange-100/50">
            <span className="text-xs font-bold flex items-center gap-1">
              <Plus size={14} /> Onboarding Membership Fee
            </span>
            <span className="font-black text-sm">₹500</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-base font-black text-[#062D27]">
          <span>Total Amount Due:</span>
          <span className="text-xl text-[#F26522]">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-400">
        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
        <span>Price inclusive of rural training subvention grants.</span>
      </div>
    </Card>
  );
}