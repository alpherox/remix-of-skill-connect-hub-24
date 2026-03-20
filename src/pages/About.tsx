import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Target, Users, Lightbulb, Heart } from "lucide-react";

const values = [
  { icon: Target, title: "Mission-Driven", description: "We believe everyone deserves access to meaningful career opportunities." },
  { icon: Users, title: "Community First", description: "Our users are at the heart of everything we build." },
  { icon: Lightbulb, title: "Innovation", description: "We use AI to create smarter, more equitable job matching." },
  { icon: Heart, title: "Empowerment", description: "We help people take control of their professional growth." },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">About <span className="text-gradient">SkillBridge</span></h1>
            <p className="text-lg text-muted-foreground">We're on a mission to bridge the gap between talent and opportunity, making career growth accessible to everyone.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-3xl mx-auto mb-16">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">SkillBridge was founded in 2024 with a simple idea: job searching shouldn't feel like a black box. Traditional job boards focus on keywords, not skills. We built an AI-powered platform that truly understands what you bring to the table.</p>
              <p className="text-muted-foreground leading-relaxed">Today, we serve over 50,000 professionals worldwide, helping them find meaningful careers while continuously upskilling through our curated marketplace of courses, ebooks, and expert content.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map(({ icon: Icon, title, description }) => (
                <div key={title} className="p-6 rounded-2xl bg-card border border-border shadow-card">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
