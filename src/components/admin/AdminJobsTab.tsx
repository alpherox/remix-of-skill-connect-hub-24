import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink, X, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobForm {
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_range: string;
  description: string;
  external_link: string;
  required_skills: string;
  is_active: boolean;
}

const emptyForm: JobForm = {
  title: "",
  company: "",
  location: "",
  job_type: "Full-time",
  salary_range: "",
  description: "",
  external_link: "",
  required_skills: "",
  is_active: true,
};

export function AdminJobsTab() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (job: JobForm & { id?: string }) => {
      const payload = {
        title: job.title,
        company: job.company,
        location: job.location || null,
        job_type: job.job_type || null,
        salary_range: job.salary_range || null,
        description: job.description || null,
        external_link: job.external_link || null,
        required_skills: job.required_skills
          ? job.required_skills.split(",").map((s) => s.trim())
          : [],
        is_active: job.is_active,
      };
      if (job.id) {
        const { error } = await supabase
          .from("job_postings")
          .update(payload)
          .eq("id", job.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("job_postings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success(editingId ? "Job updated" : "Job created");
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_postings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success("Job deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (job: any) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company,
      location: job.location || "",
      job_type: job.job_type || "",
      salary_range: job.salary_range || "",
      description: job.description || "",
      external_link: (job as any).external_link || "",
      required_skills: (job.required_skills || []).join(", "),
      is_active: job.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company) {
      toast.error("Title and company are required");
      return;
    }
    upsertMutation.mutate({ ...form, id: editingId ?? undefined });
  };

  const update = (field: keyof JobForm, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Job Postings ({jobs.length})
          </h2>
          <Button variant="hero" size="sm" className="gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Add Job
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No job postings yet.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-semibold text-foreground">{job.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        job.is_active
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {job.is_active ? "Active" : "Closed"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {job.company}
                    {job.location && ` • ${job.location}`}
                    {job.job_type && ` • ${job.job_type}`}
                    {job.salary_range && ` • ${job.salary_range}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {(job as any).external_link && (
                    <a
                      href={(job as any).external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-muted rounded"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                  <button className="p-1 hover:bg-muted rounded" onClick={() => openEdit(job)}>
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    className="p-1 hover:bg-destructive/10 rounded"
                    onClick={() => deleteMutation.mutate(job.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? "Edit Job Posting" : "New Job Posting"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Title *</label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Senior Frontend Developer" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Company *</label>
              <Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="TechCorp Inc." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Location</label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Remote" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Type</label>
                <select
                  value={form.job_type}
                  onChange={(e) => update("job_type", e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Salary Range</label>
              <Input value={form.salary_range} onChange={(e) => update("salary_range", e.target.value)} placeholder="$120k - $160k" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">External Link</label>
              <Input value={form.external_link} onChange={(e) => update("external_link", e.target.value)} placeholder="https://company.com/careers/job-123" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Required Skills (comma-separated)</label>
              <Input value={form.required_skills} onChange={(e) => update("required_skills", e.target.value)} placeholder="React, TypeScript, Node.js" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Job description..." rows={4} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => update("is_active", e.target.checked)}
                className="rounded border-border"
              />
              <label className="text-sm text-foreground">Active</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
