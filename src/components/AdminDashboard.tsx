import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  LogOut, 
  Eye, 
  EyeOff, 
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Download,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Check,
  X,
  Phone,
  Mail,
  FileSpreadsheet,
  Clock,
  Filter,
  MessageCircle,
  TrendingUp,
  MapPin,
  CheckCircle,
  Activity,
  Layers,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

// Security Password configuration
const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Washmitra@2026';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('washmitra_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'inquiries' | 'technicians' | 'analytics' | 'settings'>('inquiries');

  const [mitras, setMitras] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Inquiries Search & Filter
  const [messageSearch, setMessageSearch] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  // Technicians Search & Filter
  const [mitraSearch, setMitraSearch] = useState('');
  const [mitraStatusFilter, setMitraStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Technician Add / Edit Modal State
  const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
  const [editingMitra, setEditingMitra] = useState<any | null>(null);
  const [mitraForm, setMitraForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    district: 'Pune',
    skills: 'Plumbing, RO Repair, Sanitation',
    is_paid: true
  });

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  const refreshAllData = async () => {
    setLoading(true);
    await Promise.all([fetchWashMitras(), fetchContactMessages()]);
    setLastSynced(new Date());
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEFAULT_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('washmitra_admin_auth', 'true');
      setAuthError(false);
      setPasswordInput('');
      toast.success("Authenticated successfully as Executive Director");
    } else {
      setAuthError(true);
      toast.error("Incorrect security passcode. Access Denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('washmitra_admin_auth');
    toast.info("Admin Command Portal locked");
  };

  // ----------------------------------------------------
  // DATA FETCHING LOGIC
  // ----------------------------------------------------
  const fetchWashMitras = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'WASHMITRA');
        
      if (!error && data) {
        setMitras(data);
      }
    } catch (err) {
      console.warn('Supabase profile fetch note:', err);
    }
  };

  const fetchContactMessages = async () => {
    let combined: any[] = [];

    // 1. Read local storage backup inquiries (both standard and permanent log)
    try {
      const localStr = localStorage.getItem('washmitra_local_inquiries');
      const permStr = localStorage.getItem('washmitra_permanent_inquiry_log');
      const localArr = localStr ? JSON.parse(localStr) : [];
      const permArr = permStr ? JSON.parse(permStr) : [];
      combined = [...localArr, ...permArr];
    } catch (e) {
      console.warn('Local storage read note:', e);
    }

    // 2. Read Supabase database inquiries
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const map = new Map();
        [...data, ...combined].forEach((item) => {
          const key = item.id || `${item.phone}_${item.name}_${item.message}`;
          if (!map.has(key)) {
            map.set(key, { ...item, status: item.status || 'pending' });
          }
        });
        combined = Array.from(map.values());
      }
    } catch (err) {
      console.warn('Supabase message fetch note:', err);
    }

    // Sort by created_at descending
    combined.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    setMessages(combined);
  };

  const syncLocalToDatabase = async () => {
    if (messages.length === 0) {
      toast.info("No local messages to sync.");
      return;
    }

    setLoading(true);
    let syncedCount = 0;

    for (const msg of messages) {
      try {
        const uuid = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
          ? (msg.id && msg.id.length > 20 ? msg.id : crypto.randomUUID())
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
              const r = Math.random() * 16 | 0;
              return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });

        const { error } = await supabase.from('contact_messages').insert([{
          id: uuid,
          name: msg.name || 'Visitor',
          phone: msg.phone || null,
          email: msg.email || null,
          message: msg.message || 'General Inquiry'
        }]);

        if (!error) syncedCount++;
      } catch (e) {
        console.warn('Sync message note:', e);
      }
    }

    setLoading(false);
    toast.success(`Database Sync Complete! (${syncedCount} records processed)`);
    fetchContactMessages();
  };

  // ----------------------------------------------------
  // INQUIRY ACTIONS
  // ----------------------------------------------------
  const toggleMessageStatus = async (msg: any) => {
    const newStatus = msg.status === 'resolved' ? 'pending' : 'resolved';
    
    // Update Supabase
    try {
      await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', msg.id);
    } catch (e) {
      console.warn('Supabase update status error:', e);
    }

    // Update local state & localStorage
    const updatedMessages = messages.map(m => m.id === msg.id ? { ...m, status: newStatus } : m);
    setMessages(updatedMessages);
    
    try {
      localStorage.setItem('washmitra_local_inquiries', JSON.stringify(updatedMessages));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    toast.success(`Inquiry marked as ${newStatus.toUpperCase()}`);
  };

  const deleteMessage = async (msgId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry message?")) return;

    try {
      await supabase.from('contact_messages').delete().eq('id', msgId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    const updated = messages.filter(m => m.id !== msgId);
    setMessages(updated);

    try {
      localStorage.setItem('washmitra_local_inquiries', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    toast.success("Inquiry deleted successfully");
  };

  const exportMessagesCSV = () => {
    if (messages.length === 0) {
      toast.error("No inquiries available to export.");
      return;
    }

    const headers = ["Date & Time", "Name", "Phone", "Email", "Subject", "Message", "Status"];
    const rows = filteredMessages.map(m => [
      `"${new Date(m.created_at || Date.now()).toLocaleString()}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.phone || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.subject || 'General Inquiry').replace(/"/g, '""')}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`,
      `"${m.status || 'pending'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WashMitra_Contact_Inquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exported Contact Inquiries to CSV!");
  };

  const openWhatsAppReply = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(`Hello ${name || 'Customer'}, thank you for contacting WASHMitra! We received your inquiry and are glad to assist you.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  // ----------------------------------------------------
  // TECHNICIAN ROSTER ACTIONS
  // ----------------------------------------------------
  const toggleMitraStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_paid: !currentStatus })
      .eq('id', userId);

    if (error) {
      toast.error("Failed to update verification status in database");
    } else {
      toast.success(currentStatus ? "Technician verification status revoked" : "Technician Status VERIFIED!");
      fetchWashMitras();
    }
  };

  const openAddTechnicianModal = () => {
    setEditingMitra(null);
    setMitraForm({
      full_name: '',
      phone: '',
      email: '',
      district: 'Pune',
      skills: 'Plumbing, RO Repair, Sanitation',
      is_paid: true
    });
    setIsTechnicianModalOpen(true);
  };

  const openEditTechnicianModal = (mitra: any) => {
    setEditingMitra(mitra);
    setMitraForm({
      full_name: mitra.full_name || mitra.name || '',
      phone: mitra.phone || '',
      email: mitra.email || '',
      district: mitra.district || 'Pune',
      skills: Array.isArray(mitra.skills) ? mitra.skills.join(', ') : (mitra.skills || 'Plumbing, Sanitation'),
      is_paid: !!mitra.is_paid
    });
    setIsTechnicianModalOpen(true);
  };

  const handleSaveTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mitraForm.full_name.trim() || !mitraForm.phone.trim()) {
      toast.error("Full Name and Phone Number are required");
      return;
    }

    const skillsArray = mitraForm.skills.split(',').map(s => s.trim()).filter(Boolean);

    if (editingMitra) {
      // Edit existing
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: mitraForm.full_name.trim(),
          name: mitraForm.full_name.trim(),
          phone: mitraForm.phone.trim(),
          email: mitraForm.email.trim() || null,
          district: mitraForm.district.trim(),
          skills: skillsArray,
          is_paid: mitraForm.is_paid
        })
        .eq('id', editingMitra.id);

      if (error) {
        toast.error("Error updating profile in database");
      } else {
        toast.success("Technician profile updated successfully!");
        fetchWashMitras();
        setIsTechnicianModalOpen(false);
      }
    } else {
      // Create new technician
      const newId = crypto.randomUUID();
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: newId,
          full_name: mitraForm.full_name.trim(),
          name: mitraForm.full_name.trim(),
          phone: mitraForm.phone.trim(),
          email: mitraForm.email.trim() || null,
          role: 'WASHMITRA',
          district: mitraForm.district.trim(),
          skills: skillsArray,
          is_paid: mitraForm.is_paid,
          is_available: true
        }]);

      if (error) {
        toast.error("Failed to add technician to database: " + error.message);
      } else {
        toast.success("New WASHMitra Technician added successfully!");
        fetchWashMitras();
        setIsTechnicianModalOpen(false);
      }
    }
  };

  const deleteTechnician = async (mitraId: string) => {
    if (!window.confirm("Are you sure you want to remove this technician from the roster?")) return;

    const { error } = await supabase.from('profiles').delete().eq('id', mitraId);
    if (error) {
      toast.error("Failed to delete technician");
    } else {
      toast.success("Technician removed successfully");
      setMitras(prev => prev.filter(m => m.id !== mitraId));
    }
  };

  const exportMitrasCSV = () => {
    if (mitras.length === 0) {
      toast.error("No technician records available to export.");
      return;
    }

    const headers = ["Name", "Phone", "Email", "District", "Skills", "Verification Status"];
    const rows = filteredMitras.map(m => [
      `"${(m.full_name || m.name || 'Technician').replace(/"/g, '""')}"`,
      `"${(m.phone || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.district || 'Pune').replace(/"/g, '""')}"`,
      `"${(Array.isArray(m.skills) ? m.skills.join('; ') : (m.skills || '')).replace(/"/g, '""')}"`,
      `"${m.is_paid ? 'VERIFIED' : 'PENDING'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WashMitra_Technicians_Roster_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exported Technicians Roster to CSV!");
  };

  // ----------------------------------------------------
  // FILTER COMPUTATIONS
  // ----------------------------------------------------
  const filteredMessages = messages.filter(m => {
    const matchesSearch = !messageSearch || 
      m.name?.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.phone?.includes(messageSearch) ||
      m.email?.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.message?.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.subject?.toLowerCase().includes(messageSearch.toLowerCase());

    const matchesStatus = 
      messageStatusFilter === 'all' ? true :
      messageStatusFilter === 'resolved' ? m.status === 'resolved' :
      (m.status || 'pending') === 'pending';

    return matchesSearch && matchesStatus;
  });

  const filteredMitras = mitras.filter(m => {
    const matchesSearch = !mitraSearch ||
      (m.full_name || m.name)?.toLowerCase().includes(mitraSearch.toLowerCase()) ||
      m.phone?.includes(mitraSearch) ||
      m.district?.toLowerCase().includes(mitraSearch.toLowerCase()) ||
      (Array.isArray(m.skills) ? m.skills.join(' ') : m.skills || '')?.toLowerCase().includes(mitraSearch.toLowerCase());

    const matchesStatus = 
      mitraStatusFilter === 'all' ? true :
      mitraStatusFilter === 'verified' ? m.is_paid :
      !m.is_paid;

    return matchesSearch && matchesStatus;
  });

  const pendingMessagesCount = messages.filter(m => (m.status || 'pending') === 'pending').length;
  const verifiedMitrasCount = mitras.filter(m => m.is_paid).length;
  const resolutionPercentage = messages.length > 0 ? Math.round(((messages.length - pendingMessagesCount) / messages.length) * 100) : 100;
  const verificationPercentage = mitras.length > 0 ? Math.round((verifiedMitrasCount / mitras.length) * 100) : 100;

  // ----------------------------------------------------
  // 🔒 SECURITY PASSCODE LOGIN OVERLAY
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden relative">
            <div className="bg-gradient-to-br from-[#062D27] via-[#094038] to-[#0A4D43] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26522]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="w-16 h-16 bg-[#F26522]/20 border border-[#F26522]/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#F26522] shadow-inner">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Admin Security Portal</h2>
              <p className="text-[11px] font-extrabold text-amber-400/90 uppercase tracking-widest mt-1">
                Authorized Directorate Personnel Only
              </p>
            </div>

            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-[#F26522]" />
                      Security Passcode
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">256-Bit Encrypted</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (authError) setAuthError(false);
                      }}
                      placeholder="Enter administrative passcode..."
                      className={`pr-10 h-12 rounded-xl text-sm font-semibold text-[#062D27] border ${
                        authError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200 focus:ring-[#F26522]/30'
                      }`}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {authError && (
                    <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Invalid passcode. Security log recorded.</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#F26522] to-[#d95d1f] hover:from-[#d95d1f] hover:to-[#be4f18] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-[#F26522]/20 transition-all cursor-pointer"
                >
                  Unlock Command Portal
                </Button>

                <div className="text-center pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400">
                    Directorate Passcode Protected System
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 🔓 AUTHENTICATED EXECUTIVE DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 md:px-0">
      
      {/* 🌟 EXECUTIVE HERO HEADER BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#062D27] via-[#094038] to-[#0D4F46] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/30">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#F26522]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold px-3 py-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5 inline-block" />
                Live Command Session
              </Badge>
              <Badge className="bg-white/10 text-white/90 border border-white/10 font-bold px-3 py-1 text-xs">
                Directorate Level Access
              </Badge>
              {lastSynced && (
                <span className="text-[11px] font-semibold text-white/50 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Synced {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
              WASHMitra Executive Command Center
            </h1>
            <p className="text-xs sm:text-sm font-medium text-white/70 max-w-2xl leading-relaxed">
              Real-time monitoring of customer inquiries, field service technicians, regional coverage, and system operational metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
            <Button
              onClick={refreshAllData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs gap-2 rounded-xl h-10 px-4 transition-all cursor-pointer backdrop-blur-xs"
            >
              <RefreshCw className={`h-4 w-4 text-[#F26522] ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh All Data'}</span>
            </Button>

            <Button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 font-bold text-xs gap-2 rounded-xl h-10 px-4 transition-all cursor-pointer backdrop-blur-xs"
            >
              <LogOut className="h-4 w-4 text-red-400" />
              <span>Lock Portal</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 📊 KPI METRICS ROW WITH VISUAL INDICATORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Inquiries */}
        <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Total Inquiries
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-[#F26522]/10 flex items-center justify-center text-[#F26522]">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#062D27]">{messages.length}</span>
              {pendingMessagesCount > 0 ? (
                <Badge className="bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-[10px]">
                  {pendingMessagesCount} Unresolved
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-[10px]">
                  100% Resolved
                </Badge>
              )}
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Resolution Rate</span>
                <span>{resolutionPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${resolutionPercentage}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Technicians */}
        <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              WASHMitras Roster
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-[#062D27]/10 flex items-center justify-center text-[#062D27]">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#062D27]">{mitras.length}</span>
              <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-[10px]">
                {verifiedMitrasCount} Verified
              </Badge>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Verification Rate</span>
                <span>{verificationPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#062D27] rounded-full transition-all duration-500" 
                  style={{ width: `${verificationPercentage}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Coverage */}
        <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Regional Coverage
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#062D27]">34</span>
              <span className="text-xs font-bold text-slate-500">Districts</span>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-semibold flex items-center gap-1 text-emerald-700">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Maharashtra & Chhattisgarh Active</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Response SLA */}
        <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Service SLA Status
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#062D27]">&lt;15 min</span>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-semibold flex items-center gap-1 text-purple-700">
              <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
              <span>Average Technician Dispatch Time</span>
            </p>
          </CardContent>
        </Card>

      </div>

      {/* 🧭 TABBED WORKSPACE NAVIGATION */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'bg-[#062D27] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="h-4 w-4 text-[#F26522]" />
          <span>Contact Inquiries</span>
          <Badge className={`ml-1 font-bold text-[10px] ${
            activeTab === 'inquiries' ? 'bg-[#F26522] text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {messages.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('technicians')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'technicians'
              ? 'bg-[#062D27] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="h-4 w-4 text-emerald-400" />
          <span>Technicians Roster</span>
          <Badge className={`ml-1 font-bold text-[10px] ${
            activeTab === 'technicians' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {mitras.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-[#062D27] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4 text-blue-400" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#062D27] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Portal Security</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 📥 TAB 1: LIVE CONTACT INQUIRIES DESK */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'inquiries' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-black text-[#062D27]">Live Contact Inquiries</CardTitle>
                  <Badge className="bg-[#F26522] text-white font-bold text-xs">
                    {filteredMessages.length} Listed
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Messages submitted by customers via washmitra.com contact form
                </p>
              </div>

              {/* Controls: Search, Filter, CSV Export */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Tabs */}
                <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
                  <button
                    onClick={() => setMessageStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      messageStatusFilter === 'all' ? 'bg-white text-[#062D27] shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    onClick={() => setMessageStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      messageStatusFilter === 'pending' ? 'bg-white text-amber-700 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending ({pendingMessagesCount})
                  </button>
                  <button
                    onClick={() => setMessageStatusFilter('resolved')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      messageStatusFilter === 'resolved' ? 'bg-white text-emerald-700 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Resolved ({messages.length - pendingMessagesCount})
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search name, phone, message..."
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    className="pl-8 h-9 text-xs border-slate-200 bg-white rounded-xl"
                  />
                </div>

                {/* Export CSV */}
                <Button
                  onClick={exportMessagesCSV}
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-200 text-slate-700 font-bold text-xs gap-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </Button>

                {/* Re-Sync DB */}
                <Button
                  onClick={syncLocalToDatabase}
                  variant="outline"
                  size="sm"
                  title="Push locally saved inquiries directly to Supabase cloud database"
                  className="h-9 border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-800 font-bold text-xs gap-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
                  <span>Re-Sync DB</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-black text-xs text-slate-700">Date & Time</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">Customer Details</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">Contact Channels</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">Subject & Message</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">Status</TableHead>
                      <TableHead className="font-black text-xs text-slate-700 text-right">Quick Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-bold text-sm">
                          {messageSearch || messageStatusFilter !== 'all' ? (
                            <div className="space-y-2">
                              <p>No contact inquiries match your search filters.</p>
                              <Button variant="outline" size="sm" onClick={() => { setMessageSearch(''); setMessageStatusFilter('all'); }}>
                                Reset Search Filters
                              </Button>
                            </div>
                          ) : (
                            <p>No customer inquiries received yet.</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMessages.map((msg) => (
                        <TableRow key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                          <TableCell className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-slate-400" />
                              <span>
                                {msg.created_at ? new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-xs">
                            <div className="font-bold text-[#062D27] flex items-center gap-1.5">
                              <span>{msg.name || 'Anonymous Customer'}</span>
                            </div>
                            {msg.subject && <div className="text-[11px] font-semibold text-slate-400">{msg.subject}</div>}
                          </TableCell>

                          <TableCell className="text-xs space-y-1">
                            {msg.phone && (
                              <div className="flex items-center gap-1.5 font-bold text-[#F26522]">
                                <Phone className="h-3 w-3" />
                                <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                              </div>
                            )}
                            {msg.email && (
                              <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                                <Mail className="h-3 w-3 text-slate-400" />
                                <a href={`mailto:${msg.email}`} className="hover:underline truncate max-w-[140px] block">{msg.email}</a>
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="text-xs font-medium text-slate-700 max-w-xs">
                            <p className="line-clamp-2">{msg.message}</p>
                            <button
                              onClick={() => setSelectedMessage(msg)}
                              className="text-[10px] font-extrabold text-[#F26522] hover:underline mt-0.5 inline-flex items-center gap-0.5"
                            >
                              <span>View Full Message</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </TableCell>

                          <TableCell>
                            {msg.status === 'resolved' ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] py-0.5">
                                <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" /> Resolved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-800 border-amber-300 bg-amber-50 font-bold text-[10px] py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping mr-1.5 inline-block" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {msg.phone && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openWhatsAppReply(msg.phone, msg.name)}
                                  className="h-8 px-2 text-emerald-600 hover:bg-emerald-50 text-xs font-bold gap-1 cursor-pointer"
                                  title="Reply via WhatsApp"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">WhatsApp</span>
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleMessageStatus(msg)}
                                className={`h-8 px-2.5 text-xs font-bold rounded-lg cursor-pointer ${
                                  msg.status === 'resolved'
                                    ? 'text-amber-700 hover:bg-amber-50'
                                    : 'text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {msg.status === 'resolved' ? 'Reopen' : 'Resolve'}
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteMessage(msg.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 🛠️ TAB 2: WASHMITRA TECHNICIANS ROSTER */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'technicians' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-black text-[#062D27]">WASHMitra Field Technicians Roster</CardTitle>
                  <Badge className="bg-[#062D27] text-white font-bold text-xs">
                    {filteredMitras.length} Technicians
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Manage certified technicians, skills, districts, and payment verification status
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Filter Tabs */}
                <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
                  <button
                    onClick={() => setMitraStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      mitraStatusFilter === 'all' ? 'bg-white text-[#062D27] shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({mitras.length})
                  </button>
                  <button
                    onClick={() => setMitraStatusFilter('verified')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      mitraStatusFilter === 'verified' ? 'bg-white text-emerald-700 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Verified ({verifiedMitrasCount})
                  </button>
                  <button
                    onClick={() => setMitraStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      mitraStatusFilter === 'pending' ? 'bg-white text-amber-700 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending ({mitras.length - verifiedMitrasCount})
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-52">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search technician, district..."
                    value={mitraSearch}
                    onChange={(e) => setMitraSearch(e.target.value)}
                    className="pl-8 h-9 text-xs border-slate-200 bg-white rounded-xl"
                  />
                </div>

                {/* Export CSV */}
                <Button
                  onClick={exportMitrasCSV}
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-200 text-slate-700 font-bold text-xs gap-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </Button>

                {/* Add Technician Button */}
                <Button
                  onClick={openAddTechnicianModal}
                  size="sm"
                  className="h-9 bg-[#F26522] hover:bg-[#d95d1f] text-white font-black text-xs gap-1.5 rounded-xl cursor-pointer shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Technician</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-black text-xs text-slate-700">Technician</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">Contact</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">District / Location</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">Certified Skills</TableHead>
                      <TableHead className="font-black text-xs text-slate-700">Status</TableHead>
                      <TableHead className="font-black text-xs text-slate-700 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMitras.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-bold text-sm">
                          {mitraSearch || mitraStatusFilter !== 'all' ? (
                            <div className="space-y-2">
                              <p>No technicians match your search filters.</p>
                              <Button variant="outline" size="sm" onClick={() => { setMitraSearch(''); setMitraStatusFilter('all'); }}>
                                Reset Filters
                              </Button>
                            </div>
                          ) : (
                            <p>No technicians registered yet. Click "Add Technician" to add one.</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMitras.map((mitra) => {
                        const name = mitra.full_name || mitra.name || 'WASHMitra Technician';
                        const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

                        return (
                          <TableRow key={mitra.id} className="hover:bg-slate-50/80 transition-colors">
                            <TableCell className="text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#062D27] text-white font-black flex items-center justify-center text-xs shadow-sm">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-bold text-[#062D27]">{name}</div>
                                  <div className="text-[10px] text-slate-400 font-semibold">ID: {mitra.id.slice(0, 8)}...</div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs font-semibold">
                              {mitra.phone ? (
                                <a href={`tel:${mitra.phone}`} className="text-[#F26522] hover:underline font-bold">
                                  {mitra.phone}
                                </a>
                              ) : (
                                <span className="text-slate-300">N/A</span>
                              )}
                              {mitra.email && <div className="text-[11px] text-slate-400 font-medium">{mitra.email}</div>}
                            </TableCell>

                            <TableCell className="text-xs font-semibold text-slate-700">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                <span>{mitra.district || 'Pune'}</span>
                              </div>
                            </TableCell>

                            <TableCell className="text-xs font-medium text-slate-600 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(mitra.skills) ? mitra.skills : (mitra.skills?.split(',') || ['Plumbing', 'Sanitation'])).map((skill: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-[10px] bg-slate-100 text-slate-700 font-semibold border-slate-200">
                                    {skill.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>

                            <TableCell>
                              {mitra.is_paid ? (
                                <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] py-0.5">
                                  <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" /> Verified Status
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-amber-700 border border-amber-300 bg-amber-50 font-bold text-[10px] py-0.5">
                                  Pending Verification
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant={mitra.is_paid ? "outline" : "default"}
                                  onClick={() => toggleMitraStatus(mitra.id, mitra.is_paid)}
                                  className={
                                    mitra.is_paid 
                                      ? "text-amber-700 border-amber-200 hover:bg-amber-50 text-[11px] font-bold h-8 rounded-lg"
                                      : "bg-[#F26522] hover:bg-[#d95d1f] text-white text-[11px] font-bold h-8 rounded-lg"
                                  }
                                >
                                  {mitra.is_paid ? 'Revoke Status' : 'Approve Status'}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEditTechnicianModal(mitra)}
                                  className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                  title="Edit Technician"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTechnician(mitra.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer"
                                  title="Delete Technician"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 📊 TAB 3: SYSTEM OVERVIEW & COVERAGE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm rounded-3xl p-6">
            <h3 className="text-lg font-black text-[#062D27] mb-2">Regional Operations & District Map</h3>
            <p className="text-xs font-semibold text-slate-500 mb-6">Active technical service hubs across western & central India</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur',
                'Amravati', 'Kolhapur', 'Sangli', 'Nanded', 'Jalgaon', 'Akola',
                'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Raigad', 'Raipur (CG)'
              ].map((district, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-center hover:border-[#F26522] transition-colors">
                  <MapPin className="h-4 w-4 text-[#F26522] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#062D27] block">{district}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">Active Hub</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ⚙️ TAB 4: PORTAL SECURITY SETTINGS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm rounded-3xl p-6 max-w-xl">
            <h3 className="text-lg font-black text-[#062D27] mb-2">Portal Security & Session Config</h3>
            <p className="text-xs font-semibold text-slate-500 mb-6">Manage administrative passkey settings and active session state</p>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-[#062D27] block">Administrative Passcode</span>
                  <span className="text-[11px] text-slate-400">Security Mode: Environment Variable Protected</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 font-bold">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-[#062D27] block">Database Connection Status</span>
                  <span className="text-[11px] text-slate-400">Supabase PostgreSQL Realtime Engine</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 font-bold">Connected</Badge>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl h-10"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Portal & End Session
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 🔍 MODAL: FULL INQUIRY DETAIL VIEW & INSPECTOR */}
      {/* ---------------------------------------------------- */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F26522]/10 rounded-xl text-[#F26522]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#062D27]">Inquiry Message Details</h3>
                  <p className="text-[11px] font-semibold text-slate-400">Received via Website Contact Desk</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Customer Name</span>
                  <span className="font-extrabold text-[#062D27] text-sm">{selectedMessage.name}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Phone Number</span>
                  <a href={`tel:${selectedMessage.phone}`} className="font-extrabold text-[#F26522] text-sm hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
              </div>

              {selectedMessage.email && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Email Address</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-slate-800 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-1">Subject</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl block border border-slate-200">
                  {selectedMessage.subject || 'General Inquiry'}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-1">Full Message Content</span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-800 whitespace-pre-wrap font-medium leading-relaxed max-h-48 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {selectedMessage.phone ? (
                <Button
                  onClick={() => openWhatsAppReply(selectedMessage.phone, selectedMessage.name)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-9 gap-1.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Reply on WhatsApp</span>
                </Button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toggleMessageStatus(selectedMessage);
                    setSelectedMessage(null);
                  }}
                  className="font-bold text-xs rounded-xl h-9"
                >
                  {selectedMessage.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                </Button>

                <Button
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                  className="bg-[#062D27] text-white font-bold text-xs rounded-xl h-9 px-4"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ➕ MODAL: ADD / EDIT TECHNICIAN */}
      {/* ---------------------------------------------------- */}
      {isTechnicianModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#062D27]/10 rounded-xl text-[#062D27]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#062D27]">
                    {editingMitra ? 'Edit Technician Profile' : 'Add New WASHMitra Technician'}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400">Register certified field service technician</p>
                </div>
              </div>
              <button
                onClick={() => setIsTechnicianModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTechnician} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={mitraForm.full_name}
                  onChange={e => setMitraForm({...mitraForm, full_name: e.target.value})}
                  className="h-10 text-xs rounded-xl border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <Input
                    required
                    placeholder="10-digit mobile"
                    value={mitraForm.phone}
                    onChange={e => setMitraForm({...mitraForm, phone: e.target.value})}
                    className="h-10 text-xs rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">District / City</label>
                  <Input
                    placeholder="e.g. Pune"
                    value={mitraForm.district}
                    onChange={e => setMitraForm({...mitraForm, district: e.target.value})}
                    className="h-10 text-xs rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address (Optional)</label>
                <Input
                  type="email"
                  placeholder="technician@example.com"
                  value={mitraForm.email}
                  onChange={e => setMitraForm({...mitraForm, email: e.target.value})}
                  className="h-10 text-xs rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Skills / Trade Services (Comma Separated)</label>
                <Input
                  placeholder="Plumbing, RO Maintenance, Electrician"
                  value={mitraForm.skills}
                  onChange={e => setMitraForm({...mitraForm, skills: e.target.value})}
                  className="h-10 text-xs rounded-xl border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_paid"
                  checked={mitraForm.is_paid}
                  onChange={e => setMitraForm({...mitraForm, is_paid: e.target.checked})}
                  className="h-4 w-4 rounded text-[#F26522] focus:ring-[#F26522] cursor-pointer"
                />
                <label htmlFor="is_paid" className="font-bold text-slate-700 cursor-pointer text-xs">
                  Verified WASHMitra Technician Status
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTechnicianModalOpen(false)}
                  className="font-bold text-xs rounded-xl h-9"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#F26522] hover:bg-[#d95d1f] text-white font-black text-xs rounded-xl h-9 px-4 cursor-pointer"
                >
                  {editingMitra ? 'Save Profile Changes' : 'Add Technician'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}