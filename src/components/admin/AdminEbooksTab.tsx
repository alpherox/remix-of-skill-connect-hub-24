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

interface EbookForm {
  title: string; author: string; description: string; price: string;
  cover_url: string; pdf_url: string; category: string; tags: string;
  is_free: boolean; is_featured: boolean; is_published: boolean;
}

const emptyForm: EbookForm = {
  title: "", author: "", description: "", price: "0", cover_url: "", pdf_url: "",
  category: "", tags: "", is_free: false, is_featured: false, is_published: true,
};

export function AdminEbooksTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<EbookForm>(emptyForm);

  const { data: ebooks = [], isLoading } = useQuery({
    queryKey: ["admin-ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ebooks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (f: EbookForm & { id?: string }) => {
      const payload = {
        title: f.title, author: f.author, description: f.description || null,
        price: parseFloat(f.price) || 0, cover_url: f.cover_url || null, pdf_url: f.pdf_url || null,
        category: f.category || null, tags: f.tags ? f.tags.split(",").map(s => s.trim()) : [],
        is_free: f.is_free, is_featured: f.is_featured, is_published: f.is_published,
      };
      if (f.id) {
        const { error } = await supabase.from("ebooks").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ebooks").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-ebooks"] }); toast.success(editId ? "Updated" : "Created"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("ebooks").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-ebooks"] }); toast.success("Deleted"); },
  });

  const close = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const edit = (e: any) => {
    setEditId(e.id);
    setForm({ title: e.title, author: e.author, description: e.description || "", price: String(e.price),
      cover_url: e.cover_url || "", pdf_url: e.pdf_url || "", category: e.category || "",
      tags: (e.tags || []).join(", "), is_free: e.is_free, is_featured: e.is_featured, is_published: e.is_published });
    setOpen(true);
  };
  const u = (k: keyof EbookForm, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Ebooks ({ebooks.length})</h2>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Ebook
          </Button>
        </div>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : ebooks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No ebooks yet.</p>
        ) : (
          <div className="space-y-3">
            {ebooks.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{e.title}</h4>
                    {e.is_featured && <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-xs font-medium">Featured</span>}
                    {e.is_free && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Free</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{e.author} • ₱{e.price}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-1 hover:bg-muted rounded" onClick={() => edit(e)}><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1 hover:bg-destructive/10 rounded" onClick={() => del.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editId ? "Edit Ebook" : "New Ebook"}</DialogTitle></DialogHeader>
          <form onSubmit={(ev) => { ev.preventDefault(); if (!form.title || !form.author) { toast.error("Title and author required"); return; } upsert.mutate({ ...form, id: editId ?? undefined }); }} className="space-y-4 mt-2">
            <div><label className="text-sm font-medium">Title *</label><Input value={form.title} onChange={ev => u("title", ev.target.value)} /></div>
            <div><label className="text-sm font-medium">Author *</label><Input value={form.author} onChange={ev => u("author", ev.target.value)} /></div>
            <div><label className="text-sm font-medium">Price (₱)</label><Input type="number" value={form.price} onChange={ev => u("price", ev.target.value)} /></div>
            <div><label className="text-sm font-medium">Category</label><Input value={form.category} onChange={ev => u("category", ev.target.value)} /></div>
            <div><label className="text-sm font-medium">Tags (comma-separated)</label><Input value={form.tags} onChange={ev => u("tags", ev.target.value)} /></div>
            <div><label className="text-sm font-medium">Cover Image URL</label><Input value={form.cover_url} onChange={ev => u("cover_url", ev.target.value)} /></div>
            <div><label className="text-sm font-medium">PDF URL</label><Input value={form.pdf_url} onChange={ev => u("pdf_url", ev.target.value)} /></div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={ev => u("description", ev.target.value)} rows={3} /></div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_free} onChange={ev => u("is_free", ev.target.checked)} /> Free</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={ev => u("is_featured", ev.target.checked)} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={ev => u("is_published", ev.target.checked)} /> Published</label>
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
