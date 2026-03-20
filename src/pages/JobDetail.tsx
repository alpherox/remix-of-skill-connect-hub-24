import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, ArrowLeft, Bookmark, BookmarkCheck, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_postings").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: isSaved } = useQuery({
    queryKey: ["saved-job", id, user?.id],
    enabled: !!user && !!id,
    queryFn: async () => {
      const { data } = await supabase.from("saved_jobs").select("id").eq("user_id", user!.id).eq("job_id", id!);
      return data && data.length > 0;
    },
  });

  const { data: hasApplied } = useQuery({
    queryKey: ["application", id, user?.id],
    enabled: !!user && !!id,
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("id").eq("user_id", user!.id).eq("job_id", id!);
      return data && data.length > 0;
    },
  });

  const toggleSave = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Login required");
      if (isSaved) {
        await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", id!);
      } else {
        await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: id! });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-job", id] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success(isSaved ? "Removed from saved" : "Job saved");
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Login required");
      let resumeUrl: string | null = null;
      if (resumeFile) {
        const path = `${user.id}/${Date.now()}_${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage.from("resumes").upload(path, resumeFile);
        if (uploadError) throw uploadError;
        resumeUrl = path;
      }
      const { error } = await supabase.from("applications").insert({
        job_id: id!,
        user_id: user.id,
        cover_letter: coverLetter || null,
        resume_url: resumeUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      toast.success("Application submitted!");
      setApplyOpen(false);
      setCoverLetter("");
      setResumeFile(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const timeAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-40 mb-8" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Job not found</h1>
          <Button asChild><Link to="/jobs">Back to Jobs</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <Link to="/jobs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-card mb-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                  <p className="text-lg text-muted-foreground">{job.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  {user && (
                    <Button variant="outline" onClick={() => toggleSave.mutate()}>
                      {isSaved ? <BookmarkCheck className="w-4 h-4 mr-2 text-primary fill-primary" /> : <Bookmark className="w-4 h-4 mr-2" />}
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                  )}
                  {hasApplied ? (
                    <Button variant="outline" disabled>Applied ✓</Button>
                  ) : (
                    <Button variant="hero" onClick={() => user ? setApplyOpen(true) : toast.error("Please login to apply")}>
                      <Send className="w-4 h-4 mr-2" /> Apply Now
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                {job.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</span>}
                {job.job_type && <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{job.job_type}</span>}
                {job.salary_range && <span className="flex items-center gap-2">₱ {job.salary_range}</span>}
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />Posted {timeAgo(job.created_at)}</span>
              </div>
              {job.required_skills && job.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.required_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{skill}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                {job.description || "No description provided."}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Apply for {job.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cover Letter</label>
              <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit..." rows={5} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setApplyOpen(false)}>Cancel</Button>
              <Button variant="hero" className="flex-1" onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
                {applyMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default JobDetail;
