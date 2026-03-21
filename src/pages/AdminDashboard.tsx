import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, FileText, Briefcase, BarChart3, BookOpen, FileImage,
  MessageSquare, Settings, ShoppingCart, CreditCard, Loader2
} from "lucide-react";
import { AdminJobsTab } from "@/components/admin/AdminJobsTab";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { AdminUsersTab } from "@/components/admin/AdminUsersTab";
import { AdminCoursesTab } from "@/components/admin/AdminCoursesTab";
import { AdminEbooksTab } from "@/components/admin/AdminEbooksTab";
import { AdminTestimonialsTab } from "@/components/admin/AdminTestimonialsTab";
import { AdminSettingsTab } from "@/components/admin/AdminSettingsTab";
import { AdminApplicationsTab } from "@/components/admin/AdminApplicationsTab";
import { AdminPricingTab } from "@/components/admin/AdminPricingTab";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "ebooks", label: "Ebooks", icon: FileImage },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "settings", label: "Site Settings", icon: Settings },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-surface-sunken">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform content, users, and settings.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id ? "bg-primary text-primary-foreground shadow-glow" : "bg-card border border-border hover:border-primary/50"
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </motion.div>

          {activeTab === "overview" && <AdminOverviewTab />}
          {activeTab === "users" && <AdminUsersTab />}
          {activeTab === "jobs" && <AdminJobsTab />}
          {activeTab === "applications" && <AdminApplicationsTab />}
          {activeTab === "courses" && <AdminCoursesTab />}
          {activeTab === "ebooks" && <AdminEbooksTab />}
          {activeTab === "testimonials" && <AdminTestimonialsTab />}
          {activeTab === "settings" && <AdminSettingsTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
