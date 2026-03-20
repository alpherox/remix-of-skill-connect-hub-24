import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Search, Bookmark, BookmarkCheck, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Freelance", "Remote", "Internship"];

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: savedJobIds = [] } = useQuery({
    queryKey: ["saved-jobs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data.map((s) => s.job_id);
    },
  });

  const toggleSave = useMutation({
    mutationFn: async (jobId: string) => {
      if (!user) throw new Error("Login required");
      const isSaved = savedJobIds.includes(jobId);
      if (isSaved) {
        await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
      } else {
        await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: jobId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success("Updated saved jobs");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      (j.location || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || j.job_type === selectedType;
    const matchesLocation = !locationFilter || (j.location || "").toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

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
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Job Listings</h1>
            <p className="text-muted-foreground">Find your next opportunity from {jobs.length} active positions.</p>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs, companies, skills..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Location..."
                  className="w-full md:w-48 h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} jobs found</p>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-40 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back soon for new listings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * Math.min(index, 10) }}
                  className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {(job as any).is_featured && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-medium">Featured</span>
                        )}
                        <Link to={`/jobs/${job.id}`} className="font-display text-xl font-semibold text-foreground hover:text-primary transition-colors">
                          {job.title}
                        </Link>
                      </div>
                      <p className="text-muted-foreground mb-3">{job.company}</p>
                      {job.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {job.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
                        {job.job_type && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.job_type}</span>}
                        {job.salary_range && <span className="flex items-center gap-1">₱ {job.salary_range}</span>}
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
                      {user && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSave.mutate(job.id)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {savedJobIds.includes(job.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </Button>
                      )}
                      <Button variant="hero" asChild>
                        <Link to={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
