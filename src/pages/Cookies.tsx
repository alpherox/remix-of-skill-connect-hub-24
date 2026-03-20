import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Cookie, Shield, BarChart3, Settings } from "lucide-react";

const cookieTypes = [
  { icon: Shield, title: "Essential Cookies", description: "Required for the website to function properly. Cannot be disabled.", required: true },
  { icon: BarChart3, title: "Analytics Cookies", description: "Help us understand how visitors interact with SkillBridge.", required: false },
  { icon: Settings, title: "Functional Cookies", description: "Enable personalized features like saved preferences and recent searches.", required: false },
  { icon: Cookie, title: "Marketing Cookies", description: "Used to deliver relevant advertisements and track campaign performance.", required: false },
];

const Cookies = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-lg text-muted-foreground mb-8">Learn about how SkillBridge uses cookies and similar technologies.</p>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">What Are Cookies?</h2>
                <p className="text-muted-foreground">Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>
              </div>
              {cookieTypes.map((cookie, index) => (
                <motion.div key={cookie.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <cookie.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-foreground">{cookie.title}</h3>
                        {cookie.required ? (
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Required</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">Optional</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{cookie.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <p className="text-sm text-muted-foreground">Last updated: March 1, 2026</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
