import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p>By accessing and using SkillBridge, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              </section>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Use of Service</h2>
                <p>You may use SkillBridge for lawful purposes only. You agree not to misuse the platform, submit false information, or attempt to circumvent security measures.</p>
              </section>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
              </section>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Marketplace</h2>
                <p>Content purchased through the marketplace is for personal use only. Redistribution or resale of marketplace content is prohibited without explicit permission.</p>
              </section>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Referral Program</h2>
                <p>Referral rewards are subject to verification. Fraudulent referral activity will result in account suspension and forfeiture of rewards.</p>
              </section>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
                <p>SkillBridge is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.</p>
              </section>
              <p className="text-sm">Last updated: March 1, 2026</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
