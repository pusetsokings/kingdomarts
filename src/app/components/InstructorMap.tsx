import React from 'react';
import { MapPin, Phone, Mail, Clock, ChevronRight, Crown, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export const InstructorMap = () => {
  const locations = [
    {
      name: "Kingdom Arts Academy Central",
      address: "Thusanyo House, Plot 1268 Lithuli Rd, North Wing Offices, 2nd Floor",
      email: "info@kingdomarts.org.bw",
      tel: "+267 311 0651",
      phone: "+267 74 965 900",
      hours: "08:00 - 18:00",
      featured: true,
      instructors: ["Mooketsi Thabo", "Neo Sebego"]
    }
  ];

  const campusInstructors = [
    { name: "Blessing Moyo", role: "Head of Piano", image: "https://images.unsplash.com/photo-1635962681953-700164d60a1a?auto=format&fit=crop&w=400&q=80" },
    { name: "Kopano Molefe", role: "Senior Guitarist", image: "https://images.unsplash.com/photo-1670743601827-a96d129e8e09?auto=format&fit=crop&w=400&q=80" },
    { name: "Akhu Kgosing", role: "Saxophone Maestro", image: "https://images.unsplash.com/photo-1585659299557-d97daee2ba2e?auto=format&fit=crop&w=400&q=80" },
    { name: "Kagiso Tlou", role: "Drum Specialist", image: "https://images.unsplash.com/photo-1593659238861-ee6e27fb9855?auto=format&fit=crop&w=400&q=80" },
    { name: "Lerato Molefe", role: "Piano & Theory", image: "https://images.unsplash.com/photo-1616966776830-0f82da69c6fe?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-20">
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Our Campus</h1>
            <p className="text-muted-foreground font-medium max-w-xl">Visit our physical academy in Gaborone for high-end studio rehearsal and personal coaching.</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Main Hub</p>
              <p className="text-2xl font-black">Gaborone <span className="text-primary">Botswana</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Map Section */}
            <div className="aspect-[16/9] bg-muted rounded-[2.5rem] relative overflow-hidden border-4 border-primary group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" 
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" 
                alt="Map"
              />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-primary text-white rounded-full shadow-2xl border-8 border-white cursor-pointer hover:scale-110 transition-transform"
              >
                <Crown className="w-10 h-10 fill-secondary" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white border border-border rounded-3xl shadow-sm space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Direct Contact</h4>
                <div className="space-y-3">
                  <a href="tel:+2673110651" className="flex items-center gap-3 text-primary hover:text-secondary transition-colors group">
                    <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="text-lg font-black">+267 311 0651</span>
                  </a>
                  <a href="tel:+26774965900" className="flex items-center gap-3 text-primary hover:text-secondary transition-colors group">
                    <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="text-lg font-black">+267 74 965 900</span>
                  </a>
                  <a href="mailto:info@kingdomarts.org.bw" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-bold">info@kingdomarts.org.bw</span>
                  </a>
                </div>
              </div>
              <div className="p-8 bg-secondary rounded-3xl shadow-sm text-primary flex flex-col justify-center">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Office Hours</h4>
                <p className="text-2xl font-black">Mon - Fri</p>
                <p className="text-xl font-bold opacity-80">08:00 - 18:00</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Headquarters
            </h3>
            {locations.map((loc, i) => (
              <motion.div 
                key={i}
                className="p-8 rounded-[2.5rem] bg-primary text-white border border-primary shadow-2xl relative overflow-hidden"
              >
                <div className="relative z-10">
                  <h4 className="font-black text-2xl mb-6 leading-tight">{loc.name}</h4>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 shrink-0 text-secondary" />
                      <span className="text-sm font-medium leading-relaxed opacity-90">{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="w-5 h-5 shrink-0 text-secondary" />
                      <span className="text-sm font-medium opacity-90">{loc.hours}</span>
                    </div>
                  </div>
                  <button className="w-full mt-10 py-4 bg-white text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-secondary transition-all">
                    Get Directions
                  </button>
                </div>
                <Crown className="w-48 h-48 absolute -bottom-12 -right-12 opacity-10 rotate-12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty List Section */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-border pb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Our Expert Faculty</h2>
            <p className="text-muted-foreground font-medium text-sm">Meet the royalty of Botswana's music education.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {campusInstructors.map((teacher, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src={teacher.image} 
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6 space-y-1">
                <h4 className="font-black text-lg group-hover:text-primary transition-colors">{teacher.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{teacher.role}</p>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[8px] font-bold text-muted-foreground">Available for Coaching</span>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
