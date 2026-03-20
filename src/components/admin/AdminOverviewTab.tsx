import { motion } from "framer-motion";
import { Users, Briefcase, FileText, BookOpen, FileImage, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminOverviewTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, jobs, applications, courses, ebooks] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("job_postings").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("ebooks").select("id", { count: "exact", head: true }),
      ]);
      return {
        users: profiles.count || 0,
        jobs: jobs.count || 0,
        applications: applications.count || 0,
        courses: courses.count || 0,
        ebooks: ebooks.count || 0,
      };
    },
  });

  const statCards = [
    { label: "Total Users", value: stats?.users, icon: Users },
    { label: "Active Jobs", value: stats?.jobs, icon: Briefcase },
    { label: "Applications", value: stats?.applications, icon: FileText },
    { label: "Courses", value: stats?.courses, icon: BookOpen },
    { label: "Ebooks", value: stats?.ebooks, icon: FileImage },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="p-6 rounded-2xl bg-card border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-display text-3xl font-bold text-foreground">{value?.toLocaleString()}</div>
            )}
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
