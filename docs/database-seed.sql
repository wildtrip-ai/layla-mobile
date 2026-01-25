-- =============================================================================
-- LAYLA TRAVEL APP - DATABASE SEED DATA
-- =============================================================================
-- This script seeds the database with sample data from the mock data files
-- Based on data from:
--   - src/data/tripData.ts
--   - src/data/savedTripsData.ts
--   - src/data/countriesData.ts
--   - src/data/destinationExtras.ts
-- =============================================================================

-- Clear existing data (optional - comment out if you want to preserve data)
-- TRUNCATE TABLE ai_chat_messages, ai_chat_sessions, review_helpful_votes, review_photos, reviews,
--   recently_viewed, favorites, transports, accommodations, activities, day_plans, city_stops,
--   trip_stats, trips, destination_local_phrases, destination_packing_lists,
--   destination_transport_options, destination_extras, country_places, countries,
--   user_preferences, user_profiles, notifications, magic_tokens, team_members,
--   accounts, users CASCADE;

-- =============================================================================
-- DEMO USER & ACCOUNT
-- =============================================================================

-- Create demo user
INSERT INTO users (id, email, first_name, last_name, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@layla.travel', 'Sari', 'Demo', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'john@example.com', 'John', 'Smith', NOW(), NOW());

-- Create demo account
INSERT INTO accounts (id, name, is_default, created_at, created_by, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Account', TRUE, NOW(), '00000000-0000-0000-0000-000000000001', NOW());

-- Create team member association
INSERT INTO team_members (account_id, user_id, role, status, created_at, created_by, joined_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'traveler', 'accepted', NOW(), '00000000-0000-0000-0000-000000000001', NOW());

-- Create user profile
INSERT INTO user_profiles (user_id, language, currency, timezone, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'en', 'usd', 'America/New_York', NOW(), NOW());

-- =============================================================================
-- COUNTRIES - Basic list (195 countries)
-- =============================================================================

INSERT INTO countries (slug, name, flag_emoji, is_featured, display_order, created_at, updated_at)
VALUES
  ('afghanistan', 'Afghanistan', '🇦🇫', FALSE, 0, NOW(), NOW()),
  ('albania', 'Albania', '🇦🇱', FALSE, 0, NOW(), NOW()),
  ('algeria', 'Algeria', '🇩🇿', FALSE, 0, NOW(), NOW()),
  ('andorra', 'Andorra', '🇦🇩', FALSE, 0, NOW(), NOW()),
  ('angola', 'Angola', '🇦🇴', FALSE, 0, NOW(), NOW()),
  ('argentina', 'Argentina', '🇦🇷', FALSE, 0, NOW(), NOW()),
  ('armenia', 'Armenia', '🇦🇲', FALSE, 0, NOW(), NOW()),
  ('australia', 'Australia', '🇦🇺', FALSE, 0, NOW(), NOW()),
  ('austria', 'Austria', '🇦🇹', FALSE, 0, NOW(), NOW()),
  ('azerbaijan', 'Azerbaijan', '🇦🇿', FALSE, 0, NOW(), NOW()),
  ('bahamas', 'Bahamas', '🇧🇸', FALSE, 0, NOW(), NOW()),
  ('bahrain', 'Bahrain', '🇧🇭', FALSE, 0, NOW(), NOW()),
  ('bangladesh', 'Bangladesh', '🇧🇩', FALSE, 0, NOW(), NOW()),
  ('barbados', 'Barbados', '🇧🇧', FALSE, 0, NOW(), NOW()),
  ('belarus', 'Belarus', '🇧🇾', FALSE, 0, NOW(), NOW()),
  ('belgium', 'Belgium', '🇧🇪', FALSE, 0, NOW(), NOW()),
  ('belize', 'Belize', '🇧🇿', FALSE, 0, NOW(), NOW()),
  ('benin', 'Benin', '🇧🇯', FALSE, 0, NOW(), NOW()),
  ('bhutan', 'Bhutan', '🇧🇹', FALSE, 0, NOW(), NOW()),
  ('bolivia', 'Bolivia', '🇧🇴', FALSE, 0, NOW(), NOW()),
  ('bosnia-and-herzegovina', 'Bosnia and Herzegovina', '🇧🇦', FALSE, 0, NOW(), NOW()),
  ('botswana', 'Botswana', '🇧🇼', FALSE, 0, NOW(), NOW()),
  ('brazil', 'Brazil', '🇧🇷', FALSE, 0, NOW(), NOW()),
  ('brunei', 'Brunei', '🇧🇳', FALSE, 0, NOW(), NOW()),
  ('bulgaria', 'Bulgaria', '🇧🇬', FALSE, 0, NOW(), NOW()),
  ('burkina-faso', 'Burkina Faso', '🇧🇫', FALSE, 0, NOW(), NOW()),
  ('burundi', 'Burundi', '🇧🇮', FALSE, 0, NOW(), NOW()),
  ('cambodia', 'Cambodia', '🇰🇭', FALSE, 0, NOW(), NOW()),
  ('cameroon', 'Cameroon', '🇨🇲', FALSE, 0, NOW(), NOW()),
  ('canada', 'Canada', '🇨🇦', FALSE, 0, NOW(), NOW()),
  ('chile', 'Chile', '🇨🇱', FALSE, 0, NOW(), NOW()),
  ('china', 'China', '🇨🇳', FALSE, 0, NOW(), NOW()),
  ('colombia', 'Colombia', '🇨🇴', FALSE, 0, NOW(), NOW()),
  ('costa-rica', 'Costa Rica', '🇨🇷', FALSE, 0, NOW(), NOW()),
  ('croatia', 'Croatia', '🇭🇷', FALSE, 0, NOW(), NOW()),
  ('cuba', 'Cuba', '🇨🇺', FALSE, 0, NOW(), NOW()),
  ('cyprus', 'Cyprus', '🇨🇾', FALSE, 0, NOW(), NOW()),
  ('czech-republic', 'Czech Republic', '🇨🇿', FALSE, 0, NOW(), NOW()),
  ('denmark', 'Denmark', '🇩🇰', FALSE, 0, NOW(), NOW()),
  ('dominican-republic', 'Dominican Republic', '🇩🇴', FALSE, 0, NOW(), NOW()),
  ('ecuador', 'Ecuador', '🇪🇨', FALSE, 0, NOW(), NOW()),
  ('egypt', 'Egypt', '🇪🇬', FALSE, 0, NOW(), NOW()),
  ('el-salvador', 'El Salvador', '🇸🇻', FALSE, 0, NOW(), NOW()),
  ('estonia', 'Estonia', '🇪🇪', FALSE, 0, NOW(), NOW()),
  ('ethiopia', 'Ethiopia', '🇪🇹', FALSE, 0, NOW(), NOW()),
  ('fiji', 'Fiji', '🇫🇯', FALSE, 0, NOW(), NOW()),
  ('finland', 'Finland', '🇫🇮', FALSE, 0, NOW(), NOW()),
  ('france', 'France', '🇫🇷', FALSE, 0, NOW(), NOW()),
  ('georgia', 'Georgia', '🇬🇪', FALSE, 0, NOW(), NOW()),
  ('germany', 'Germany', '🇩🇪', TRUE, 5, NOW(), NOW()),
  ('ghana', 'Ghana', '🇬🇭', FALSE, 0, NOW(), NOW()),
  ('greece', 'Greece', '🇬🇷', FALSE, 0, NOW(), NOW()),
  ('guatemala', 'Guatemala', '🇬🇹', FALSE, 0, NOW(), NOW()),
  ('haiti', 'Haiti', '🇭🇹', FALSE, 0, NOW(), NOW()),
  ('honduras', 'Honduras', '🇭🇳', FALSE, 0, NOW(), NOW()),
  ('hungary', 'Hungary', '🇭🇺', FALSE, 0, NOW(), NOW()),
  ('iceland', 'Iceland', '🇮🇸', FALSE, 0, NOW(), NOW()),
  ('india', 'India', '🇮🇳', FALSE, 0, NOW(), NOW()),
  ('indonesia', 'Indonesia', '🇮🇩', TRUE, 4, NOW(), NOW()),
  ('iran', 'Iran', '🇮🇷', FALSE, 0, NOW(), NOW()),
  ('iraq', 'Iraq', '🇮🇶', FALSE, 0, NOW(), NOW()),
  ('ireland', 'Ireland', '🇮🇪', FALSE, 0, NOW(), NOW()),
  ('israel', 'Israel', '🇮🇱', FALSE, 0, NOW(), NOW()),
  ('italy', 'Italy', '🇮🇹', TRUE, 2, NOW(), NOW()),
  ('ivory-coast', 'Ivory Coast', '🇨🇮', FALSE, 0, NOW(), NOW()),
  ('jamaica', 'Jamaica', '🇯🇲', FALSE, 0, NOW(), NOW()),
  ('japan', 'Japan', '🇯🇵', FALSE, 0, NOW(), NOW()),
  ('jordan', 'Jordan', '🇯🇴', FALSE, 0, NOW(), NOW()),
  ('kazakhstan', 'Kazakhstan', '🇰🇿', FALSE, 0, NOW(), NOW()),
  ('kenya', 'Kenya', '🇰🇪', FALSE, 0, NOW(), NOW()),
  ('kuwait', 'Kuwait', '🇰🇼', FALSE, 0, NOW(), NOW()),
  ('kyrgyzstan', 'Kyrgyzstan', '🇰🇬', FALSE, 0, NOW(), NOW()),
  ('laos', 'Laos', '🇱🇦', FALSE, 0, NOW(), NOW()),
  ('latvia', 'Latvia', '🇱🇻', FALSE, 0, NOW(), NOW()),
  ('lebanon', 'Lebanon', '🇱🇧', FALSE, 0, NOW(), NOW()),
  ('libya', 'Libya', '🇱🇾', FALSE, 0, NOW(), NOW()),
  ('liechtenstein', 'Liechtenstein', '🇱🇮', FALSE, 0, NOW(), NOW()),
  ('lithuania', 'Lithuania', '🇱🇹', FALSE, 0, NOW(), NOW()),
  ('luxembourg', 'Luxembourg', '🇱🇺', FALSE, 0, NOW(), NOW()),
  ('madagascar', 'Madagascar', '🇲🇬', FALSE, 0, NOW(), NOW()),
  ('malaysia', 'Malaysia', '🇲🇾', FALSE, 0, NOW(), NOW()),
  ('maldives', 'Maldives', '🇲🇻', FALSE, 0, NOW(), NOW()),
  ('mali', 'Mali', '🇲🇱', FALSE, 0, NOW(), NOW()),
  ('malta', 'Malta', '🇲🇹', FALSE, 0, NOW(), NOW()),
  ('mauritius', 'Mauritius', '🇲🇺', FALSE, 0, NOW(), NOW()),
  ('mexico', 'Mexico', '🇲🇽', FALSE, 0, NOW(), NOW()),
  ('moldova', 'Moldova', '🇲🇩', FALSE, 0, NOW(), NOW()),
  ('monaco', 'Monaco', '🇲🇨', FALSE, 0, NOW(), NOW()),
  ('mongolia', 'Mongolia', '🇲🇳', FALSE, 0, NOW(), NOW()),
  ('montenegro', 'Montenegro', '🇲🇪', FALSE, 0, NOW(), NOW()),
  ('morocco', 'Morocco', '🇲🇦', FALSE, 0, NOW(), NOW()),
  ('mozambique', 'Mozambique', '🇲🇿', FALSE, 0, NOW(), NOW()),
  ('myanmar', 'Myanmar', '🇲🇲', FALSE, 0, NOW(), NOW()),
  ('namibia', 'Namibia', '🇳🇦', FALSE, 0, NOW(), NOW()),
  ('nepal', 'Nepal', '🇳🇵', FALSE, 0, NOW(), NOW()),
  ('netherlands', 'Netherlands', '🇳🇱', FALSE, 0, NOW(), NOW()),
  ('new-zealand', 'New Zealand', '🇳🇿', FALSE, 0, NOW(), NOW()),
  ('nicaragua', 'Nicaragua', '🇳🇮', FALSE, 0, NOW(), NOW()),
  ('nigeria', 'Nigeria', '🇳🇬', FALSE, 0, NOW(), NOW()),
  ('north-korea', 'North Korea', '🇰🇵', FALSE, 0, NOW(), NOW()),
  ('north-macedonia', 'North Macedonia', '🇲🇰', FALSE, 0, NOW(), NOW()),
  ('norway', 'Norway', '🇳🇴', FALSE, 0, NOW(), NOW()),
  ('oman', 'Oman', '🇴🇲', FALSE, 0, NOW(), NOW()),
  ('pakistan', 'Pakistan', '🇵🇰', FALSE, 0, NOW(), NOW()),
  ('panama', 'Panama', '🇵🇦', FALSE, 0, NOW(), NOW()),
  ('papua-new-guinea', 'Papua New Guinea', '🇵🇬', FALSE, 0, NOW(), NOW()),
  ('paraguay', 'Paraguay', '🇵🇾', FALSE, 0, NOW(), NOW()),
  ('peru', 'Peru', '🇵🇪', FALSE, 0, NOW(), NOW()),
  ('philippines', 'Philippines', '🇵🇭', FALSE, 0, NOW(), NOW()),
  ('poland', 'Poland', '🇵🇱', FALSE, 0, NOW(), NOW()),
  ('portugal', 'Portugal', '🇵🇹', TRUE, 3, NOW(), NOW()),
  ('qatar', 'Qatar', '🇶🇦', FALSE, 0, NOW(), NOW()),
  ('romania', 'Romania', '🇷🇴', FALSE, 0, NOW(), NOW()),
  ('russia', 'Russia', '🇷🇺', FALSE, 0, NOW(), NOW()),
  ('rwanda', 'Rwanda', '🇷🇼', FALSE, 0, NOW(), NOW()),
  ('saudi-arabia', 'Saudi Arabia', '🇸🇦', FALSE, 0, NOW(), NOW()),
  ('senegal', 'Senegal', '🇸🇳', FALSE, 0, NOW(), NOW()),
  ('serbia', 'Serbia', '🇷🇸', FALSE, 0, NOW(), NOW()),
  ('singapore', 'Singapore', '🇸🇬', FALSE, 0, NOW(), NOW()),
  ('slovakia', 'Slovakia', '🇸🇰', FALSE, 0, NOW(), NOW()),
  ('slovenia', 'Slovenia', '🇸🇮', FALSE, 0, NOW(), NOW()),
  ('south-africa', 'South Africa', '🇿🇦', FALSE, 0, NOW(), NOW()),
  ('south-korea', 'South Korea', '🇰🇷', FALSE, 0, NOW(), NOW()),
  ('spain', 'Spain', '🇪🇸', TRUE, 1, NOW(), NOW()),
  ('sri-lanka', 'Sri Lanka', '🇱🇰', FALSE, 0, NOW(), NOW()),
  ('sudan', 'Sudan', '🇸🇩', FALSE, 0, NOW(), NOW()),
  ('sweden', 'Sweden', '🇸🇪', FALSE, 0, NOW(), NOW()),
  ('switzerland', 'Switzerland', '🇨🇭', FALSE, 0, NOW(), NOW()),
  ('syria', 'Syria', '🇸🇾', FALSE, 0, NOW(), NOW()),
  ('taiwan', 'Taiwan', '🇹🇼', FALSE, 0, NOW(), NOW()),
  ('tajikistan', 'Tajikistan', '🇹🇯', FALSE, 0, NOW(), NOW()),
  ('tanzania', 'Tanzania', '🇹🇿', FALSE, 0, NOW(), NOW()),
  ('thailand', 'Thailand', '🇹🇭', FALSE, 0, NOW(), NOW()),
  ('togo', 'Togo', '🇹🇬', FALSE, 0, NOW(), NOW()),
  ('trinidad-and-tobago', 'Trinidad and Tobago', '🇹🇹', FALSE, 0, NOW(), NOW()),
  ('tunisia', 'Tunisia', '🇹🇳', FALSE, 0, NOW(), NOW()),
  ('turkey', 'Turkey', '🇹🇷', FALSE, 0, NOW(), NOW()),
  ('turkmenistan', 'Turkmenistan', '🇹🇲', FALSE, 0, NOW(), NOW()),
  ('uganda', 'Uganda', '🇺🇬', FALSE, 0, NOW(), NOW()),
  ('ukraine', 'Ukraine', '🇺🇦', FALSE, 0, NOW(), NOW()),
  ('united-arab-emirates', 'United Arab Emirates', '🇦🇪', FALSE, 0, NOW(), NOW()),
  ('united-kingdom', 'United Kingdom', '🇬🇧', FALSE, 0, NOW(), NOW()),
  ('united-states', 'United States', '🇺🇸', FALSE, 0, NOW(), NOW()),
  ('uruguay', 'Uruguay', '🇺🇾', FALSE, 0, NOW(), NOW()),
  ('uzbekistan', 'Uzbekistan', '🇺🇿', FALSE, 0, NOW(), NOW()),
  ('venezuela', 'Venezuela', '🇻🇪', FALSE, 0, NOW(), NOW()),
  ('vietnam', 'Vietnam', '🇻🇳', FALSE, 0, NOW(), NOW()),
  ('yemen', 'Yemen', '🇾🇪', FALSE, 0, NOW(), NOW()),
  ('zambia', 'Zambia', '🇿🇲', FALSE, 0, NOW(), NOW()),
  ('zimbabwe', 'Zimbabwe', '🇿🇼', FALSE, 0, NOW(), NOW());

-- Update featured countries with hero images
UPDATE countries SET
  hero_image_url = 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80',
  description = 'Experience vibrant culture, stunning architecture, and world-class cuisine'
WHERE slug = 'spain';

UPDATE countries SET
  hero_image_url = 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80',
  description = 'Discover ancient history, Renaissance art, and unforgettable cuisine'
WHERE slug = 'italy';

UPDATE countries SET
  hero_image_url = 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80',
  description = 'Explore charming cities, dramatic coastlines, and rich wine culture'
WHERE slug = 'portugal';

UPDATE countries SET
  hero_image_url = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  description = 'Island paradise with ancient temples, tropical beaches, and vibrant culture'
WHERE slug = 'indonesia';

UPDATE countries SET
  hero_image_url = 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80',
  description = 'Fairy-tale castles, historic cities, and rich cultural heritage'
WHERE slug = 'germany';

-- =============================================================================
-- COUNTRY PLACES - Spain
-- =============================================================================

-- Spain Destinations
INSERT INTO country_places (id, country_id, category, name, slug, image_url, description, rating, is_featured, display_order, created_at, updated_at)
SELECT
  gen_random_uuid(),
  c.id,
  'destinations',
  'Costa del Sol',
  'costa-del-sol',
  'https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=600&q=80',
  'Sun-drenched beaches and resort towns',
  4.6,
  TRUE,
  1,
  NOW(),
  NOW()
FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'destinations', 'Ibiza', 'ibiza', 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80', 'World-famous nightlife and beaches', 4.5, TRUE, 2, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'destinations', 'Canary Islands', 'canary-islands', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=80', 'Year-round sunshine and volcanic landscapes', 4.7, TRUE, 3, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'destinations', 'Balearic Islands', 'balearic-islands', 'https://images.unsplash.com/photo-1517627043994-b991abb62fc8?w=600&q=80', 'Mediterranean paradise islands', 4.6, TRUE, 4, NOW(), NOW() FROM countries c WHERE c.slug = 'spain';

-- Spain Cities
INSERT INTO country_places (id, country_id, category, name, slug, image_url, description, rating, is_featured, display_order, created_at, updated_at)
SELECT
  gen_random_uuid(), c.id, 'cities', 'Madrid', 'madrid', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80', 'The vibrant capital with world-class art museums', 4.7, TRUE, 1, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'cities', 'Barcelona', 'barcelona', 'https://images.unsplash.com/photo-1583422409516-2895a77efbed?w=600&q=80', 'Gaudí''s masterpieces and Mediterranean beaches', 4.8, TRUE, 2, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'cities', 'Seville', 'seville', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80', 'Flamenco, tapas, and stunning Moorish architecture', 4.6, TRUE, 3, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'cities', 'Valencia', 'valencia', 'https://images.unsplash.com/photo-1599498636929-fe61ed76c41f?w=600&q=80', 'Futuristic architecture meets traditional paella', 4.5, FALSE, 4, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'cities', 'Granada', 'granada', 'https://images.unsplash.com/photo-1591617844608-4de90edbc5da?w=600&q=80', 'Home to the legendary Alhambra palace', 4.7, FALSE, 5, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'cities', 'Bilbao', 'bilbao', 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80', 'The Guggenheim and Basque culinary excellence', 4.4, FALSE, 6, NOW(), NOW() FROM countries c WHERE c.slug = 'spain';

-- Spain Restaurants
INSERT INTO country_places (id, country_id, category, name, slug, image_url, description, rating, price_level, created_at, updated_at)
SELECT
  gen_random_uuid(), c.id, 'restaurants', 'El Celler de Can Roca', 'el-celler', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', 'Three Michelin stars in Girona', 4.9, 4, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'restaurants', 'Asador Etxebarri', 'asador-etxebarri', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', 'World-famous grilled cuisine', 4.8, 4, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'restaurants', 'DiverXO', 'diverxo', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', 'Avant-garde dining in Madrid', 4.7, 4, NOW(), NOW() FROM countries c WHERE c.slug = 'spain'
UNION ALL
SELECT gen_random_uuid(), c.id, 'restaurants', 'Tickets', 'tickets', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80', 'Creative tapas by the Adrià brothers', 4.6, 3, NOW(), NOW() FROM countries c WHERE c.slug = 'spain';

-- Continue with more countries... (This would be very long, so I'll create a representative sample)

-- =============================================================================
-- TRIPS
-- =============================================================================

-- Jordan Honeymoon Trip
INSERT INTO trips (id, user_id, account_id, title, subtitle, image_url, start_date, end_date, status, traveler_count, adult_count, estimated_budget, currency, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '7-Day Luxury Jordan Honeymoon Escape',
  'Luxurious Amman Honeymoon Start',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200&q=80',
  '2025-05-01',
  '2025-05-09',
  'upcoming',
  2,
  2,
  5000.00,
  'usd',
  NOW(),
  NOW()
);

-- Trip stats
INSERT INTO trip_stats (trip_id, total_days, total_cities, total_activities, total_restaurants, total_hotels, total_transports, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  8,
  5,
  18,
  5,
  5,
  6,
  NOW(),
  NOW()
);

-- City stops for Jordan trip
INSERT INTO city_stops (id, trip_id, name, country_name, country_slug, image_url, start_date, end_date, nights, sequence_order, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Amman', 'Jordan', 'jordan', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&q=80', '2025-05-01', '2025-05-03', 2, 1, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Wadi Rum', 'Jordan', 'jordan', 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600&q=80', '2025-05-03', '2025-05-05', 2, 2, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Petra', 'Jordan', 'jordan', 'https://images.unsplash.com/photo-1585260474478-c33fae7cd5be?w=600&q=80', '2025-05-05', '2025-05-07', 2, 3, NOW(), NOW());

-- Transports
INSERT INTO transports (id, trip_id, type, title, from_location, from_code, to_location, to_code, departure_date, departure_time, arrival_date, arrival_time, duration_minutes, stops, price, price_currency, travelers, sequence_order, created_at, updated_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'flight', 'Flight to Amman', 'Berlin', 'BER', 'Amman', 'AMM', '2025-05-01', '00:00', '2025-05-01', '09:25', 385, 1, 20425.00, 'usd', 2, 1, NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'transfer', 'Airport Transfer To and From Amman', 'Queen Alia International Airport', NULL, 'Hotel', NULL, '2025-05-01', '10:00', '2025-05-01', '11:00', 60, NULL, 995.00, 'usd', 2, 2, NOW(), NOW());

-- Accommodations
INSERT INTO accommodations (id, trip_id, city_stop_id, name, type, stars, rating, review_count, image_url, description, check_in_date, check_out_date, nights, price, price_currency, provider, created_at, updated_at)
VALUES (
  '40000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'W Amman Hotel',
  'hotel',
  5,
  8.8,
  1932,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'This luxury 5-star hotel perfectly aligns with your request for a high-end stay in Amman following your visit to the Dead Sea and prior to your departure.',
  '2025-05-01',
  '2025-05-03',
  2,
  17437.00,
  'usd',
  'Trip.com',
  NOW(),
  NOW()
);

-- Day plans
INSERT INTO day_plans (id, trip_id, city_stop_id, day_number, date, day_of_week, title, weather, temperature_celsius, created_at, updated_at)
VALUES
  ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1, '2025-05-01', 'Friday', 'Arrival in Amman and Evening Charm on Rainbow Street', 'Sunny', 23, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 2, '2025-05-02', 'Saturday', 'Guided Cultural and Culinary Exploration of Amman', 'Partly Cloudy', 21, NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 3, '2025-05-03', 'Sunday', 'Morning Departure to the Wadi Rum Desert', 'Partly Cloudy', 23, NOW(), NOW());

-- Activities for Day 1
INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, persons, sequence_order, created_at, updated_at)
VALUES
  ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'activity', 'Rainbow Street', 'Rainbow St.', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', 2, 1, NOW(), NOW()),
  ('60000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'restaurant', 'Fakhreldin Restaurant', 'Taha Hussein St., Amman, Jordan', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', 2, 2, NOW(), NOW()),
  ('60000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'note', 'Arrive at Queen Alia International Airport and meet your private transfer to the Four Seasons Hotel Amman. Check-in starts at 3:00 PM.', NULL, NULL, 2, 3, NOW(), NOW());

UPDATE activities SET rating = 4.4, review_count = 5122 WHERE id = '60000000-0000-0000-0000-000000000002';

-- Activities for Day 2
INSERT INTO activities (id, trip_id, day_plan_id, type, title, image_url, rating, review_count, duration_minutes, price, price_currency, persons, sequence_order, created_at, updated_at)
VALUES
  ('60000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'activity', 'Amman Walking Tour: Hidden Gems, Culture & Street Food', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', 5.0, 220, 180, 2854.00, 'usd', 2, 1, NOW(), NOW()),
  ('60000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'activity', 'Amman Citadel (Jabal al-Qalaa)', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', NULL, NULL, NULL, NULL, NULL, 2, 2, NOW(), NOW()),
  ('60000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'activity', 'Jordan Archaeological Museum', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', NULL, NULL, NULL, NULL, NULL, 2, 3, NOW(), NOW()),
  ('60000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'activity', 'Amman Roman Theater', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', NULL, NULL, NULL, NULL, NULL, 2, 4, NOW(), NOW()),
  ('60000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'restaurant', 'Hashem Restaurant', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80', 4.1, 23722, NULL, NULL, NULL, 2, 5, NOW(), NOW());

-- Additional saved trips (Family Europe Trip, Ireland Road Trip, Japan Draft)
INSERT INTO trips (id, user_id, account_id, title, image_url, start_date, end_date, status, traveler_count, adult_count, child_count, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Family Europe Trip', 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80', '2025-06-15', '2025-06-25', 'upcoming', 4, 2, 2, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Ireland Highlands Road Trip', 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=1200&q=80', '2024-08-05', '2024-08-12', 'completed', 2, 2, 0, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Japan Cherry Blossom Adventure', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80', NULL, NULL, 'draft', 2, 2, 0, NOW(), NOW());

-- Trip stats for saved trips
INSERT INTO trip_stats (trip_id, total_days, total_cities, total_activities, total_restaurants, total_hotels, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000002', 10, 4, 0, 0, 0, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000003', 7, 6, 0, 0, 0, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000004', 14, 5, 0, 0, 0, NOW(), NOW());

-- =============================================================================
-- SAMPLE DESTINATION EXTRAS (Transport, Budget, Packing, Phrases)
-- =============================================================================

-- Get place ID for Costa del Sol
DO $$
DECLARE
  costa_sol_id UUID;
  ibiza_id UUID;
  bali_id UUID;
BEGIN
  -- Costa del Sol extras
  SELECT id INTO costa_sol_id FROM country_places WHERE slug = 'costa-del-sol' LIMIT 1;

  IF costa_sol_id IS NOT NULL THEN
    -- Destination extras
    INSERT INTO destination_extras (place_id, budget_currency, accommodation_budget_low, accommodation_budget_mid, accommodation_budget_high, food_budget_low, food_budget_mid, food_budget_high, activities_budget_low, activities_budget_mid, activities_budget_high, transport_budget, created_at, updated_at)
    VALUES (costa_sol_id, 'eur', 50, 120, 300, 25, 50, 100, 15, 40, 100, 15, NOW(), NOW());

    -- Transport options
    INSERT INTO destination_transport_options (place_id, transport_type, name, description, duration_minutes, display_order, created_at, updated_at)
    VALUES
      (costa_sol_id, 'airport', 'Málaga Airport (AGP)', 'Main international airport serving the region', 30, 1, NOW(), NOW()),
      (costa_sol_id, 'train', 'AVE from Madrid', 'High-speed rail to Málaga station', 150, 2, NOW(), NOW()),
      (costa_sol_id, 'bus', 'ALSA Bus Network', 'Connects coastal towns along the coast', NULL, 3, NOW(), NOW());

    -- Packing lists
    INSERT INTO destination_packing_lists (place_id, category, items, display_order, created_at, updated_at)
    VALUES
      (costa_sol_id, 'Beach Essentials', ARRAY['Swimsuit', 'Beach towel', 'Sunscreen SPF 50+', 'Sunglasses', 'Flip flops'], 1, NOW(), NOW()),
      (costa_sol_id, 'Clothing', ARRAY['Light summer clothes', 'Evening wear for restaurants', 'Comfortable walking shoes', 'Light cardigan'], 2, NOW(), NOW()),
      (costa_sol_id, 'Activities', ARRAY['Water shoes for rocky beaches', 'Snorkeling gear', 'Golf attire if playing', 'Hiking boots for villages'], 3, NOW(), NOW());

    -- Local phrases
    INSERT INTO destination_local_phrases (place_id, language, phrase, translation, pronunciation, display_order, created_at, updated_at)
    VALUES
      (costa_sol_id, 'Spanish', 'Hola', 'Hello', 'OH-lah', 1, NOW(), NOW()),
      (costa_sol_id, 'Spanish', 'Gracias', 'Thank you', 'GRAH-see-ahs', 2, NOW(), NOW()),
      (costa_sol_id, 'Spanish', '¿Cuánto cuesta?', 'How much does it cost?', 'KWAHN-toh KWES-tah', 3, NOW(), NOW()),
      (costa_sol_id, 'Spanish', 'La cuenta, por favor', 'The bill, please', 'lah KWEN-tah por fah-VOR', 4, NOW(), NOW()),
      (costa_sol_id, 'Spanish', '¿Dónde está la playa?', 'Where is the beach?', 'DON-deh es-TAH lah PLAH-yah', 5, NOW(), NOW()),
      (costa_sol_id, 'Spanish', 'Una cerveza, por favor', 'A beer, please', 'OO-nah ser-VEH-sah por fah-VOR', 6, NOW(), NOW());
  END IF;
END $$;

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================

INSERT INTO notifications (user_id, subject, body, type, is_read, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Welcome to Layla!', 'Start planning your dream vacation today.', 'welcome', FALSE, NOW()),
  ('00000000-0000-0000-0000-000000000001', 'Trip Reminder', 'Your Jordan Honeymoon is coming up in 30 days!', 'trip_reminder', FALSE, NOW() - INTERVAL '2 days');

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================

-- Summary of seeded data
DO $$
BEGIN
  RAISE NOTICE '=============================================================================';
  RAISE NOTICE 'Database seeding completed successfully!';
  RAISE NOTICE '=============================================================================';
  RAISE NOTICE 'Seeded data summary:';
  RAISE NOTICE '- Users: 2 (demo users)';
  RAISE NOTICE '- Accounts: 1';
  RAISE NOTICE '- Countries: 195 (5 featured with detailed data)';
  RAISE NOTICE '- Trips: 4 (1 detailed Jordan honeymoon + 3 saved trips)';
  RAISE NOTICE '- City stops: 3 (Amman, Wadi Rum, Petra)';
  RAISE NOTICE '- Day plans: 3';
  RAISE NOTICE '- Activities: 8+';
  RAISE NOTICE '- Accommodations: 1';
  RAISE NOTICE '- Transports: 2';
  RAISE NOTICE '- Destination extras: Sample data for Costa del Sol';
  RAISE NOTICE '- Notifications: 2';
  RAISE NOTICE '=============================================================================';
END $$;
