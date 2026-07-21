import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useBookingStore } from '../store/useBookingStore';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Home,
  ShoppingBag,
  ClipboardList,
  ShieldCheck,
  LifeBuoy,
  Menu,
  X,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Footer from './Footer';
import logoUrl from '../assets/images/WASH Mitra logo.png';
import { SHOW_TRANSACTIONAL_FEATURES } from '../lib/featureFlags';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../contexts/NotificationContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, setUser } = useStore();
  const { notifications = [], unreadCount = 0, markAsRead } = useNotifications() || {};
  const { openBookingFor } = useBookingStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Impact', path: '/impact' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleBecomeMitraClick = () => {
    navigate('/training');
    toast.success("Navigated to Training Hub! Choose a certification course to enroll.");
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] font-sans flex flex-col selection:bg-[#F26522]/30">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-[#062D27]/5 bg-[#F9F9F7]/80 backdrop-blur-xl">
        <div className="container flex h-24 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
          
          {/* Brand Logo Container */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => handleNavClick(e, '/')}>
            <div className="flex items-center">
              <img 
                src={logoUrl} 
                alt="WashMitra Logo" 
                className="h-12 w-auto"
              />
            </div>
            <div className="flex flex-col -space-y-1">
               <span className="text-lg font-black tracking-tighter text-[#293592] leading-tight uppercase">
                 WASH <span className="text-[#F26522]">Mitra</span>
               </span>
               <span className="text-[10px] font-bold text-[#062D27]/40 tracking-widest uppercase">PVT. LTD.</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button 
                key={item.label} 
                onClick={(e) => handleNavClick(e, item.path)}
                className={`text-sm font-semibold transition-all hover:scale-105 bg-transparent border-none outline-none cursor-pointer ${
                  location.pathname === item.path ? 'text-[#062D27]' : 'text-[#062D27]/60 hover:text-[#062D27]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Right Action Bar Options */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Popover>
                  <PopoverTrigger
                    nativeButton
                    render={
                      <Button variant="ghost" size="icon" className="relative text-[#062D27] hover:bg-[#062D27]/5 rounded-xl">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute top-2 right-2 h-2 w-2 bg-[#F26522] rounded-full ring-2 ring-white" />
                        )}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-80 p-0 rounded-3xl border-[#062D27]/5 shadow-2xl mr-4 md:mr-0" align="end">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
                      <h3 className="font-black text-xs uppercase tracking-widest text-[#062D27]">Notifications</h3>
                      {unreadCount > 0 && <Badge className="bg-[#F26522] text-[10px]">{unreadCount} New</Badge>}
                    </div>
                    <ScrollArea className="h-[350px]">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                             <Bell className="h-6 w-6 text-slate-300" />
                          </div>
                          <p className="text-xs font-bold text-slate-400 italic">No new messages yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group ${!n.read ? 'bg-orange-50/30' : ''}`}
                              onClick={() => markAsRead && markAsRead(n.id)}
                            >
                              <div className="flex gap-3">
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-200' : 'bg-[#F26522]'}`} />
                                <div className="space-y-1">
                                  <p className="text-xs font-black text-[#062D27] leading-none">{n.title}</p>
                                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest pt-1">
                                    {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) : ''}
                                  </p>
                               </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="p-2 border-t border-slate-50 rounded-b-3xl">
                      <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#062D27] h-10">
                        View all activity
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger className="relative h-11 w-11 rounded-xl hover:bg-[#062D27]/5 transition-colors flex items-center justify-center outline-none border border-transparent hover:border-[#062D27]/10">
                    <Avatar className="h-9 w-9 rounded-lg">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="rounded-lg bg-[#062D27] text-white underline-offset-4">{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-[#062D27]/5 shadow-xl">
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-black text-[#062D27] leading-none">{user.full_name}</p>
                        <p className="text-[10px] font-black leading-none text-slate-400 capitalize tracking-widest mt-1">{user.role?.toLowerCase()}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#062D27]/5" />
                    <DropdownMenuItem className="cursor-pointer font-bold text-[#062D27] rounded-xl px-3 py-2">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer font-bold text-[#062D27] rounded-xl px-3 py-2">Settings</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#062D27]/5" />
                    <DropdownMenuItem 
                      className="text-[#F26522] cursor-pointer font-black rounded-xl px-3 py-2"
                      onClick={() => setUser(null)}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {SHOW_TRANSACTIONAL_FEATURES && (
                  <>
                    <Button 
  variant="outline"
  onClick={handleBecomeMitraClick}
  className="hidden sm:inline-flex border-[#062D27]/20 text-[#062D27] hover:bg-[#062D27]/5 rounded-xl h-9 px-3 text-[10px] font-black uppercase tracking-widest transition-all"
>
  <UserPlus className="mr-1.5 h-3 w-3 text-[#F26522]" /> Become a WASH Mitra
</Button>

                    <Button 
                      variant="ghost"
                      onClick={handleLoginClick}
                      className="hidden md:inline-flex text-[12px] font-black uppercase tracking-widest text-[#062D27]/70 hover:text-[#062D27] hover:bg-[#062D27]/5 rounded-xl h-12 px-4"
                    >
                      Partner Login
                    </Button>
                    <Button 
                      onClick={() => openBookingFor('General Inquiry')}
                      className="bg-[#F26522] hover:bg-[#d95d1f] font-black h-11 sm:h-12 rounded-xl px-4 sm:px-6 shadow-xl shadow-orange-200 border-none text-white whitespace-nowrap text-[11px] sm:text-[12px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                    >
                      Book a Service
                    </Button>
                  </>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden h-11 w-11 text-[#062D27] hover:bg-[#062D27]/5 rounded-xl"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-[#062D27]/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[80%] max-w-sm bg-white shadow-2xl p-10 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-black tracking-tighter text-[#062D27] leading-tight uppercase">
                    WASH <span className="text-[#F26522]">Mitra</span>
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile Tab Items */}
              <div className="flex flex-col space-y-6">
                {navItems.map((item, idx) => (
                  <motion.button 
                    key={item.label}
                    onClick={(e) => handleNavClick(e, item.path)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="text-3xl font-black text-[#062D27] tracking-tight group flex items-center justify-between bg-transparent border-none text-left outline-none cursor-pointer w-full"
                  >
                    {item.label}
                    <span className="w-10 h-10 rounded-full border border-[#062D27]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <LifeBuoy className="h-4 w-4 text-[#F26522]" />
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto pt-10 border-t border-slate-100 space-y-4">
                {SHOW_TRANSACTIONAL_FEATURES && (
                  <>
                    <Button 
                      onClick={handleBecomeMitraClick}
                      className="w-full h-14 bg-[#062D27] text-white hover:bg-[#0A3D36] rounded-2xl font-black uppercase tracking-widest text-xs shadow-md"
                    >
                      Become a WASH Mitra
                    </Button>
                    <Button 
                      onClick={handleLoginClick}
                      className="w-full h-14 bg-slate-50 text-[#062D27] hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Partner Login
                    </Button>
                    <Button 
                      onClick={() => {
                        openBookingFor('General Inquiry');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-14 bg-[#F26522] hover:bg-[#d95d1f] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-100"
                    >
                      Book a Service
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* This is the single, clean <main> tag */}
      <main className="flex-1 w-full relative">
        {user && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <h2 className="text-2xl font-black text-[#062D27] animate-in fade-in slide-in-from-bottom-2">
              Welcome back, {user.full_name || 'User'}!
            </h2>
            <p className="text-[10px] font-bold text-[#F26522] uppercase tracking-[0.2em] mb-4">
              {user.role ? user.role.replace('_', ' ') : 'Dashboard'}
            </p>
          </div>
        )}
        
        {children}
      </main>

      <Footer />

      {/* Mobile Tab Navigation */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 sm:hidden">
          <div className="flex justify-around items-center h-16">
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 items-center">
              <Home className="h-5 w-5" />
              <span className="text-[10px]">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 items-center">
              <ClipboardList className="h-5 w-5" />
              <span className="text-[10px]">Requests</span>
            </Button>
            {user.role === 'WASHMITRA' ? (
               <Button variant="ghost" size="sm" className="flex flex-col gap-1 items-center">
               <ShoppingBag className="h-5 w-5" />
               <span className="text-[10px]">WashMart</span>
             </Button>
            ) : (
              <Button variant="ghost" size="sm" className="flex flex-col gap-1 items-center">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-[10px]">AMC</span>
            </Button>
            )}
            <Button variant="ghost" size="sm" className="flex flex-col gap-1 items-center">
              <LifeBuoy className="h-5 w-5" />
              <span className="text-[10px]">Help</span>
            </Button>
          </div>
        </nav>
      )}
      
      <Toaster position="top-center" />
    </div>
  );
}