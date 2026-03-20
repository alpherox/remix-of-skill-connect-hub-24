import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const statusOptions = ["pending", "reviewed", "shortlisted", "rejected"];

export function AdminApplicationsTab() {
  const qc = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, job_postings(title, company)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles-for-apps"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id, full_name");
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-applications"] }); toast.success("Status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const getName = (userId: string) => profiles.find((p) => p.user_id === userId)?.full_name || "Unknown";

  const statusColor = (s: string) => {
    switch (s) {
      case "shortlisted": return "bg-primary/10 text-primary";
      case "rejected": return "bg-destructive/10 text-destructive";
      case "reviewed": return "bg-amber-light text-amber-warm";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Applications ({applications.length})</h2>
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Applicant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app: any) => (
                  <tr key={app.id} className="border-b border-border hover:bg-surface-sunken transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{getName(app.user_id)}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {app.job_postings?.title} <span className="text-xs">at {app.job_postings?.company}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus.mutate({ id: app.id, status: e.target.value })}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColor(app.status)}`}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
