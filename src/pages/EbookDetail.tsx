import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Download, Lock, Star, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const EbookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buying, setBuying] = useState(false);

  const { data: ebook, isLoading } = useQuery({
    queryKey: ["ebook", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("ebooks").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: purchase } = useQuery({
    queryKey: ["purchase", "ebook", id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("purchases")
        .select("id").eq("user_id", user!.id).eq("product_id", id!).eq("product_type", "ebook").eq("status", "completed").maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  const hasPurchased = !!purchase || ebook?.is_free;

  const handleBuy = async () => {
    if (!user) { navigate("/login"); return; }
    setBuying(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: {
          product_id: ebook!.id, product_type: "ebook", price: Number(ebook!.price),
          title: ebook!.title, user_id: user.id,
          success_url: window.location.href, cancel_url: window.location.href,
        },
      });
      if (error) throw error;
      if (data?.url) { window.location.href = data.url; }
      else { toast.error("Could not create payment link"); }
    } catch (e: any) { toast.error(e.message || "Payment failed"); }
    finally { setBuying(false); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen"><Navbar />
        <main className="pt-24 pb-16"><div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Skeleton className="h-10 w-2/3" /><Skeleton className="h-80 w-64 rounded-2xl" /><Skeleton className="h-32 w-full" />
        </div></main><Footer /></div>
    );
  }

  if (!ebook) {
    return <div className="min-h-screen"><Navbar /><main className="pt-24 pb-16"><div className="container mx-auto px-4 text-center py-20"><p className="text-lg text-muted-foreground">Ebook not found.</p></div></main><Footer /></div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-muted">
                  {ebook.cover_url ? (
                    <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-16 h-16 text-muted-foreground" /></div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">{ebook.title}</h1>
                  <p className="text-lg text-muted-foreground mb-1">by {ebook.author}</p>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    {ebook.category && <span className="text-sm">{ebook.category}</span>}
                    {ebook.rating && <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 text-amber-500 fill-amber-500" />{Number(ebook.rating).toFixed(1)}</span>}
                    {ebook.is_free && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">Free</span>}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-3xl font-bold text-foreground">
                      {ebook.is_free ? "Free" : `₱${Number(ebook.price).toLocaleString()}`}
                    </span>
                  </div>
                  {hasPurchased && ebook.pdf_url ? (
                    <Button variant="hero" size="lg" className="w-full gap-2" asChild>
                      <a href={ebook.pdf_url} target="_blank" rel="noopener noreferrer"><Download className="w-5 h-5" /> Download PDF</a>
                    </Button>
                  ) : hasPurchased ? (
                    <Button variant="hero" size="lg" className="w-full" disabled>Purchased — PDF coming soon</Button>
                  ) : (
                    <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleBuy} disabled={buying}>
                      {buying ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> :
                        user ? <><Lock className="w-5 h-5" /> Buy Now</> : "Login to Purchase"}
                    </Button>
                  )}
                </div>

                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">Description</h2>
                  {hasPurchased ? (
                    <p className="text-muted-foreground whitespace-pre-line">{ebook.description}</p>
                  ) : (
                    <div className="relative">
                      <p className="text-muted-foreground whitespace-pre-line line-clamp-4">{ebook.description}</p>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
                      <p className="text-sm text-primary font-medium mt-2">Purchase to read the full description.</p>
                    </div>
                  )}
                </div>

                {ebook.tags && (ebook.tags as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(ebook.tags as string[]).map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EbookDetail;
