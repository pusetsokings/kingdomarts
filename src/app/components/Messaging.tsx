import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Search, MoreVertical, Phone, Video,
  Image as ImageIcon, Paperclip, Smile,
  CheckCheck, Mic, MessageSquare, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMessages } from '@/app/stores/useMessageStore';
import { useAuth } from '@/app/stores/useAuthStore';

const QUICK_REPLIES = [
  'Thank you! 🙏',
  'Noted, I will practise that.',
  'Can we schedule a session?',
  'I will send my recording soon.',
];

export const Messaging = () => {
  const { state, dispatch } = useMessages();
  const { state: authState } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [showMobile, setShowMobile] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedContact = state.contacts.find(c => c.id === state.selectedContactId);
  const filteredContacts = state.contacts.filter(c =>
    !state.searchQuery ||
    c.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact?.messages.length]);

  const handleSelectContact = (id: string) => {
    dispatch({ type: 'SELECT_CONTACT', id });
    setShowMobile('chat');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !state.selectedContactId) return;
    dispatch({ type: 'SEND_MESSAGE', contactId: state.selectedContactId, text });
    setMessageText('');
  };

  const unreadTotal = state.contacts.reduce(
    (sum, c) => sum + c.messages.filter(m => !m.read && m.sender === 'them').length, 0
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border border-border rounded-[2rem] overflow-hidden shadow-sm m-4 lg:m-8">

      {/* ── Contact List ── */}
      <div className={`${showMobile === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-80 border-r border-border flex-col bg-muted/20 flex-shrink-0`}>
        <div className="p-5 border-b border-border bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black">Messages</h3>
            {unreadTotal > 0 && (
              <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadTotal} new
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={state.searchQuery}
              onChange={e => dispatch({ type: 'SET_SEARCH', query: e.target.value })}
              className="w-full bg-muted border-none rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm font-medium">No contacts found</div>
            ) : (
              filteredContacts.map(contact => {
                const unread = contact.messages.filter(m => !m.read && m.sender === 'them').length;
                const lastMsg = contact.messages[contact.messages.length - 1];
                return (
                  <motion.button
                    key={contact.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleSelectContact(contact.id)}
                    className={`w-full p-4 flex items-start gap-3 transition-all border-b border-border/50 text-left ${
                      state.selectedContactId === contact.id ? 'bg-white shadow-sm' : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={contact.avatar} alt={contact.name} className="w-11 h-11 rounded-2xl object-cover" />
                      {contact.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className={`text-sm truncate ${unread > 0 ? 'font-black' : 'font-semibold'}`}>{contact.name}</h4>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase flex-shrink-0 ml-2">
                          {lastMsg?.time || ''}
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-[#522d80] uppercase tracking-wider mb-0.5">{contact.role}</p>
                      <p className={`text-xs truncate ${unread > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium'}`}>
                        {lastMsg?.sender === 'me' ? '↩ ' : ''}{lastMsg?.text || 'No messages yet'}
                      </p>
                    </div>
                    {unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className={`${showMobile === 'list' ? 'hidden' : 'flex'} md:flex flex-1 flex-col bg-white min-w-0`}>
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowMobile('list')} className="md:hidden p-1.5 hover:bg-muted rounded-lg transition-colors mr-1">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm leading-tight">{selectedContact.name}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedContact.online ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {selectedContact.online ? 'Active now' : `Last seen ${selectedContact.lastSeen}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/5">
              <AnimatePresence initial={false}>
                {selectedContact.messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[72%] space-y-1">
                      <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                        msg.sender === 'me'
                          ? 'bg-[#522d80] text-white rounded-tr-sm'
                          : 'bg-white border border-border rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1.5 px-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{msg.time}</span>
                        {msg.sender === 'me' && <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-[#fdb913]' : 'text-muted-foreground'}`} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="px-5 py-2 flex gap-2 overflow-x-auto border-t border-border/50 bg-white flex-shrink-0">
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr}
                  onClick={() => setMessageText(qr)}
                  className="flex-shrink-0 text-[10px] font-bold text-[#522d80] bg-[#f8f4ff] px-3 py-1.5 rounded-full border border-[#e4d9f7] hover:bg-[#522d80] hover:text-white transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white flex-shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors"><ImageIcon className="w-4 h-4" /></button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors"><Paperclip className="w-4 h-4" /></button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-primary transition-colors"><Mic className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 relative">
                  <input
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    type="text"
                    placeholder={`Message ${selectedContact.name}...`}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="w-11 h-11 bg-[#522d80] text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-[#fdb913] hover:text-[#522d80] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-lg font-black mb-2">Select a Conversation</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-xs">
              Connect with instructors and fellow musicians at Kingdom Arts Academy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
