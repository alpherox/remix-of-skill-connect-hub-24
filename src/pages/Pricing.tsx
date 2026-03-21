import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<number, typeof Zap> = { 0: Zap, 1: Crown, 2: Building2 };

const Pricing = () => {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_plans").select("*").eq("is_active", true).order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">Choose the plan that fits your career goals. Upgrade anytime.</p>
          </motion.div>

          {isLoading && (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          )}

          {!isLoading && (!plans || plans.length === 0) && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No pricing plans available yet. Check back soon!</p>
            </div>
          )}

          {plans && plans.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => {
                const Icon = iconMap[index] || Zap;
                return (
                  <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    className={`relative p-8 rounded-2xl bg-card border shadow-card ${plan.is_highlighted ? "border-primary shadow-glow" : "border-border"}`}>
                    {plan.is_highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium">Most Popular</div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">{plan.name}</h3>
                    <div className="mt-2 mb-4">
                      <span className="font-display text-4xl font-bold text-foreground">₱{Number(plan.price).toLocaleString()}</span>
                      {plan.billing_cycle && <span className="text-muted-foreground">/{plan.billing_cycle === "yearly" ? "year" : "month"}</span>}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {(plan.features || []).map((feature: string) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant={plan.is_highlighted ? "hero" : "outline"} size="lg" className="w-full" asChild>
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
