import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Check your email for a reset link");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-16 pb-8 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Reset your password</h1>
            <p className="text-muted-foreground">
              {sent ? "We've sent a reset link to your email" : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Didn't receive the email? Check your spam folder or try again.</p>
                <Button variant="outline" onClick={() => setSent(false)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Try again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            )}
          </div>

          <p className="text-center mt-6 text-muted-foreground">
            <Link to="/login" className="text-primary font-medium hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
