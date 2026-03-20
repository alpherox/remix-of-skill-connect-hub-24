import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Search, HelpCircle, BookOpen, MessageSquare, FileText, Mail } from "lucide-react";

const categories = [
  { icon: BookOpen, title: "Getting Started", description: "Learn the basics of SkillBridge and set up your profile.", articles: 12 },
  { icon: FileText, title: "Job Matching", description: "How our AI matches you with the right opportunities.", articles: 8 },
  { icon: MessageSquare, title: "Marketplace", description: "Buying, accessing, and managing your content library.", articles: 15 },
  { icon: HelpCircle, title: "Account & Billing", description: "Manage your subscription, payments, and settings.", articles: 10 },
  { icon: Mail, title: "Referrals", description: "How the referral system works and how to earn rewards.", articles: 6 },
];

const Help = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Help <span className="text-gradient">Center</span></h1>
            <p className="text-lg text-muted-foreground mb-8">Find answers to common questions or reach out to our support team.</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Search for help articles..." className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg" />
            </div>
          </motion.div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <cat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
                <span className="text-sm text-primary font-medium">{cat.articles} articles</span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
