import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

const openings = [
  { title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", department: "Design", location: "San Francisco, CA", type: "Full-time" },
  { title: "Data Scientist – ML", department: "AI/ML", location: "Remote", type: "Full-time" },
  { title: "Growth Marketing Manager", department: "Marketing", location: "New York, NY", type: "Full-time" },
  { title: "Customer Success Lead", department: "Operations", location: "Remote", type: "Full-time" },
];

const Careers = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Join Our <span className="text-gradient">Team</span></h1>
            <p className="text-lg text-muted-foreground">Help us build the future of career development. We're looking for passionate people who want to make a difference.</p>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {openings.map((job, index) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.type}</span>
                    </div>
                  </div>
                  <Button variant="hero-outline" size="sm" className="gap-1">Apply <ArrowRight className="w-4 h-4" /></Button>
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

export default Careers;
