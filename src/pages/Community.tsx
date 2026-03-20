import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, MessageSquare, ThumbsUp, Users, TrendingUp, Award } from "lucide-react";

const topics = [
  { label: "All Topics", active: true },
  { label: "Career Advice", active: false },
  { label: "Tech Skills", active: false },
  { label: "Entrepreneurship", active: false },
  { label: "Productivity", active: false },
];

const discussions = [
  {
    id: 1,
    title: "How to negotiate a 30% salary increase - my story",
    author: "Marcus J.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    topic: "Career Advice",
    replies: 47,
    likes: 234,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "Best resources for learning system design in 2024?",
    author: "Emily W.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    topic: "Tech Skills",
    replies: 32,
    likes: 156,
    timeAgo: "5 hours ago",
  },
  {
    id: 3,
    title: "From side project to $10k MRR - lessons learned",
    author: "David K.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    topic: "Entrepreneurship",
    replies: 89,
    likes: 445,
    timeAgo: "1 day ago",
  },
  {
    id: 4,
    title: "My morning routine that 3x'd my productivity",
    author: "Sarah C.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    topic: "Productivity",
    replies: 56,
    likes: 312,
    timeAgo: "2 days ago",
  },
];

const topContributors = [
  { name: "Marcus J.", points: 2450, badge: "Expert" },
  { name: "Emily W.", points: 1890, badge: "Pro" },
  { name: "David K.", points: 1654, badge: "Pro" },
];

const Community = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Community
                </h1>
                <p className="text-muted-foreground">
                  Connect, learn, and grow with fellow professionals.
                </p>
              </motion.div>

              {/* Search & Topics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 mb-8"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {topics.map(({ label, active }) => (
                    <button
                      key={label}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Create Post */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-4 rounded-2xl bg-card border border-border mb-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <input
                    type="text"
                    placeholder="Start a discussion..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <Button variant="hero" size="sm">Post</Button>
                </div>
              </motion.div>

              {/* Discussions */}
              <div className="space-y-4">
                {discussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={discussion.avatar}
                        alt={discussion.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {discussion.topic}
                          </span>
                          <span className="text-xs text-muted-foreground">{discussion.timeAgo}</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{discussion.author}</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {discussion.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {discussion.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:w-80 space-y-6"
            >
              {/* Stats */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-display font-semibold text-foreground mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Members
                    </span>
                    <span className="font-semibold text-foreground">12,453</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Discussions
                    </span>
                    <span className="font-semibold text-foreground">3,891</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Active Today
                    </span>
                    <span className="font-semibold text-foreground">234</span>
                  </div>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-display font-semibold text-foreground mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {topContributors.map((contributor, index) => (
                    <div key={contributor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{contributor.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-warm" />
                        <span className="text-sm text-muted-foreground">{contributor.badge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
