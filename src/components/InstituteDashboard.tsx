"use client"

import React, { useState } from 'react';
import { useStore } from "../store/useStore";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Wrench, 
  Activity, 
  Download, 
  PieChart, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstituteDashboard() {
  const { user } = useStore();
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'ASSETS' | 'BILLING' | 'BULK_REQUEST'>('OVERVIEW');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  // Mock data for assets tracking
  const assets = [
    { name: 'Community Toilet Block (M)', health: 92, status: 'Operational', lastService: '12 May, 2026' },
    { name: 'RO Filtration Plant - Building A', health: 45, status: 'Needs Maintenance', lastService: '02 Jan, 2026' },
    { name: 'Solar Water Pump (Panchayat)', health: 88, status: 'Operational', lastService: '14 Apr, 2026' },
    { name: 'Septic Drainage System', health: 12, status: 'Dysfunctional', lastService: 'Never' },
  ];

  const toggleIssueTag = (tag: string) => {
    setSelectedIssues(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-20 px-4 sm:px-6 md:px-0">
      
      {/* Institutional Branding Header - Stack on mobile, inline on desktop */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-6 md:pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-[#062D27]" />
            <p className="text-[10px] font-black text-[#F26522] uppercase tracking-[0.4em]">Institutional O&M Overwatch</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Gram Panchayat, <span className="italic font-serif text-slate-400">Baramati</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Responsible for 12 Tribal Ashramshalas & 4 Community Sites.</p>
        </div>
        
        {/* Dynamic Segmented Navigation Tabs - Responsive Grid Wrap */}
        <div className="grid grid-cols-2 sm:flex bg-slate-100 p-1.5 rounded-2xl w-full lg:w-auto gap-1">
          {(['OVERVIEW', 'ASSETS', 'BULK_REQUEST', 'BILLING'] as const).map((view) => (
            <Button 
              key={view}
              onClick={() => setActiveView(view)}
              variant="ghost"
              className={`rounded-xl h-10 px-4 text-xs font-black uppercase tracking-wider transition-all w-full sm:w-auto ${
                activeView === view 
                  ? 'bg-[#062D27] text-white shadow-md hover:bg-[#062D27] hover:text-white' 
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              {view === 'BULK_REQUEST' ? 'Bulk Request' : view.toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Tab Rendering Target Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {activeView === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6 md:space-y-8">
                
                {/* Mission Critical Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  <Card className="border-none shadow-sm bg-white rounded-[24px] p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Users size={22} /></div>
                      <Badge className="bg-green-100 text-green-700 font-bold">+12%</Badge>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Impact Metrics</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mt-1">2,480+</h3>
                    <p className="text-xs text-slate-500 mt-1">Beneficiaries today</p>
                  </Card>

                  <Card className="border-none shadow-sm bg-white rounded-[24px] p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-orange-50 rounded-2xl text-[#F26522]"><Activity size={22} /></div>
                      <Badge className="bg-orange-100 text-[#F26522] font-bold">90%</Badge>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Health Overview</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mt-1">Functional</h3>
                    <p className="text-xs text-slate-500 mt-1">Infrastructure operational rate</p>
                  </Card>

                  <Card className="border-none shadow-sm bg-[#2B4B9B] rounded-[24px] p-6 text-white">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white/10 rounded-2xl text-white"><ShieldCheck size={22} /></div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Expenditure Ledger</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter mt-1">₹4.2L Spent</h3>
                    <p className="text-xs text-blue-200/60 mt-1 italic">FY2026 Budget Transacted</p>
                  </Card>
                </div>

                {/* Impact Report Summary Section */}
                <Card className="border-none bg-slate-900 text-white rounded-[32px] overflow-hidden p-6 md:p-10 relative">
                  <div className="relative z-10 max-w-xl">
                    <Badge className="bg-[#F26522] text-white border-none font-black text-[10px] px-3 mb-4 uppercase tracking-[0.2em]">National Goal JJM</Badge>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 leading-tight italic font-serif text-slate-300">Sustainable Lifecycle Management</h2>
                    <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                      Technical dysfunctionality metrics across the sector matrix have fallen significantly since deploying community-linked active operations tracking logs.
                    </p>
                    <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#F26522]">Water Saved</p>
                        <p className="text-xl md:text-2xl font-black">4.2M Liters</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#F26522]">Cost Reduction</p>
                        <p className="text-xl md:text-2xl font-black">₹1.2M Saved</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 p-10 opacity-5 hidden lg:block">
                    <PieChart size={200} />
                  </div>
                </Card>
              </div>

              {/* Sidebar Component Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-8">
                <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden h-fit">
                  <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                    <CardTitle className="text-md font-black text-[#062D27]">AMC Manager</CardTitle>
                    <CardDescription className="font-bold text-[9px] uppercase tracking-widest text-slate-400">Scheduled Prevention</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 space-y-3">
                    {[
                      { title: 'Plumbing Audit', date: 'In 3 Days', tech: 'Vikram R.' },
                      { title: 'Electrical Check', date: 'In 12 Days', tech: 'Assigning...' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-[#F26522] transition-all">
                        <div>
                          <p className="font-black text-slate-900 text-xs">{item.title}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.tech}</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-black text-[#F26522] border-[#F26522] rounded-md px-2">
                          {item.date}
                        </Badge>
                      </div>
                    ))}
                    <Button className="w-full h-11 rounded-xl bg-[#062D27] text-white font-black uppercase text-[10px] tracking-widest shadow-md mt-2">
                      Request Special Visit
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-[24px] border-none bg-[#F26522] text-white p-6 h-fit">
                  <h3 className="text-lg font-black mb-1">Emergency Hub</h3>
                  <p className="text-xs opacity-80 mb-5 font-medium italic">Immediate response dispatch for system degradation on remote nodes.</p>
                  <Button className="w-full h-11 bg-white text-[#F26522] hover:bg-slate-50 font-black rounded-xl shadow-md uppercase text-[10px] tracking-widest">
                    Deploy Emergency Technician
                  </Button>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'ASSETS' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {assets.map((asset, i) => (
                  <Card key={i} className="border-none shadow-sm bg-white rounded-[24px] p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${asset.health < 50 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {asset.health < 50 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-wider rounded-md ${asset.health < 50 ? 'text-red-500 border-red-200 bg-red-50/50' : 'text-green-500 border-green-200 bg-green-50/50'}`}>
                        {asset.status}
                    </Badge>
                    </div>
                    <h3 className="text-lg font-black text-[#062D27] tracking-tight mb-4 min-h-[3rem] flex items-center">{asset.name}</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[9px] font-black uppercase mb-1">
                          <span className="text-slate-400">Health index</span>
                          <span className={asset.health < 50 ? 'text-red-600' : 'text-green-600'}>{asset.health}%</span>
                        </div>
                        <Progress value={asset.health} className={`h-1.5 ${asset.health < 50 ? '[&>div]:bg-red-500 bg-red-100' : '[&>div]:bg-green-500 bg-green-100'}`} />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1">Last Log: {asset.lastService}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {activeView === 'BULK_REQUEST' && (
            <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
              <div className="h-2 w-full bg-[#2B4B9B]" />
              <CardHeader className="p-6 md:p-8">
                <CardTitle className="text-2xl font-black text-[#062D27] tracking-tight">Campus Bulk Maintenance</CardTitle>
                <CardDescription className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                  Report multiple technical dysfunctions across your facility deployment sites. This triggers a localized, priority-tracked team dispatch.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Ashramshala Node</label>
                    <select className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-[#062D27] focus:ring-1 focus:ring-blue-500 outline-none">
                      <option>ZP Tribal Ashramshala - Unit A</option>
                      <option>Community Sanitation Block 02</option>
                      <option>Main Water Intake Plant</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority Tier Scale</label>
                    <select className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-[#062D27] focus:ring-1 focus:ring-blue-500 outline-none">
                      <option>Standard Routine Maintenance</option>
                      <option>Urgent: Mission Critical Anomaly</option>
                      <option>Emergency: Complete Failure Status</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fault Diagnostic Flags (Select Multiple)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {['Plumbing Leak', 'Pump Failure', 'Roof Seepage', 'Wall Crack', 'Electrical Trip', 'Tank Cleaning', 'Bio-Gas Block', 'RO Filter'].map((tag) => {
                      const isSelected = selectedIssues.includes(tag);
                      return (
                        <div 
                          key={tag} 
                          onClick={() => toggleIssueTag(tag)}
                          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-50/60 border-[#2B4B9B] ring-1 ring-[#2B4B9B]' 
                              : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            isSelected ? 'bg-[#2B4B9B] border-[#2B4B9B] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <span className="text-[9px] font-bold">✓</span>}
                          </div>
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#2B4B9B]' : 'text-slate-600'}`}>{tag}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button className="w-full sm:w-auto h-12 px-8 bg-[#2B4B9B] hover:bg-[#1a2f63] text-white font-black uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2">
                    <Wrench size={14} /> Submit Maintenance Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeView === 'BILLING' && (
            <Card className="border-none shadow-sm bg-white rounded-[24px] overflow-hidden">
              <CardHeader className="bg-slate-50/80 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
                <div>
                  <CardTitle className="text-xl font-black text-[#062D27] tracking-tight">Consolidated Fiscal Audit Ledger</CardTitle>
                  <CardDescription className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mt-0.5">Auditable system logs supporting regional verification parameters</CardDescription>
                </div>
                <Button className="h-11 px-5 rounded-xl bg-[#2B4B9B] hover:bg-[#1a2f63] text-white font-black uppercase text-[10px] tracking-widest shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center">
                  <Download size={14} /> Export CSV Ledger
                </Button>
              </CardHeader>
              
              {/* Responsive Container enabling seamless table overflow handling */}
              <div className="w-full overflow-x-auto">
                <Table className="w-full min-w-[600px]">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="font-black text-slate-400 uppercase text-[9px] tracking-wider px-6 py-4">Invoice ID</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[9px] tracking-wider">Deployment Area</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[9px] tracking-wider">Task Profile Roster</TableHead>
                      <TableHead className="font-black text-slate-400 uppercase text-[9px] tracking-wider">Status</TableHead>
                      <TableHead className="text-right font-black text-slate-400 uppercase text-[9px] tracking-wider px-6">Costing</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 'INV-WP-001', site: 'ZP Ashramshala A', service: 'Annual RO AMC', status: 'Settled', amount: '14,500' },
                      { id: 'INV-WP-002', site: 'Community Block 4', service: 'Deep Pit Cleaning', status: 'Pending', amount: '8,200' },
                      { id: 'INV-WP-003', site: 'ZP Ashramshala B', service: 'Pump Replacement', status: 'Settled', amount: '22,100' },
                    ].map((row, i) => (
                      <TableRow key={i} className="hover:bg-slate-50/80 transition-colors border-slate-100">
                        <TableCell className="text-xs font-black text-slate-900 px-6 py-5">{row.id}</TableCell>
                        <TableCell className="text-xs font-bold text-slate-500">{row.site}</TableCell>
                        <TableCell className="text-xs font-bold text-slate-800 italic font-serif">{row.service}</TableCell>
                        <TableCell>
                          <Badge className={`text-[9px] font-black uppercase tracking-wider border-none rounded-md ${
                            row.status === 'Settled' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6 font-black text-sm text-[#062D27]">
                          ₹{row.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}