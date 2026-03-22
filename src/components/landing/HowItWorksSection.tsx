import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Zap, Users, Trophy } from "lucide-react";

const icons = [FileText, Zap, Users, Trophy];

export function HowItWorksSection() {
  const { data: settings, isLoading } = useSiteSettings();

  const steps = [1, 2, 3, 4].map(n => ({
    title: settings?.[`how_it_works_step${n}_title`] || `Step ${n}`,
    desc: settings?.[`how_it_works_step${n}_desc`] || "",
    Icon: icons[n - 1],
  }));

  const hasContent = steps.some(s => s.title !== `Step ${s.title.slice(-1)}` || s.desc);

  return (
    <section className="py-24 bg-surface-sunken">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">Get started in just a few steps.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="text-center">
                <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="font-display text-sm font-bold text-primary mb-2">Step {i + 1}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
