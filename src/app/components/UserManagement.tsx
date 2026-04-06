import React, { useState } from 'react';
import {
  Users, Search, Mail,
  Shield, UserMinus, UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ACADEMY_USERS } from '@/app/stores/useAuthStore';

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'instructor' | 'admin'>('all');

  const filteredUsers = ACADEMY_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 text-primary">Academy Directory</h2>
          <p className="text-muted-foreground font-medium">Manage students, instructors, and staff permissions.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search by name or email..."
              className="bg-white border border-border rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64 font-bold"
            />
          </div>
          {(['all', 'student', 'instructor', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${filterRole === r ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary/70 border-b border-primary/10">
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Role & Level</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-primary/5 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden flex items-center justify-center text-primary font-black shrink-0">
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          : user.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {user.city && <p className="text-[10px] text-muted-foreground/60 font-medium">{user.city}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'instructor' ? 'text-secondary' :
                        user.role === 'admin' ? 'text-primary' : 'text-primary/70'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {user.instrument
                          ? `${user.instrument} · ${typeof user.level === 'number' ? `Level ${user.level}` : user.level}`
                          : (typeof user.level === 'number' ? `Level ${user.level}` : user.level)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        user.status === 'Active' ? 'bg-green-500' :
                        user.status === 'Pending Approval' ? 'bg-amber-500' :
                        user.status === 'On Leave' ? 'bg-blue-400' : 'bg-red-500'
                      }`} />
                      <span className="text-xs font-bold">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono text-muted-foreground">{user.joinDate}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toast.success(`Email sent to ${user.name}`)}
                        className="p-2.5 bg-white border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.info(`Managing permissions for ${user.name}`)}
                        className="p-2.5 bg-white border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.error(`Account for ${user.name} suspended`)}
                        className="p-2.5 bg-white border border-border rounded-xl text-muted-foreground hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
