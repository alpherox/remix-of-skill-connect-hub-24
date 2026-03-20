import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminSettingsTab() {
  const qc = useQueryClient();
  const [settings, setSettings] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((s) => { map[s.key] = s.value || ""; });
      setSettings(map);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site-settings"] }); toast.success("Settings saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const fields = [
    { key: "hero_headline", label: "Hero Headline" },
    { key: "hero_subheadline", label: "Hero Subheadline" },
    { key: "hero_cta_text", label: "Hero CTA Button Text" },
    { key: "stats_jobs", label: "Stats: Jobs Count" },
    { key: "stats_users", label: "Stats: Users Count" },
    { key: "stats_courses", label: "Stats: Courses Count" },
    { key: "stats_placements", label: "Stats: Placements Count" },
  ];

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Site Settings</h2>
        <div className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
              <Input
                value={settings[key] || ""}
                onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
              />
            </div>
          ))}
          <Button variant="hero" onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {save.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
