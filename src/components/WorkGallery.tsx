import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { LayoutPanelTop, MapPin, CheckCircle2, Upload, Plus, Loader2, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useStore } from '../store/useStore';
import { getSupabase } from '../lib/supabase';
import { toast } from 'sonner';
import solarImg from '../assets/images/solar.jpeg';
import toiletImg from '../assets/images/toilet.jpeg';
import windowPipeImg from '../assets/images/window_pipe.jpeg';
import roofRepairImg from '../assets/images/roof_repair.jpeg';

const STATIC_GALLERY_IMAGES = [
  {
    id: 'static-1',
    title: 'Solar Pump Restoration',
    location: 'Wai, Maharashtra',
    date: 'Oct 2025',
    image: solarImg,
    description: 'Restored vital agricultural water supply for 40+ smallholder farmers.'
  },
  {
    id: 'static-2',
    title: 'School Sanitation Unit',
    location: 'Dharashiv, MH',
    date: 'Dec 2025',
    image: toiletImg,
    description: 'Full plumbing overhaul of a primary school toilet block serving 120 students.'
  },
  {
    id: 'static-3',
    title: 'Community Water Filter',
    location: 'Gadchiroli, MH',
    date: 'Jan 2026',
    image: windowPipeImg,
    description: 'Installation of high-capacity UV filtration system for tribal hamlet.'
  },
  {
    id: 'static-4',
    title: 'Jal Swaraj Maintenance',
    location: 'Satara, MH',
    date: 'Feb 2026',
    image: roofRepairImg,
    description: 'Routine maintenance of overhead tank valves and distribution lines.'
  }
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
      style={{
        x,
        rotate,
        opacity,
        zIndex: index,
        gridArea: '1 / 1',
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{
        scale: 1 - Math.min(visibleOffset, 3) * 0.05,
        y: Math.min(visibleOffset, 3) * -15,
        opacity: visibleOffset > 3 ? 0 : 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`w-full max-w-sm md:max-w-md mx-auto ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
    >
      <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white group ring-4 ring-transparent hover:ring-[#F26522]/20 transition-all duration-500">
        <div className="relative h-[250px] md:h-[350px] overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 select-none"
            referrerPolicy="no-referrer"
            draggable="false"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062D27] via-transparent to-transparent opacity-60" />
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <CheckCircle2 size={12} className="text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#062D27]">Verified Work</span>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black text-[#062D27] tracking-tight">{item.title}</h3>
              <div className="flex items-center gap-1 mt-1 text-slate-500 font-bold text-xs italic">
                <MapPin size={12} className="text-[#F26522]" /> {item.location}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Completed</p>
              <p className="text-sm font-black text-[#062D27] mt-1">{item.date}</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.description}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function WorkGallery() {
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
        return;
      }

      if (data && data.length > 0) {
        const dbItems = data.map((item: any) => ({
          ...item,
          id: item.id,
          image: item.image_url
        }));
        setCards([...STATIC_GALLERY_IMAGES, ...dbItems]);
      }
    } catch (err) {
      console.error('Error fetching gallery items:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewWork(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
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
        user_id: user?.id
      };

      const { data: dbData, error: dbError } = await supabase
        .from('work_gallery')
        .insert([newItem])
        .select();

      if (dbError) {
        const localItem = { ...newItem, id: `local-${Date.now()}`, image: publicUrl };
        setCards(prev => [...prev, localItem]);
        toast.warning('Image uploaded but failed to save to database record.');
      } else if (dbData && dbData.length > 0) {
        setCards(prev => [...prev, { ...dbData[0], id: dbData[0].id, image: dbData[0].image_url }]);
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
    setCards(prev => {
      if (prev.length <= 1) return prev;
      const newItems = [...prev];
      const topItem = newItems.pop();
      if (topItem) newItems.unshift(topItem);
      return newItems;
    });
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'WASHMITRA';

  return (
    <section className="py-24 space-y-12 bg-[#F9F9F7] rounded-[60px]">
      <div className="text-center space-y-4 px-4 relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LayoutPanelTop className="h-5 w-5 text-[#F26522]" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#062D27]">Our Impact Gallery</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
          Technical Mastery <span className="text-[#F16622]">In Action</span>
        </h2>
        <p className="max-w-xl mx-auto text-slate-500 font-medium leading-relaxed">
          Explore the tangible transformations brought to rural life by certified WashMitras. Swipe to see more projects.
        </p>

        {isAuthorized && (
          <div className="pt-8">
            <Button 
              onClick={() => setShowUploadForm(true)}
              className="bg-[#062D27] text-white hover:bg-[#0A3D36] rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl flex gap-2 mx-auto transition-transform active:scale-95"
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062D27]/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 relative overflow-hidden"
              >
                <button 
                  onClick={() => setShowUploadForm(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-[#062D27] transition-colors outline-none"
                >
                  <X size={24} />
                </button>

                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 rounded-2xl text-[#F26522]">
                      <Upload size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-black text-[#062D27] tracking-tight">Post Work-Done</h3>
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
                          onChange={(e) => setNewWork(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Pump Restoration"
                          className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-[#062D27] focus:ring-2 focus:ring-[#F26522]/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                        <input 
                          required
                          value={newWork.location}
                          onChange={(e) => setNewWork(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. Satara, MH"
                          className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-[#062D27] focus:ring-2 focus:ring-[#F26522]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Achievement Description</label>
                      <textarea 
                        required
                        value={newWork.description}
                        onChange={(e) => setNewWork(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Briefly describe what was fixed..."
                        className="w-full h-24 bg-slate-50 border-none rounded-2xl p-4 font-medium text-[#062D27] focus:ring-2 focus:ring-[#F26522]/20 outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Site Photo</label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-[#F26522] transition-colors bg-slate-50 overflow-hidden">
                          {newWork.file ? (
                            <div className="flex flex-col items-center gap-1">
                              <CheckCircle2 size={24} className="text-green-600" />
                              <span className="text-xs font-bold text-[#062D27] px-4 truncate max-w-xs">{newWork.file.name}</span>
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
                      className="w-full h-14 bg-[#F26522] hover:bg-[#d5581e] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl flex gap-2 justify-center items-center disabled:opacity-50"
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
               className={`h-1.5 rounded-full transition-all duration-500 ${i === cards.length - 1 ? 'w-8 bg-[#F26522]' : 'w-2 bg-slate-200'}`} 
             />
           ))}
        </div>
      </div>
    </section>
  );
}
