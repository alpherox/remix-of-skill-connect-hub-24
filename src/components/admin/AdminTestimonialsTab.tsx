import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AdminTestimonialsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", quote: "", photo_url: "" });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (f: typeof form & { id?: string }) => {
      const payload = { name: f.name, role: f.role || null, quote: f.quote, photo_url: f.photo_url || null };
      if (f.id) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast.success("Saved"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast.success("Deleted"); },
  });

  const close = () => { setOpen(false); setEditId(null); setForm({ name: "", role: "", quote: "", photo_url: "" }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Testimonials ({testimonials.length})</h2>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => { setEditId(null); setForm({ name: "", role: "", quote: "", photo_url: "" }); setOpen(true); }}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
        {testimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No testimonials yet.</p>
        ) : (
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{t.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">{t.quote}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-1 hover:bg-muted rounded" onClick={() => { setEditId(t.id); setForm({ name: t.name, role: t.role || "", quote: t.quote, photo_url: t.photo_url || "" }); setOpen(true); }}><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1 hover:bg-destructive/10 rounded" onClick={() => del.mutate(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">{editId ? "Edit" : "New"} Testimonial</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); if (!form.name || !form.quote) { toast.error("Name and quote required"); return; } upsert.mutate({ ...form, id: editId ?? undefined }); }} className="space-y-4 mt-2">
            <div><label className="text-sm font-medium">Name *</label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Role</label><Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Software Engineer" /></div>
            <div><label className="text-sm font-medium">Photo URL</label><Input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Quote *</label><Textarea value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} rows={3} /></div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={close}>Cancel</Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
