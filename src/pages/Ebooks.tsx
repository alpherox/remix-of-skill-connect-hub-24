import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Search, BookOpen, Star } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Ebooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ebooks").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const categories = ["all", ...new Set(ebooks?.map(e => e.category).filter(Boolean) || [])];

  const filtered = ebooks?.filter((e) => {
    const matchesCat = categoryFilter === "all" || e.category === categoryFilter;
    const matchesSearch = !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Ebooks</h1>
            <p className="text-muted-foreground">Expand your knowledge with our curated ebook library.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ebooks..." className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full border text-sm capitalize transition-all ${categoryFilter === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"}`}>
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </motion.div>

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-4 space-y-2"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered?.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No ebooks yet. Check back soon!</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered?.map((ebook, i) => (
              <motion.div key={ebook.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <Link to={`/ebooks/${ebook.id}`} className="group block bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-glow transition-all duration-300">
                  <div className="relative overflow-hidden aspect-[3/4]">
                    {ebook.cover_url ? (
                      <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center"><BookOpen className="w-12 h-12 text-muted-foreground" /></div>
                    )}
                    {ebook.is_free && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Free</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">{ebook.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{ebook.author}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{ebook.description}</p>
                    <div className="flex items-center justify-between">
                      {ebook.rating ? <span className="flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{Number(ebook.rating).toFixed(1)}</span> : <span />}
                      <span className="font-display font-semibold text-primary">
                        {ebook.is_free ? "Free" : `₱${Number(ebook.price).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ebooks;
