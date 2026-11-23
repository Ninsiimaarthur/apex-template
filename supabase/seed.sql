-- =====================================================================
-- Seed data: Apex Solar & Electrical demo content
-- Run AFTER schema.sql. Safe to re-run: it never overwrites existing
-- settings and only inserts services/projects into EMPTY tables.
-- =====================================================================

-- Business settings (single row)
insert into public.site_settings
  (id, business_name, tagline, phone, whatsapp, email, address, hours, hero_title, hero_subtitle)
values (
  1,
  'Apex Solar & Electrical',
  'Power your home. Cut your bills.',
  '+256 700 000 000',
  '256700000000',
  'info@apexsolar.example',
  'Plot 12, Example Road, Kampala, Uganda',
  '[
    {"days": "Mon – Fri", "time": "8:00 AM – 6:00 PM"},
    {"days": "Saturday", "time": "9:00 AM – 2:00 PM"},
    {"days": "Sunday", "time": "Emergency call-outs only"}
  ]'::jsonb,
  'Solar and electrical work done right, the first time.',
  'From rooftop solar and battery backup to full rewiring, our certified team keeps your lights on and your bills down. Free site survey, fixed written quotes.'
)
on conflict (id) do nothing;

-- Products & services
insert into public.services_products
  (title, category, description, price_ugx, features_list, is_featured, sort_order)
select * from (values
  ('Home Starter Solar', 'Solar',
   'Essential solar for lights, TV, fridge and Wi-Fi, with battery backup.',
   8500000::bigint,
   array['3 kW hybrid inverter', '5 kWh battery', '6 solar panels', '2-year warranty'],
   false, 10),
  ('Home Plus Solar', 'Solar',
   'Whole-home backup including pumps and heavier appliances.',
   18000000::bigint,
   array['5 kW hybrid inverter', '10 kWh battery', '12 solar panels', '5-year warranty'],
   true, 20),
  ('Business Solar', 'Solar',
   'Custom systems for shops, clinics, offices and small factories.',
   null::bigint,
   array['10 kW+ systems', 'Load analysis', 'Monitoring dashboard', 'Maintenance plan'],
   false, 30),
  ('Electrical Wiring', 'Electrical',
   'Full residential and commercial wiring by certified electricians, including distribution boards, earthing and compliance certificates.',
   null::bigint,
   array['New-build wiring', 'Rewiring and upgrades', 'Distribution boards', 'Earthing and surge protection'],
   true, 40),
  ('Backup Power & Batteries', 'Backup Power',
   'Silent, fuel-free backup power. We retrofit batteries to existing solar systems or supply standalone inverter-battery packages.',
   null::bigint,
   array['Inverter and battery packs', 'Solar retrofits', 'Generator changeover switches', 'Load management'],
   true, 50),
  ('Maintenance & Repairs', 'Maintenance',
   'Scheduled maintenance plans and rapid fault repair for solar and electrical systems, whoever installed them.',
   null::bigint,
   array['Panel cleaning and inspection', 'Inverter diagnostics', 'Emergency call-outs', 'Annual service plans'],
   false, 60),
  ('Commercial Solutions', 'Commercial',
   'Larger systems engineered for commercial loads, with ROI projections so the numbers make sense before you commit.',
   null::bigint,
   array['ROI and payback analysis', 'Three-phase systems', 'Project management', 'Financing support'],
   false, 70),
  ('Energy Audits', 'Energy Audits',
   'A clear, written audit of your consumption with practical recommendations, whether or not you go solar.',
   null::bigint,
   array['Consumption analysis', 'Efficiency recommendations', 'Solar sizing report', 'Written summary'],
   false, 80)
) as v(title, category, description, price_ugx, features_list, is_featured, sort_order)
where not exists (select 1 from public.services_products);

-- Projects (staggered dates keep the listed order, newest first)
insert into public.projects
  (title, category, location, specs, summary, created_at)
select * from (values
  ('Hillside Family Home', 'Residential Solar', 'Kampala',
   '5 kW hybrid · 10 kWh battery',
   'Rooftop solar with battery backup, cutting grid use by around 70%.',
   now() - interval '1 day'),
  ('Greenfield Supermarket', 'Commercial', 'Entebbe',
   '20 kW rooftop · grid-tied',
   'Commercial rooftop solar cutting power bills by 60%.',
   now() - interval '2 days'),
  ('Lakeview Clinic', 'Commercial', 'Jinja',
   '8 kW hybrid · 15 kWh battery',
   'Battery backup for critical medical equipment.',
   now() - interval '3 days'),
  ('Sunrise Apartments', 'Electrical Wiring', 'Kampala',
   '24 units · 3-phase boards',
   'Distribution boards, wiring and earthing for a 24-unit block.',
   now() - interval '4 days'),
  ('Nile Bottlers Plant', 'Electrical Wiring', 'Jinja',
   'Three-phase upgrade · 45 kVA',
   'Power upgrade and load monitoring for a production line.',
   now() - interval '5 days'),
  ('Kololo Villa', 'Residential Solar', 'Kampala',
   '8 kW hybrid · 10 kWh battery',
   'Whole-home backup with smart monitoring.',
   now() - interval '6 days')
) as v(title, category, location, specs, summary, created_at)
where not exists (select 1 from public.projects);
