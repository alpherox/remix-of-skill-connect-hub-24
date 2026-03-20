import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  User, Mail, Bell, CreditCard, Shield, Palette,
  Save, Loader2, Check
} from "lucide-react";

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-surface-sunken">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and configuration.</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-64 flex-shrink-0">
              <div className="p-2 rounded-2xl bg-card border border-border shadow-card space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === "profile" && <ProfileSettings userId={user.id} />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "payments" && <PaymentSettings />}
              {activeTab === "security" && <SecuritySettings email={user.email || ""} />}
              {activeTab === "appearance" && <AppearanceSettings />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function ProfileSettings({ userId }: { userId: string }) {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [industries, setIndustries] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) {
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setSkills((data.skills || []).join(", "));
        setIndustries((data.preferred_industries || []).join(", "));
        setExperienceLevel(data.experience_level || "");
      }
      setLoaded(true);
    };
    loadProfile();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        preferred_industries: industries.split(",").map((s) => s.trim()).filter(Boolean),
        experience_level: experienceLevel,
      })
      .eq("user_id", userId);
    setSaving(false);
    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  if (!loaded) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
            <textarea
              value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Skills (comma separated)</label>
            <input
              type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Product Management..."
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Preferred Industries (comma separated)</label>
            <input
              type="text" value={industries} onChange={(e) => setIndustries(e.target.value)}
              placeholder="Technology, Fintech, Healthcare..."
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Experience Level</label>
            <select
              value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="">Select level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior (5-10 years)</option>
              <option value="lead">Lead / Staff (10+ years)</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <Button variant="hero" onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationSettings() {
  const [emailJobs, setEmailJobs] = useState(true);
  const [emailCourses, setEmailCourses] = useState(true);
  const [emailReferrals, setEmailReferrals] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [pushJobs, setPushJobs] = useState(true);
  const [pushMessages, setPushMessages] = useState(true);

  const handleSave = () => {
    toast.success("Notification preferences saved!");
  };

  const Toggle = ({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description: string }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-transform ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Email Notifications</h2>
        <div className="divide-y divide-border">
          <Toggle checked={emailJobs} onChange={setEmailJobs} label="Job Alerts" description="Get notified when new jobs match your profile" />
          <Toggle checked={emailCourses} onChange={setEmailCourses} label="New Courses" description="Updates about new marketplace content" />
          <Toggle checked={emailReferrals} onChange={setEmailReferrals} label="Referral Updates" description="Notifications about referral activity and rewards" />
          <Toggle checked={emailMarketing} onChange={setEmailMarketing} label="Marketing" description="Product news, tips, and promotional content" />
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Push Notifications</h2>
        <div className="divide-y divide-border">
          <Toggle checked={pushJobs} onChange={setPushJobs} label="Job Matches" description="Instant alerts for high-match job opportunities" />
          <Toggle checked={pushMessages} onChange={setPushMessages} label="Messages" description="Notifications for new messages and community activity" />
        </div>
      </div>
      <Button variant="hero" onClick={handleSave} className="gap-2">
        <Save className="w-4 h-4" />
        Save Preferences
      </Button>
    </motion.div>
  );
}

function PaymentSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Payment Methods</h2>
          <Button variant="hero" size="sm" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Add Method
          </Button>
        </div>

        {/* Existing Card */}
        <div className="p-4 rounded-xl bg-surface-sunken border-2 border-primary/20 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 rounded bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">VISA</span>
              </div>
              <div>
                <div className="font-medium text-foreground">•••• •••• •••• 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/27</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Default</span>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-sunken">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 rounded bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs font-bold">MC</span>
              </div>
              <div>
                <div className="font-medium text-foreground">•••• •••• •••• 8888</div>
                <div className="text-sm text-muted-foreground">Expires 06/26</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">Set Default</Button>
              <Button variant="ghost" size="sm">Remove</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: "Mar 1, 2026", item: "Pro Subscription", amount: "$29.00", status: "Paid" },
            { date: "Feb 15, 2026", item: "Leadership in Tech", amount: "$79.00", status: "Paid" },
            { date: "Feb 1, 2026", item: "Pro Subscription", amount: "$29.00", status: "Paid" },
          ].map((bill) => (
            <div key={`${bill.date}-${bill.item}`} className="flex items-center justify-between p-3 rounded-xl bg-surface-sunken">
              <div>
                <div className="font-medium text-foreground">{bill.item}</div>
                <div className="text-sm text-muted-foreground">{bill.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{bill.amount}</span>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{bill.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SecuritySettings({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Account Security</h2>
        <div className="mb-6 p-4 rounded-xl bg-surface-sunken">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Email Address</div>
              <div className="font-medium text-foreground">{email}</div>
            </div>
          </div>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
            <input
              type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
            <input
              type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
            <input
              type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <Button variant="hero" onClick={handleChangePassword} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState("light");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Appearance</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-4">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  theme === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className={`w-full h-16 rounded-lg mb-3 ${
                  opt.value === "light" ? "bg-background border border-border" :
                  opt.value === "dark" ? "bg-foreground" :
                  "bg-gradient-to-r from-background to-foreground"
                }`} />
                <div className="flex items-center justify-center gap-2">
                  {theme === opt.value && <Check className="w-4 h-4 text-primary" />}
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Accessibility</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-foreground">Reduce Motion</div>
              <div className="text-sm text-muted-foreground">Minimize animations throughout the app</div>
            </div>
            <button className="relative w-12 h-7 rounded-full bg-muted transition-colors">
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-card shadow transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-foreground">Large Text</div>
              <div className="text-sm text-muted-foreground">Increase the base font size for better readability</div>
            </div>
            <button className="relative w-12 h-7 rounded-full bg-muted transition-colors">
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-card shadow transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Settings;
