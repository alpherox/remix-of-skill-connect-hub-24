import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FeaturedJobsSection } from "@/components/landing/FeaturedJobsSection";
import { FeaturedCoursesSection } from "@/components/landing/FeaturedCoursesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/hooks/use-site-settings";

const Index = () => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.site_name || "SkillBridge";

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{siteName} – Find Jobs & Upskill in the Philippines</title>
        <meta name="description" content={settings?.hero_subheadline || "Bridge your skills to dream careers."} />
        <meta property="og:title" content={`${siteName} – Find Jobs & Upskill in the Philippines`} />
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedJobsSection />
        <FeaturedCoursesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;