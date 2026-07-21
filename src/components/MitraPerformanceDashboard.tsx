import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  Trophy, TrendingUp, Star, DollarSign, CheckCircle2, 
  MessageSquare, Calendar, Bell, Zap, Gem, Gift, ArrowUpCircle, Medal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'motion/react';

const EarningHistory = [
  { day: 'Mon', earnings: 1200 },
  { day: 'Tue', earnings: 1800 },
  { day: 'Wed', earnings: 900 },
  { day: 'Thu', earnings: 2400 },
  { day: 'Fri', earnings: 1600 },
  { day: 'Sat', earnings: 3200 },
  { day: 'Sun', earnings: 2100 },
];

const ServiceBreakdown = [
  { name: 'Plumbing', value: 40, color: '#F26522' },
  { name: 'Electrical', value: 25, color: '#062D27' },
  { name: 'Water Mgmt', value: 20, color: '#0EA5E9' },
  { name: 'Solar', value: 15, color: '#10B981' },
];

export default function MitraPerformanceDashboard() {
  const stats = useMemo(() => ({
    completed: 142,
    rating: 4.9,
    earnings: 42500,
    acceptanceRate: 94,
    mitraPoints: 2450,
    level: "Gold Tier",
    pointsToNext: 550
  }), []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8 max-w-7xl mx-auto rounded-[40px]">
      
      {/* 1. LOYALTY & TRUST SCORE HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[32px] bg-gradient-to-br from-[#062D27] to-[#0A3D36] text-white p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                <Medal size={14} className="text-[#F26522]" />
                <span className="text-[10px] font-black uppercase tracking-widest">{stats.level}</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter">Your Mitra Score</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-[#F26522]">{stats.mitraPoints.toLocaleString()}</span>
                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Points</span>
              </div>
              <p className="text-slate-300 text-xs font-medium max-w-xs leading-relaxed">
                High scores unlock priority O&M contracts and exclusive gear discounts.
              </p>
            </div>

            <div className="flex flex-col justify-end items-end gap-4 text-right">
              <div className="space-y-2 w-full min-w-[200px]">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-400">Next: Platinum</span>
                  <span className="text-[#F26522]">{stats.pointsToNext} pts left</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                   <div className="bg-[#F26522] h-full transition-all duration-1000" style={{ width: '75%' }} />
                </div>
              </div>
              <Button className="bg-white text-[#062D27] hover:bg-slate-100 rounded-xl font-black uppercase text-[10px] tracking-widest h-12 px-8">
                Redeem Rewards <Gift size={16} className="ml-2" />
              </Button>
            </div>
          </div>
          <Gem size={280} className="absolute -right-16 -bottom-16 opacity-5 rotate-12" />
        </Card>

        {/* RECENT POINT ACTIVITY */}
        <Card className="border-none shadow-sm rounded-[32px] bg-white p-8">
          <h3 className="text-lg font-black text-[#062D27] mb-6 flex items-center gap-2">
            Trust Credits <ArrowUpCircle size={18} className="text-green-500" />
          </h3>
          <div className="space-y-5">
            {[
              { reason: 'Customer 5-Star Rating', points: '+50', date: 'Today' },
              { reason: 'Solar Safety Training', points: '+500', date: '2 Jun' },
              { reason: 'Early Site Arrival', points: '+25', date: '1 Jun' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-none">
                <div>
                  <p className="text-xs font-black text-slate-800">{item.reason}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{item.date}</p>
                </div>
                <span className="text-sm font-black text-green-600">{item.points}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 2. STATS & ANALYTICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Completed Services', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Rating', value: `${stats.rating} / 5.0`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Earnings', value: `₹${stats.earnings.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Feedback', value: '24 Reviews', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className={`p-3 rounded-2xl w-fit mb-4 ${stat.bg} ${stat.color}`}><stat.icon size={20} /></div>
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1.5">{stat.label}</h3>
              <p className="text-2xl font-black text-[#062D27]">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden bg-white p-8">
          <CardTitle className="text-xl font-black text-[#062D27] mb-6 flex justify-between items-center">
            Earnings Trend <TrendingUp className="text-emerald-500" size={20} />
          </CardTitle>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EarningHistory}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F26522" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F26522" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700}} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="earnings" stroke="#F26522" strokeWidth={4} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px] bg-white p-8">
          <CardTitle className="text-xl font-black text-[#062D27] mb-4">Service Type</CardTitle>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ServiceBreakdown} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {ServiceBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {ServiceBreakdown.map((s, i) => (
              <div key={i} className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">{s.name}</span>
                <span className="text-[#062D27]">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. ANNOUNCEMENTS FOOTER */}
      <div className="bg-[#062D27] rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="text-xl font-black tracking-tight mb-2 italic font-serif">Community Announcements</h4>
          <p className="text-white/60 text-sm max-w-md font-medium leading-relaxed">
            Stay updated with training opportunities and high-demand service areas.
          </p>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-black uppercase text-[10px] tracking-widest h-12 px-6">News Feed</Button>
          <Button className="bg-[#F26522] hover:bg-[#d5581e] text-white rounded-xl font-black uppercase text-[10px] tracking-widest h-12 px-6 shadow-xl"><Bell size={14} className="mr-2" /> Notifications</Button>
        </div>
      </div>
    </div>
  );
}