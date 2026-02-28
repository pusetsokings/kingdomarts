import React, { useState } from 'react';
import { Search, Bell, Menu, Crown, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigate: (view: 'home' | 'courses' | 'instructors' | 'community' | 'profile') => void;
  currentView: string;
}

export const Navbar = ({ onOpenAuth, onNavigate, currentView }: NavbarProps) => {
  return (
    <header className="bg-white border-b border-border h-18 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg"
          >
            <Crown className="w-6 h-6 fill-secondary" />
          </motion.div>
          <div className="flex flex-col -space-y-1">
            <span className="font-bold text-xl tracking-tight text-foreground">Kingdom Arts</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Academy</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center relative group">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="bg-muted border-none rounded-full pl-10 pr-4 py-2 text-sm w-48 xl:w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
            />
          </div>
          
          <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>

          <button 
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border ${currentView === 'profile' ? 'bg-muted border-border' : ''}`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-black hidden sm:block mr-1">Lerato</span>
            <Menu className="w-5 h-5 lg:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
};
