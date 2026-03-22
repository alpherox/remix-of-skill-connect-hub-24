import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedCoursesSection() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_featured", true)
        .eq("is_published", true)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured <span className="text-gradient">Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground">Upskill with expert-led content.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No featured courses yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/courses/${course.id}`}
                  className="block rounded-2xl bg-card border border-border shadow-card overflow-hidden hover:shadow-glow transition-all group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    {course.is_free && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">Free</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-foreground line-clamp-1 mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-warm fill-amber-warm" />
                        <span className="text-sm font-medium">{course.rating || 0}</span>
                      </div>
                      <span className="font-display font-semibold text-primary">
                        {course.is_free ? "Free" : `₱${course.price}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
