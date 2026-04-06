import React, { useState, useRef } from 'react';
import {
  Users, MessageSquare, Share2, Music, Crown,
  Heart, PlayCircle, Video, UserPlus, Zap,
  ArrowRight, X, Calendar, MapPin,
  Plus, Users2, Send, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useCommunity } from '@/app/stores/useCommunityStore';
import { useAuth, ACADEMY_USERS } from '@/app/stores/useAuthStore';
import type { PostCategory } from '@/app/stores/useCommunityStore';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Activity',
  discussion: 'Discussions',
  performance: 'Performances',
  event: 'Events',
  group: 'Groups',
};

const CATEGORY_COLORS: Record<string, string> = {
  performance: 'bg-secondary/20 text-primary',
  event: 'bg-primary text-white',
  group: 'bg-green-100 text-green-700',
  discussion: 'bg-primary/10 text-primary',
};

export const Community = () => {
  const { state, dispatch } = useCommunity();
  const { state: authState } = useAuth();
  const user = authState.user;

  const [isDuetLobbyOpen, setIsDuetLobbyOpen] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Duet lobby: real academy members (students & instructors, excluding current user and admins)
  const activePartners = ACADEMY_USERS
    .filter(u => u.role !== 'admin' && u.id !== user.id && u.instrument)
    .map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      instrument: u.instrument,
      level: typeof u.level === 'number' ? `Level ${u.level}` : u.level,
      status: u.status === 'Active' ? 'Available' : u.status === 'On Leave' ? 'Away' : 'In Session',
    }));

  const filteredPosts = state.activeFilter === 'all'
    ? state.posts
    : state.posts.filter(p => p.category === state.activeFilter);

  const handleSubmitPost = () => {
    if (!state.newPostText.trim()) {
      toast.error('Please write something before posting.');
      return;
    }
    dispatch({
      type: 'ADD_POST',
      post: {
        author: user.name,
        role: user.instrument || user.role,
        avatar: user.avatar,
        category: state.newPostCategory,
        content: state.newPostText,
      },
    });
    setIsNewPostOpen(false);
    toast.success('Post published to the community!');
  };

  const handleToggleLike = (postId: string) => {
    dispatch({ type: 'TOGGLE_LIKE', postId });
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      postId,
      comment: {
        author: user.name,
        avatar: user.avatar,
        text: commentText,
        time: 'Just now',
      },
    });
    setCommentText('');
    setOpenCommentId(null);
    toast.success('Comment added!');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast.success('Community link copied to clipboard');
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Academy Community</h1>
          <p className="text-muted-foreground font-medium">Connect and perform with fellow musicians across Botswana.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsDuetLobbyOpen(true)}
            className="bg-secondary text-primary font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg hover:bg-white transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Live Duet
          </button>
          <button
            onClick={() => setIsNewPostOpen(true)}
            className="bg-primary text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl shadow-lg hover:bg-secondary hover:text-primary transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {/* Live Duet Callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary shadow-xl animate-pulse">
              <Video className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-secondary">Live Duet Partner Search</h3>
              <p className="text-white/70 font-bold text-sm">Find someone at your level to practice synchronicity in real-time.</p>
            </div>
          </div>
          <button
            onClick={() => setIsDuetLobbyOpen(true)}
            className="bg-white text-primary font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full shadow-xl hover:bg-secondary transition-all"
          >
            Find a Partner
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {/* Feed Filters */}
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {(['all', 'discussion', 'performance', 'event', 'group'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => dispatch({ type: 'SET_FILTER', filter })}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-border transition-all ${
                state.activeFilter === filter
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-white text-muted-foreground hover:bg-muted'
              }`}
            >
              {CATEGORY_LABELS[filter]}
            </button>
          ))}
        </div>

        {/* New Post Panel */}
        <AnimatePresence>
          {isNewPostOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-border rounded-3xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-sm">{user.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {user.instrument || user.role}
                  </p>
                </div>
              </div>

              <textarea
                className="w-full p-4 bg-muted rounded-2xl border border-border resize-none text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 mb-4"
                rows={3}
                placeholder="Share something with the community..."
                value={state.newPostText}
                onChange={(e) => dispatch({ type: 'SET_NEW_POST_TEXT', text: e.target.value })}
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {(['discussion', 'performance', 'event', 'group'] as PostCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => dispatch({ type: 'SET_NEW_POST_CATEGORY', category: cat })}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                        state.newPostCategory === cat
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground hover:bg-border'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsNewPostOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-primary transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                    <img src={post.avatar} className="w-full h-full object-cover" alt={post.author} />
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      {post.author}
                      {post.category === 'event' && <Calendar className="w-3.5 h-3.5 text-primary" />}
                      {post.category === 'group' && <Users2 className="w-3.5 h-3.5 text-primary" />}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {post.role} · {post.time}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${CATEGORY_COLORS[post.category] || 'bg-primary/10 text-primary'}`}>
                  {CATEGORY_LABELS[post.category]}
                </span>
              </div>

              <p className="text-lg font-medium leading-relaxed mb-6">{post.content}</p>

              {/* Event Card */}
              {post.category === 'event' && post.eventDate && (
                <div className="bg-muted/50 border border-border rounded-2xl p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-border shadow-sm">
                      <span className="text-[8px] font-black uppercase text-primary">Event</span>
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary">{post.eventDate}</p>
                      {post.eventLocation && (
                        <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" /> {post.eventLocation}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('Ticket reserved!')}
                    className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                  >
                    Reserve Seat
                  </button>
                </div>
              )}

              {/* Group Card */}
              {post.category === 'group' && post.groupMembers && (
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/150?u=group${i}`} alt="member" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-black text-green-800">{post.groupMembers} Members</p>
                      <p className="text-[10px] font-bold text-green-700/70">Join this ensemble group</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.info('Membership application sent')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                  >
                    Request Access
                  </button>
                </div>
              )}

              {/* Video Thumbnail */}
              {post.videoThumb && (
                <div className="aspect-video bg-muted rounded-2xl relative overflow-hidden mb-6 group cursor-pointer">
                  <img src={post.videoThumb} className="w-full h-full object-cover opacity-80" alt="Video" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              )}

              {/* Image */}
              {post.imageUrl && !post.videoThumb && (
                <div className="rounded-2xl overflow-hidden mb-6">
                  <img src={post.imageUrl} className="w-full object-cover max-h-64" alt="Post" />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-8 pt-6 border-t border-border">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors group ${post.likedByMe ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${post.likedByMe ? 'fill-current' : 'group-hover:fill-current'}`} />
                  <span className="text-xs font-black">{post.likes}</span>
                </button>
                <button
                  onClick={() => {
                    setOpenCommentId(openCommentId === post.id ? null : post.id);
                    setTimeout(() => commentInputRef.current?.focus(), 100);
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs font-black">{post.comments.length}</span>
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {openCommentId === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-4">
                      {post.comments.map(cmt => (
                        <div key={cmt.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                            <img src={cmt.avatar} alt={cmt.author} className="w-full h-full object-cover" />
                          </div>
                          <div className="bg-muted rounded-2xl px-4 py-3 flex-1">
                            <p className="text-xs font-black mb-1">{cmt.author} <span className="text-muted-foreground font-medium">· {cmt.time}</span></p>
                            <p className="text-sm font-medium">{cmt.text}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-3 pt-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            ref={commentInputRef}
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                            className="flex-1 bg-muted rounded-full px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-border"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 bg-primary text-white rounded-full hover:bg-secondary hover:text-primary transition-all"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center space-y-4 bg-muted/30 rounded-3xl border border-dashed border-border">
            <Music className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
            <p className="font-black text-lg">No posts in this category yet.</p>
            <button
              onClick={() => { setIsNewPostOpen(true); }}
              className="px-6 py-3 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              Be the First to Post
            </button>
          </div>
        )}
      </div>

      {/* Live Duet Lobby Modal */}
      <AnimatePresence>
        {isDuetLobbyOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDuetLobbyOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="bg-primary p-8 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Live Duet Lobby</h2>
                  <p className="text-white/70 font-medium italic">Synchronized Practice Room · Botswana Central</p>
                </div>
                <button onClick={() => setIsDuetLobbyOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="bg-muted p-6 rounded-3xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary shadow-lg">
                      <Zap className="w-6 h-6 fill-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Your Status</p>
                      <p className="text-lg font-black text-primary">Searching for Partner...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Available Musicians</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {activePartners.map((partner, i) => (
                      <div key={partner.id || i} className="flex items-center justify-between p-6 bg-white border border-border rounded-3xl hover:border-primary/20 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden">
                            <img src={partner.avatar || `https://i.pravatar.cc/150?u=${partner.name}`} alt={partner.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold">{partner.name}</p>
                              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">{partner.level}</span>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">{partner.instrument}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            partner.status === 'Available' ? 'text-green-500' :
                            partner.status === 'Away' ? 'text-blue-400' : 'text-amber-500'
                          }`}>
                            {partner.status}
                          </span>
                          <button
                            disabled={partner.status !== 'Available'}
                            onClick={() => toast.success(`Request sent to ${partner.name}`, { description: 'Establishing peer-to-peer connection...' })}
                            className={`p-3 rounded-xl transition-all ${
                              partner.status === 'Available'
                                ? 'bg-primary text-white hover:bg-secondary hover:text-primary shadow-lg'
                                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                            }`}
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 p-6 bg-secondary/10 rounded-3xl border border-secondary/20">
                  <div className="flex items-center gap-4">
                    <Music className="w-6 h-6 text-primary" />
                    <p className="text-xs font-bold text-primary italic">"Music is the tool that can build a kingdom."</p>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 group">
                    Invite Friend <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
