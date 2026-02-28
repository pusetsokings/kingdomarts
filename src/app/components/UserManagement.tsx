import React, { useState } from 'react';
import { 
  Users, Search, Filter, MoreVertical, Mail, 
  Shield, UserMinus, UserCheck, CheckCircle2, 
  Clock, Award, MapPin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const users = [
    { id: 1, name: 'Lerato Molefe', email: 'lerato@example.bw', role: 'Student', level: 12, status: 'Active', joined: '2025-08-12', avatar: 'https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=150&q=80' },
    { id: 2, name: 'Blessing Moyo', email: 'blessing@kingdomarts.bw', role: 'Instructor', level: 'Master', status: 'Active', joined: '2024-03-15', avatar: 'https://images.unsplash.com/photo-1656313836297-0cd072f08f43?auto=format&fit=crop&w=150&q=80' },
    { id: 3, name: 'Thabo M.', email: 'thabo@example.bw', role: 'Student', level: 4, status: 'Pending Approval', joined: '2026-01-20', avatar: 'https://i.pravatar.cc/150?u=Thabo' },
    { id: 4, name: 'Kabo Letsholo', email: 'kabo@example.bw', role: 'Student', level: 8, status: 'Active', joined: '2025-11-02', avatar: 'https://i.pravatar.cc/150?u=Kabo' },
    { id: 5, name: 'Amara Okeke', email: 'amara@kingdomarts.bw', role: 'Instructor', level: 'Expert', status: 'On Leave', joined: '2024-12-10', avatar: 'https://i.pravatar.cc/150?u=Amara' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 text-primary">Academy Directory</h2>
          <p className="text-muted-foreground font-medium">Manage students, instructors, and staff permissions.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text" 
              placeholder="Search by name or email..." 
              className="bg-white border border-border rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none w-72 font-bold" 
            />
          </div>
          <button className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Role & Level</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Joined</th>
                <th className="px-8 py-5 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-primary/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden flex items-center justify-center text-primary font-black">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'Instructor' ? 'text-secondary' : 'text-primary'}`}>
                        {user.role}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {typeof user.level === 'number' ? `Level ${user.level}` : user.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500' : 
                        user.status === 'Pending Approval' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs font-bold">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono text-muted-foreground">{user.joined}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
