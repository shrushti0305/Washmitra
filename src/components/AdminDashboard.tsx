import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, Droplets, ShieldCheck, Wallet, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [mitras, setMitras] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWashMitras();
    fetchContactMessages();
  }, []);

  const fetchWashMitras = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'WASHMITRA');
      
    if (error) toast.error("Error loading WashMitras");
    else setMitras(data || []);
    setLoading(false);
  };

  const fetchContactMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
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

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 md:px-0 animate-in fade-in duration-500">
      
      {/* 1. Command Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <p className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]">Directorate Dashboard 2026</p>
          <h1 className="text-5xl font-black text-[#062D27]">Command Center</h1>
        </div>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total WashMitras" value={mitras.length.toString()} icon={Users} color="blue" sub="Registered Operators" />
        <MetricCard title="Fee Collection" value={`₹${mitras.filter(m => m.is_paid).length * 500}`} icon={Wallet} color="green" sub="Total Revenue" />
        <MetricCard title="Pending Verifications" value={mitras.filter(m => !m.is_paid).length.toString()} icon={AlertCircle} color="purple" sub="Action Required" />
        <MetricCard title="Contact Messages" value={messages.length.toString()} icon={FileText} color="blue" sub="Inquiries Received" />
      </div>

      {/* 3. Live Contact Inquiry Messages Table */}
      <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black text-[#062D27] flex items-center gap-2">
              <FileText className="text-[#F26522]" /> Live Contact Inquiries ({messages.length})
            </h3>
            <p className="text-xs font-medium text-slate-400">Messages submitted through the Contact Us form</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchContactMessages} className="rounded-xl text-xs font-bold">
            Refresh Messages
          </Button>
        </div>

        {messages.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl">
            <p className="text-sm font-bold text-slate-400">No contact messages received yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>MESSAGE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id || Math.random()}>
                  <TableCell className="text-xs font-bold text-slate-400">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Today'}
                  </TableCell>
                  <TableCell className="font-black text-[#062D27]">{msg.name}</TableCell>
                  <TableCell className="font-bold text-[#F26522]">{msg.phone}</TableCell>
                  <TableCell>{msg.email || 'N/A'}</TableCell>
                  <TableCell className="max-w-md text-xs font-medium text-slate-600">{msg.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* 4. Registry Table */}
      <Card className="border-none shadow-sm rounded-[40px] p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black flex items-center gap-2"><FileText /> WashMitra Registry</h3>
          <Input 
            placeholder="Search name..." 
            className="w-64 rounded-xl" 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>LOCATION</TableHead>
              <TableHead>CERTIFICATE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mitras.filter(m => m.name?.toLowerCase().includes(search.toLowerCase())).map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-black">{m.name}</TableCell>
                <TableCell>{m.district || 'N/A'}</TableCell>
                <TableCell>{m.certificate_no || 'Pending'}</TableCell>
                <TableCell>
                  <Badge 
                    className={`cursor-pointer ${m.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    onClick={() => togglePaymentStatus(m.id, m.is_paid)}
                  >
                    {m.is_paid ? 'PAID' : 'PENDING FEE'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="font-bold text-[#F26522]">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, sub }: any) {
  const colors: any = { 
    green: 'bg-green-50 text-green-600', 
    blue: 'bg-blue-50 text-blue-600', 
    purple: 'bg-purple-50 text-purple-600' 
  };
  return (
    <Card className="border-none shadow-sm rounded-[32px] p-6 bg-white">
      <div className={`p-3 rounded-2xl w-fit mb-4 ${colors[color]}`}><Icon size={24} /></div>
      <p className="text-[10px] font-black uppercase text-slate-400">{title}</p>
      <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
      <p className="text-[10px] font-bold text-slate-500 mt-1 italic">{sub}</p>
    </Card>
  );
}