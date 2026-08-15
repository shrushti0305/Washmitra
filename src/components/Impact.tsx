import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import {
  Users, GraduationCap, MapPin, Shield, ArrowUpRight, ChevronRight,
  LayoutPanelTop, CheckCircle2, Upload, Plus, Loader2, X,
  Quote, Star, ArrowLeft, ArrowRight, Handshake, ArrowRight as ArrowRightCta,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '../store/useStore';
import { getSupabase } from '../lib/supabase';
import { toast } from 'sonner';

// Field Operations gallery images
import img1 from '../assets/images/window_pipe.jpeg';
import img2 from '../assets/images/WASH MITRA photo.png';
import img3 from '../assets/images/tools.jpeg';
import img4 from '../assets/images/toilet.jpeg';
import img5 from '../assets/images/solar.jpeg';
import img6 from '../assets/images/plumbing2.jpeg';
import img7 from '../assets/images/plumbing.jpeg';
import img10 from '../assets/images/home_R-O.jpeg';
import img11 from '../assets/images/drill.jpeg';

// Work Gallery images (separate section, real project photos)
import solarImg from '../assets/images/solar.jpeg';
import toiletImg from '../assets/images/toilet.jpeg';
import windowPipeImg from '../assets/images/window_pipe.jpeg';
import roofRepairImg from '../assets/images/roof_repair.jpeg';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

/* ============================================================
   SECTION 1 — Stats + Field Operations (the main Impact header)
   ============================================================ */

const stats = [
  { label: "WASH Mitras trained", value: "850+", icon: GraduationCap, color: "text-brand-accent" },
  { label: "Districts in Maharashtra", value: "29", icon: MapPin, color: "text-brand-success" },
  { label: "Districts in Chhattisgarh", value: "5", icon: MapPin, color: "text-brand-accent" },
  { label: "Youth aged 21–30", value: "70.5%", icon: Users, color: "text-brand-success" },
  { label: "Women Technicians Trained", value: "149", icon: Users, color: "text-brand-accent" },
  { label: "Tribal Mitras Deployed", value: "120", icon: Shield, color: "text-brand-success" },
];

function StatsAndFieldOps() {
  const [stack, setStack] = useState([img1, img2, img3, img4, img5, img6, img7, img10, img11]);

  const cycleNext = () => {
    setStack((prev) => {
      const [top, ...rest] = prev;
      return [...rest, top];
    });
  };

  useEffect(() => {
    const timer = setInterval(cycleNext, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4 max-w-2xl">
          <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em]">Our Impact</h3>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-brand-primary leading-tight tracking-tighter">
            Measuring success in <br className="hidden sm:block" />
            <span className="text-slate-500 italic font-serif"> livelihoods & scale.</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-lg">
            Every number below reflects a trained technician, a household with reliable water or sanitation,
            or income earned in a community that didn't have it before.
          </p>
        </div>

        {/* Commercial Impact Highlighting Module */}
        <div className="p-6 sm:p-8 bg-white rounded-[32px] sm:rounded-[40px] shadow-xl border border-slate-100 text-left sm:text-right w-full md:w-auto">
          <p className="text-3xl sm:text-4xl font-black text-brand-primary">₹49 Lakh</p>
          <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Tribal Income Generated (Sep 2025–Mar 2026)</p>
          <p className="text-xs text-slate-400 font-medium mt-2 max-w-[220px] sm:ml-auto">
            Direct earnings placed into the hands of tribal technicians and their families — not routed through intermediaries.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group flex flex-col justify-between p-8 sm:p-10 min-h-[200px] sm:min-h-[220px] bg-brand-primary hover:bg-brand-accent rounded-[32px] sm:rounded-[40px] shadow-lg transition-all duration-500 relative overflow-hidden border border-white/5"
          >
            <div className={`w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-white/20 flex items-center justify-center shrink-0 ${stat.color} transition-colors`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">{stat.value}</p>
                <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-white/40 shrink-0" />
              </div>
              <p className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest mt-2 leading-snug">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Focus Highlight Banner */}
      <div className="bg-slate-50 border border-slate-100 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
        <div className="space-y-3 sm:space-y-4">
          <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest block">Gender Paradigm Shift</span>
          <h3 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">Shattering Barriers in Technical Fields</h3>
          <p className="text-slate-600 font-medium text-sm sm:text-base">
            By intentionally training and actively deploying 149 women technicians, we are shifting traditional rural paradigms across mechanical and infrastructure maintenance sectors.
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <span className="text-[10px] font-black text-brand-success uppercase tracking-widest block">Operational Impact</span>
          <h3 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight">Securing 250 Ashramshalas</h3>
          <p className="text-slate-600 font-medium text-sm sm:text-base">
            Our specialized rural tribal workforce ensures direct, dependable preventive O&M system frameworks across remote, highly vulnerable geographical regions.
          </p>
        </div>
      </div>

      {/* Field Operations Stack Gallery */}
      <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center bg-brand-primary p-6 sm:p-10 md:p-16 rounded-[32px] sm:rounded-[48px] md:rounded-[60px] shadow-2xl">
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter">WASH <br /> Field Operations</h3>
            <p className="text-white/50 text-sm sm:text-base md:text-lg font-medium">Real-time glimpses of our multi-skilled technicians handling electrical, solar, plumbing, masonry, and RO systems filtration units.</p>
          </div>
          <Button
            onClick={cycleNext}
            className="bg-white text-brand-primary hover:bg-brand-accent hover:text-white rounded-2xl font-black uppercase text-xs tracking-[0.15em] sm:tracking-[0.2em] px-6 sm:px-8 h-12 sm:h-14"
          >
            Next Image <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="lg:col-span-7 h-[400px] w-full flex items-center justify-center relative">
          <div className="relative w-full max-w-[450px] aspect-[4/3] cursor-pointer" onClick={cycleNext}>
            <AnimatePresence mode="popLayout">
              {stack.slice(0, 3).map((img, index) => (
                <motion.div
                  key={img}
                  layout
                  animate={{
                    opacity: 1 - index * 0.25,
                    scale: 1 - index * 0.08,
                    y: index * -20,
                    zIndex: 50 - index,
                  }}
                  className="absolute inset-0 w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border-8 border-brand-primary"
                >
                  <img src={img} alt="WASH field work" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   SECTION 2 — Partner & Funder Trust Strip
   ============================================================ */

/* ============================================================
   SECTION 2B — Featured Women WASH Mitra Spotlight (carousel)
   Add photos at ../assets/images/mitras/<slug>.jpeg per person
   and set `photo: importedImage` once files are ready.
   ============================================================ */

const featuredMitras = [
  {
    name: 'Rupali Sunil Kumbhare',
    eyebrow: 'Meet Our Women WASH Mitra',
    location: 'Katol, Nagpur',
    skills: ['Plumbing', 'Electrical Repairs', 'Solar Maintenance', 'Basic Construction'],
    metrics: [
      { label: 'Earnings to Date', value: '₹3,25,900' },
      { label: 'Service Areas', value: 'Ladgaon and Hardoli' },
    ],
    story:
      "Rupali Sunil Kumbhare from Katol, Nagpur, is proving that women can excel in technical trades. " +
      "Trained in plumbing, electrical repairs, solar maintenance, and basic construction, she has repaired " +
      "taps, fans, lighting, and electrical systems in schools and hostels across Ladgaon and Hardoli. " +
      "With earnings of ₹3,25,900, Rupali is improving community infrastructure while inspiring rural women " +
      "to build sustainable livelihoods through technical skills.",
    photo: undefined as string | undefined,
  },
  {
    name: 'Sonali Haridas Gawali',
    eyebrow: 'Meet Our Women WASH Mitra',
    location: 'Hatti, Chhatrapati Sambhajinagar',
    skills: ['Plumbing', 'Electrical Repairs', 'Welding', 'Carpentry', 'Facility Maintenance'],
    metrics: [
      { label: 'Earnings to Date', value: '₹2,42,500' },
      { label: 'Service Areas', value: 'Hatti, Nagad, and Brahmani' },
    ],
    story:
      "Sonali Haridas Gawali from Hatti, Chhatrapati Sambhajinagar, transformed her career after completing " +
      "the WASH Mitra Multi-Skilled Training Program. Equipped with practical skills in plumbing, electrical " +
      "repairs, welding, carpentry, and facility maintenance, she now delivers essential repair and maintenance " +
      "services in Ashram schools. Serving Hatti, Nagad, and Brahmani, she has earned ₹2,42,500, improving " +
      "community infrastructure, supporting her family, and inspiring more rural women to build sustainable " +
      "livelihoods through technical skills.",
    photo: undefined as string | undefined,
  },
  {
    name: 'Ashok',
    eyebrow: 'Meet Our WASH Mitra',
    location: 'Wada, Palghar District',
    skills: ['Solar Installation', 'Solar Maintenance', 'Solar Repair', 'Mechanical Engineering'],
    metrics: [
      { label: 'Annual Turnover', value: '₹20 Lakh' },
      { label: 'Focus Area', value: 'Clean Energy Solutions' },
    ],
    story:
      "Ashok from Wada, Palghar District, is a Mechanical Engineer who chose to strengthen his practical " +
      "skills through the WASH Mitra Multi-Skilled Training Program. After completing the training, he began " +
      "working with WASH Mitra and expanded his expertise in solar installation, maintenance, and repair " +
      "services. Through his dedication and technical capabilities, Ashok has successfully built a thriving " +
      "enterprise, generating a turnover of ₹20 lakh in the last year while contributing to clean energy " +
      "solutions and creating sustainable livelihood opportunities in his community.",
    photo: undefined as string | undefined,
  },
];

const CARD_SIZES = {
  sm: { height: 180, label: 'Small' },
  md: { height: 220, label: 'Medium' },
  lg: { height: 280, label: 'Large' },
} as const;

type CardSizeKey = keyof typeof CARD_SIZES;

function MitraExpandCard({ m, isOpen, onOpen, onClose, cardHeight }: {
  m: typeof featuredMitras[number];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  cardHeight: number;
}) {
  return (
    <>
      {/* Compact card in the grid */}
      <motion.button
        type="button"
        layoutId={`mitra-card-${m.name}`}
        onClick={onOpen}
        aria-label={`Read ${m.name}'s story`}
        className="relative w-full rounded-[32px] md:rounded-[40px] overflow-hidden shadow-lg border border-slate-100 bg-brand-primary text-left cursor-pointer block"
        style={{ visibility: isOpen ? 'hidden' : 'visible', minHeight: `${cardHeight}px`, height: `${cardHeight}px` }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className="absolute inset-0">
          {m.photo ? (
            <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 flex items-center justify-center text-white font-black text-2xl md:text-3xl">
                {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-1.5 md:space-y-2">
          <span className="text-[9px] md:text-[10px] font-black text-brand-accent uppercase tracking-[0.25em] md:tracking-[0.3em] block">{m.eyebrow}</span>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">{m.name}</h3>
          <div className="flex items-center gap-1 text-white/50 font-bold text-xs">
            <MapPin size={12} /> {m.location}
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 md:pt-2 text-brand-accent text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            Read story <ArrowRightCta size={12} />
          </div>
        </div>
      </motion.button>

      {/* Expanded overlay panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-brand-primary/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              layoutId={`mitra-card-${m.name}`}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="relative w-full max-w-lg mx-auto flex flex-col rounded-[32px] bg-brand-primary border border-white/10 shadow-2xl overflow-hidden"
              style={{ maxHeight: '70vh' }}
            >
              {/* Sticky header — always visible, never scrolls away */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">
                  {m.eyebrow}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close story"
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 flex items-center justify-center text-white font-black text-2xl md:text-3xl">
                        {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-transparent" />
                </div>

                <div className="p-6 sm:p-8 md:p-10 space-y-5 md:space-y-6 pb-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{m.name}</h3>
                    <div className="flex items-center gap-1 text-white/50 font-bold text-xs">
                      <MapPin size={12} /> {m.location}
                    </div>
                  </div>

                  <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed">{m.story}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {m.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 md:gap-6 pt-4 md:pt-5 border-t border-white/10">
                    {m.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="text-base md:text-lg font-black text-white">{metric.value}</p>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-0.5">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FeaturedMitraSpotlight() {
  const { user } = useStore();
  const [openName, setOpenName] = useState<string | null>(null);
  const [cardSize, setCardSize] = useState<CardSizeKey>('md');

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'WASHMITRA';

  useEffect(() => {
    const saved = window.localStorage.getItem('mitraCardSize');
    if (saved === 'sm' || saved === 'md' || saved === 'lg') {
      setCardSize(saved);
    }
  }, []);

  const handleSizeChange = (size: CardSizeKey) => {
    setCardSize(size);
    window.localStorage.setItem('mitraCardSize', size);
  };

  useEffect(() => {
    if (openName) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [openName]);

  return (
    <section className="py-4 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">Real People, Real Impact</span>
        <h2 className="text-3xl md:text-4xl font-black text-brand-primary tracking-tight">
          Meet Our WASH Mitras
        </h2>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">
          Click a card to read their story.
        </p>

        {isAuthorized && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-1">Card size:</span>
            {(Object.keys(CARD_SIZES) as CardSizeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSizeChange(key)}
                className={`px-4 h-9 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  cardSize === key
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {CARD_SIZES[key].label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {featuredMitras.map((m) => (
          <div key={m.name} className="w-full sm:w-[calc(50%-10px)] lg:w-[280px]">
            <MitraExpandCard
              m={m}
              isOpen={openName === m.name}
              onOpen={() => setOpenName(m.name)}
              onClose={() => setOpenName(null)}
              cardHeight={CARD_SIZES[cardSize].height}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 3 — Work Gallery (swipeable real-project cards)
   ============================================================ */

const STATIC_GALLERY_IMAGES = [
  {
    id: 'static-1',
    title: 'Solar Pump Restoration',
    location: 'Wai, Maharashtra',
    date: 'Oct 2025',
    image: solarImg,
    description: 'Restored vital agricultural water supply for 40+ smallholder farmers.',
  },
  {
    id: 'static-2',
    title: 'School Sanitation Unit',
    location: 'Dharashiv, MH',
    date: 'Dec 2025',
    image: toiletImg,
    description: 'Full plumbing overhaul of a primary school toilet block serving 120 students.',
  },
  {
    id: 'static-3',
    title: 'Community Water Filter',
    location: 'Gadchiroli, MH',
    date: 'Jan 2026',
    image: windowPipeImg,
    description: 'Installation of high-capacity UV filtration system for tribal hamlet.',
  },
  {
    id: 'static-4',
    title: 'Jal Swaraj Maintenance',
    location: 'Satara, MH',
    date: 'Feb 2026',
    image: roofRepairImg,
    description: 'Routine maintenance of overhead tank valves and distribution lines.',
  },
];

interface GalleryCardProps {
  item: any;
  index: number;
  total: number;
  onSwipe: () => void;
}

function GalleryCard({ item, index, total, onSwipe }: GalleryCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const isTop = index === total - 1;

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe();
    }
  };

  const visibleOffset = total - 1 - index;

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: index, gridArea: '1 / 1' }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{
        scale: 1 - Math.min(visibleOffset, 3) * 0.05,
        y: Math.min(visibleOffset, 3) * -15,
        opacity: visibleOffset > 3 ? 0 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`w-full max-w-sm md:max-w-md mx-auto ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
    >
      <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white group ring-4 ring-transparent hover:ring-brand-accent/20 transition-all duration-500">
        <div className="relative h-[250px] md:h-[350px] overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 select-none"
            referrerPolicy="no-referrer"
            draggable="false"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-transparent opacity-60" />
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <CheckCircle2 size={12} className="text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Verified Work</span>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black text-brand-primary tracking-tight">{item.title}</h3>
              <div className="flex items-center gap-1 mt-1 text-slate-500 font-bold text-xs italic">
                <MapPin size={12} className="text-brand-accent" /> {item.location}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Completed</p>
              <p className="text-sm font-black text-brand-primary mt-1">{item.date}</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function WorkGallerySection() {
  const { user } = useStore();
  const [cards, setCards] = useState<any[]>(STATIC_GALLERY_IMAGES);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newWork, setNewWork] = useState({ title: '', location: '', description: '', file: null as File | null });

  const supabase = getSupabase();

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('work_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not fetch from work_gallery table:', error.message);
        toast.error('Could not load the latest gallery uploads — showing recent highlights instead.');
        return;
      }

      if (data && data.length > 0) {
        const dbItems = data.map((item: any) => ({
          ...item,
          id: item.id,
          image: item.image_url,
        }));
        setCards([...STATIC_GALLERY_IMAGES, ...dbItems]);
      }
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      toast.error('Something went wrong loading the gallery.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('Image is too large — please choose a file under 5MB.');
      return;
    }

    setNewWork((prev) => ({ ...prev, file }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('Your session has expired — please sign in again before uploading.');
      return;
    }
    if (!newWork.file || !newWork.title || !supabase) {
      toast.error('Please provide a title and select an image.');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = newWork.file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('work-gallery')
        .upload(filePath, newWork.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('work-gallery')
        .getPublicUrl(filePath);

      const newItem = {
        title: newWork.title,
        location: newWork.location,
        description: newWork.description,
        image_url: publicUrl,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        user_id: user.id,
      };

      const { data: dbData, error: dbError } = await supabase
        .from('work_gallery')
        .insert([newItem])
        .select();

      if (dbError) {
        const localItem = { ...newItem, id: `local-${Date.now()}`, image: publicUrl };
        setCards((prev) => [...prev, localItem]);
        toast.warning('Image uploaded but failed to save to database record.');
      } else if (dbData && dbData.length > 0) {
        setCards((prev) => [...prev, { ...dbData[0], id: dbData[0].id, image: dbData[0].image_url }]);
        toast.success('Gallery updated successfully!');
      }

      setNewWork({ title: '', location: '', description: '', file: null });
      setShowUploadForm(false);
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Failed to upload work-done photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const moveToEnd = () => {
    setCards((prev) => {
      if (prev.length <= 1) return prev;
      const newItems = [...prev];
      const topItem = newItems.pop();
      if (topItem) newItems.unshift(topItem);
      return newItems;
    });
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'WASHMITRA';

  return (
    <section className="py-24 space-y-12 bg-brand-background rounded-[60px]">
      <div className="text-center space-y-4 px-4 relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LayoutPanelTop className="h-5 w-5 text-brand-accent" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Our Impact Gallery</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
          Technical Mastery <span className="text-brand-accent">In Action</span>
        </h2>
        <p className="max-w-xl mx-auto text-slate-500 font-medium leading-relaxed">
          Explore the tangible transformations brought to rural life by certified WashMitras. Swipe to see more projects.
        </p>

        {isAuthorized && (
          <div className="pt-8">
            <Button
              onClick={() => setShowUploadForm(true)}
              className="bg-brand-primary text-white hover:bg-brand-primary-light rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl flex gap-2 mx-auto transition-transform active:scale-95"
            >
              <Plus size={18} /> Add Your Work
            </Button>
          </div>
        )}

        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 relative overflow-hidden"
              >
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-brand-primary transition-colors outline-none"
                >
                  <X size={24} />
                </button>

                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 rounded-2xl text-brand-accent">
                      <Upload size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-black text-brand-primary tracking-tight">Post Work-Done</h3>
                      <p className="text-xs text-slate-500 font-medium italic">Share your technical achievements.</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Title</label>
                        <input
                          required
                          value={newWork.title}
                          onChange={(e) => setNewWork((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Pump Restoration"
                          className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-brand-primary focus:ring-2 focus:ring-brand-accent/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                        <input
                          required
                          value={newWork.location}
                          onChange={(e) => setNewWork((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. Satara, MH"
                          className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-brand-primary focus:ring-2 focus:ring-brand-accent/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Achievement Description</label>
                      <textarea
                        required
                        value={newWork.description}
                        onChange={(e) => setNewWork((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Briefly describe what was fixed..."
                        className="w-full h-24 bg-slate-50 border-none rounded-2xl p-4 font-medium text-brand-primary focus:ring-2 focus:ring-brand-accent/20 outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Site Photo (max 5MB)</label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-brand-accent transition-colors bg-slate-50 overflow-hidden">
                          {newWork.file ? (
                            <div className="flex flex-col items-center gap-1">
                              <CheckCircle2 size={24} className="text-green-600" />
                              <span className="text-xs font-bold text-brand-primary px-4 truncate max-w-xs">{newWork.file.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload size={24} className="text-slate-400" />
                              <span className="text-xs font-bold text-slate-400">Click or drag image here</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isUploading}
                      className="w-full h-14 bg-brand-accent hover:bg-brand-accent-hover text-white font-black uppercase tracking-widest rounded-2xl shadow-xl flex gap-2 justify-center items-center disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="animate-spin h-5 w-5" /> : <Upload size={18} />}
                      {isUploading ? 'Uploading Achievement...' : 'Publish to Gallery'}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative h-[550px] md:h-[650px] flex items-center justify-center overflow-hidden">
        <div className="grid w-full px-4 max-w-sm md:max-w-md relative">
          <AnimatePresence initial={false}>
            {cards.map((item, index) => (
              <GalleryCard
                key={item.id || `card-${index}`}
                item={item}
                index={index}
                total={cards.length}
                onSwipe={moveToEnd}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center flex-col items-center gap-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
          <span className="w-12 h-[1px] bg-slate-200" />
          Swipe left or right to browse
          <span className="w-12 h-[1px] bg-slate-200" />
        </p>
        <div className="flex gap-2">
          {cards.map((item, i) => (
            <div
              key={`dot-${item.id || i}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === cards.length - 1 ? 'w-8 bg-brand-accent' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 4 — Testimonials
   Sourced from Supabase `testimonials` table when available,
   falls back to FALLBACK_TESTIMONIALS if empty or unreachable.
   No stock avatar photos — real photo (avatar_url) or initials.
   ============================================================ */

const FALLBACK_TESTIMONIALS = [
  {
    id: 'fallback-1',
    quote: "WASH Mitra has created livelihood opportunities while improving maintenance systems in our schools and communities.",
    author: "Gram Panchayat Member",
    location: "Satara, Maharashtra",
    rating: 5,
    avatar_url: null,
  },
  {
    id: 'fallback-2',
    quote: "The training helped us gain confidence and technical skills for sustainable income. Now I lead a team of 4.",
    author: "Pooja Patil",
    location: "WashMitra Batch 03",
    rating: 5,
    avatar_url: null,
  },
  {
    id: 'fallback-3',
    quote: "Their annual maintenance contract has solved all our plumbing and electrical issues in the ashramshala.",
    author: "School Principal",
    location: "Pune District",
    rating: 5,
    avatar_url: null,
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>(FALLBACK_TESTIMONIALS);
  const supabase = getSupabase();

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.warn('Could not fetch testimonials:', error.message);
          return;
        }
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-slate-50 relative overflow-hidden rounded-[32px] sm:rounded-[48px]">
      <div className="container px-4 sm:px-8 mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 sm:mb-20">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-black text-brand-accent uppercase tracking-[0.2em]">Social Proof</h3>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              Voice of the <br />
              <span className="text-slate-400 italic font-serif lowercase tracking-normal">community.</span>
            </h2>
          </div>
          <div className="hidden sm:flex gap-4">
            <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:border-brand-accent hover:text-brand-accent transition-all">
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:border-brand-accent hover:text-brand-accent transition-all">
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="group bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-8">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-6 -left-6 h-12 w-12 text-brand-accent/5 group-hover:text-brand-accent/10 transition-colors" />
                  <p className="text-xl md:text-2xl font-medium text-slate-900 leading-[1.4] tracking-tight relative z-10 italic">
                    "{t.quote}"
                  </p>
                </div>
              </div>

              <div className="pt-10 mt-10 border-t border-slate-50 flex items-center gap-4">
                {t.avatar_url ? (
                  <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 grayscale hover:grayscale-0 transition-all">
                    <img src={t.avatar_url} alt={t.author} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black text-sm">
                    {initials(t.author || '?')}
                  </div>
                )}
                <div>
                  <p className="font-black text-slate-900 leading-none">{t.author}</p>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-secondary/5 -skew-x-12 translate-x-1/2" />
    </section>
  );
}

/* ============================================================
   SECTION 5 — Donor / CSR Call to Action
   ============================================================ */

function ImpactCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-4">
      <div className="bg-brand-primary rounded-[32px] sm:rounded-[48px] md:rounded-[60px] p-6 sm:p-10 md:p-16 lg:p-20 grid lg:grid-cols-[1.3fr_1fr] gap-8 md:gap-12 items-center overflow-hidden relative shadow-2xl">
        <div className="space-y-4 sm:space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-accent backdrop-blur-sm">
            <Handshake className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Partner With WASH Mitra</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight break-words">
            Every technician we train is a household with safer water tomorrow.
          </h2>
          <p className="text-white/70 font-medium text-sm sm:text-base leading-relaxed max-w-xl">
            WASH Mitra's skilling programs are powered through CSR partnerships and institutional collaborations.
            If your organization wants to support technician training, sanitation infrastructure, or
            tribal livelihoods, let's connect.
          </p>
        </div>

        <div className="flex flex-col gap-3.5 relative z-10 w-full">
          <Button
            className="w-full min-h-[3.5rem] h-auto py-4 px-6 bg-[#F26522] hover:bg-[#d95d1f] text-white rounded-2xl font-black uppercase text-xs tracking-wider sm:tracking-[0.15em] flex items-center justify-center gap-2 shadow-xl shadow-orange-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-center whitespace-normal leading-tight"
            onClick={() => navigate('/contact')}
          >
            <span>Request Partnership Proposal</span>
            <ArrowRightCta className="h-4 w-4 shrink-0" />
          </Button>
          <a
            href="mailto:washmitra.india@gmail.com"
            className="w-full min-h-[3.5rem] h-auto py-3.5 px-6 border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/10 rounded-2xl font-black uppercase text-xs tracking-wider sm:tracking-[0.15em] flex items-center justify-center gap-2 transition-all text-center whitespace-normal leading-tight"
          >
            Email washmitra.india@gmail.com
          </a>
        </div>

        <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}

/* ============================================================
   MAIN EXPORT — the full /impact page in one component
   ============================================================ */

export default function Impact() {
  return (
    <div className="space-y-24 py-12 relative z-0">
      <StatsAndFieldOps />
      <FeaturedMitraSpotlight />
      <WorkGallerySection />
      <TestimonialsSection />
      <ImpactCTA />
    </div>
  );
}