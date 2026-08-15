import type { ComponentType } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'motion/react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceCategory } from '../types';
import { toast } from 'sonner';
import { useNotifications } from '../contexts/NotificationContext';
import { SHOW_TRANSACTIONAL_FEATURES } from '../lib/featureFlags';
import {
  GraduationCap, Wrench, Users, ShoppingBag, HardHat,
  MapPin, Clock, ShieldCheck, Star, Phone, Zap, Droplets, Sun,
  Video as VideoIcon, CheckCircle2, ArrowRight, ArrowUpRight,
  Circle, Hammer, Filter, ShowerHead, Waves, Recycle, Trash2,
  Home, Building2, Truck, HeartPulse,
} from 'lucide-react';

/* ============================================================
   SECTION 1 — Company Products & Services
   Official service lines per the WashMitra Pvt Ltd company profile.
   ============================================================ */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const COMPANY_SERVICES = [
  {
    icon: GraduationCap,
    title: 'WASH Mitra Training',
    description: '16-day multiskilled residential training program certifying rural youth across plumbing, electrical, solar, RO, sanitation, CCTV, masonry, and carpentry trades.',
  },
  {
    icon: Wrench,
    title: 'AMC Services',
    description: 'Annual Maintenance Contracts covering ongoing upkeep and repair of WASH infrastructure for institutions and communities.',
  },
  {
    icon: Users,
    title: 'Training Consultancy',
    description: 'Technical skills training support delivered on behalf of partner agencies, NGOs, and government programs.',
  },
  {
    icon: ShoppingBag,
    title: 'Wash Mart',
    description: 'Follow-up and upskilling support, plus toolkit and supply access for certified WASH Mitras after training.',
  },
  {
    icon: HardHat,
    title: 'Technical Services',
    description: 'Certified WASH Mitra technician placement, alongside Operations & Maintenance (O&M) and housekeeping services.',
  },
];

function CompanyServicesSection() {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight">
          Company Products &amp; Services
        </h2>
        <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
          Comprehensive WASH solutions under one roof.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {COMPANY_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="h-full p-6 border-slate-200 hover:shadow-lg transition-shadow rounded-3xl">
                <div className="h-12 w-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-brand-accent" />
                </div>
                <h3 className="font-black text-lg text-brand-primary mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ============================================================
   SECTION 2 — Request a Service (trade grid + live tracking)
   Shows the trade grid directly - no click-through gate.
   ============================================================ */

const TRADE_PROGRAMS = [
  { id: 'electrical', name: 'Electrical', icon: Zap, price: 2000, color: 'text-yellow-500' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, price: 2500, color: 'text-blue-500' },
  { id: 'solar', name: 'Solar PV', icon: Sun, price: 1500, color: 'text-orange-500' },
  { id: 'cctv', name: 'CCTV Tech', icon: VideoIcon, price: 1000, color: 'text-slate-600' },
];

// Maps a booking's real status to a step index (0-3) so the tracker
// reflects what actually happened, instead of always showing "Hired".
const STATUS_STEPS = ['PENDING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];
const STATUS_LABELS = ['Hired', 'Arrived', 'Started', 'Finished'];

function getStatusStepIndex(status: string | undefined): number {
  const idx = STATUS_STEPS.indexOf((status || '').toUpperCase());
  return idx === -1 ? 0 : idx;
}

const HELPLINE_NUMBER = '+919657978896';

function ServiceRequestSection() {
  const navigate = useNavigate();
  const { user, requests, addRequest, updateRequest } = useStore();
  const { sendNotification } = useNotifications();
  const [isBooking, setIsBooking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleBook = async (trade: typeof TRADE_PROGRAMS[0]) => {
    if (!SHOW_TRANSACTIONAL_FEATURES) {
      toast.success(`Redirecting to inquiry form for ${trade.name}...`);
      navigate('/contact');
      return;
    }
    if (!user) {
      toast.error('Please sign in to request a service.');
      return;
    }
    if (isBooking) return;
    setIsBooking(true);

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        name: user.full_name,
        phone: user.phone,
        location: user.location?.address ?? user.district ?? '',
        service: trade.name,
        user_id: user.id,
        status: 'PENDING',
        total_price: trade.price,
        labor_charge: trade.price,
      }])
      .select()
      .single();

    setIsBooking(false);

    if (error || !data) {
      console.error('Booking failed:', error);
      toast.error('Could not submit your request. Please try again.');
      return;
    }

    addRequest(data);
    toast.success(`${trade.name} request successfully broadcasted!`);
    sendNotification({
      title: 'Request Received',
      message: `Certified ${trade.name} WashMitra has been alerted to your location.`,
      type: 'success',
    });
  };

  const handleCancel = async (requestId: string) => {
    const confirmed = window.confirm('Cancel this service request? This cannot be undone.');
    if (!confirmed) return;

    setIsCancelling(true);
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED' })
      .eq('id', requestId);
    setIsCancelling(false);

    if (error) {
      console.error('Cancel failed:', error);
      toast.error('Could not cancel the request. Please try again.');
      return;
    }

    updateRequest?.(requestId, { status: 'CANCELLED' });
    toast.success('Service request cancelled.');
  };

  if (requests.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-black text-brand-primary tracking-tight">Request a Service</h2>
          <p className="text-slate-500">Only verified & certified technicians will be assigned.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRADE_PROGRAMS.map((trade) => (
            <Card
              key={trade.id}
              role="button"
              tabIndex={0}
              aria-disabled={isBooking}
              className={`cursor-pointer hover:border-brand-accent hover:shadow-xl transition-all group rounded-3xl ${
                isBooking ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={() => handleBook(trade)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleBook(trade)}
            >
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-brand-accent/10 transition-colors ${trade.color}`}>
                  <trade.icon size={32} />
                </div>
                <div className="text-center">
                  <p className="font-black text-brand-primary uppercase text-[10px] tracking-widest">{trade.name}</p>
                  <p className="text-lg font-black text-slate-900 mt-1">₹{trade.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const latestRequest = requests[0];
  const stepIndex = getStatusStepIndex(latestRequest.status);
  const progressPercent = ((stepIndex + 1) / STATUS_LABELS.length) * 100;
  const isFinished = latestRequest.status === 'COMPLETED' || latestRequest.status === 'CANCELLED';

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-2xl rounded-[40px] bg-white">
        <div className="bg-brand-primary px-8 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-brand-accent" />
            <span className="font-black uppercase text-[10px] tracking-[0.2em]">Live Tracking: Verified Mitra</span>
          </div>
          <Badge className="bg-brand-accent text-white border-none font-black text-[10px] uppercase">
            {latestRequest.status}
          </Badge>
        </div>

        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-brand-accent mt-1" />
                <div>
                  <p className="text-lg font-black text-brand-primary leading-none">{latestRequest.address || latestRequest.location}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Service Point</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-brand-accent mt-1" />
                <div>
                  <p className="text-lg font-black text-brand-primary leading-none">
                    {new Date(latestRequest.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Requested At</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-5 border border-slate-100 min-w-[280px]">
              <div className="h-14 w-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black text-xl">W</div>
              <div>
                <p className="text-sm font-black text-brand-primary">Certification: Expert</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">4.9 Star Rating</span>
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-[10px] text-brand-accent font-black uppercase tracking-widest mt-2"
                  onClick={() => window.open(`tel:${HELPLINE_NUMBER}`, '_self')}
                >
                  Contact Tech
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Job Pipeline</h4>
              {!isFinished && (
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full animate-pulse">
                  Technician is 2.4 km away
                </span>
              )}
            </div>

            <div className="relative px-2">
              <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
              <div
                className="absolute top-1/2 left-0 h-1.5 bg-brand-accent -translate-y-1/2 transition-all duration-1000 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="flex justify-between relative">
                {STATUS_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border-4 ${
                      i <= stepIndex ? 'bg-brand-primary border-white text-white shadow-lg' : 'bg-white border-slate-100 text-slate-200'
                    }`}
                  >
                    {i <= stepIndex ? <CheckCircle2 size={18} /> : <span className="text-xs font-black">{i + 1}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between px-2">
              {STATUS_LABELS.map((label) => (
                <span key={label} className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-8 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Estimate</p>
            <p className="text-3xl font-black text-brand-primary">₹{latestRequest.total_price || '450'}.00</p>
          </div>
          {!isFinished && (
            <Button
              variant="outline"
              disabled={isCancelling}
              className="h-12 px-8 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
              onClick={() => handleCancel(latestRequest.id)}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Service'}
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-brand-primary border-none rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Phone size={80} />
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-2">24/7 Mitra Helpdesk</h3>
          <p className="text-slate-400 text-sm mb-8 font-medium">Locked out or having a technical emergency? Our SOS line is always open.</p>
          <Button
            className="bg-brand-accent hover:bg-brand-accent-hover w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-none"
            onClick={() => window.open(`tel:${HELPLINE_NUMBER}`, '_self')}
          >
            <Phone className="mr-2 h-4 w-4" /> Call Helpline
          </Button>
        </Card>

        <Card className="rounded-[40px] border-none bg-white p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl text-brand-secondary">
              <ShieldCheck />
            </div>
            <div>
              <h3 className="text-xl font-black text-brand-primary">Active AMC Plan</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Smart Maintenance</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-8">Your quarterly RO Water Filter check is scheduled for next Tuesday at 10:00 AM.</p>
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200 text-slate-600"
            onClick={() => toast.info('AMC subscription management is coming soon.')}
          >
            Manage Subscriptions
          </Button>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 3 — Service Catalogue (categories from Supabase)
   ============================================================ */

const ICON_MAP: Record<string, ComponentType<{ className?: string; size?: number | string }>> = {
  Circle, Sun, Hammer, Droplets, Zap, Wrench, Filter, ShowerHead, Waves,
  Recycle, Trash2, Home, Building2, Truck, ShieldCheck, HeartPulse,
};

const SERVICES_MAP: Record<string, string[]> = {
  "Plumbing": ["Tap & pipeline repair", "Bathroom fitting installation", "Water leakage repair", "Tank maintenance", "School plumbing"],
  "Electrical": ["Internal wiring", "Switchboards & lighting", "Fan & appliance repair", "School maintenance"],
  "Hygiene": ["Waste management", "Disinfection services", "Sanitary napkin dispensers", "Awareness programs"],
};

function CatalogueSection({ onSelect }: { onSelect?: (cat: ServiceCategory) => void }) {
  const { categories } = useStore();
  const navigate = useNavigate();

  if (!categories || categories.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-brand-primary tracking-tighter leading-[0.95] md:leading-[0.9]">
            Services that <span className="font-serif italic text-brand-primary-light font-normal tracking-normal">show up,</span>{' '}
            <br className="hidden sm:block" />
            on time, every time.
          </h2>
        </div>
        <div className="max-w-md ml-auto">
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            From single repairs to institutional AMCs — a verified WASH Mitra is one tap away.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {categories.slice(0, 2).map((cat, idx) => {
          const IconComponent = ICON_MAP[cat.icon] || Circle;
          const isDark = idx === 0;
          return (
            <div
              key={cat.id}
              role="button"
              tabIndex={0}
              className={`group relative p-12 rounded-[3.5rem] transition-all duration-500 cursor-pointer overflow-hidden ${
                isDark ? 'bg-brand-primary text-white' : 'bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-slate-900'
              }`}
              onClick={() => onSelect?.(cat)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.(cat)}
            >
              <div className="absolute top-10 right-10 opacity-20 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-8 w-8" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'text-orange-400' : 'text-brand-primary-light'}`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight">{cat.name}</h3>
                <ul className="space-y-4">
                  {(SERVICES_MAP[cat.name] || ["General maintenance"]).map((service, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-orange-500' : 'bg-brand-primary-light'}`} />
                      <span className={`text-lg font-medium ${isDark ? 'text-white/80' : 'text-slate-500'}`}>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {categories.slice(2).map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Circle;
          return (
            <div
              key={cat.id}
              role="button"
              tabIndex={0}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 cursor-pointer"
              onClick={() => onSelect?.(cat)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.(cat)}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-accent mb-6">
                <IconComponent className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{cat.name}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">{cat.description}</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] group">
                <span>Learn More</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-brand-primary p-12 rounded-[3.5rem] mt-24 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 blur-[100px] opacity-20 -ml-32 -mt-32" />
        <div className="relative z-10 space-y-2">
          <h3 className="text-3xl font-black tracking-tight">Need a customized AMC?</h3>
          <p className="text-white/60 font-medium">We design specific maintenance plans for schools, hospitals, and corporate facilities.</p>
        </div>
        <Button
          className="h-14 px-10 rounded-full bg-brand-accent hover:bg-white hover:text-slate-900 border-none font-black uppercase tracking-widest relative z-10 transition-all"
          onClick={() => navigate('/contact')}
        >
          Get a Quote
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN EXPORT — the full /services page in one component
   ============================================================ */

export default function Services() {
  return (
    <div className="space-y-12">
      <CompanyServicesSection />
      <div className="border-t border-slate-200 pt-12">
        <ServiceRequestSection />
      </div>
      <div className="border-t border-slate-200 pt-12">
        <CatalogueSection />
      </div>
    </div>
  );
}