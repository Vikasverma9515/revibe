-- Fix for missing profile for user 95e3ac2a-879d-4f07-873f-1b4b20d09ef8
-- Run this in Supabase SQL Editor to create the profile manually

INSERT INTO public.profiles (id, email, full_name, employee_id, department, designation, grade, joining_date, role, is_active)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name',
  NULL,  -- employee_id
  NULL,  -- department
  NULL,  -- designation
  NULL,  -- grade
  NULL,  -- joining_date
  'employee',  -- role
  true   -- is_active
FROM auth.users au
WHERE au.id = '95e3ac2a-879d-4f07-873f-1b4b20d09ef8'
ON CONFLICT (id) DO NOTHING;