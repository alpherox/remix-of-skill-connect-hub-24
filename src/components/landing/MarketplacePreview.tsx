import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, PlayCircle, Headphones, Star } from "lucide-react";

const categories = [
  { icon: BookOpen, label: "Ebooks", count: "200+" },
  { icon: PlayCircle, label: "Video Courses", count: "150+" },
  { icon: Headphones, label: "Podcasts", count: "100+" },
];

const featuredItems = [
  {
    title: "Mastering the Art of Negotiation",
    author: "Sarah Chen",
    type: "Video Course",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    price: "$49",
  },
  {
    title: "The Entrepreneur's Mindset",
    author: "Michael Torres",
    type: "Ebook",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    price: "$24",
  },
  {
    title: "Career Growth Strategies",
    author: "Emily Watson",
    type: "Podcast Series",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop",
    price: "Free",
  },
];

export function MarketplacePreview() {
  return (
    <section className="py-24 bg-surface-sunken">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Self-Development Marketplace
            </h2>
            <p className="text-lg text-muted-foreground">
              Curated content from industry experts to accelerate your growth.
            </p>
          </div>
          <Button variant="hero-outline" asChild>
            <Link to="/marketplace">View All</Link>
          </Button>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {categories.map(({ icon: Icon, label, count }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-sm text-muted-foreground">{count}</span>
            </div>
          ))}
        </motion.div>

        {/* Featured Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * index }}
              className="group bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-glow transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium">
                  {item.type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">by {item.author}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-warm fill-amber-warm" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <span className="font-display font-semibold text-primary">{item.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
