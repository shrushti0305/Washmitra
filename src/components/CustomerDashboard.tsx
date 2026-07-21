import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import Catalogue from './Catalogue';
import InvoicePreview from './InvoicePreview';
import { Booking } from '../types';
import { 
  History, 
  CheckCircle2,
  Clock,
  Wallet,
  Eye,
  ShieldCheck,
  Star,
  User,
  Zap,
  Droplets,
  Hammer,
  QrCode,
  FileText,
  Activity,
  Wrench,
  Gauge,
  Sparkles,
  Gem,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import MitraStackView from './MitraStackView';

export default function CustomerDashboard() {
  const { user, requests = [], services = [], setRequests } = useStore();
  const [previewRequest, setPreviewRequest] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'HOME' | 'HISTORY' | 'SERVICES'>('HOME');

  // Load this customer's real bookings from Supabase
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!cancelled && !error && data) {
        setRequests(data as Booking[]);
      }
    })();
    return () => { cancelled = true; };
  }, [user, setRequests]);
  
  // Interactive Loyalty Star Rating State
  const [userRating, setUserRating] = useState<number>(0);

  // Core State Engine for the Work-Done Process Monitoring
  const [workStage, setWorkStage] = useState(0);
  const technicalMilestones = [
    { phase: 'DIAGNOSTICS', label: 'System Fault Analysis', desc: 'Mitra is testing pressure levels and hunting pipeline structural stress points.', icon: Activity, progress: 15, eta: '20 min remaining' },
    { phase: 'DISASSEMBLY', label: 'Component Descaling', desc: 'Dismantling core valve couplers and flushing carbon deposits from the filtration grid.', icon: Wrench, progress: 45, eta: '12 min remaining' },
    { phase: 'REPLACEMENT', label: 'Hardware Calibration', desc: 'Fitting certified high-pressure gaskets and securing localized joint loops.', icon: Gauge, progress: 75, eta: '5 min remaining' },
    { phase: 'QUALITY_AUDIT', label: 'JJM Compliance Testing', desc: 'Running TDS water purity audits and logging flow volume indicators into the central repository.', icon: Sparkles, progress: 100, eta: 'Ready for handoff' }
  ];

  // Simulated worker execution telemetry loop
  useEffect(() => {
    const processTimer = setInterval(() => {
      setWorkStage((prev) => (prev < technicalMilestones.length - 1 ? prev + 1 : prev));
    }, 15000); // Transitions across maintenance phases every 15 seconds
    return () => clearInterval(processTimer);
  }, []);

  // Connected loyalty review engine logic code block
  const handleRatingSubmit = (rating: number) => {
    if (rating === 0) {
      toast.error("Please select a star value before submitting your verification audit.");
      return;
    }

    if (rating === 5) {
      toast.success("Excellent 5-Star Audit! You have awarded Suresh 50 Trust Loyalty points.");
    } else {
      toast.success("Feedback successfully logged. Thank you for ensuring technical compliance.");
    }
    setUserRating(0); // Clear state selection after execution handshake completes
  };

  const completedRequests = requests.filter(r => r.status === 'COMPLETED' || r.status === 'BILLED');
  const activeRequests = requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'BILLED' && r.status !== 'CANCELLED');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      
      {/* Header Layout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8 px-4 md:px-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} className="text-[#F26522]" />
            <p className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]">Verified Household Account</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Welcome, <span className="italic font-serif text-slate-400">{user?.full_name ? user.full_name.split(' ')[0] : 'Resident'}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Status: Active Service Linkage (Pune Dist.)</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto">
          <Button onClick={() => setActiveTab('HOME')} className={`rounded-xl h-10 px-6 text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'HOME' ? 'bg-[#062D27] text-white shadow-xl' : 'text-slate-500 hover:bg-slate-200'}`}>Overview</Button>
          <Button onClick={() => setActiveTab('SERVICES')} className={`rounded-xl h-10 px-6 text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'SERVICES' ? 'bg-[#062D27] text-white shadow-xl' : 'text-slate-500 hover:bg-slate-200'}`}>Catalogue</Button>
          <Button onClick={() => setActiveTab('HISTORY')} className={`rounded-xl h-10 px-6 text-xs font-black uppercase tracking-wider transition-all shrink-0 ${activeTab === 'HISTORY' ? 'bg-[#062D27] text-white shadow-xl' : 'text-slate-500 hover:bg-slate-200'}`}>Ledger</Button>
        </div>
      </div>

      {activeTab === 'HOME' && (
        <div className="space-y-12 px-4 md:px-0">
          
          {/* LIVE WORK-DONE PROCESS TRACKER CONTAINER */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Technical Maintenance Diagnostics <Badge className="bg-[#062D27] text-white animate-pulse">Fix In Progress</Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Technical Progression Loop Tracking Stream */}
              <Card className="lg:col-span-8 border-none bg-white shadow-2xl rounded-[40px] overflow-hidden">
                <div className="p-8 bg-[#062D27] text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {React.createElement(technicalMilestones[workStage].icon, { size: 20, className: "text-[#F26522]" })}
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Current Execution Phase</p>
                      <h4 className="text-lg font-black tracking-tight leading-none mt-1">{technicalMilestones[workStage].label}</h4>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[#F26522] border-[#F26522] text-[9px] font-black tracking-widest uppercase px-3 py-1 bg-white/5">
                    {technicalMilestones[workStage].eta}
                  </Badge>
                </div>

                <div className="p-8 space-y-8">
                  {/* Explanatory telemetry prompt phrase */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {technicalMilestones[workStage].desc}
                    </p>
                  </div>

                  {/* Horizontal visual status block progress trackers */}
                  <div className="relative pt-4 pb-4">
                    <div className="absolute top-[32px] left-0 w-full h-[2px] bg-slate-100" />
                    <div className="relative flex justify-between">
                      {technicalMilestones.map((step, idx) => {
                        const isDone = workStage >= idx;
                        const isCurrent = workStage === idx;
                        return (
                          <div key={step.phase} className="flex flex-col items-center gap-2.5 relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isCurrent ? 'bg-[#F26522] border-[#F26522] text-white scale-110 shadow-lg' : 
                              isDone ? 'bg-[#062D27] border-[#062D27] text-white' : 'bg-white border-slate-200 text-slate-300'
                            }`}>
                              <CheckCircle2 size={16} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-wider text-center max-w-[70px] ${isCurrent ? 'text-[#062D27]' : 'text-slate-400'}`}>
                              {step.phase.replace('_', ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total progress calculation meter block line */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <span>Overall Task Metric Compliance</span>
                      <span className="text-[#062D27] font-black">{technicalMilestones[workStage].progress}% Completed</span>
                    </div>
                    <Progress value={technicalMilestones[workStage].progress} className="h-2 bg-slate-100" />
                  </div>
                </div>
              </Card>

              {/* Right Side Stack: Feedback Hub upgraded with Loyalty Rewards interaction */}
              <Card className="lg:col-span-4 rounded-[40px] border-none bg-[#062D27] text-white p-8 flex flex-col justify-between overflow-hidden shadow-2xl relative min-h-[380px]">
                <div className="relative z-10 space-y-4 text-center">
                  
                  {/* Interactive Star Selection Bar Layout */}
                  <div className="flex justify-center gap-1.5 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="transition-transform active:scale-95 hover:scale-110 outline-none focus:outline-none"
                      >
                        <Star 
                          size={28}
                          className={`transition-colors ${userRating >= star ? "text-[#F26522] fill-[#F26522]" : "text-white/20"}`}
                        />
                      </button>
                    ))}
                  </div>

                  <h3 className="text-xl font-black tracking-tight pt-2">Feedback Hub</h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-[220px] mx-auto font-medium">
                    {userRating === 5 
                      ? "Excellent! Submitting this 5-star audit will credit +50 Loyalty Points to your Mitra."
                      : "Your performance validation notes shape local credit indices."}
                  </p>

                  <Button
                    onClick={() => handleRatingSubmit(userRating)}
                    className="w-full bg-[#F26522] hover:bg-[#d5581e] border-none text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    {userRating === 5 ? <Gem size={12} /> : null}
                    {userRating === 5 ? "Award Points & Submit" : "Submit Audit"}
                  </Button>
                </div>
                
                {/* Handover verification token layout box alert */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl relative z-10 mt-auto space-y-1">
                  <div className="flex items-center gap-2 text-[#F26522]">
                    <QrCode size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Close Out Key</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed text-left">
                    Provide code <strong className="text-white tracking-wider">4821</strong> once infrastructure diagnostic passes are logged complete.
                  </p>
                </div>

                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                  <Star size={160} />
                </div>
              </Card>

            </div>
          </section>

          {/* Express Repair Category Grid Selection Panel */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Express Repair Request</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Plumbing', icon: Droplets, color: 'text-blue-600 bg-blue-50' },
                { name: 'Electrical', icon: Zap, color: 'text-orange-600 bg-orange-50' },
                { name: 'Water Filter', icon: ShieldCheck, color: 'text-[#062D27] bg-green-50' },
                { name: 'Masonry', icon: Hammer, color: 'text-slate-600 bg-slate-50' },
              ].map((item) => (
                <Card key={item.name} className="border-none shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all cursor-pointer group rounded-[32px] overflow-hidden" onClick={() => setActiveTab('SERVICES')}>
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-[#062D27] group-hover:text-white ${item.color}`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <p className="font-black text-[#062D27] text-xs uppercase tracking-widest">{item.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Stats Metrics Panels Counter Row Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
            <StatsCard label="Past Repairs" value={completedRequests.length} icon={History} color="blue" />
            <StatsCard label="Active Status" value={activeRequests.length} icon={Clock} color="orange" />
            <StatsCard label="Total Conserved" value="1,240 Ltrs" icon={Droplets} color="green" />
            <StatsCard label="Credits Available" value="₹450" icon={Wallet} color="purple" />
          </div>

          {/* Livelihoods Stack Workforce Presentation Panel Wrapper Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-6">
            <div className="space-y-6">
              <div className="w-fit">
                <Badge variant="outline" className="text-[#062D27] border-[#062D27] font-black text-[10px] uppercase tracking-widest px-3 py-1">Featured Workforce</Badge>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight italic font-serif">Meet the Faces of <br /> <span className="text-[#062D27] not-italic">Sustainable Change</span></h2>
              <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">Every technician undergoes an exhaustive trade filter residential check, completing structural alignment checks on mechanical assets.</p>
              <div className="flex gap-8 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-3xl font-black text-[#062D27]">149+</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Women Technicians</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#062D27]">820+</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Certified Partners</p>
                </div>
              </div>
            </div>
            <div className="relative"><MitraStackView /></div>
          </section>
        </div>
      )}

      {activeTab === 'SERVICES' && (
        <div className="px-4 md:px-0">
          <Catalogue />
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <section className="space-y-6 px-4 md:px-0">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Digital Ledger</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Verified records of local system certifications and settled balances.</p>
            </div>
            <FileText className="h-8 w-8 text-slate-200 shrink-0" />
          </div>
          
          <div className="grid gap-4">
            {completedRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium bg-white rounded-3xl border border-dashed">No closed service entries logged on this account ledger.</div>
            ) : (
              completedRequests.map((req) => (
                <Card key={req.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-[32px] overflow-hidden bg-white">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#062D27] shrink-0"><QrCode className="h-7 w-7" /></div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge className="text-[8px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-500 border-none px-2 py-0.5">REF-{req.id}</Badge>
                          <span className="text-xs text-slate-400 font-bold">{new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <h3 className="text-xl font-black text-[#062D27] tracking-tight">{req.service || services.find(s => s.id === req.service_id)?.title || 'Technical Intervention'}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                          <User size={12} className="text-slate-400" />
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified System Audit Logged</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Settled Amount</p>
                      <p className="text-2xl font-black text-[#F26522] tracking-tighter">₹{req.total_price ? req.total_price.toFixed(2) : '0.00'}</p>
                    </div>
                    <Button onClick={() => setPreviewRequest(req)} className="h-12 md:h-14 px-6 rounded-xl bg-[#062D27] hover:bg-[#0A3D36] text-white font-black uppercase tracking-widest gap-2 shadow-md shrink-0 w-full md:w-auto text-xs"><Eye className="h-4 w-4" />View Invoice</Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      )}

      <InvoicePreview booking={previewRequest} services={services} onClose={() => setPreviewRequest(null)} />
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-[#F16622]',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}