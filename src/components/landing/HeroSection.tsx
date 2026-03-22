import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, Users } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const { data: settings, isLoading } = useSiteSettings();

  const headline = settings?.hero_headline || "Bridge Your Skills to Dream Careers";
  const subheadline = settings?.hero_subheadline || "Upload your resume, get matched with perfect job opportunities, and upskill with our curated marketplace of courses, ebooks, and expert content.";
  const ctaText = settings?.hero_cta_text || "Start Free Today";
  const statsJobs = settings?.stats_jobs || "500+";
  const statsUsers = settings?.stats_users || "1,200+";
  const statsCourses = settings?.stats_courses || "100+";
  const statsPlacements = settings?.stats_placements || "300+";

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-warm/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-light px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-amber-warm" />
              <span className="text-sm font-medium text-foreground">AI-Powered Career Matching</span>
            </div>

            {isLoading ? (
              <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
            ) : (
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
                {headline.includes("Dream Careers") ? (
                  <>
                    {headline.split("Dream Careers")[0]}
                    <span className="text-gradient">Dream Careers</span>
                    {headline.split("Dream Careers")[1]}
                  </>
                ) : (
                  <span className="text-gradient">{headline}</span>
                )}
              </h1>
            )}

            {isLoading ? (
              <Skeleton className="h-8 w-2/3 mx-auto mb-10" />
            ) : (
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                {subheadline}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  {ctaText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/quiz">Take the Quiz</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3" />
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))
            ) : (
              [
                { icon: Target, value: statsJobs, label: "Jobs Posted" },
                { icon: Users, value: statsUsers, label: "Active Users" },
                { icon: Sparkles, value: statsCourses, label: "Courses" },
                { icon: Target, value: statsPlacements, label: "Placements" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}