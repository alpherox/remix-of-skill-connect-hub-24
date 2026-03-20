import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Zap,
    description: "Get started with basic job matching and marketplace access.",
    features: [
      "5 job matches per month",
      "Browse marketplace",
      "Basic profile",
      "Community access",
    ],
    cta: "Get Started",
    variant: "hero-outline" as const,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    icon: Crown,
    description: "Unlock unlimited matching, referrals, and premium content.",
    features: [
      "Unlimited job matches",
      "AI resume analysis",
      "Referral network access",
      "Premium courses (20% off)",
      "Priority support",
      "Career analytics dashboard",
    ],
    cta: "Start Free Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    icon: Building2,
    description: "For teams and organizations looking to upskill their workforce.",
    features: [
      "Everything in Pro",
      "Team management",
      "Custom integrations",
      "Dedicated account manager",
      "Bulk content licensing",
      "Analytics & reporting",
    ],
    cta: "Contact Sales",
    variant: "hero-outline" as const,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your career goals. Upgrade anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl bg-card border shadow-card ${
                  plan.popular ? "border-primary shadow-glow" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.variant} size="lg" className="w-full" asChild>
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
