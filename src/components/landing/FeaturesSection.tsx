import { motion } from "framer-motion";
import { FileText, Zap, Users, Trophy, BookOpen, LineChart } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Analysis",
    description: "Upload your resume and let our AI extract your skills, experience, and potential growth areas.",
  },
  {
    icon: Zap,
    title: "Smart Job Matching",
    description: "Get personalized job recommendations based on your unique skill profile and career aspirations.",
  },
  {
    icon: Users,
    title: "Referral Network",
    description: "Connect with professionals who can refer you, or earn rewards by referring others.",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    description: "Earn badges, track achievements, and stay motivated on your career growth journey.",
  },
  {
    icon: BookOpen,
    title: "Learning Marketplace",
    description: "Access curated ebooks, video courses, podcasts, and masterclasses from industry experts.",
  },
  {
    icon: LineChart,
    title: "Career Analytics",
    description: "Track your progress, skill development, and market positioning with detailed insights.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to <span className="text-gradient">Level Up</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From job matching to continuous learning, SkillBridge provides all the tools 
            for your professional growth journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
