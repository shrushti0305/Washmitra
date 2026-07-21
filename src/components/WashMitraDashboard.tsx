import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { useOfflineSync, PendingSyncItem } from '../hooks/useOfflineSync';
import WashMart from './WashMart';
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Star,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  MoreVertical,
  ShieldCheck,
  Hammer,
  Wallet,
  Settings,
  Package,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { motion } from 'motion/react';

import { useNotifications } from '../contexts/NotificationContext';
import MitraPerformanceDashboard from './MitraPerformanceDashboard';

export default function WashMitraDashboard() {
  const { user, requests, updateRequest, setRequests } = useStore();
  const { sendNotification } = useNotifications();
  const { isOnline, queue, queueTask, processSync } = useOfflineSync();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'JOBS' | 'SKILLS' | 'TOOLKIT' | 'EARNINGS' | 'PERFORMANCE'>('JOBS');
  const [isAvailable, setIsAvailable] = useState(true);

  // Load this WashMitra's real assigned bookings from Supabase
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('washmitra_id', user.id)
        .order('created_at', { ascending: false });
      if (!cancelled && !error && data) {
        setRequests(data);
      }
    })();
    return () => { cancelled = true; };
  }, [user, setRequests]);

  // Auto-sync logic...

  // Auto-sync logic
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      handleSync();
    }
  }, [isOnline]);

  const handleSync = async () => {
    setIsSyncing(true);
    await processSync(async (item: PendingSyncItem) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (item.type === 'SERVICE_COMPLETION') {
            updateRequest(item.id, { status: 'COMPLETED' });
            resolve(true);
          } else {
            resolve(false);
          }
        }, 1000);
      });
    });
    setIsSyncing(false);
  };

  const handleStartService = (jobId: string) => {
    updateRequest(jobId, { status: 'IN_PROGRESS' });
    toast.info('Service started. Timer is active.');
  };

  const handleCompleteJob = (jobId: string) => {
    if (!isOnline) {
      queueTask(jobId, 'SERVICE_COMPLETION', { completedAt: new Date().toISOString() });
      updateRequest(jobId, { status: 'PENDING' });
      toast.success('Offline: Saved completion. Will sync later.');
    } else {
      updateRequest(jobId, { status: 'COMPLETED' });
      sendNotification({
        title: 'Payout Processed',
        message: 'Job completed successfully. Your earnings have been updated.',
        type: 'success'
      });
    }
  };

  // Mock data for new features
  const skillBadges = [
    { name: 'RO Systems', level: 'Expert', icon: ShieldCheck, color: 'text-blue-500' },
    { name: 'Electrical', level: 'Certified', icon: ShieldCheck, color: 'text-orange-500' },
    { name: 'Plumbing', level: 'Master', icon: ShieldCheck, color: 'text-green-500' },
  ];

  const toolkitItems = [
    { name: 'Adjustable Wrench', status: 'Functional', lastSeen: '2 days ago' },
    { name: 'Digital Multimeter', status: 'Functional', lastSeen: '1 day ago' },
    { name: 'Pipe Cutter', status: 'Functional', lastSeen: 'Just now' },
  ];

  const availableJobs = [
    { id: 'JOB-902', customer: 'Gram Panchayat Hall', task: 'Tap Leakage', distance: '1.2 km', payout: 250 },
    { id: 'JOB-905', customer: 'Ashramshala Building', task: 'Switchboard Repair', distance: '3.5 km', payout: 450 },
  ];

  const activeJobs = requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20 px-4 md:px-0">
      {/* Header with Role Focus & Availability Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`flex h-2 w-2 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <p className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]">Work Hub: Verified WashMitra</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Good Morning, <span className="italic font-serif text-slate-400">{user?.full_name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Status: {isAvailable ? 'Active & Certified (Batch 04). Ready for service.' : 'Offline. Shift finished.'}</p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <Button 
              onClick={() => setIsAvailable(true)}
              className={`rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest ${isAvailable ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500'}`}
            >
              Online
            </Button>
            <Button 
              onClick={() => setIsAvailable(false)}
              className={`rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest ${!isAvailable ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}
            >
              Offline
            </Button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <Button 
              variant={activeTab === 'JOBS' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('JOBS')}
              className={`rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest ${activeTab === 'JOBS' ? 'bg-[#062D27] text-white shadow-lg' : 'text-slate-500'}`}
            >
              Jobs
            </Button>
            <Button 
              variant={activeTab === 'SKILLS' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('SKILLS')}
              className={`rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest ${activeTab === 'SKILLS' ? 'bg-[#062D27] text-white shadow-lg' : 'text-slate-500'}`}
            >
              Profile
            </Button>
            <Button 
              variant={activeTab === 'TOOLKIT' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('TOOLKIT')}
              className={`rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest ${activeTab === 'TOOLKIT' ? 'bg-[#062D27] text-white shadow-lg' : 'text-slate-500'}`}
            >
              Toolkit
            </Button>
            <Button 
              variant={activeTab === 'PERFORMANCE' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('PERFORMANCE')}
              className={`rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest ${activeTab === 'PERFORMANCE' ? 'bg-[#062D27] text-white shadow-lg' : 'text-slate-500'}`}
            >
              Stats
            </Button>
          </div>
        </div>
      </div>

      {activeTab === 'JOBS' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Job Queue */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Assignments */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 italic">
                Active Assignment <Badge className="bg-[#F26522]">{activeJobs.length}</Badge>
              </h2>
              
              {activeJobs.length === 0 ? (
                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 p-12 text-center rounded-[40px]">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">No active assignments</h3>
                  <p className="text-slate-400 mt-1">You are currently visible on the map for new bookings.</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {activeJobs.map((job) => (
                    <Card key={job.id} className="border-none shadow-2xl rounded-[40px] overflow-hidden group hover:shadow-md transition-all bg-white">
                      <div className="h-2 bg-[#F26522] w-full" />
                      <CardHeader className="pb-2 p-8">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-slate-200">#{job.id}</Badge>
                            <CardTitle className="text-2xl font-black text-[#062D27] mt-1 tracking-tight">{job.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 font-bold text-slate-500">
                              <MapPin size={14} className="text-[#F26522]" /> {job.address || job.location}
                            </CardDescription>
                          </div>
                          <Badge className={`${job.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-[#062D27]'} text-white rounded-full py-1.5 px-4 font-black uppercase text-[8px] tracking-widest`}>
                            {job.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-8 pb-8">
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl mb-6 text-center">
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Scheduled</p>
                            <p className="text-xl font-black text-[#062D27]">{job.scheduled_date ? new Date(job.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Estimate</p>
                            <p className="text-xl font-black text-[#F26522]">₹{job.total_price}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {job.status === 'ASSIGNED' || job.status === 'EN_ROUTE' ? (
                            <Button 
                              onClick={() => handleStartService(job.id)}
                              className="flex-1 h-16 bg-[#062D27] hover:bg-[#0A3D36] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all"
                            >
                              Verify OTP & Start
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleCompleteJob(job.id)}
                              className="flex-1 h-16 bg-[#F26522] hover:bg-[#d5581e] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all"
                            >
                              Work Finished
                            </Button>
                          )}
                          <Button variant="outline" className="h-16 w-16 rounded-2xl border-slate-100 bg-slate-50 text-slate-400">
                            <MoreVertical />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Offline Sync Status */}
            <div className={`p-4 rounded-[24px] flex items-center justify-between border ${isOnline ? 'bg-green-50/50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-green-50 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Status</p>
                  <p className="text-sm font-bold text-slate-700">{isOnline ? 'Fully Connected' : `${queue.length} Pending Actions`}</p>
                </div>
              </div>
              {queue.length > 0 && isOnline && (
                <Button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="bg-[#062D27] text-white h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Queue
                </Button>
              )}
            </div>

            {/* Nearby Available Jobs Feed */}
            <div className="space-y-6">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 italic">
                Jobs Near You <Badge variant="outline" className="text-slate-400 border-slate-200">Real-time Feed</Badge>
              </h2>
              <div className="grid gap-4">
                {availableJobs.map((job) => (
                  <Card key={job.id} className="border-none shadow-sm rounded-3xl p-6 bg-slate-50 hover:bg-white hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#F26522] group-hover:bg-[#F26522] group-hover:text-white transition-all">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-[#062D27]">{job.customer}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.task} • {job.distance}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-lg font-black text-[#062D27]">₹{job.payout}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Base Payout</p>
                        </div>
                        <Button className="h-10 px-6 bg-[#062D27] rounded-xl text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
                          Accept
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Work Hub Stats & Earnings */}
          <div className="space-y-6">
            <Card className="bg-[#062D27] border-none rounded-[40px] overflow-hidden text-white shadow-2xl relative p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-2xl text-[#F26522] shadow-inner"><Wallet size={24} /></div>
                <div>
                   <h3 className="text-xl font-black tracking-tight leading-none">Earnings Hub</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Settled & Pending</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Today's Revenue</p>
                <h3 className="text-5xl font-black tracking-tighter">₹1,240</h3>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span className="text-slate-400">Weekly Target</span>
                    <span className="text-[#F26522]">₹5,000</span>
                  </div>
                  <Progress value={65} className="h-2 bg-white/10" />
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">65% of Goal Reached</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">This Week</p>
                   <p className="text-xl font-black">₹4,840</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#F16622]">Last Week</p>
                   <p className="text-xl font-black opacity-40">₹3,900</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-[32px] border-none bg-slate-50 p-8">
               <h3 className="text-lg font-black text-[#062D27] mb-4">Upcoming Audits</h3>
               <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#F26522]"><Star size={20} className="fill-[#F26522]" /></div>
                  <div>
                    <p className="font-black text-xs text-[#062D27]">Skill Recertification</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Starts in 12 Days</p>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'SKILLS' && (
        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Verified Credentials</h2>
            <div className="grid gap-4">
              {skillBadges.map((badge, idx) => (
                <Card key={idx} className="border-none shadow-sm rounded-[24px] overflow-hidden">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${badge.color}`}>
                        <badge.icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#062D27]">{badge.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">Batch 04 Residential Graduate</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-none font-black text-[10px] uppercase tracking-widest">
                      {badge.level}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          <Card className="rounded-[40px] bg-slate-50 border-none p-10 flex flex-col justify-center items-center text-center">
            <GraduationCap className="h-16 w-16 text-[#062D27] mb-6" />
            <h3 className="text-2xl font-black text-[#062D27] tracking-tight">Enterprise Support</h3>
            <p className="text-slate-500 font-medium mt-2 max-w-sm">
              We help you register your own micro-enterprise. Get support for GST filing and national portal listings.
            </p>
            <Button className="mt-8 h-12 px-8 bg-[#062D27] rounded-full font-black text-xs uppercase tracking-widest shadow-xl">
              Register Business
            </Button>
          </Card>
        </div>
      )}

      {activeTab === 'TOOLKIT' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Digital Toolkit Ledger</h2>
            <Badge className="bg-[#062D27]">{toolkitItems.length} Total items</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {toolkitItems.map((item, idx) => (
              <Card key={idx} className="border-none shadow-sm rounded-[24px] p-6 hover:translate-y-[-4px] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#062D27]">
                    <Hammer size={24} />
                  </div>
                  <Badge className="bg-green-50 text-green-600 border-none text-[8px] font-black">{item.status}</Badge>
                </div>
                <h3 className="font-black text-[#062D27]">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Last inventoried: {item.lastSeen}</p>
                <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase text-slate-400 hover:text-[#062D27] border-t border-slate-50 pt-4 rounded-none h-auto">
                  Report Damage
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'PERFORMANCE' && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           <MitraPerformanceDashboard />
        </div>
      )}
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
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-lg font-black text-slate-900 leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
