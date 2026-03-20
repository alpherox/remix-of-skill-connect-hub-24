import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Briefcase, BookOpen, Bell, FileText, Bookmark, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, loading: authLoading, userRole } = useAuth();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      return data;
    },
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["my-applications", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, job_postings(title, company)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: savedJobs = [] } = useQuery({
    queryKey: ["my-saved-jobs", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, job_postings(title, company, location)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const statusColor = (s: string) => {
    switch (s) {
      case "shortlisted": return "bg-primary/10 text-primary";
      case "rejected": return "bg-destructive/10 text-destructive";
      case "reviewed": return "bg-amber-light text-amber-warm";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-surface-sunken">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name || "there"}! 👋
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your career journey.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> My Applications
                </h2>
                <span className="text-sm text-muted-foreground">{applications.length} recent</span>
              </div>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-3">No applications yet</p>
                  <Button variant="hero" size="sm" asChild><Link to="/jobs">Browse Jobs</Link></Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
                      <div>
                        <div className="font-medium text-foreground">{app.job_postings?.title}</div>
                        <div className="text-sm text-muted-foreground">{app.job_postings?.company}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Saved Jobs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-primary" /> Saved Jobs
                </h2>
                <span className="text-sm text-muted-foreground">{savedJobs.length} saved</span>
              </div>
              {savedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-3">No saved jobs yet</p>
                  <Button variant="hero" size="sm" asChild><Link to="/jobs">Explore Jobs</Link></Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedJobs.map((s: any) => (
                    <Link key={s.id} to={`/jobs/${s.job_id}`} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken hover:bg-muted transition-colors">
                      <div>
                        <div className="font-medium text-foreground">{s.job_postings?.title}</div>
                        <div className="text-sm text-muted-foreground">{s.job_postings?.company} • {s.job_postings?.location}</div>
                      </div>
                      <Bookmark className="w-4 h-4 text-primary fill-primary" />
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link to="/jobs" className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all text-center">
              <Briefcase className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-semibold text-foreground">Browse Jobs</h3>
              <p className="text-sm text-muted-foreground">Find your next opportunity</p>
            </Link>
            <Link to="/marketplace" className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-semibold text-foreground">Learn & Grow</h3>
              <p className="text-sm text-muted-foreground">Courses & ebooks</p>
            </Link>
            <Link to="/profile" className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all text-center">
              <Bell className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-semibold text-foreground">My Profile</h3>
              <p className="text-sm text-muted-foreground">Update your info</p>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
