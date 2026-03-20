import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Code, Key, Webhook, Database } from "lucide-react";

const endpoints = [
  { icon: Key, title: "Authentication", description: "OAuth 2.0 authentication endpoints for user login and token management.", method: "POST" },
  { icon: Database, title: "Job Matching API", description: "Access job matching algorithms and retrieve personalized recommendations.", method: "GET" },
  { icon: Code, title: "Marketplace API", description: "Browse, search, and manage marketplace content programmatically.", method: "GET" },
  { icon: Webhook, title: "Webhooks", description: "Receive real-time notifications for job matches, referrals, and purchases.", method: "POST" },
];

const ApiPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Developer <span className="text-gradient">API</span></h1>
            <p className="text-lg text-muted-foreground">Integrate SkillBridge into your applications with our RESTful API.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Base URL</h2>
              <code className="block p-4 rounded-xl bg-surface-sunken text-sm font-mono text-foreground">https://api.skillbridge.com/v1</code>
            </motion.div>
            <div className="space-y-4">
              {endpoints.map((ep, index) => (
                <motion.div key={ep.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.05 }} className="p-6 rounded-2xl bg-card border border-border shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ep.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-foreground">{ep.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">{ep.method}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{ep.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApiPage;
