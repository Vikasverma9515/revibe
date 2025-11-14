-- Enable Row Level Security
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  employee_id TEXT UNIQUE,
  department TEXT,
  designation TEXT,
  grade TEXT,
  joining_date DATE,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'hr', 'employee')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create employees table for detailed employee information
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  grade TEXT,
  joining_date DATE NOT NULL,
  basic_salary DECIMAL(10,2),
  hra DECIMAL(10,2),
  conveyance DECIMAL(10,2),
  lta DECIMAL(10,2),
  medical DECIMAL(10,2),
  other_allowances DECIMAL(10,2),
  provident_fund DECIMAL(10,2),
  professional_tax DECIMAL(10,2),
  income_tax DECIMAL(10,2),
  other_deductions DECIMAL(10,2),
  reporting_manager UUID REFERENCES public.profiles(id),
  skills TEXT[],
  responsibilities TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  ifsc_code TEXT,
  pan_number TEXT,
  aadhaar_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('casual', 'sick', 'earned', 'maternity', 'paternity')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create salary_slips table
CREATE TABLE IF NOT EXISTS public.salary_slips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL,
  hra DECIMAL(10,2),
  conveyance DECIMAL(10,2),
  lta DECIMAL(10,2),
  medical DECIMAL(10,2),
  other_allowances DECIMAL(10,2),
  gross_salary DECIMAL(10,2) NOT NULL,
  provident_fund DECIMAL(10,2),
  professional_tax DECIMAL(10,2),
  income_tax DECIMAL(10,2),
  other_deductions DECIMAL(10,2),
  total_deductions DECIMAL(10,2),
  net_salary DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'paid')),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create promotion_requests table
CREATE TABLE IF NOT EXISTS public.promotion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_designation TEXT NOT NULL,
  current_grade TEXT,
  current_salary DECIMAL(10,2),
  proposed_designation TEXT NOT NULL,
  proposed_grade TEXT,
  proposed_salary DECIMAL(10,2),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  effective_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create payroll_runs table
CREATE TABLE IF NOT EXISTS public.payroll_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'paid')),
  total_employees INTEGER,
  total_gross_salary DECIMAL(10,2),
  total_deductions DECIMAL(10,2),
  total_net_salary DECIMAL(10,2),
  processed_by UUID REFERENCES public.profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Allow users to view and update their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow all authenticated users to view all profiles (role-based access handled in app)
CREATE POLICY "Authenticated users can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow users to insert their own profile (for automatic profile creation)
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow HR and Admin to update all profiles (checked in application code)
CREATE POLICY "HR and Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for employees table
-- Allow users to view their own employee record
CREATE POLICY "Users can view their own employee record" ON public.employees
  FOR SELECT USING (profile_id = auth.uid());

-- Allow authenticated users to view all employee records (role-based access handled in app)
CREATE POLICY "Authenticated users can view all employee records" ON public.employees
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to insert/update employee records (role-based access handled in app)
CREATE POLICY "Authenticated users can insert employee records" ON public.employees
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update employee records" ON public.employees
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for leave_requests table
-- Allow users to view and insert their own leave requests
CREATE POLICY "Users can view their own leave requests" ON public.leave_requests
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "Users can insert their own leave requests" ON public.leave_requests
  FOR INSERT WITH CHECK (employee_id = auth.uid());

-- Allow authenticated users to view and update all leave requests (role-based access handled in app)
CREATE POLICY "Authenticated users can view all leave requests" ON public.leave_requests
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update leave requests" ON public.leave_requests
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for salary_slips table
-- Allow users to view their own salary slips
CREATE POLICY "Users can view their own salary slips" ON public.salary_slips
  FOR SELECT USING (employee_id = auth.uid());

-- Allow authenticated users to view, insert, and update all salary slips (role-based access handled in app)
CREATE POLICY "Authenticated users can view all salary slips" ON public.salary_slips
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert salary slips" ON public.salary_slips
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update salary slips" ON public.salary_slips
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for promotion_requests table
-- Allow users to view and insert their own promotion requests
CREATE POLICY "Users can view their own promotion requests" ON public.promotion_requests
  FOR SELECT USING (employee_id = auth.uid());

CREATE POLICY "Users can insert their own promotion requests" ON public.promotion_requests
  FOR INSERT WITH CHECK (employee_id = auth.uid());

-- Allow authenticated users to view and update all promotion requests (role-based access handled in app)
CREATE POLICY "Authenticated users can view all promotion requests" ON public.promotion_requests
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update promotion requests" ON public.promotion_requests
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for payroll_runs table
-- Allow authenticated users to view, insert, and update payroll runs (role-based access handled in app)
CREATE POLICY "Authenticated users can view payroll runs" ON public.payroll_runs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert payroll runs" ON public.payroll_runs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update payroll runs" ON public.payroll_runs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create policies for audit_logs table
-- Allow authenticated users to view audit logs (role-based access handled in app)
CREATE POLICY "Authenticated users can view audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Create function to handle user profile creation
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
    NEW.raw_user_meta_data->>'user_id',
    NEW.raw_user_meta_data->>'department',
    NULL,  -- designation will be set later
    NULL,  -- grade will be set later
    NULL,  -- joining_date will be set later
    'employee',  -- default role
    true   -- is_active
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_salary_slips_updated_at BEFORE UPDATE ON public.salary_slips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotion_requests_updated_at BEFORE UPDATE ON public.promotion_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_runs_updated_at BEFORE UPDATE ON public.payroll_runs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

