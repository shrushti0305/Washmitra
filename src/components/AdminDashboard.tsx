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
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// Security Password configuration
const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Washmitra@2026';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('washmitra_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [mitras, setMitras] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEFAULT_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('washmitra_admin_auth', 'true');
      setAuthError(false);
      setPasswordInput('');
      toast.success("Authenticated successfully as Administrator");
    } else {
      setAuthError(true);
      toast.error("Incorrect security password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('washmitra_admin_auth');
    toast.info("Admin Portal locked");
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

    // 1. Read local storage backup inquiries
    try {
      const localStr = localStorage.getItem('washmitra_local_inquiries');
      if (localStr) {
        combined = JSON.parse(localStr);
      }
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

  // ----------------------------------------------------
  // INQUIRY ACTIONS
  // ----------------------------------------------------
  const toggleMessageStatus = async (msg: any) => {
    const newStatus = msg.status === 'resolved' ? 'pending' : 'resolved';
    
    // 1. Update Supabase
    try {
      await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', msg.id);
    } catch (e) {
      console.warn('Supabase update status error:', e);
    }

    // 2. Update local state & localStorage
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
    if (!window.confirm("Are you sure you want to delete this inquiry message?")) return;

    // 1. Delete from Supabase
    try {
      await supabase.from('contact_messages').delete().eq('id', msgId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    // 2. Delete from local state & localStorage
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

    const headers = ["Date", "Name", "Phone", "Email", "Subject", "Message", "Status"];
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
      toast.success(currentStatus ? "Technician verification revoked" : "Technician status VERIFIED!");
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
        toast.success("Technician details updated successfully!");
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

  // ----------------------------------------------------
  // 🔒 PASSWORD LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-[#062D27] p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-[#F26522]/20 border border-[#F26522]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#F26522]">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Security Access</h2>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mt-1">Authorized Directorate Personnel Only</p>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-[#F26522]" />
                  <span>Enter Security Passcode</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError(false);
                    }}
                    placeholder="Enter security password..."
                    className={`pr-10 h-12 rounded-xl text-sm font-semibold text-[#062D27] border ${
                      authError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200 focus:ring-[#F26522]/30'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Incorrect passcode. Please try again.</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#F26522] hover:bg-[#d95d1f] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Unlock Admin Portal
              </Button>

              <div className="text-center pt-2">
                <p className="text-[11px] font-semibold text-slate-400">
                  Default Passcode: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">Washmitra@2026</code>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // 🔓 AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 md:px-0 animate-in fade-in duration-500">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-bold px-2.5 py-0.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              Authenticated Session
            </Badge>
            <Badge className="bg-[#062D27] text-white hover:bg-[#062D27] font-bold px-2.5 py-0.5 text-xs">
              Directorate View
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#062D27] tracking-tight mt-2">
            Admin Command Center
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Real-time customer inquiries, technician roster management & live monitoring
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <Button
            onClick={refreshAllData}
            disabled={loading}
            variant="outline"
            className="border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs gap-1.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#F26522] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-200 hover:bg-red-50 text-red-600 font-bold text-xs gap-1.5 rounded-xl cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Lock Portal</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Contact Inquiries
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-[#F26522]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#062D27]">{messages.length}</span>
              {pendingMessagesCount > 0 && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-extrabold text-[10px]">
                  {pendingMessagesCount} Unresolved
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Live inquiries submitted via website</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Registered WASHMitras
            </CardTitle>
            <Users className="h-5 w-5 text-[#062D27]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#062D27]">{mitras.length}</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-extrabold text-[10px]">
                {mitras.filter(m => m.is_paid).length} Verified
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Certified field service technicians</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Operational Coverage
            </CardTitle>
            <Sparkles className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#062D27]">34 Districts</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Active across Maharashtra & Chhattisgarh</p>
          </CardContent>
        </Card>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 📥 SECTION 1: LIVE CONTACT INQUIRIES */}
      {/* ---------------------------------------------------- */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-black text-[#062D27]">Live Contact Inquiries</CardTitle>
              <Badge className="bg-[#F26522] text-white font-bold text-xs">
                {filteredMessages.length} Messages
              </Badge>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Real-time user inquiries submitted via contact page
            </p>
          </div>

          {/* Controls: Search, Filter, CSV Export */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Tabs */}
            <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setMessageStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  messageStatusFilter === 'all' ? 'bg-white text-[#062D27] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMessageStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  messageStatusFilter === 'pending' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setMessageStatusFilter('resolved')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  messageStatusFilter === 'resolved' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Resolved
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search inquiries..."
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
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black text-xs text-slate-700">Date & Time</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Sender Details</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Contact</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Inquiry Subject & Message</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Status</TableHead>
                  <TableHead className="font-black text-xs text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-bold text-sm">
                      {messageSearch || messageStatusFilter !== 'all' ? 'No inquiries match your filters.' : 'No contact messages received yet.'}
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
                        <div className="font-bold text-[#062D27]">{msg.name || 'Anonymous User'}</div>
                        {msg.subject && <div className="text-[11px] font-medium text-slate-400">{msg.subject}</div>}
                      </TableCell>

                      <TableCell className="text-xs space-y-0.5">
                        {msg.phone && (
                          <div className="flex items-center gap-1 font-bold text-[#F26522]">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                          </div>
                        )}
                        {msg.email && (
                          <div className="flex items-center gap-1 text-slate-600 font-semibold text-[11px]">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-xs font-medium text-slate-700 max-w-xs">
                        <p className="line-clamp-2">{msg.message}</p>
                        {msg.message?.length > 70 && (
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="text-[10px] font-bold text-[#F26522] hover:underline mt-0.5"
                          >
                            Read Full Inquiry &rarr;
                          </button>
                        )}
                      </TableCell>

                      <TableCell>
                        {msg.status === 'resolved' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Resolved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 font-bold text-[10px]">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleMessageStatus(msg)}
                            title={msg.status === 'resolved' ? "Mark as Pending" : "Mark as Resolved"}
                            className={`h-8 px-2.5 text-xs font-bold ${
                              msg.status === 'resolved'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {msg.status === 'resolved' ? 'Mark Pending' : 'Resolve'}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMessage(msg.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
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

      {/* ---------------------------------------------------- */}
      {/* 🛠️ SECTION 2: WASHMITRA TECHNICIANS ROSTER */}
      {/* ---------------------------------------------------- */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-black text-[#062D27]">WASHMitra Technicians Roster</CardTitle>
              <Badge className="bg-[#062D27] text-white font-bold text-xs">
                {filteredMitras.length} Technicians
              </Badge>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Manage field technician registrations, skills, and verification
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Tabs */}
            <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setMitraStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mitraStatusFilter === 'all' ? 'bg-white text-[#062D27] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMitraStatusFilter('verified')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mitraStatusFilter === 'verified' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setMitraStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mitraStatusFilter === 'pending' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search technicians..."
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
                  <TableHead className="font-black text-xs text-slate-700">Technician Name</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Contact</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">District / Region</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Skills & Trade</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Verification Status</TableHead>
                  <TableHead className="font-black text-xs text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMitras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400 font-bold text-sm">
                      {mitraSearch || mitraStatusFilter !== 'all' ? 'No technicians match your search filters.' : 'No technicians currently listed.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMitras.map((mitra) => (
                    <TableRow key={mitra.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-bold text-xs text-[#062D27]">
                        {mitra.full_name || mitra.name || 'WASHMitra Technician'}
                      </TableCell>

                      <TableCell className="text-xs font-semibold">
                        <div className="text-[#F26522]">{mitra.phone || 'N/A'}</div>
                        {mitra.email && <div className="text-[11px] text-slate-400">{mitra.email}</div>}
                      </TableCell>

                      <TableCell className="text-xs font-semibold text-slate-700">
                        {mitra.district || 'Pune'}
                      </TableCell>

                      <TableCell className="text-xs font-medium text-slate-600 max-w-xs">
                        {Array.isArray(mitra.skills) ? mitra.skills.join(', ') : (mitra.skills || 'Plumbing, RO Maintenance')}
                      </TableCell>

                      <TableCell>
                        {mitra.is_paid ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Status
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 font-bold text-[10px]">
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
                                ? "text-amber-700 border-amber-200 hover:bg-amber-50 text-[11px] font-bold h-8"
                                : "bg-[#F26522] hover:bg-[#d95d1f] text-white text-[11px] font-bold h-8"
                            }
                          >
                            {mitra.is_paid ? 'Revoke Status' : 'Approve Status'}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditTechnicianModal(mitra)}
                            className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 cursor-pointer"
                            title="Edit Technician"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTechnician(mitra.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                            title="Delete Technician"
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

      {/* ---------------------------------------------------- */}
      {/* 🔍 MODAL: FULL INQUIRY DETAIL VIEW */}
      {/* ---------------------------------------------------- */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#F26522]" />
                <h3 className="font-black text-lg text-[#062D27]">Inquiry Details</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Submitted Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedMessage.created_at || Date.now()).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Name</span>
                  <span className="font-bold text-[#062D27]">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Phone</span>
                  <a href={`tel:${selectedMessage.phone}`} className="font-bold text-[#F26522] hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
              </div>

              {selectedMessage.email && (
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Email</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-slate-700 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Subject</span>
                <span className="font-bold text-slate-800">{selectedMessage.subject || 'General Inquiry'}</span>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Full Message</span>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap font-medium mt-1 leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleMessageStatus(selectedMessage);
                  setSelectedMessage(null);
                }}
                className="font-bold text-xs rounded-xl"
              >
                {selectedMessage.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
              </Button>

              <Button
                size="sm"
                onClick={() => setSelectedMessage(null)}
                className="bg-[#062D27] text-white font-bold text-xs rounded-xl"
              >
                Close
              </Button>
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
                <Users className="h-5 w-5 text-[#062D27]" />
                <h3 className="font-black text-lg text-[#062D27]">
                  {editingMitra ? 'Edit Technician Record' : 'Add New WASHMitra Technician'}
                </h3>
              </div>
              <button
                onClick={() => setIsTechnicianModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_paid"
                  checked={mitraForm.is_paid}
                  onChange={e => setMitraForm({...mitraForm, is_paid: e.target.checked})}
                  className="h-4 w-4 rounded text-[#F26522] focus:ring-[#F26522]"
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
                  className="font-bold text-xs rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#F26522] hover:bg-[#d95d1f] text-white font-black text-xs rounded-xl cursor-pointer"
                >
                  {editingMitra ? 'Save Changes' : 'Add Technician'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}