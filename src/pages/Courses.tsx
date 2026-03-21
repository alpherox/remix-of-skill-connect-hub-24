import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, GraduationCap, Clock, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const categories = ["all", ...new Set(courses?.map(c => c.category).filter(Boolean) || [])];

  const filtered = courses?.filter((c) => {
    const matchesCat = categoryFilter === "all" || c.category === categoryFilter;
    const matchesSearch = !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Video Courses</h1>
            <p className="text-muted-foreground">Level up your skills with expert-led courses.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..." className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-5 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-full" /></div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered?.length === 0 && (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No courses yet. Check back soon!</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <Link to={`/courses/${course.id}`} className="group block bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-glow transition-all duration-300">
                  <div className="relative overflow-hidden aspect-video">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center"><GraduationCap className="w-12 h-12 text-muted-foreground" /></div>
                    )}
                    {course.is_free && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Free</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {course.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>}
                        {course.rating && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{Number(course.rating).toFixed(1)}</span>}
                      </div>
                      <span className="font-display font-semibold text-primary">
                        {course.is_free ? "Free" : `₱${Number(course.price).toLocaleString()}`}
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

export default Courses;
