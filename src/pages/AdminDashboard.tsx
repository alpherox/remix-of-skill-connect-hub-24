import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import {
  Users, ShoppingCart, FileText, Briefcase, BarChart3,
  Plus, Pencil, Trash2, Eye, TrendingUp, DollarSign
} from "lucide-react";
import { AdminJobsTab } from "@/components/admin/AdminJobsTab";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "content", label: "Content", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "orders", label: "Orders", icon: ShoppingCart },
];

const overviewStats = [
  { label: "Total Users", value: "12,453", change: "+12%", icon: Users },
  { label: "Revenue", value: "$48,290", change: "+8%", icon: DollarSign },
  { label: "Active Jobs", value: "342", change: "+15%", icon: Briefcase },
  { label: "Content Items", value: "567", change: "+5%", icon: FileText },
];

const salesData = [
  { month: "Jan", sales: 4000, users: 2400 },
  { month: "Feb", sales: 3000, users: 2800 },
  { month: "Mar", sales: 5000, users: 3200 },
  { month: "Apr", sales: 4500, users: 3800 },
  { month: "May", sales: 6000, users: 4200 },
  { month: "Jun", sales: 5500, users: 4800 },
];

const categoryData = [
  { name: "Ebooks", value: 35 },
  { name: "Videos", value: 30 },
  { name: "Podcasts", value: 20 },
  { name: "Courses", value: 15 },
];
const COLORS = ["hsl(160,45%,22%)", "hsl(38,92%,60%)", "hsl(160,45%,32%)", "hsl(45,80%,58%)"];

const mockUsers = [
  { id: 1, name: "Jessica Park", email: "jessica@example.com", role: "user", joined: "2024-01-15", status: "active" },
  { id: 2, name: "Marcus Johnson", email: "marcus@example.com", role: "user", joined: "2024-02-20", status: "active" },
  { id: 3, name: "Aisha Rahman", email: "aisha@example.com", role: "moderator", joined: "2024-01-10", status: "active" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "user", joined: "2024-03-01", status: "inactive" },
];

const mockContent = [
  { id: 1, title: "Mastering Negotiation", type: "video", author: "Sarah Chen", price: 49, status: "published" },
  { id: 2, title: "The Entrepreneur's Mindset", type: "ebook", author: "Michael Torres", price: 24, status: "published" },
  { id: 3, title: "Career Growth Strategies", type: "podcast", author: "Emily Watson", price: 0, status: "draft" },
  { id: 4, title: "Leadership in Tech", type: "course", author: "David Kim", price: 79, status: "published" },
];

const mockOrders = [
  { id: "#ORD-001", user: "Jessica Park", item: "Mastering Negotiation", amount: 49, date: "2024-03-05", status: "completed" },
  { id: "#ORD-002", user: "Marcus Johnson", item: "Leadership in Tech", amount: 79, date: "2024-03-04", status: "completed" },
  { id: "#ORD-003", user: "David Kim", item: "The Entrepreneur's Mindset", amount: 24, date: "2024-03-03", status: "refunded" },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  // For demo purposes, allow all logged-in users to view the admin page
  // In production, uncomment: if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-surface-sunken">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, content, jobs, and track analytics.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "content" && <ContentTab />}
          {activeTab === "jobs" && <AdminJobsTab />}
          {activeTab === "orders" && <OrdersTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

function OverviewTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="p-6 rounded-2xl bg-card border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-emerald-glow font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {change}
              </span>
            </div>
            <div className="font-display text-3xl font-bold text-foreground">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Revenue & Users</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 10% 90%)" />
              <XAxis dataKey="month" stroke="hsl(160 10% 42%)" />
              <YAxis stroke="hsl(160 10% 42%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "1px solid hsl(160 10% 90%)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="sales" fill="hsl(160,45%,22%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="hsl(38,92%,60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Content by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Engagement Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 10% 90%)" />
            <XAxis dataKey="month" stroke="hsl(160 10% 42%)" />
            <YAxis stroke="hsl(160 10% 42%)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(160 10% 90%)",
                borderRadius: "12px",
              }}
            />
            <Line type="monotone" dataKey="users" stroke="hsl(160,45%,22%)" strokeWidth={2} dot={{ fill: "hsl(160,45%,22%)" }} />
            <Line type="monotone" dataKey="sales" stroke="hsl(38,92%,60%)" strokeWidth={2} dot={{ fill: "hsl(38,92%,60%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function UsersTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">User Management</h2>
          <Button variant="hero" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-surface-sunken transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{u.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === "moderator" ? "bg-amber-light text-amber-warm" : "bg-muted text-muted-foreground"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{u.joined}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-muted rounded"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1 hover:bg-muted rounded"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function ContentTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Content Management</h2>
          <Button variant="hero" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Content
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Author</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockContent.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-surface-sunken transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{item.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{item.author}</td>
                  <td className="py-3 px-4 text-foreground">{item.price === 0 ? "Free" : `$${item.price}`}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "published" ? "bg-primary/10 text-primary" : "bg-amber-light text-amber-warm"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-muted rounded"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1 hover:bg-muted rounded"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// JobsTab removed - now using AdminJobsTab component

function OrdersTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Orders & Purchases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Item</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-surface-sunken transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.user}</td>
                  <td className="py-3 px-4 text-foreground">{order.item}</td>
                  <td className="py-3 px-4 text-foreground">${order.amount}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "completed" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
