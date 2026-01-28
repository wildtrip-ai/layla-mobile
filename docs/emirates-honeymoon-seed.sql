-- =============================================================================
-- LAYLA TRAVEL APP - 7-DAY LUXURY EMIRATES HONEYMOON ESCAPE SEED DATA
-- =============================================================================
-- This script seeds a luxury 7-day honeymoon trip to United Arab Emirates
-- Features Dubai and Abu Dhabi with luxury accommodations and romantic experiences
--
-- Itinerary Overview:
--   Day 1-3: Dubai (Atlantis The Palm) - Arrival, Burj Khalifa, Desert Safari
--   Day 4-5: Abu Dhabi (Emirates Palace) - Grand Mosque, Louvre Abu Dhabi
--   Day 6-7: Dubai (Burj Al Arab) - Leisure & Departure
-- =============================================================================

-- =============================================================================
-- TRIP DETAILS
-- =============================================================================

-- Main Trip Entry
INSERT INTO trips (id, user_id, account_id, title, subtitle, image_url, start_date, end_date, status, traveler_count, adult_count, estimated_budget, currency, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '7-Day Luxury Emirates Honeymoon Escape',
  'Romantic Journey Through Dubai & Abu Dhabi',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  '2026-03-15',
  '2026-03-21',
  'upcoming',
  2,
  2,
  12500.00,
  'usd',
  NOW(),
  NOW()
);

-- Trip Statistics
INSERT INTO trip_stats (trip_id, total_days, total_cities, total_activities, total_restaurants, total_hotels, total_transports, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000010',
  7,
  2,
  22,
  7,
  3,
  4,
  NOW(),
  NOW()
);

-- =============================================================================
-- CITY STOPS
-- =============================================================================

INSERT INTO city_stops (id, trip_id, name, country_name, country_slug, image_url, start_date, end_date, nights, sequence_order, created_at, updated_at)
VALUES
  (
    '20000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000010',
    'Dubai',
    'United Arab Emirates',
    'united-arab-emirates',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    '2026-03-15',
    '2026-03-18',
    3,
    1,
    NOW(),
    NOW()
  ),
  (
    '20000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000010',
    'Abu Dhabi',
    'United Arab Emirates',
    'united-arab-emirates',
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600&q=80',
    '2026-03-18',
    '2026-03-20',
    2,
    2,
    NOW(),
    NOW()
  ),
  (
    '20000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000010',
    'Dubai',
    'United Arab Emirates',
    'united-arab-emirates',
    'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=80',
    '2026-03-20',
    '2026-03-21',
    1,
    3,
    NOW(),
    NOW()
  );

-- =============================================================================
-- TRANSPORTS
-- =============================================================================

INSERT INTO transports (id, trip_id, type, title, from_location, from_code, to_location, to_code, departure_date, departure_time, arrival_date, arrival_time, duration_minutes, stops, price, price_currency, travelers, sequence_order, created_at, updated_at)
VALUES
  (
    '30000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000010',
    'flight',
    'International Flight to Dubai',
    'New York',
    'JFK',
    'Dubai',
    'DXB',
    '2026-03-14',
    '23:30',
    '2026-03-15',
    '19:45',
    770,
    0,
    3200.00,
    'usd',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000010',
    'transfer',
    'Private Airport Transfer to Atlantis The Palm',
    'Dubai International Airport',
    'DXB',
    'Atlantis The Palm',
    NULL,
    '2026-03-15',
    '20:00',
    '2026-03-15',
    '20:45',
    45,
    NULL,
    150.00,
    'usd',
    2,
    2,
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000010',
    'transfer',
    'Private Transfer Dubai to Abu Dhabi',
    'Atlantis The Palm',
    NULL,
    'Emirates Palace Mandarin Oriental',
    NULL,
    '2026-03-18',
    '10:00',
    '2026-03-18',
    '11:30',
    90,
    NULL,
    200.00,
    'usd',
    2,
    3,
    NOW(),
    NOW()
  ),
  (
    '30000000-0000-0000-0000-000000000013',
    '10000000-0000-0000-0000-000000000010',
    'flight',
    'Return Flight to New York',
    'Dubai',
    'DXB',
    'New York',
    'JFK',
    '2026-03-21',
    '03:15',
    '2026-03-21',
    '09:30',
    855,
    0,
    3200.00,
    'usd',
    2,
    4,
    NOW(),
    NOW()
  );

-- =============================================================================
-- ACCOMMODATIONS
-- =============================================================================

INSERT INTO accommodations (id, trip_id, city_stop_id, name, type, stars, rating, review_count, image_url, description, check_in_date, check_out_date, nights, price, price_currency, provider, created_at, updated_at)
VALUES
  (
    '40000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000010',
    'Atlantis The Palm',
    'resort',
    5,
    9.2,
    8547,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    'Ultra-luxurious resort on the iconic Palm Jumeirah featuring unlimited access to Aquaventure Waterpark and The Lost Chambers Aquarium. Perfect romantic start to your honeymoon with stunning views of the Arabian Gulf.',
    '2026-03-15',
    '2026-03-18',
    3,
    2800.00,
    'usd',
    'Booking.com',
    NOW(),
    NOW()
  ),
  (
    '40000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000011',
    'Emirates Palace Mandarin Oriental',
    'hotel',
    5,
    9.4,
    3215,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    'The epitome of luxury and Arabian hospitality. This legendary palace hotel offers opulent suites, private beach access, world-class dining, and an unforgettable romantic experience in the heart of Abu Dhabi.',
    '2026-03-18',
    '2026-03-20',
    2,
    1900.00,
    'usd',
    'Booking.com',
    NOW(),
    NOW()
  ),
  (
    '40000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000012',
    'Burj Al Arab Jumeirah',
    'hotel',
    5,
    9.6,
    4892,
    'https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&q=80',
    'The world''s most luxurious hotel and Dubai''s most iconic landmark. All-suite accommodation with 24-hour butler service, nine signature restaurants, private beach, and unparalleled luxury. The perfect finale to your honeymoon.',
    '2026-03-20',
    '2026-03-21',
    1,
    3200.00,
    'usd',
    'Burj Al Arab Direct',
    NOW(),
    NOW()
  );

-- =============================================================================
-- DAY PLANS
-- =============================================================================

INSERT INTO day_plans (id, trip_id, city_stop_id, day_number, date, day_of_week, title, weather, temperature_celsius, created_at, updated_at)
VALUES
  (
    '50000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000010',
    1,
    '2026-03-15',
    'Sunday',
    'Arrival & Dubai Marina Evening',
    'Sunny',
    27,
    NOW(),
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000010',
    2,
    '2026-03-16',
    'Monday',
    'Dubai Icons: Burj Khalifa & Dubai Mall',
    'Sunny',
    29,
    NOW(),
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000010',
    3,
    '2026-03-17',
    'Tuesday',
    'Romantic Desert Safari Adventure',
    'Sunny',
    28,
    NOW(),
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000013',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000011',
    4,
    '2026-03-18',
    'Wednesday',
    'Journey to Abu Dhabi & Grand Mosque',
    'Partly Cloudy',
    26,
    NOW(),
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000014',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000011',
    5,
    '2026-03-19',
    'Thursday',
    'Cultural Abu Dhabi: Louvre & Qasr Al Watan',
    'Sunny',
    27,
    NOW(),
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000015',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000012',
    6,
    '2026-03-20',
    'Friday',
    'Return to Dubai & Burj Al Arab Experience',
    'Sunny',
    30,
    NOW(),
    NOW()
  ),
  (
    '50000000-0000-0000-0000-000000000016',
    '10000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000012',
    7,
    '2026-03-21',
    'Saturday',
    'Farewell Brunch & Departure',
    'Sunny',
    29,
    NOW(),
    NOW()
  );

-- =============================================================================
-- ACTIVITIES - DAY 1: Arrival & Dubai Marina Evening
-- =============================================================================

INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, description, persons, sequence_order, created_at, updated_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000010',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000010',
    'note',
    'Arrival & Hotel Check-in',
    'Atlantis The Palm',
    NULL,
    'Arrive at Dubai International Airport at 19:45. Private transfer to Atlantis The Palm. Check-in at 21:00. Freshen up and prepare for evening cruise.',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000011',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000010',
    'activity',
    'Romantic Dubai Marina Dhow Cruise Dinner',
    'Dubai Marina',
    'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=400&q=80',
    'Traditional wooden dhow cruise along Dubai Marina with international buffet dinner, live entertainment, and stunning views of illuminated skyscrapers, Bluewaters Island, and Ain Dubai. Featuring Tanoura dance performance.',
    2,
    2,
    NOW(),
    NOW()
  );

UPDATE activities SET
  rating = 4.8,
  review_count = 3245,
  duration_minutes = 120,
  price = 180.00,
  price_currency = 'usd'
WHERE id = '60000000-0000-0000-0000-000000000011';

-- =============================================================================
-- ACTIVITIES - DAY 2: Dubai Icons
-- =============================================================================

INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, description, rating, review_count, duration_minutes, price, price_currency, persons, sequence_order, created_at, updated_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000012',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000011',
    'activity',
    'Aquaventure Waterpark & Lost Chambers',
    'Atlantis The Palm',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    'Enjoy unlimited access to Aquaventure Waterpark featuring thrilling slides and The Lost Chambers Aquarium showcasing 65,000 marine animals. Included with your hotel stay.',
    4.7,
    5890,
    180,
    0.00,
    'usd',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000013',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000011',
    'restaurant',
    'Lunch at Kaleidoscope',
    'Atlantis The Palm',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    'International buffet restaurant at Atlantis offering diverse cuisines in a vibrant setting.',
    4.5,
    1247,
    NULL,
    85.00,
    'usd',
    2,
    2,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000014',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000011',
    'activity',
    'Burj Khalifa - At The Top SKY (Level 148)',
    'Downtown Dubai',
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400&q=80',
    'Skip-the-line access to the world''s highest observation deck at 555 meters. Includes the SKY lounge with Arabic coffee, sweets, and beverages. Sunset time slot for romantic views.',
    4.9,
    28456,
    90,
    250.00,
    'usd',
    2,
    3,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000015',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000011',
    'activity',
    'Dubai Mall & Dubai Fountain Show',
    'Downtown Dubai',
    'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&q=80',
    'Explore the world''s largest shopping mall featuring luxury brands, Dubai Aquarium, and the spectacular Dubai Fountain show with water dancing to music every 30 minutes.',
    4.6,
    15783,
    120,
    0.00,
    'usd',
    2,
    4,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000016',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000011',
    'restaurant',
    'Dinner at At.mosphere - Burj Khalifa',
    'Burj Khalifa, Level 122',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    'World''s highest restaurant at 442 meters offering contemporary European cuisine with spectacular Dubai views. Dress code: Smart elegant.',
    4.8,
    3892,
    NULL,
    420.00,
    'usd',
    2,
    5,
    NOW(),
    NOW()
  );

-- =============================================================================
-- ACTIVITIES - DAY 3: Desert Safari
-- =============================================================================

INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, description, rating, review_count, duration_minutes, price, price_currency, persons, sequence_order, created_at, updated_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000017',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000012',
    'note',
    'Morning Leisure at Atlantis',
    'Atlantis The Palm',
    NULL,
    'Enjoy a relaxed morning. Take advantage of the private beach, spa facilities, or simply relax by the pool. Late checkout available upon request.',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000018',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000012',
    'restaurant',
    'Lunch at Nobu',
    'Atlantis The Palm',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80',
    'World-renowned Japanese-Peruvian fusion cuisine by Chef Nobu Matsuhisa with stunning ocean views.',
    4.7,
    2156,
    NULL,
    185.00,
    'usd',
    2,
    2,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000019',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000012',
    'activity',
    'VIP Romantic Desert Safari Experience',
    'Dubai Desert Conservation Reserve',
    'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&q=80',
    'Private luxury desert safari with hotel pickup. Experience exhilarating dune bashing, sunset camel ride, sandboarding, falconry display, and private romantic dinner setup under the stars with candlelight, rose petals, premium tent seating, and live entertainment including Tanoura and belly dance shows.',
    4.9,
    4567,
    360,
    650.00,
    'usd',
    2,
    3,
    NOW(),
    NOW()
  );

-- =============================================================================
-- ACTIVITIES - DAY 4: Journey to Abu Dhabi
-- =============================================================================

INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, description, rating, review_count, duration_minutes, price, price_currency, persons, sequence_order, created_at, updated_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000020',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000013',
    'note',
    'Check-out & Private Transfer',
    'Dubai to Abu Dhabi',
    NULL,
    'Check out from Atlantis The Palm at 10:00. Private transfer to Abu Dhabi (90 minutes). Scenic drive along the coast.',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000021',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000013',
    'activity',
    'Sheikh Zayed Grand Mosque Tour',
    'Abu Dhabi',
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400&q=80',
    'Guided tour of one of the world''s most beautiful mosques. Marvel at the stunning white marble architecture, intricate Islamic art, the world''s largest hand-knotted carpet, and crystal chandeliers. Modest dress code required (abayas provided for women).',
    4.9,
    42567,
    120,
    0.00,
    'usd',
    2,
    2,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000022',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000013',
    'note',
    'Check-in at Emirates Palace',
    'Emirates Palace Mandarin Oriental',
    NULL,
    'Arrive at the legendary Emirates Palace. Check-in and experience the epitome of Arabian luxury. Explore the palace grounds and private beach.',
    2,
    3,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000023',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000013',
    'restaurant',
    'Dinner at Mezlai',
    'Emirates Palace',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    'Award-winning authentic Emirati fine dining restaurant serving traditional dishes in an elegant setting. Experience local flavors prepared with premium ingredients.',
    4.7,
    1834,
    NULL,
    220.00,
    'usd',
    2,
    4,
    NOW(),
    NOW()
  );

-- =============================================================================
-- ACTIVITIES - DAY 5: Cultural Abu Dhabi
-- =============================================================================

INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, description, rating, review_count, duration_minutes, price, price_currency, persons, sequence_order, created_at, updated_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000024',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000014',
    'restaurant',
    'Breakfast at Le Vendôme',
    'Emirates Palace',
    'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=400&q=80',
    'Luxurious breakfast buffet featuring international and Middle Eastern specialties in an opulent French brasserie setting.',
    4.6,
    987,
    NULL,
    95.00,
    'usd',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000025',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000014',
    'activity',
    'Louvre Abu Dhabi',
    'Saadiyat Island',
    'https://images.unsplash.com/photo-1625509862120-c3bb40e08bf5?w=400&q=80',
    'Skip-the-line tickets to the stunning museum showcasing art and artifacts from around the world. Explore masterpieces under the iconic dome designed by Jean Nouvel. Allow 2-3 hours for visit.',
    4.8,
    12456,
    180,
    28.00,
    'usd',
    2,
    2,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000026',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000014',
    'restaurant',
    'Lunch at Art Lounge - Louvre Abu Dhabi',
    'Louvre Abu Dhabi',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80',
    'Contemporary restaurant with views of the museum''s architecture. Mediterranean-inspired menu with fresh, seasonal ingredients.',
    4.4,
    756,
    NULL,
    75.00,
    'usd',
    2,
    3,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000027',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000014',
    'activity',
    'Qasr Al Watan Palace Tour',
    'Abu Dhabi',
    'https://images.unsplash.com/photo-1566133669779-77e5e5c89c43?w=400&q=80',
    'Discover the working presidential palace showcasing Arabian heritage and craftsmanship. Explore the Great Hall, Spirit of Collaboration room, and magnificent library. Evening Palace in Motion light show included.',
    4.7,
    8934,
    120,
    25.00,
    'usd',
    2,
    4,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000028',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000014',
    'restaurant',
    'Dinner at Hakkasan Abu Dhabi',
    'Emirates Palace',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    'Michelin-starred modern Cantonese cuisine in a sophisticated setting with stunning design and impeccable service.',
    4.8,
    2145,
    NULL,
    280.00,
    'usd',
    2,
    5,
    NOW(),
    NOW()
  );

-- =============================================================================
-- ACTIVITIES - DAY 6: Return to Dubai & Burj Al Arab
-- =============================================================================

INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, description, rating, review_count, duration_minutes, price, price_currency, persons, sequence_order, created_at, updated_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000029',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000015',
    'note',
    'Return to Dubai & Burj Al Arab Check-in',
    'Burj Al Arab Jumeirah',
    NULL,
    'Check out from Emirates Palace. Private transfer back to Dubai (90 min). Check-in at the iconic Burj Al Arab - world''s most luxurious hotel. Meet your 24-hour butler and settle into your all-suite accommodation.',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000030',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000015',
    'restaurant',
    'Lunch at Scape Restaurant & Bar',
    'Burj Al Arab',
    'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=400&q=80',
    'Poolside restaurant offering international cuisine with stunning views of the Arabian Gulf. Relaxed yet refined atmosphere.',
    4.5,
    1234,
    NULL,
    120.00,
    'usd',
    2,
    2,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000031',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000015',
    'activity',
    'Burj Al Arab Private Beach & Spa',
    'Burj Al Arab',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80',
    'Exclusive access to private beach with butler service, luxury cabanas, and water sports. Optional couples spa treatment at Talise Spa (advance booking recommended).',
    4.9,
    3456,
    240,
    0.00,
    'usd',
    2,
    3,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000032',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000015',
    'restaurant',
    'Sunset Cocktails at Skyview Bar',
    'Burj Al Arab, 27th Floor',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80',
    'Exclusive bar on the 27th floor offering breathtaking views, signature cocktails, and canapés. Watch the sunset over the Arabian Gulf.',
    4.8,
    2890,
    NULL,
    150.00,
    'usd',
    2,
    4,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000033',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000015',
    'restaurant',
    'Farewell Dinner at Al Mahara',
    'Burj Al Arab',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    'Underwater fine dining restaurant featuring contemporary seafood cuisine by Chef Nathan Outlaw. Dine surrounded by a stunning floor-to-ceiling aquarium. The ultimate romantic farewell dinner.',
    4.9,
    4123,
    NULL,
    520.00,
    'usd',
    2,
    5,
    NOW(),
    NOW()
  );

-- =============================================================================
-- ACTIVITIES - DAY 7: Farewell & Departure
-- =============================================================================

INSERT INTO activities (id, trip_id, day_plan_id, type, title, location, image_url, description, persons, sequence_order, created_at, updated_at)
VALUES
  (
    '60000000-0000-0000-0000-000000000034',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000016',
    'restaurant',
    'Farewell Champagne Brunch at Al Muntaha',
    'Burj Al Arab, 27th Floor',
    'https://images.unsplash.com/photo-1464979681340-bdd28a61699e?w=400&q=80',
    'Legendary sky-high brunch at 200 meters with panoramic Dubai views, unlimited champagne, premium seafood, international delicacies, and live cooking stations. The perfect way to end your honeymoon. Reservations included.',
    2,
    1,
    NOW(),
    NOW()
  ),
  (
    '60000000-0000-0000-0000-000000000035',
    '10000000-0000-0000-0000-000000000010',
    '50000000-0000-0000-0000-000000000016',
    'note',
    'Check-out & Airport Transfer',
    'Dubai International Airport',
    NULL,
    'Late checkout until 15:00. Final moments at Burj Al Arab. Private transfer to Dubai International Airport for your 03:15 departure. Your butler will assist with all departure arrangements.',
    2,
    2,
    NOW(),
    NOW()
  );

UPDATE activities SET
  rating = 4.9,
  review_count = 5678,
  price = 450.00,
  price_currency = 'usd'
WHERE id = '60000000-0000-0000-0000-000000000034';

-- =============================================================================
-- DESTINATION EXTRAS FOR UAE
-- =============================================================================

-- Update UAE country with details if not already present
UPDATE countries SET
  hero_image_url = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
  description = 'Luxury, innovation, and Arabian hospitality in spectacular desert cities',
  is_featured = TRUE,
  display_order = 6
WHERE slug = 'united-arab-emirates';

-- Add Dubai and Abu Dhabi as featured cities if not present
DO $$
DECLARE
  uae_country_id UUID;
  dubai_place_id UUID;
  abu_dhabi_place_id UUID;
BEGIN
  -- Get UAE country ID
  SELECT id INTO uae_country_id FROM countries WHERE slug = 'united-arab-emirates' LIMIT 1;

  IF uae_country_id IS NOT NULL THEN
    -- Insert Dubai city
    INSERT INTO country_places (id, country_id, category, name, slug, image_url, description, rating, is_featured, display_order, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      uae_country_id,
      'cities',
      'Dubai',
      'dubai',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
      'Ultra-modern metropolis of luxury, innovation, and iconic architecture',
      4.8,
      TRUE,
      1,
      NOW(),
      NOW()
    )
    ON CONFLICT (country_id, slug) DO NOTHING
    RETURNING id INTO dubai_place_id;

    -- Insert Abu Dhabi city
    INSERT INTO country_places (id, country_id, category, name, slug, image_url, description, rating, is_featured, display_order, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      uae_country_id,
      'cities',
      'Abu Dhabi',
      'abu-dhabi',
      'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600&q=80',
      'Capital city blending cultural heritage with contemporary luxury',
      4.7,
      TRUE,
      2,
      NOW(),
      NOW()
    )
    ON CONFLICT (country_id, slug) DO NOTHING
    RETURNING id INTO abu_dhabi_place_id;

    -- Get the place IDs if they already existed
    IF dubai_place_id IS NULL THEN
      SELECT id INTO dubai_place_id FROM country_places WHERE country_id = uae_country_id AND slug = 'dubai' LIMIT 1;
    END IF;

    IF abu_dhabi_place_id IS NULL THEN
      SELECT id INTO abu_dhabi_place_id FROM country_places WHERE country_id = uae_country_id AND slug = 'abu-dhabi' LIMIT 1;
    END IF;

    -- Dubai destination extras
    IF dubai_place_id IS NOT NULL THEN
      INSERT INTO destination_extras (place_id, budget_currency, accommodation_budget_low, accommodation_budget_mid, accommodation_budget_high, food_budget_low, food_budget_mid, food_budget_high, activities_budget_low, activities_budget_mid, activities_budget_high, transport_budget, created_at, updated_at)
      VALUES (dubai_place_id, 'usd', 150, 400, 1500, 40, 100, 300, 50, 150, 500, 25, NOW(), NOW())
      ON CONFLICT (place_id) DO NOTHING;

      -- Transport options for Dubai
      INSERT INTO destination_transport_options (place_id, transport_type, name, description, duration_minutes, display_order, created_at, updated_at)
      VALUES
        (dubai_place_id, 'airport', 'Dubai International Airport (DXB)', 'One of the world''s busiest airports, 15 minutes from downtown', 15, 1, NOW(), NOW()),
        (dubai_place_id, 'metro', 'Dubai Metro', 'Modern driverless metro system covering major attractions', NULL, 2, NOW(), NOW()),
        (dubai_place_id, 'taxi', 'Dubai Taxi & Uber', 'Widely available, affordable metered taxis and ride-sharing', NULL, 3, NOW(), NOW()),
        (dubai_place_id, 'tram', 'Dubai Tram', 'Connects Dubai Marina, JBR, and Palm Jumeirah', NULL, 4, NOW(), NOW())
      ON CONFLICT (place_id, transport_type, name) DO NOTHING;

      -- Packing list for Dubai
      INSERT INTO destination_packing_lists (place_id, category, items, display_order, created_at, updated_at)
      VALUES
        (dubai_place_id, 'Clothing', ARRAY['Light, breathable fabrics', 'Modest clothing for religious sites', 'Swimwear', 'Sunglasses and hat', 'Light jacket for air-conditioned spaces', 'Elegant evening wear for fine dining'], 1, NOW(), NOW()),
        (dubai_place_id, 'Desert Safari', ARRAY['Comfortable closed-toe shoes', 'Light scarf for sand protection', 'Camera for stunning photos', 'Sunscreen SPF 50+'], 2, NOW(), NOW()),
        (dubai_place_id, 'Essentials', ARRAY['Universal power adapter (UK-style)', 'Valid passport', 'Travel insurance', 'Credit cards (widely accepted)', 'Prescription medications'], 3, NOW(), NOW())
      ON CONFLICT (place_id, category) DO NOTHING;

      -- Local phrases for Dubai
      INSERT INTO destination_local_phrases (place_id, language, phrase, translation, pronunciation, display_order, created_at, updated_at)
      VALUES
        (dubai_place_id, 'Arabic', 'As-salamu alaykum', 'Peace be upon you (Hello)', 'as-sa-LAH-mu ah-LAY-kum', 1, NOW(), NOW()),
        (dubai_place_id, 'Arabic', 'Shukran', 'Thank you', 'SHOOK-ran', 2, NOW(), NOW()),
        (dubai_place_id, 'Arabic', 'Afwan', 'You''re welcome', 'AHF-wan', 3, NOW(), NOW()),
        (dubai_place_id, 'Arabic', 'Kam hatha?', 'How much is this?', 'kam HAH-tha', 4, NOW(), NOW()),
        (dubai_place_id, 'Arabic', 'Inshallah', 'God willing', 'in-shah-AH-lah', 5, NOW(), NOW()),
        (dubai_place_id, 'Arabic', 'Maa salama', 'Goodbye', 'mah sa-LAH-ma', 6, NOW(), NOW())
      ON CONFLICT (place_id, language, phrase) DO NOTHING;
    END IF;

    -- Abu Dhabi destination extras
    IF abu_dhabi_place_id IS NOT NULL THEN
      INSERT INTO destination_extras (place_id, budget_currency, accommodation_budget_low, accommodation_budget_mid, accommodation_budget_high, food_budget_low, food_budget_mid, food_budget_high, activities_budget_low, activities_budget_mid, activities_budget_high, transport_budget, created_at, updated_at)
      VALUES (abu_dhabi_place_id, 'usd', 130, 350, 1200, 35, 90, 280, 40, 120, 400, 20, NOW(), NOW())
      ON CONFLICT (place_id) DO NOTHING;

      -- Transport options for Abu Dhabi
      INSERT INTO destination_transport_options (place_id, transport_type, name, description, duration_minutes, display_order, created_at, updated_at)
      VALUES
        (abu_dhabi_place_id, 'airport', 'Abu Dhabi International Airport (AUH)', 'Main international airport, 30 minutes from city center', 30, 1, NOW(), NOW()),
        (abu_dhabi_place_id, 'bus', 'Abu Dhabi Bus Network', 'Comprehensive public bus system covering the city', NULL, 2, NOW(), NOW()),
        (abu_dhabi_place_id, 'taxi', 'Abu Dhabi Taxi', 'Reliable metered taxis, slightly cheaper than Dubai', NULL, 3, NOW(), NOW()),
        (abu_dhabi_place_id, 'transfer', 'Dubai to Abu Dhabi', 'Private transfer or bus, approximately 90 minutes', 90, 4, NOW(), NOW())
      ON CONFLICT (place_id, transport_type, name) DO NOTHING;
    END IF;
  END IF;
END $$;

-- =============================================================================
-- SUMMARY
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '=============================================================================';
  RAISE NOTICE '7-Day Luxury Emirates Honeymoon Escape - Seeding Complete!';
  RAISE NOTICE '=============================================================================';
  RAISE NOTICE 'Trip Summary:';
  RAISE NOTICE '- Duration: 7 days / 6 nights';
  RAISE NOTICE '- Destinations: Dubai & Abu Dhabi';
  RAISE NOTICE '- Hotels: Atlantis The Palm, Emirates Palace, Burj Al Arab';
  RAISE NOTICE '- Total Activities: 22 activities including dining experiences';
  RAISE NOTICE '- Estimated Budget: $12,500 USD for 2 adults';
  RAISE NOTICE '- Highlights: Burj Khalifa, Desert Safari, Grand Mosque, Louvre Abu Dhabi';
  RAISE NOTICE '=============================================================================';
  RAISE NOTICE 'This honeymoon features:';
  RAISE NOTICE '✓ Three ultra-luxury 5-star properties';
  RAISE NOTICE '✓ Fine dining at Michelin-starred restaurants';
  RAISE NOTICE '✓ Romantic experiences (dhow cruise, desert dinner under stars)';
  RAISE NOTICE '✓ Iconic attractions (Burj Khalifa SKY, Grand Mosque, Louvre)';
  RAISE NOTICE '✓ Private transfers throughout';
  RAISE NOTICE '✓ Cultural experiences blending tradition and modernity';
  RAISE NOTICE '=============================================================================';
END $$;
