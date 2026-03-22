import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowLeft, RotateCcw, GraduationCap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Quiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["quiz-questions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quiz_questions").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  // Collect recommended IDs from selected answers
  const recommendedIds = done
    ? [...new Set(answers.flatMap((ansIdx, qIdx) => {
        const q = questions[qIdx];
        if (!q?.recommended_content_ids) return [];
        // Each option maps to the same recommended_content_ids for the question
        return q.recommended_content_ids;
      }))]
    : [];

  const { data: recommendedCourses = [] } = useQuery({
    queryKey: ["quiz-courses", recommendedIds],
    queryFn: async () => {
      if (recommendedIds.length === 0) return [];
      const { data } = await supabase.from("courses").select("*").in("id", recommendedIds);
      return data || [];
    },
    enabled: done && recommendedIds.length > 0,
  });

  const { data: recommendedEbooks = [] } = useQuery({
    queryKey: ["quiz-ebooks", recommendedIds],
    queryFn: async () => {
      if (recommendedIds.length === 0) return [];
      const { data } = await supabase.from("ebooks").select("*").in("id", recommendedIds);
      return data || [];
    },
    enabled: done && recommendedIds.length > 0,
  });

  const selectAnswer = (optionIdx: number) => {
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setDone(false);
  };

  const q = questions[currentQ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Skills Assessment Quiz – SkillBridge</title>
      </Helmet>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
              Skills Assessment <span className="text-gradient">Quiz</span>
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              Answer a few questions to get personalized course & ebook recommendations.
            </p>

            {isLoading ? (
              <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
                <Skeleton className="h-6 w-3/4 mb-6" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              </div>
            ) : questions.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No quiz questions available yet. Check back soon!</p>
            ) : done ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="text-center">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your Personalized Learning Path</h2>
                  <p className="text-muted-foreground">Based on your answers, we recommend these resources:</p>
                </div>

                {recommendedCourses.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" /> Recommended Courses
                    </h3>
                    <div className="grid gap-4">
                      {recommendedCourses.map((c: any) => (
                        <Link key={c.id} to={`/courses/${c.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-glow transition-all">
                          {c.thumbnail_url ? (
                            <img src={c.thumbnail_url} alt={c.title} className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                              <GraduationCap className="w-8 h-8 text-primary/40" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground">{c.title}</h4>
                            <p className="text-sm text-muted-foreground">{c.instructor} • {c.is_free ? "Free" : `₱${c.price}`}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {recommendedEbooks.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" /> Recommended Ebooks
                    </h3>
                    <div className="grid gap-4">
                      {recommendedEbooks.map((e: any) => (
                        <Link key={e.id} to={`/ebooks/${e.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-glow transition-all">
                          {e.cover_url ? (
                            <img src={e.cover_url} alt={e.title} className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-primary/40" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground">{e.title}</h4>
                            <p className="text-sm text-muted-foreground">{e.author} • {e.is_free ? "Free" : `₱${e.price}`}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {recommendedCourses.length === 0 && recommendedEbooks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No specific recommendations based on your answers. Browse all our courses and ebooks!</p>
                )}

                <div className="text-center">
                  <Button variant="hero-outline" onClick={reset} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Retake Quiz
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 rounded-2xl bg-card border border-border shadow-card">
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
                  <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                  </div>
                </div>

                <h2 className="font-display text-xl font-semibold text-foreground mb-6">{q?.question_text}</h2>

                <div className="space-y-3">
                  {(q?.options || []).map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(idx)}
                      className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-foreground font-medium"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;