import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, BookOpen, PlayCircle, Headphones, Star, Filter, GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContentType = "all" | "ebook" | "video" | "podcast" | "course";

const categories: { icon: typeof BookOpen; label: string; value: ContentType }[] = [
  { icon: BookOpen, label: "All", value: "all" },
  { icon: BookOpen, label: "Ebooks", value: "ebook" },
  { icon: PlayCircle, label: "Videos", value: "video" },
  { icon: Headphones, label: "Podcasts", value: "podcast" },
  { icon: GraduationCap, label: "Courses", value: "course" },
];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState<ContentType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["marketplace-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredItems = items?.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.type === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Curated content to accelerate your personal and professional growth.</p>
          </motion.div>

          {/* Search & Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, ebooks, podcasts..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map(({ icon: Icon, label, value }) => (
                <button
                  key={value}
                  onClick={() => setActiveCategory(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    activeCategory === value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredItems?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No items found. Try adjusting your filters.</p>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.03 }}
                className="group bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-video">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium capitalize">
                    {product.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{product.description}</p>
                  <p className="text-sm text-muted-foreground mb-3">by {product.author}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-warm fill-amber-warm" />
                        <span className="text-sm font-medium">{Number(product.rating).toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.review_count})</span>
                    </div>
                    <span className="font-display font-semibold text-primary">
                      {Number(product.price) === 0 ? "Free" : `$${Number(product.price)}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
