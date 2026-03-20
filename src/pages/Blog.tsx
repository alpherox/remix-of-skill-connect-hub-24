import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  { title: "10 Skills Employers Are Looking For in 2026", excerpt: "Stay ahead of the curve by mastering these in-demand skills.", date: "Mar 5, 2026", readTime: "5 min", category: "Career Advice" },
  { title: "How AI Is Changing Job Matching Forever", excerpt: "A deep dive into how artificial intelligence is revolutionizing recruitment.", date: "Mar 1, 2026", readTime: "8 min", category: "Technology" },
  { title: "Building a Personal Brand on LinkedIn", excerpt: "Actionable strategies to make your LinkedIn profile stand out.", date: "Feb 25, 2026", readTime: "6 min", category: "Personal Branding" },
  { title: "The Ultimate Guide to Career Pivots", excerpt: "How to successfully transition to a new industry.", date: "Feb 20, 2026", readTime: "10 min", category: "Career Change" },
  { title: "Negotiation Tactics That Actually Work", excerpt: "Proven strategies to land better offers and raises.", date: "Feb 15, 2026", readTime: "7 min", category: "Negotiation" },
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">The SkillBridge <span className="text-gradient">Blog</span></h1>
            <p className="text-lg text-muted-foreground">Insights, tips, and strategies for career growth and personal development.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-6">
            {posts.map((post, index) => (
              <motion.article key={post.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all cursor-pointer group">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.category}</span>
                <h2 className="font-display text-xl font-semibold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <span className="flex items-center gap-1 text-primary font-medium">Read More <ArrowRight className="w-3 h-3" /></span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
