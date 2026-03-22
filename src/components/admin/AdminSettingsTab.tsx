import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const settingsGroups = [
  {
    title: "General",
    fields: [
      { key: "site_name", label: "Site Name" },
      { key: "site_logo_url", label: "Logo URL" },
      { key: "contact_email", label: "Contact Email" },
      { key: "footer_text", label: "Footer Text" },
    ],
  },
  {
    title: "Hero Section",
    fields: [
      { key: "hero_headline", label: "Headline" },
      { key: "hero_subheadline", label: "Subheadline" },
      { key: "hero_cta_text", label: "CTA Button Text" },
    ],
  },
  {
    title: "Stats",
    fields: [
      { key: "stats_jobs", label: "Jobs Count" },
      { key: "stats_users", label: "Users Count" },
      { key: "stats_courses", label: "Courses Count" },
      { key: "stats_placements", label: "Placements Count" },
    ],
  },
  {
    title: "Social Links",
    fields: [
      { key: "social_facebook", label: "Facebook URL" },
      { key: "social_instagram", label: "Instagram URL" },
      { key: "social_linkedin", label: "LinkedIn URL" },
    ],
  },
  {
    title: "How It Works — Step 1",
    fields: [
      { key: "how_it_works_step1_title", label: "Title" },
      { key: "how_it_works_step1_desc", label: "Description" },
    ],
  },
  {
    title: "How It Works — Step 2",
    fields: [
      { key: "how_it_works_step2_title", label: "Title" },
      { key: "how_it_works_step2_desc", label: "Description" },
    ],
  },
  {
    title: "How It Works — Step 3",
    fields: [
      { key: "how_it_works_step3_title", label: "Title" },
      { key: "how_it_works_step3_desc", label: "Description" },
    ],
  },
  {
    title: "How It Works — Step 4",
    fields: [
      { key: "how_it_works_step4_title", label: "Title" },
      { key: "how_it_works_step4_desc", label: "Description" },
    ],
  },
];

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

  // Blog management
  const [blogOpen, setBlogOpen] = useState(false);
  const [blogEditId, setBlogEditId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState({ title: "", content: "", cover_url: "", category: "", tags: "", published_at: "" });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const blogUpsert = useMutation({
    mutationFn: async (f: typeof blogForm & { id?: string }) => {
      const payload = {
        title: f.title,
        content: f.content || null,
        cover_url: f.cover_url || null,
        category: f.category || null,
        tags: f.tags ? f.tags.split(",").map(t => t.trim()) : [],
        published_at: f.published_at || null,
      };
      if (f.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog-posts"] }); toast.success("Blog post saved"); setBlogOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const blogDel = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog-posts"] }); toast.success("Deleted"); },
  });

  // Quiz management
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizEditId, setQuizEditId] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState({ question_text: "", options: "", recommended_content_ids: "" });

  const { data: quizQuestions = [] } = useQuery({
    queryKey: ["admin-quiz-questions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quiz_questions").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const quizUpsert = useMutation({
    mutationFn: async (f: typeof quizForm & { id?: string }) => {
      const payload = {
        question_text: f.question_text,
        options: f.options ? f.options.split("\n").filter(Boolean) : [],
        recommended_content_ids: f.recommended_content_ids ? f.recommended_content_ids.split(",").map(t => t.trim()) : [],
      };
      if (f.id) {
        const { error } = await supabase.from("quiz_questions").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("quiz_questions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] }); toast.success("Saved"); setQuizOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const quizDel = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("quiz_questions").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-quiz-questions"] }); toast.success("Deleted"); },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Site Settings */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Site Settings</h2>
        <div className="space-y-8">
          {settingsGroups.map(group => (
            <div key={group.title}>
              <h3 className="font-display text-sm font-semibold text-primary mb-3 uppercase tracking-wider">{group.title}</h3>
              <div className="space-y-3">
                {group.fields.map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
                    <Input
                      value={settings[key] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button variant="hero" onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {save.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Blog Posts ({blogPosts.length})</h2>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => { setBlogEditId(null); setBlogForm({ title: "", content: "", cover_url: "", category: "", tags: "", published_at: "" }); setBlogOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Post
          </Button>
        </div>
        {blogPosts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No blog posts yet.</p>
        ) : (
          <div className="space-y-3">
            {blogPosts.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{p.title}</h4>
                  <p className="text-sm text-muted-foreground">{p.published_at ? "Published" : "Draft"} • {p.category || "No category"}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-1 hover:bg-muted rounded" onClick={() => {
                    setBlogEditId(p.id);
                    setBlogForm({ title: p.title, content: p.content || "", cover_url: p.cover_url || "", category: p.category || "", tags: (p.tags || []).join(", "), published_at: p.published_at ? p.published_at.split("T")[0] : "" });
                    setBlogOpen(true);
                  }}><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1 hover:bg-destructive/10 rounded" onClick={() => blogDel.mutate(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Questions */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Quiz Questions ({quizQuestions.length})</h2>
          <Button variant="hero" size="sm" className="gap-2" onClick={() => { setQuizEditId(null); setQuizForm({ question_text: "", options: "", recommended_content_ids: "" }); setQuizOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Question
          </Button>
        </div>
        {quizQuestions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No quiz questions yet.</p>
        ) : (
          <div className="space-y-3">
            {quizQuestions.map((q: any) => (
              <div key={q.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground line-clamp-1">{q.question_text}</h4>
                  <p className="text-sm text-muted-foreground">{(q.options || []).length} options</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-1 hover:bg-muted rounded" onClick={() => {
                    setQuizEditId(q.id);
                    setQuizForm({ question_text: q.question_text, options: (q.options || []).join("\n"), recommended_content_ids: (q.recommended_content_ids || []).join(", ") });
                    setQuizOpen(true);
                  }}><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                  <button className="p-1 hover:bg-destructive/10 rounded" onClick={() => quizDel.mutate(q.id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Dialog */}
      <Dialog open={blogOpen} onOpenChange={setBlogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{blogEditId ? "Edit" : "New"} Blog Post</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); if (!blogForm.title) { toast.error("Title required"); return; } blogUpsert.mutate({ ...blogForm, id: blogEditId ?? undefined }); }} className="space-y-4 mt-2">
            <div><label className="text-sm font-medium">Title *</label><Input value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Content (HTML)</label><Textarea value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} rows={10} /></div>
            <div><label className="text-sm font-medium">Cover Image URL</label><Input value={blogForm.cover_url} onChange={e => setBlogForm(f => ({ ...f, cover_url: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Category</label><Input value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Tags (comma-separated)</label><Input value={blogForm.tags} onChange={e => setBlogForm(f => ({ ...f, tags: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Publish Date (leave empty = draft)</label><Input type="date" value={blogForm.published_at} onChange={e => setBlogForm(f => ({ ...f, published_at: e.target.value }))} /></div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setBlogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={blogUpsert.isPending}>{blogUpsert.isPending ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">{quizEditId ? "Edit" : "New"} Quiz Question</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); if (!quizForm.question_text) { toast.error("Question required"); return; } quizUpsert.mutate({ ...quizForm, id: quizEditId ?? undefined }); }} className="space-y-4 mt-2">
            <div><label className="text-sm font-medium">Question *</label><Input value={quizForm.question_text} onChange={e => setQuizForm(f => ({ ...f, question_text: e.target.value }))} /></div>
            <div><label className="text-sm font-medium">Options (one per line)</label><Textarea value={quizForm.options} onChange={e => setQuizForm(f => ({ ...f, options: e.target.value }))} rows={4} placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4" /></div>
            <div><label className="text-sm font-medium">Recommended Content IDs (comma-separated)</label><Input value={quizForm.recommended_content_ids} onChange={e => setQuizForm(f => ({ ...f, recommended_content_ids: e.target.value }))} placeholder="uuid1, uuid2" /></div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setQuizOpen(false)}>Cancel</Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={quizUpsert.isPending}>{quizUpsert.isPending ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}