import React from 'react';
import { BarChart3, Users, ShieldCheck, DollarSign, ArrowUpRight, ArrowDownRight, MoreVertical, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: 'P124,500', trend: '+12.5%', up: true, icon: DollarSign },
    { label: 'Active Students', value: '1,240', trend: '+8.2%', up: true, icon: Users },
    { label: 'Instructor Payouts', value: 'P45,200', trend: '-2.4%', up: false, icon: BarChart3 },
    { label: 'Pending Approvals', value: '18', trend: 'High', up: true, icon: ShieldCheck },
  ];

  const pendingApprovals = [
    { name: 'Traditional Piano: Level 4', instructor: 'Thapelo Kemo', type: 'Course Content', date: '2026-02-01' },
    { name: 'Segaba Techniques', instructor: 'Neo Sebego', type: 'Course Content', date: '2026-01-31' },
    { name: 'K. Moremi', instructor: 'Self-Enroll', type: 'Instructor Application', date: '2026-01-30' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">System Administration</h1>
          <p className="text-muted-foreground font-medium">Kingdom Arts Academy Global Management Console</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
             <BarChart3 className="w-4 h-4" /> Export Report
           </button>
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
            className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend} {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approvals Table */}
        <div className="lg:col-span-2 bg-white border border-border rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h3 className="text-xl font-black">Content Approval Queue</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <th className="px-8 py-4">Item Name</th>
                  <th className="px-8 py-4">Submitted By</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingApprovals.map((item, i) => (
                  <tr key={i} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{item.date}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary">
                           {item.instructor[0]}
                         </div>
                         <span className="text-xs font-medium">{item.instructor}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary px-2 py-1 rounded-full border border-primary/10">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><XCircle className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-muted text-muted-foreground rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Activity Side Panel */}
        <div className="bg-white border border-border rounded-[2.5rem] p-8 space-y-8">
          <h3 className="text-xl font-black">System Status</h3>
          <div className="space-y-6">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Payments Gateway</p>
                  <p className="text-xs text-muted-foreground">Operational • Pula Processing Active</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Video CDN</p>
                  <p className="text-xs text-muted-foreground">High Load • Level 1-5 buffering optimized</p>
                </div>
             </div>
          </div>

          <div className="p-6 bg-primary text-white rounded-3xl relative overflow-hidden">
             <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Admin Security</p>
               <h4 className="font-black text-lg mb-4">2FA Required for Payouts</h4>
               <button className="w-full py-3 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Verify Identity</button>
             </div>
             <ShieldCheck className="w-24 h-24 absolute -bottom-4 -right-4 opacity-10" />
          </div>
        </div>
      </div>
    </div>
  );
};
