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

interface CourseForm {
  title: string; description: string; price: string; instructor: string;
  instructor_bio: string; category: string; tags: string; video_url: string;
  thumbnail_url: string; duration: string; is_free: boolean; is_featured: boolean; is_published: boolean;
}

const emptyForm: CourseForm = {
  title: "", description: "", price: "0", instructor: "", instructor_bio: "",
  category: "", tags: "", video_url: "", thumbnail_url: "", duration: "",
  is_free: false, is_featured: false, is_published: true,
};

export function AdminCoursesTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (f: CourseForm & { id?: string }) => {
      const payload = {
        title: f.title, description: f.description || null, price: parseFloat(f.price) || 0,
        instructor: f.instructor, instructor_bio: f.instructor_bio || null,
        category: f.category || null, tags: f.tags ? f.tags.split(",").map(s => s.trim()) : [],
        video_url: f.video_url || null, thumbnail_url: f.thumbnail_url || null,
        duration: f.duration || null, is_free: f.is_free, is_featured: f.is_featured, is_published: f.is_published,
      };
      if (f.id) {
        const { error } = await supabase.from("courses").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); toast.success(editId ? "Updated" : "Created"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("courses").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const close = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const edit = (c: any) => {
    setEditId(c.id);
    setForm({ title: c.title, description: c.description || "", price: String(c.price), instructor: c.instructor,
      instructor_bio: c.instructor_bio || "", category: c.category || "", tags: (c.tags || []).join(", "),
      video_url: c.video_url || "", thumbnail_url: c.thumbnail_url || "", duration: c.duration || "",
      is_free: c.is_free, is_featured: c.is_featured, is_published: c.is_published });
    setOpen(true);
  };
  const u = (k: keyof CourseForm, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Courses ({courses.length})</h2>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => { setEditId(null); setForm(emptyForm); setOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : courses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No courses yet.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{c.title}</h4>
                    {c.is_featured && <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-xs font-medium">Featured</span>}
                    {c.is_free && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Free</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{c.instructor} • ₱{c.price} • {c.category || "Uncategorized"}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-1 hover:bg-muted rounded" onClick={() => edit(c)}><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1 hover:bg-destructive/10 rounded" onClick={() => del.mutate(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editId ? "Edit Course" : "New Course"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); if (!form.title || !form.instructor) { toast.error("Title and instructor required"); return; } upsert.mutate({ ...form, id: editId ?? undefined }); }} className="space-y-4 mt-2">
            <div><label className="text-sm font-medium">Title *</label><Input value={form.title} onChange={e => u("title", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Instructor *</label><Input value={form.instructor} onChange={e => u("instructor", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">Price (₱)</label><Input type="number" value={form.price} onChange={e => u("price", e.target.value)} /></div>
              <div><label className="text-sm font-medium">Duration</label><Input value={form.duration} onChange={e => u("duration", e.target.value)} placeholder="e.g. 4 hours" /></div>
            </div>
            <div><label className="text-sm font-medium">Category</label><Input value={form.category} onChange={e => u("category", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Tags (comma-separated)</label><Input value={form.tags} onChange={e => u("tags", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Video URL</label><Input value={form.video_url} onChange={e => u("video_url", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Thumbnail URL</label><Input value={form.thumbnail_url} onChange={e => u("thumbnail_url", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={e => u("description", e.target.value)} rows={3} /></div>
            <div><label className="text-sm font-medium">Instructor Bio</label><Textarea value={form.instructor_bio} onChange={e => u("instructor_bio", e.target.value)} rows={2} /></div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_free} onChange={e => u("is_free", e.target.checked)} /> Free</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => u("is_featured", e.target.checked)} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e => u("is_published", e.target.checked)} /> Published</label>
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
