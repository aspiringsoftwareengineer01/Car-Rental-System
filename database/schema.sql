-- Database Initialization Migration Script for Antigravity Car Rental System
-- Target Dialect: PostgreSQL (Supabase)

-- 1. Enable UUID generation if desired
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Cars Fleet Table
CREATE TABLE IF NOT EXISTS public.cars (
    id TEXT PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL DEFAULT 'Gasoline',
    seats INTEGER NOT NULL DEFAULT 5,
    price_per_day NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('BK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9))),
    user_email VARCHAR(255) NOT NULL,
    car_id TEXT NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT check_dates CHECK (return_date >= pickup_date)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Set up RLS Access Policies

-- Cars Policies: Everyone can read cars catalog
CREATE POLICY "Allow public read access to cars" 
ON public.cars FOR SELECT 
TO public 
USING (true);

-- Bookings Policies: Users can only see or add their own bookings
CREATE POLICY "Allow users to read their own bookings" 
ON public.bookings FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow users to insert their own bookings" 
ON public.bookings FOR INSERT 
TO authenticated 
WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Allow users to update their own bookings" 
ON public.bookings FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'email' = user_email)
WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- 6. Insert Premium Fleet Seed Data
INSERT INTO public.cars (id, make, model, type, fuel_type, seats, price_per_day, status)
VALUES
  ('c_tesla_s', 'Tesla', 'Model S Plaid', 'Electric', 'Electric', 5, 5180.00, 'available'),
  ('c_porsche_911', 'Porsche', '911 GT3 RS', 'Sports', 'Gasoline', 2, 5280.00, 'available'),
  ('c_rangerover', 'Range Rover', 'Autobiography', 'SUV', 'Hybrid', 7, 5220.00, 'rented'),
  ('c_audietron', 'Audi', 'e-tron GT', 'Electric', 'Electric', 5, 5190.00, 'available'),
  ('c_bmwm4', 'BMW', 'M4 Competition', 'Sports', 'Gasoline', 4, 5170.00, 'available'),
  ('c_mercedesg63', 'Mercedes-AMG', 'G 63 AMG', 'SUV', 'Gasoline', 5, 5250.00, 'maintenance'),
  ('c_lucidair', 'Lucid', 'Air Sapphire', 'Electric', 'Electric', 5, 5290.00, 'available'),
  ('c_ferrarif8', 'Ferrari', 'F8 Tributo', 'Sports', 'Gasoline', 2, 5380.00, 'available')
ON CONFLICT (id) DO UPDATE 
SET price_per_day = EXCLUDED.price_per_day,
    status = EXCLUDED.status;
