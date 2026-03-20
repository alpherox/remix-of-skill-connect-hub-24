import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  User, Mail, MapPin, Briefcase, FileText, Upload, 
  Edit2, Award, BookmarkIcon, Star 
} from "lucide-react";

const skills = ["React", "TypeScript", "Node.js", "Product Management", "UI/UX Design", "Data Analysis"];
const achievements = [
  { icon: "🏆", title: "Early Adopter", description: "Joined in first 1000 users" },
  { icon: "⭐", title: "Top Referrer", description: "Made 5+ successful referrals" },
  { icon: "📚", title: "Knowledge Seeker", description: "Completed 10 courses" },
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-surface-sunken">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-background"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">John Doe</h2>
                <p className="text-muted-foreground mb-4">Senior Frontend Developer</p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    San Francisco
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <h3 className="font-display font-semibold text-foreground mb-4">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">john.doe@email.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">TechCorp Inc.</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <h3 className="font-display font-semibold text-foreground mb-4">Achievements</h3>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.title} className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-foreground">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Resume Section */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">Resume</h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload New
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-surface-sunken border-2 border-dashed border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">John_Doe_Resume.pdf</div>
                      <div className="text-sm text-muted-foreground">Uploaded on March 1, 2024</div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">Skills</h3>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Interests */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">Career Interests</h3>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Preferred Industries</label>
                    <p className="text-foreground">Technology, Fintech, Healthcare</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Job Types</label>
                    <p className="text-foreground">Full-time, Remote</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Salary Expectation</label>
                    <p className="text-foreground">$150,000 - $200,000</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Experience Level</label>
                    <p className="text-foreground">Senior (5-10 years)</p>
                  </div>
                </div>
              </div>

              {/* Saved Jobs */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">Saved Jobs</h3>
                  <span className="text-sm text-muted-foreground">3 saved</span>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Lead Frontend Engineer", company: "Stripe", match: 92 },
                    { title: "Senior React Developer", company: "Airbnb", match: 89 },
                    { title: "Staff Engineer", company: "Netflix", match: 85 },
                  ].map((job) => (
                    <div
                      key={job.title}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-sunken"
                    >
                      <div>
                        <div className="font-medium text-foreground">{job.title}</div>
                        <div className="text-sm text-muted-foreground">{job.company}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary font-medium">{job.match}% match</span>
                        <BookmarkIcon className="w-4 h-4 text-amber-warm fill-amber-warm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
