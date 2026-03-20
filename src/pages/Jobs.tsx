import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Filter, MapPin, Clock, DollarSign, ArrowRight, Search, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Jobs = () => {
  const [search, setSearch] = useState("");

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      (j.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const timeAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Job Matches</h1>
            <p className="text-muted-foreground">Personalized opportunities based on your skills and experience.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies, skills..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading jobs...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No jobs found.</div>
          ) : (
            <div className="space-y-4">
              {filtered.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-semibold text-foreground">{job.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-3">{job.company}</p>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {job.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                        )}
                        {job.job_type && (
                          <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.job_type}</span>
                        )}
                        {job.salary_range && (
                          <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary_range}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{timeAgo(job.created_at)}</span>
                      </div>
                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.required_skills.map((skill) => (
                            <span key={skill} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {(job as any).external_link && (
                        <Button variant="outline" asChild>
                          <a href={(job as any).external_link} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View Original
                          </a>
                        </Button>
                      )}
                      <Button variant="hero" className="gap-2" asChild>
                        {(job as any).external_link ? (
                          <a href={(job as any).external_link} target="_blank" rel="noopener noreferrer">
                            Apply <ArrowRight className="w-4 h-4" />
                          </a>
                        ) : (
                          <span>Apply <ArrowRight className="w-4 h-4" /></span>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12 p-8 rounded-2xl bg-gradient-hero text-center">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Want better matches?</h3>
            <p className="text-muted-foreground mb-4">Upload your resume to unlock AI-powered job recommendations.</p>
            <Button variant="hero" asChild><Link to="/signup">Upload Resume</Link></Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
