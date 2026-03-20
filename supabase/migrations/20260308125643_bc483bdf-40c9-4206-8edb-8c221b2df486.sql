
-- Add external_link column to job_postings
ALTER TABLE public.job_postings ADD COLUMN external_link text;

-- Fix RLS policies to be PERMISSIVE (currently all are RESTRICTIVE which means they AND together, blocking access)
-- Drop restrictive policies and recreate as permissive

DROP POLICY IF EXISTS "Active jobs viewable by everyone" ON public.job_postings;
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.job_postings;
DROP POLICY IF EXISTS "Admins can insert jobs" ON public.job_postings;
DROP POLICY IF EXISTS "Admins can update jobs" ON public.job_postings;
DROP POLICY IF EXISTS "Admins can delete jobs" ON public.job_postings;

-- Permissive SELECT: everyone sees active jobs
CREATE POLICY "Active jobs viewable by everyone"
  ON public.job_postings FOR SELECT
  USING (is_active = true);

-- Permissive SELECT: admins see all
CREATE POLICY "Admins can view all jobs"
  ON public.job_postings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permissive INSERT: admins only
CREATE POLICY "Admins can insert jobs"
  ON public.job_postings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Permissive UPDATE: admins only
CREATE POLICY "Admins can update jobs"
  ON public.job_postings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permissive DELETE: admins only
CREATE POLICY "Admins can delete jobs"
  ON public.job_postings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
