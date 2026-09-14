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
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// Password configuration (Can also be overridden by VITE_ADMIN_PASSWORD env variable)
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchWashMitras();
      fetchContactMessages();
    }
  }, [isAuthenticated]);

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

  const fetchWashMitras = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'WASHMITRA');
        
      if (!error && data) {
        setMitras(data);
      }
    } catch (err) {
      console.warn('Supabase fetch note:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.warn('Supabase fetch note:', err);
    }
  };

  const togglePaymentStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_paid: !currentStatus })
      .eq('id', userId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(currentStatus ? "Payment status revoked" : "Payment verified!");
      fetchWashMitras();
    }
  };

  // 🔒 PASSWORD LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-[#062D27] p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-[#F26522]/20 border border-[#F26522]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#F26522]">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Security Access</h2>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest mt-1">Authorized Personnel Only</p>
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
                    placeholder="Enter admin password..."
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
                  Default Password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">Washmitra@2026</code>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔓 AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 md:px-0 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
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
            Real-time contact inquiries & technician verification portal
          </p>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs gap-2 rounded-xl cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>Lock Portal</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Total Inquiries Received
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-[#F26522]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#062D27]">{messages.length}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">From website contact form</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Registered WashMitras
            </CardTitle>
            <Users className="h-5 w-5 text-[#062D27]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#062D27]">{mitras.length}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Certified field technicians</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-500">
              Operating Coverage
            </CardTitle>
            <Sparkles className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#062D27]">34 Districts</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Maharashtra & Chhattisgarh</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Contact Inquiries Table */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-[#062D27]">Live Contact Inquiries</CardTitle>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Real-time user inquiries submitted via contact page</p>
          </div>
          <Badge className="bg-[#F26522] text-white hover:bg-[#F26522] font-bold">
            {messages.length} Messages
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black text-xs text-slate-700">Date & Time</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Name</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Phone</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Email</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Message / Inquiry Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-bold text-sm">
                      No contact messages received yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg) => (
                    <TableRow key={msg.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-[#062D27]">{msg.name}</TableCell>
                      <TableCell className="text-xs font-bold text-[#F26522]">
                        <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-600">
                        {msg.email ? <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a> : <span className="text-slate-300">N/A</span>}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-700 max-w-md">
                        {msg.message}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* WASHMitras Verification Management */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-black text-[#062D27]">WASHMitra Technicians Roster</CardTitle>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Manage technician registration and verification status</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search technician..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs border-slate-200 bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black text-xs text-slate-700">Technician</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">District / Village</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Skills / Trade</TableHead>
                  <TableHead className="font-black text-xs text-slate-700">Verification Status</TableHead>
                  <TableHead className="font-black text-xs text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mitras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-bold text-sm">
                      No technicians currently listed.
                    </TableCell>
                  </TableRow>
                ) : (
                  mitras
                    .filter(m => !search || m.full_name?.toLowerCase().includes(search.toLowerCase()))
                    .map((mitra) => (
                      <TableRow key={mitra.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-bold text-xs text-[#062D27]">{mitra.full_name || 'Technician'}</TableCell>
                        <TableCell className="text-xs font-semibold text-slate-600">{mitra.district || 'Pune'}</TableCell>
                        <TableCell className="text-xs font-semibold text-slate-600">{mitra.skills?.join(', ') || 'Plumbing, RO'}</TableCell>
                        <TableCell>
                          {mitra.is_paid ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-bold text-[10px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 font-bold text-[10px]">
                              Pending Verification
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={mitra.is_paid ? "outline" : "default"}
                            onClick={() => togglePaymentStatus(mitra.id, mitra.is_paid)}
                            className={mitra.is_paid ? "text-red-600 border-red-200 hover:bg-red-50 text-xs" : "bg-[#F26522] hover:bg-[#d95d1f] text-white text-xs"}
                          >
                            {mitra.is_paid ? 'Revoke Status' : 'Approve Status'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}