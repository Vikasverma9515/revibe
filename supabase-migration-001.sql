-- Migration to update the handle_new_user function to include all profile fields
-- This ensures profiles are created with all necessary columns when users sign up

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the function to handle all profile fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    employee_id,
    department,
    designation,
    grade,
    joining_date,
    role,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'user_id',  -- employee_id from signup
    NEW.raw_user_meta_data->>'department',  -- department from signup
    NULL,  -- designation will be set later
    NULL,  -- grade will be set later
    NULL,  -- joining_date will be set later
    'employee',  -- default role
    true   -- is_active
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- For existing users who don't have profiles, run this manually in Supabase SQL Editor:
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
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;