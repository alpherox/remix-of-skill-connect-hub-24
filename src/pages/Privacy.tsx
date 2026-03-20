import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                  <p>We collect information you provide directly, such as your name, email address, resume data, skills, and career preferences. We also collect usage data to improve our services.</p>
                </section>
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                  <p>We use your information to provide AI-powered job matching, personalize your marketplace experience, facilitate referrals, and improve our platform. We never sell your personal data to third parties.</p>
                </section>
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Data Security</h2>
                  <p>We implement industry-standard security measures including encryption, secure data storage, and regular security audits to protect your personal information.</p>
                </section>
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Your Rights</h2>
                  <p>You have the right to access, correct, or delete your personal data at any time. You can also opt out of marketing communications and data processing for non-essential purposes.</p>
                </section>
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Contact Us</h2>
                  <p>If you have questions about this privacy policy, please contact us at privacy@skillbridge.com.</p>
                </section>
                <p className="text-sm">Last updated: March 1, 2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
