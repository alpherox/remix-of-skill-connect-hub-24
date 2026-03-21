import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PlanForm {
  name: string; price: string; billing_cycle: string; features: string; is_highlighted: boolean; is_active: boolean; sort_order: string;
}
const emptyForm: PlanForm = { name: "", price: "0", billing_cycle: "monthly", features: "", is_highlighted: false, is_active: true, sort_order: "0" };

export function AdminPricingTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanForm>(emptyForm);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_plans").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (f: PlanForm & { id?: string }) => {
      const payload = {
        name: f.name, price: parseFloat(f.price) || 0, billing_cycle: f.billing_cycle,
        features: f.features ? f.features.split("\n").map(s => s.trim()).filter(Boolean) : [],
        is_highlighted: f.is_highlighted, is_active: f.is_active, sort_order: parseInt(f.sort_order) || 0,
      };
      if (f.id) {
        const { error } = await supabase.from("pricing_plans").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pricing_plans").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-pricing"] }); toast.success(editId ? "Updated" : "Created"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("pricing_plans").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-pricing"] }); toast.success("Deleted"); },
  });

  const close = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const edit = (p: any) => {
    setEditId(p.id);
    setForm({ name: p.name, price: String(p.price), billing_cycle: p.billing_cycle || "monthly",
      features: (p.features || []).join("\n"), is_highlighted: p.is_highlighted, is_active: p.is_active, sort_order: String(p.sort_order || 0) });
    setOpen(true);
  };
  const u = (k: keyof PlanForm, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Pricing Plans ({plans.length})</h2>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Plan
          </Button>
        </div>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : plans.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pricing plans yet.</p>
        ) : (
          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{p.name}</h4>
                    {p.is_highlighted && <Crown className="w-4 h-4 text-amber-500" />}
                    {!p.is_active && <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">Inactive</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">₱{p.price}/{p.billing_cycle} • {(p.features || []).length} features</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-1 hover:bg-muted rounded" onClick={() => edit(p)}><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1 hover:bg-destructive/10 rounded" onClick={() => del.mutate(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editId ? "Edit Plan" : "New Plan"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); if (!form.name) { toast.error("Name required"); return; } upsert.mutate({ ...form, id: editId ?? undefined }); }} className="space-y-4 mt-2">
            <div><label className="text-sm font-medium">Plan Name *</label><Input value={form.name} onChange={e => u("name", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">Price (₱)</label><Input type="number" value={form.price} onChange={e => u("price", e.target.value)} /></div>
              <div>
                <label className="text-sm font-medium">Billing Cycle</label>
                <select value={form.billing_cycle} onChange={e => u("billing_cycle", e.target.value)} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm">
                  <option value="monthly">Monthly</option><option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div><label className="text-sm font-medium">Sort Order</label><Input type="number" value={form.sort_order} onChange={e => u("sort_order", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Features (one per line)</label><Textarea value={form.features} onChange={e => u("features", e.target.value)} rows={5} placeholder="Feature 1&#10;Feature 2" /></div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_highlighted} onChange={e => u("is_highlighted", e.target.checked)} /> Highlighted (Most Popular)</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => u("is_active", e.target.checked)} /> Active</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={close}>Cancel</Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : editId ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
