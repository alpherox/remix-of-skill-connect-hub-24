import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Join SkillBridge today and unlock personalized job matches, 
            expert-led courses, and a community that supports your growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link to="/jobs">Explore Job Matches</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
