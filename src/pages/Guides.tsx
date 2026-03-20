import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

const guides = [
  { title: "Complete Guide to AI Resume Optimization", description: "Learn how to craft a resume that gets noticed by both AI and humans.", level: "Beginner" },
  { title: "Mastering the Referral Network", description: "How to build and leverage professional connections for job referrals.", level: "Intermediate" },
  { title: "Building Your Personal Brand", description: "A step-by-step guide to establishing your professional identity online.", level: "Beginner" },
  { title: "Career Transition Playbook", description: "Everything you need to know about switching industries successfully.", level: "Advanced" },
  { title: "Marketplace Seller's Guide", description: "How to create and sell your own courses and content on SkillBridge.", level: "Intermediate" },
  { title: "Interview Preparation Masterclass", description: "Proven techniques to ace any job interview.", level: "Beginner" },
];

const Guides = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Learning <span className="text-gradient">Guides</span></h1>
            <p className="text-lg text-muted-foreground">In-depth guides to help you make the most of SkillBridge and your career.</p>
          </motion.div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <motion.div key={guide.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    guide.level === "Beginner" ? "bg-primary/10 text-primary" :
                    guide.level === "Intermediate" ? "bg-amber-light text-amber-warm" :
                    "bg-destructive/10 text-destructive"
                  }`}>{guide.level}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                <span className="flex items-center gap-1 text-sm text-primary font-medium">Read Guide <ArrowRight className="w-3 h-3" /></span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Guides;
