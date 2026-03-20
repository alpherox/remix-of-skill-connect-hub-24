import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Newspaper, Calendar } from "lucide-react";

const pressReleases = [
  { title: "SkillBridge Raises $15M Series A to Expand AI Job Matching", date: "March 1, 2026", outlet: "TechCrunch" },
  { title: "SkillBridge Reaches 50,000 Active Users Milestone", date: "February 15, 2026", outlet: "Forbes" },
  { title: "How SkillBridge is Revolutionizing Career Development", date: "January 20, 2026", outlet: "The Verge" },
  { title: "SkillBridge Launches Self-Development Marketplace", date: "December 10, 2025", outlet: "Business Insider" },
];

const Press = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Press & <span className="text-gradient">Media</span></h1>
            <p className="text-lg text-muted-foreground">Latest news and media coverage about SkillBridge. For press inquiries, contact press@skillbridge.com.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {pressReleases.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{item.outlet}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Press;
