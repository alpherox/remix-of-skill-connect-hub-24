
-- Update profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url text;

-- Add columns to job_postings
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS deadline timestamptz;
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.job_postings ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true;

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter text,
  resume_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own saved jobs" ON public.saved_jobs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  thumbnail_url text,
  video_url text,
  chapters jsonb DEFAULT '[]'::jsonb,
  instructor text NOT NULL,
  instructor_bio text,
  category text,
  tags text[] DEFAULT '{}'::text[],
  is_free boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  duration text,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published courses viewable by everyone" ON public.courses FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create ebooks table
CREATE TABLE IF NOT EXISTS public.ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  cover_url text,
  pdf_url text,
  category text,
  tags text[] DEFAULT '{}'::text[],
  is_free boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published ebooks viewable by everyone" ON public.ebooks FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Admins can manage ebooks" ON public.ebooks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  product_type text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  stripe_payment_id text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all purchases" ON public.purchases FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own purchases" ON public.purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  photo_url text,
  quote text NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active testimonials viewable by everyone" ON public.testimonials FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings viewable by everyone" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text DEFAULT 'info',
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create pricing_plans table
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  billing_cycle text DEFAULT 'monthly',
  features text[] DEFAULT '{}'::text[],
  is_highlighted boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active plans viewable by everyone" ON public.pricing_plans FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.pricing_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Employer policies for job_postings
CREATE POLICY "Employers can insert own jobs" ON public.job_postings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'employer') AND created_by = auth.uid());
CREATE POLICY "Employers can update own jobs" ON public.job_postings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'employer') AND created_by = auth.uid());
CREATE POLICY "Employers can view own jobs" ON public.job_postings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'employer') AND created_by = auth.uid());

-- Employers can view/update applications for their jobs
CREATE POLICY "Employers can view applications for own jobs" ON public.applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.job_postings WHERE job_postings.id = applications.job_id AND job_postings.created_by = auth.uid())
);
CREATE POLICY "Employers can update applications for own jobs" ON public.applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.job_postings WHERE job_postings.id = applications.job_id AND job_postings.created_by = auth.uid())
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "Auth users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users can view own resumes" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can upload resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Admins can view all resumes" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view content" ON storage.objects FOR SELECT TO public USING (bucket_id = 'content');
CREATE POLICY "Admins can manage content uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update content files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete content files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'content' AND public.has_role(auth.uid(), 'admin'));

-- Triggers
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON public.ebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_headline', 'Accelerate Your Career Growth'),
  ('hero_subheadline', 'AI-powered job matching, expert courses, and a thriving professional community.'),
  ('hero_cta_text', 'Get Started Free'),
  ('stats_jobs', '500+'),
  ('stats_users', '1,200+'),
  ('stats_courses', '150+'),
  ('stats_placements', '300+')
ON CONFLICT (key) DO NOTHING;
