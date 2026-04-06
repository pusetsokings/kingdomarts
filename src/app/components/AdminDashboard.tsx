import React from 'react';
import {
  BarChart3, Users, ShieldCheck, DollarSign, ArrowUpRight,
  CheckCircle2, XCircle, Clock, Rocket, Info
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboard = () => {
  // Academy just launched — no real enrollments or revenue yet
  const stats = [
    { label: 'Total Revenue', value: 'P0.00', sub: 'No transactions yet', icon: DollarSign, color: 'text-muted-foreground' },
    { label: 'Enrolled Students', value: '0', sub: 'Awaiting first sign-ups', icon: Users, color: 'text-muted-foreground' },
    { label: 'Instructor Payouts', value: 'P0.00', sub: 'No payouts processed', icon: BarChart3, color: 'text-muted-foreground' },
    { label: 'Pending Approvals', value: '0', sub: 'Content queue is clear', icon: ShieldCheck, color: 'text-muted-foreground' },
  ];

  const systemStatus = [
    { label: 'Payment Gateway', status: 'Operational', note: 'Pula (BWP) processing ready', ok: true },
    { label: 'Video CDN', status: 'Ready', note: 'No videos uploaded yet', ok: true },
    { label: 'Live Streaming', status: 'Ready', note: 'BroadcastChannel active', ok: true },
    { label: 'Enrollment Portal', status: 'Open', note: 'Accepting registrations', ok: true },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">System Administration</h1>
          <p className="text-muted-foreground font-medium">Kingdom Arts Academy — Gaborone, Botswana</p>
        </div>
        <button className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 self-start md:self-auto">
          <BarChart3 className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Launch Banner */}
      <div className="bg-secondary/20 border-2 border-secondary rounded-[2rem] p-8 flex items-start gap-6">
        <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
          <Rocket className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-black mb-1">Academy is Live — Awaiting First Students</h3>
          <p className="text-sm font-medium text-muted-foreground max-w-2xl">
            The platform is fully operational. All revenue, enrollment, and payout figures will populate once real students register and transact.
            All amounts are shown in Botswana Pula (P).
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-secondary bg-secondary/15 px-2 py-1 rounded-full">
                <Info className="w-3 h-3" /> New
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-primary/50 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-primary">{stat.value}</p>
            <p className="text-[10px] font-medium text-muted-foreground mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Empty Queue */}
        <div className="lg:col-span-2 bg-primary/5 border border-primary/10 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-primary/10 flex items-center justify-between">
            <h3 className="text-xl font-black text-primary">Content Approval Queue</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">All Clear</span>
          </div>
          <div className="p-16 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-black text-lg">Queue is Empty</p>
              <p className="text-sm text-muted-foreground font-medium mt-1">New course submissions and instructor applications will appear here.</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-8">
          <h3 className="text-xl font-black text-primary">System Status</h3>
          <div className="space-y-5">
            {systemStatus.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.ok ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {item.ok ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.status} · {item.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-primary text-white rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Admin Security</p>
              <h4 className="font-black text-lg mb-4">2FA Setup Recommended</h4>
              <button className="w-full py-3 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                Secure Account
              </button>
            </div>
            <ShieldCheck className="w-24 h-24 absolute -bottom-4 -right-4 opacity-10" />
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-primary">Revenue Overview (BWP)</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last 12 months</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-muted/50 rounded-t-lg" style={{ height: '8px' }} />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{month}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground font-medium mt-6">Revenue data will appear here once transactions are recorded</p>
      </div>
    </div>
  );
};
