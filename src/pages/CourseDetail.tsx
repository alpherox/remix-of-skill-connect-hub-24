import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap, Clock, Star, PlayCircle, Lock, CheckCircle, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buying, setBuying] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: purchase } = useQuery({
    queryKey: ["purchase", "course", id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("purchases")
        .select("id").eq("user_id", user!.id).eq("product_id", id!).eq("product_type", "course").eq("status", "completed").maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  const hasPurchased = !!purchase || course?.is_free;

  const handleBuy = async () => {
    if (!user) { navigate("/login"); return; }
    setBuying(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: {
          product_id: course!.id, product_type: "course", price: Number(course!.price),
          title: course!.title, user_id: user.id,
          success_url: window.location.href, cancel_url: window.location.href,
        },
      });
      if (error) throw error;
      if (data?.url) { window.location.href = data.url; }
      else { toast.error("Could not create payment link"); }
    } catch (e: any) { toast.error(e.message || "Payment failed"); }
    finally { setBuying(false); }
  };

  const chapters: string[] = Array.isArray(course?.chapters) ? (course.chapters as string[]) : [];

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen"><Navbar />
        <main className="pt-24 pb-16"><div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Skeleton className="h-10 w-2/3" /><Skeleton className="aspect-video w-full rounded-2xl" /><Skeleton className="h-6 w-1/3" /><Skeleton className="h-32 w-full" />
        </div></main><Footer /></div>
    );
  }

  if (!course) {
    return <div className="min-h-screen"><Navbar /><main className="pt-24 pb-16"><div className="container mx-auto px-4 text-center py-20"><p className="text-lg text-muted-foreground">Course not found.</p></div></main><Footer /></div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{course.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-6 flex-wrap">
              <span>{course.instructor}</span>
              {course.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>}
              {course.rating && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" />{Number(course.rating).toFixed(1)}</span>}
              {course.is_free && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">Free</span>}
            </div>

            {/* Video */}
            {course.video_url && hasPurchased ? (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-black">
                <iframe src={getYouTubeEmbedUrl(course.video_url)} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            ) : course.thumbnail_url ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                {!hasPurchased && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center text-white">
                      <Lock className="w-12 h-12 mx-auto mb-3" />
                      <p className="text-lg font-semibold">Unlock for ₱{Number(course.price).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">About this course</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{course.description}</p>
                </div>

                {chapters.length > 0 && (
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-3">Chapters</h2>
                    <div className="space-y-2">
                      {chapters.map((ch, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                          {hasPurchased ? <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" /> : <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                          <span className="text-sm">{typeof ch === 'string' ? ch : String(ch)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {course.instructor_bio && (
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-3">About the Instructor</h2>
                    <p className="text-muted-foreground">{course.instructor_bio}</p>
                  </div>
                )}
              </div>

              <div>
                <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border shadow-card">
                  <div className="text-center mb-4">
                    <span className="font-display text-3xl font-bold text-foreground">
                      {course.is_free ? "Free" : `₱${Number(course.price).toLocaleString()}`}
                    </span>
                  </div>
                  {hasPurchased ? (
                    <Button variant="hero" size="lg" className="w-full gap-2">
                      <PlayCircle className="w-5 h-5" /> Continue Learning
                    </Button>
                  ) : (
                    <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleBuy} disabled={buying}>
                      {buying ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> :
                        user ? <><GraduationCap className="w-5 h-5" /> Buy Course</> :
                        "Login to Purchase"}
                    </Button>
                  )}
                  {course.category && <p className="text-sm text-muted-foreground mt-4 text-center">Category: {course.category}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
