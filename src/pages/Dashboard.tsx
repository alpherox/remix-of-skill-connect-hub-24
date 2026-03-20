import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Briefcase, BookOpen, Bell, Trophy, Target, TrendingUp, 
  ArrowRight, Star, Clock, CheckCircle2 
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Job Matches", value: "12", icon: Briefcase, trend: "+3 this week" },
  { label: "Courses Completed", value: "5", icon: BookOpen, trend: "2 in progress" },
  { label: "Referrals Made", value: "8", icon: Target, trend: "$240 earned" },
  { label: "Skill Score", value: "87", icon: Trophy, trend: "+5 from last month" },
];

const recentMatches = [
  { title: "Senior Frontend Developer", company: "TechCorp", match: 95 },
  { title: "Product Manager", company: "StartupXYZ", match: 88 },
  { title: "UX Designer", company: "DesignStudio", match: 82 },
];

const notifications = [
  { text: "New job match: Data Scientist at AI Labs", time: "2h ago", type: "job" },
  { text: "Your referral to Marcus was successful!", time: "1d ago", type: "referral" },
  { text: "New course available: Leadership in Tech", time: "2d ago", type: "course" },
];

const Dashboard = () => {
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
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your career journey.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map(({ label, value, icon: Icon, trend }) => (
              <div
                key={label}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-glow" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground mb-1">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="text-xs text-emerald-glow mt-2">{trend}</div>
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Job Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Top Job Matches
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/jobs" className="gap-1">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {recentMatches.map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{job.title}</div>
                        <div className="text-sm text-muted-foreground">{job.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {job.match}% match
                      </span>
                      <Button variant="hero" size="sm">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Notifications
                </h2>
                <Bell className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {notifications.map((notif, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-sunken transition-colors cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notif.type === 'job' ? 'bg-primary' :
                      notif.type === 'referral' ? 'bg-amber-warm' : 'bg-emerald-glow'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">{notif.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Your Progress
              </h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-warm fill-amber-warm" />
                <span className="font-semibold text-foreground">Level 12</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Skills Completed</span>
                  <span className="text-sm font-medium text-foreground">15/20</span>
                </div>
                <div className="h-2 rounded-full bg-surface-sunken overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-primary rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Courses Progress</span>
                  <span className="text-sm font-medium text-foreground">7/10</span>
                </div>
                <div className="h-2 rounded-full bg-surface-sunken overflow-hidden">
                  <div className="h-full w-[70%] bg-amber-warm rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Profile Complete</span>
                  <span className="text-sm font-medium text-foreground">90%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-sunken overflow-hidden">
                  <div className="h-full w-[90%] bg-emerald-glow rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
