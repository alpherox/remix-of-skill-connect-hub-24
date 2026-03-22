import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Briefcase, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedJobsSection() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-24 bg-surface-sunken">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured <span className="text-gradient">Jobs</span>
          </h2>
          <p className="text-lg text-muted-foreground">Top opportunities handpicked for you.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No featured jobs yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/jobs/${job.id}`}
                  className="block p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {job.logo_url ? (
                      <img src={job.logo_url} alt={job.company} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-semibold text-foreground line-clamp-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.location && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    )}
                    {job.job_type && (
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{job.job_type}</span>
                    )}
                    {job.salary_range && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{job.salary_range}</span>
                    )}
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
