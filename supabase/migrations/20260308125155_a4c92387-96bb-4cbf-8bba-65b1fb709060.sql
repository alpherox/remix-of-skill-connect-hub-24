
-- Drop restrictive policies and recreate as permissive for marketplace_items
DROP POLICY IF EXISTS "Published items viewable by everyone" ON public.marketplace_items;
DROP POLICY IF EXISTS "Admins can view all items" ON public.marketplace_items;
DROP POLICY IF EXISTS "Admins can manage items" ON public.marketplace_items;

CREATE POLICY "Published items viewable by everyone" ON public.marketplace_items FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all items" ON public.marketplace_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert items" ON public.marketplace_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update items" ON public.marketplace_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete items" ON public.marketplace_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix job_postings policies too
DROP POLICY IF EXISTS "Active jobs viewable by everyone" ON public.job_postings;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.job_postings;
DROP POLICY IF EXISTS "Admins can manage jobs" ON public.job_postings;

CREATE POLICY "Active jobs viewable by everyone" ON public.job_postings FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all jobs" ON public.job_postings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert jobs" ON public.job_postings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update jobs" ON public.job_postings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete jobs" ON public.job_postings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix profiles policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
