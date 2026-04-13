-- Enable the Website to see total counts for the Admin Dashboard
-- Run this in your Supabase SQL Editor

-- 1. Allow 'anon' role to see count of Profiles
DROP POLICY IF EXISTS "Allow anon count profiles" ON profiles;
CREATE POLICY "Allow anon count profiles" ON profiles 
FOR SELECT TO anon USING (true);

-- 2. Allow 'anon' role to see count of Shops
DROP POLICY IF EXISTS "Allow anon count shops" ON shops;
CREATE POLICY "Allow anon count shops" ON shops 
FOR SELECT TO anon USING (true);

-- 3. Allow 'anon' role to see count of Shop Members
DROP POLICY IF EXISTS "Allow anon count shop_members" ON shop_members;
CREATE POLICY "Allow anon count shop_members" ON shop_members 
FOR SELECT TO anon USING (true);

-- 4. Allow 'anon' role to see Activity Logs (for the dashboard feed)
DROP POLICY IF EXISTS "Allow anon read activity" ON activity_logs;
CREATE POLICY "Allow anon read activity" ON activity_logs 
FOR SELECT TO anon USING (true);
