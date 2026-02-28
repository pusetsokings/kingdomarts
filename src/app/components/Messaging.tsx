import React, { useState } from 'react';
import { 
  Send, Search, MoreVertical, Phone, Video, 
  Image as ImageIcon, Paperclip, Smile, 
  CheckCheck, Music, Mic, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(0);
  const [messageText, setMessageText] = useState('');

  const contacts = [
    { id: 0, name: 'Teacher Neo Sebego', role: 'Head Instructor', lastMsg: 'Your scale fingerings are improving!', time: '10:24 AM', online: true, unread: 2, avatar: 'https://images.unsplash.com/photo-1552157194-da6d1320a741?auto=format&fit=crop&w=150&q=80' },
    { id: 1, name: 'Thapelo Kemo', role: 'Piano Instructor', lastMsg: 'See you at the Gospel Masterclass tomorrow.', time: 'Yesterday', online: false, unread: 0, avatar: 'https://i.pravatar.cc/150?u=thapelo' },
    { id: 2, name: 'Lerato Molefe', role: 'Duet Partner', lastMsg: 'Can we practice the Gaborone Waltz?', time: 'Mon', online: true, unread: 0, avatar: 'https://images.unsplash.com/photo-1487546511569-62a31e1c607c?auto=format&fit=crop&w=150&q=80' },
    { id: 3, name: 'Kabo Letsholo', role: 'Student', lastMsg: 'How do I tune my Setinkane?', time: 'Sun', online: false, unread: 0, avatar: 'https://i.pravatar.cc/150?u=Kabo' },
  ];

  const messages = [
    { id: 1, sender: 'them', text: 'Dumela Lerato! I just reviewed your last submission for the G Major mastery lesson.', time: '10:20 AM' },
    { id: 2, sender: 'them', text: 'Your scale fingerings are improving! Watch the wrist rotation in the higher registers.', time: '10:21 AM' },
    { id: 3, sender: 'me', text: 'Thank you Teacher Neo! I struggled with the transition around C4.', time: '10:22 AM' },
    { id: 4, sender: 'them', text: 'Use the AI Scanner to slow down the MIDI playback for that section. It helps to isolate the movement.', time: '10:24 AM' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    toast.success("Message sent");
    setMessageText('');
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm m-6 lg:m-10">
      {/* Sidebar - Contact List */}
      <div className="w-80 border-r border-border flex flex-col bg-muted/20">
        <div className="p-6 border-b border-border bg-white">
          <h3 className="text-xl font-black mb-4">Messages</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-muted border-none rounded-xl pl-10 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedChat(contact.id)}
              className={`w-full p-6 flex items-start gap-4 transition-all border-b border-border/50 text-left ${
                selectedChat === contact.id ? 'bg-white shadow-sm scale-[1.02] z-10' : 'hover:bg-white/50'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black overflow-hidden">
                  {(contact as any).avatar ? <img src={(contact as any).avatar} className="w-full h-full object-cover" /> : contact.name[0]}
                </div>
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                  <span className="text-[8px] font-black text-muted-foreground uppercase">{contact.time}</span>
                </div>
                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{contact.role}</p>
                <p className="text-xs text-muted-foreground truncate font-medium">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat !== null ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black overflow-hidden">
                  {(contacts[selectedChat] as any).avatar ? <img src={(contacts[selectedChat] as any).avatar} className="w-full h-full object-cover" /> : contacts[selectedChat].name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{contacts[selectedChat].name}</h4>
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                    {contacts[selectedChat].online ? 'Active Now' : 'Away'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2.5 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2.5 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-muted/5">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] space-y-1`}>
                    <div className={`p-4 rounded-3xl text-sm font-medium shadow-sm ${
                      msg.sender === 'me' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white border border-border rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-2 px-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-secondary" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors"><ImageIcon className="w-5 h-5" /></button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors"><Paperclip className="w-5 h-5" /></button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors"><Mic className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 relative">
                  <input 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    type="text" 
                    placeholder="Type your message for Teacher Neo..." 
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  type="submit"
                  className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-secondary hover:text-primary transition-all transform active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
            <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-black mb-2">Select a Conversation</h3>
            <p className="text-sm font-medium max-w-xs">Communicate directly with instructors and fellow musicians in the Kingdom Arts Academy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Re-importing local icons for visual coherence
import { MessageSquare } from 'lucide-react';
