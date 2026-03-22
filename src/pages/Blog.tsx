import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";

const Blog = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Blog & Resources – SkillBridge</title>
        <meta name="description" content="Insights, tips, and strategies for career growth." />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">The SkillBridge <span className="text-gradient">Blog</span></h1>
            <p className="text-lg text-muted-foreground">Insights, tips, and strategies for career growth and personal development.</p>
          </motion.div>

          {isLoading ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No blog posts yet. Check back soon!</p>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {posts.map((post: any, index: number) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={`/blog/${post.id}`} className="block p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all group">
                    {post.cover_url && (
                      <img src={post.cover_url} alt={post.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                    )}
                    {post.category && (
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.category}</span>
                    )}
                    <h2 className="font-display text-xl font-semibold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                    <p className="text-muted-foreground mb-4">{post.content?.substring(0, 150)}...</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : ""}
                      </span>
                      <span className="flex items-center gap-1 text-primary font-medium">Read More <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;