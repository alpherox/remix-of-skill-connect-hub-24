import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminUsersTab() {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const getRoles = (userId: string) => roles.filter((r) => r.user_id === userId).map((r) => r.role);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">User Management ({profiles.length})</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-surface-sunken transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{p.full_name || "—"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {getRoles(p.user_id).map((role) => (
                          <span key={role} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            role === "admin" ? "bg-destructive/10 text-destructive"
                            : role === "employer" ? "bg-amber-light text-amber-warm"
                            : "bg-muted text-muted-foreground"
                          }`}>{role}</span>
                        ))}
                        {getRoles(p.user_id).length === 0 && <span className="text-sm text-muted-foreground">user</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
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
