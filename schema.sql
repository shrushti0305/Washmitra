-- ============================================================================
-- WASHMITRA PRODUCTION DATABASE SCHEMA (Supabase PostgreSQL)
-- Clean, Consolidated Single-Source-of-Truth Schema
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE
-- Extends Supabase auth.users with app-specific profile metadata
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  name TEXT, -- Alias for backward compatibility
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('CUSTOMER', 'WASHMITRA', 'INSTITUTION', 'ADMIN')) DEFAULT 'CUSTOMER',
  avatar_url TEXT,
  district TEXT DEFAULT 'Pune',
  location TEXT,
  location_address TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  is_paid BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. SERVICE CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. SERVICES TABLE
-- Individual services bookable by customers and institutions
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  name TEXT,
  description TEXT,
  base_price NUMERIC(10,2) DEFAULT 0,
  labor_charge NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. TRAINING BATCHES TABLE
-- Vocational skilling modules for aspiring WASH Mitras
-- ============================================================================
CREATE TABLE IF NOT EXISTS training_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade TEXT NOT NULL,
  title TEXT,
  batch_number TEXT,
  duration_days INTEGER DEFAULT 10,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  start_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. WASHMART ITEMS TABLE
-- Hardware, tools, and replacement components for field operators
-- ============================================================================
CREATE TABLE IF NOT EXISTS washmart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. BOOKINGS TABLE
-- End-to-end service booking lifecycle
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  washmitra_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  name TEXT,
  phone TEXT,
  service TEXT,
  description TEXT,
  location TEXT,
  address TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  scheduled_date TIMESTAMPTZ DEFAULT NOW(),
  total_price NUMERIC(10,2) DEFAULT 0,
  visit_charge NUMERIC(10,2) DEFAULT 0,
  travel_charge NUMERIC(10,2) DEFAULT 0,
  labor_charge NUMERIC(10,2) DEFAULT 0,
  otp_code TEXT,
  status TEXT CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'BILLED', 'CANCELLED')) DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. TRANSACTIONS TABLE
-- Financial ledger for fee gate, training courses, and service invoices
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  full_name TEXT,
  mobile_number TEXT,
  amount NUMERIC(10,2) NOT NULL,
  payment_type TEXT DEFAULT 'ONBOARDING_FEE', -- 'ONBOARDING_FEE', 'TRAINING_COURSE', 'SERVICE_INVOICE'
  payment_method TEXT DEFAULT 'UPI', -- 'UPI', 'NETBANKING', 'CARD'
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. CONTACT MESSAGES TABLE
-- Public website contact inquiries with honeypot validation
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. NOTIFICATIONS TABLE
-- Real-time in-app alerts for users and operators
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'INFO', -- 'INFO', 'SUCCESS', 'WARNING', 'ALERT'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. WORK GALLERY TABLE
-- Verified proof-of-work photos uploaded by certified technicians
-- ============================================================================
CREATE TABLE IF NOT EXISTS work_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mitra_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATED USER CREATION TRIGGER
-- Ensures every new auth.users signup gets a profile row automatically
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    name = EXCLUDED.name,
    email = COALESCE(EXCLUDED.email, profiles.email),
    phone = COALESCE(EXCLUDED.phone, profiles.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE washmart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_gallery ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Public Catalog Read Policies (Categories, Services, Training, WashMart, Gallery)
CREATE POLICY "Anyone can view active service categories"
  ON service_categories FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active training batches"
  ON training_batches FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active washmart items"
  ON washmart_items FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view work gallery photos"
  ON work_gallery FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload work gallery items"
  ON work_gallery FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Bookings Policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = washmitra_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Involved parties can update bookings"
  ON bookings FOR UPDATE USING (
    auth.uid() = user_id OR auth.uid() = washmitra_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
  );

-- 4. Transactions Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT USING (
    auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Contact Messages Policies
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN'
  );

-- 6. Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA (Default Services & Training Batches)
-- ============================================================================
INSERT INTO service_categories (id, name, icon, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Plumbing', 'Wrench', 'Pipe repair, tap installation, RO filter setup, and drainage'),
  ('22222222-2222-2222-2222-222222222222', 'Electrical', 'Zap', 'Wiring repair, MCB fix, pump motor maintenance, and switches'),
  ('33333333-3333-3333-3333-333333333333', 'Solar Systems', 'Sun', 'Solar water heater repair, PV panel cleaning, and battery check'),
  ('44444444-4444-4444-4444-444444444444', 'Sanitation', 'Droplets', 'Toilet block repair, septic tank audit, and wastewater clearance')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, category_id, title, name, description, base_price, labor_charge)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Leakage & Pipe Repair', 'Leakage & Pipe Repair', 'Emergency leak repair, joint seal, and pipeline restoration', 299, 150),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'RO & Water Filter Service', 'RO & Water Filter Service', 'Membrane replacement, TDS test, and filter flushing', 499, 200),
  ('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Motor Pump Electrical Fix', 'Motor Pump Electrical Fix', 'Starter repair, wiring fix, and phase check', 349, 150),
  ('a4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Solar Water Heater Audit', 'Solar Water Heater Audit', 'Collector cleaning, scale removal, and leak check', 599, 250)
ON CONFLICT (id) DO NOTHING;

INSERT INTO training_batches (id, trade, title, batch_number, duration_days, fee, start_date)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Master Plumber', 'Master Plumbing Certification', 'Batch 06', 10, 4500, CURRENT_DATE + INTERVAL '7 days'),
  ('b2222222-2222-2222-2222-222222222222', 'Electrical Audit', 'Certified Electrical Maintenance', 'Batch 05', 10, 4500, CURRENT_DATE + INTERVAL '10 days'),
  ('b3333333-3333-3333-3333-333333333333', 'Solar Technician', 'Solar PV & Pump Specialist', 'Batch 04', 4, 3000, CURRENT_DATE + INTERVAL '14 days'),
  ('b4444444-4444-4444-4444-444444444444', 'Comprehensive WASH Mitra', 'All-Trade WASH Enterprise Program', 'Batch 03', 18, 7500, CURRENT_DATE + INTERVAL '21 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO washmart_items (id, name, description, price, category, stock_quantity)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Professional Plumbing Toolbag', 'Complete 18-piece wrench and pipe threader kit', 1850, 'Toolkits', 25),
  ('c2222222-2222-2222-2222-222222222222', 'Digital TDS & Water Testing Pen', 'Calibrated sensor for drinking water testing', 650, 'Diagnostics', 50),
  ('c3333333-3333-3333-3333-333333333333', 'Heavy-Duty Submersible Wire (30m)', 'Weatherproof 3-core copper pump cable', 2400, 'Electrical', 15)
ON CONFLICT (id) DO NOTHING;
