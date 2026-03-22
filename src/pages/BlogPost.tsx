import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

const BlogPost = () => {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{post?.title || "Blog"} – SkillBridge</title>
        <meta name="description" content={post?.content?.substring(0, 160) || ""} />
        <meta property="og:title" content={post?.title || ""} />
        <meta property="og:image" content={post?.cover_url || ""} />
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {isLoading ? (
            <div>
              <Skeleton className="h-64 w-full rounded-2xl mb-8" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-40 mb-8" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : !post ? (
            <p className="text-center text-muted-foreground py-12">Post not found.</p>
          ) : (
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {post.cover_url && (
                <img src={post.cover_url} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" />
              )}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
                {post.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </span>
                )}
                {post.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.category}</span>
                )}
                <Button variant="ghost" size="sm" onClick={copyLink} className="gap-1">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </motion.article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;