-- =============================================================================
-- LAYLA TRAVEL APP - EXTENDED DATABASE INITIALIZATION
-- =============================================================================
-- This script extends the existing database schema with all tables needed
-- for the travel planning application functionality.
--
-- Existing tables (from base schema):
--   - users, accounts, team_members, notifications, magic_tokens
--
-- New tables added:
--   - user_profiles, trips, trip_stats, city_stops, day_plans, activities
--   - accommodations, transports, favorites, reviews, countries, country_places
--   - destination_extras, destination_transport_options, destination_packing_lists
--   - destination_local_phrases, recently_viewed, trip_shares, user_preferences
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Existing enums (preserved for reference)
CREATE TYPE user_role AS ENUM ('superadmin', 'traveler', 'creator', 'fellow_traveler');
CREATE TYPE team_member_status AS ENUM ('invited', 'accepted', 'rejected');
CREATE TYPE notification_type AS ENUM ('welcome', 'news', 'updates', 'invite_accepted', 'trip_shared', 'trip_reminder', 'new_review');

-- New enums for travel functionality
CREATE TYPE trip_status AS ENUM ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE transport_type AS ENUM ('flight', 'train', 'bus', 'car', 'ferry', 'transfer', 'walking');
CREATE TYPE activity_type AS ENUM ('activity', 'restaurant', 'note', 'transport', 'accommodation');
CREATE TYPE favorite_category AS ENUM ('destinations', 'cities', 'restaurants', 'museums', 'historical_sites', 'natural_attractions', 'amenities', 'accommodations', 'activities');
CREATE TYPE place_category AS ENUM ('destinations', 'cities', 'restaurants', 'museums', 'historical_sites', 'natural_attractions', 'amenities');
CREATE TYPE budget_level AS ENUM ('budget', 'mid_range', 'luxury');
CREATE TYPE share_permission AS ENUM ('view', 'edit', 'admin');
CREATE TYPE currency_code AS ENUM ('usd', 'eur', 'gbp', 'jpy', 'cad', 'aud', 'chf', 'cny', 'inr', 'krw', 'mxn', 'brl', 'sgd', 'hkd', 'nzd');
CREATE TYPE language_code AS ENUM ('en', 'es', 'fr', 'it', 'de', 'pt', 'zh', 'ja', 'ko', 'ar', 'ru', 'pl', 'nl', 'tr', 'th');
CREATE TYPE accommodation_type AS ENUM ('hotel', 'resort', 'hostel', 'apartment', 'villa', 'bnb', 'boutique', 'lodge');
CREATE TYPE review_visit_type AS ENUM ('solo', 'couple', 'family', 'friends', 'business');

-- =============================================================================
-- CORE TABLES (EXISTING - PRESERVED)
-- =============================================================================

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Team members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'traveler',
  status team_member_status NOT NULL DEFAULT 'accepted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (account_id, user_id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'welcome',
  details TEXT,
  cta TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Magic tokens
CREATE TABLE magic_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- USER PROFILE & PREFERENCES
-- =============================================================================

-- User profiles (extended user data)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  profile_photo_url TEXT,
  profile_photo_thumbnail_url TEXT,
  language language_code NOT NULL DEFAULT 'en',
  currency currency_code NOT NULL DEFAULT 'usd',
  timezone TEXT DEFAULT 'UTC',
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  -- Notification preferences
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  trip_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  -- Subscription info
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- User preferences (key-value store for flexible settings)
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preference_key TEXT NOT NULL,
  preference_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (user_id, preference_key)
);

-- =============================================================================
-- COUNTRIES & DESTINATIONS
-- =============================================================================

-- Countries reference table
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT,
  flag TEXT,
  flag_emoji TEXT,
  hero_image_url TEXT,
  description TEXT,
  continent TEXT,
  region TEXT,
  capital TEXT,
  official_language TEXT,
  local_currency TEXT,
  phone_code TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Country places (destinations, cities, restaurants, etc.)
CREATE TABLE country_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  category place_category NOT NULL,
  name TEXT NOT NULL,
  slug TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  short_description TEXT,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  address TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  phone TEXT,
  website TEXT,
  opening_hours JSONB,
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
  tags TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  -- Weather data
  avg_temperature_celsius DECIMAL(4,1),
  best_visit_months INTEGER[],
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Destination extras (transport, budget, etc. for each destination)
CREATE TABLE destination_extras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL UNIQUE REFERENCES country_places(id) ON DELETE CASCADE,
  -- Budget info
  budget_currency currency_code NOT NULL DEFAULT 'usd',
  accommodation_budget_low INTEGER,
  accommodation_budget_mid INTEGER,
  accommodation_budget_high INTEGER,
  food_budget_low INTEGER,
  food_budget_mid INTEGER,
  food_budget_high INTEGER,
  activities_budget_low INTEGER,
  activities_budget_mid INTEGER,
  activities_budget_high INTEGER,
  transport_budget INTEGER,
  -- Local info
  local_language TEXT,
  emergency_number TEXT,
  tourist_info_url TEXT,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Destination transport options
CREATE TABLE destination_transport_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES country_places(id) ON DELETE CASCADE,
  transport_type transport_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  estimated_cost DECIMAL(10,2),
  currency currency_code DEFAULT 'usd',
  duration_minutes INTEGER,
  frequency TEXT,
  booking_url TEXT,
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Destination packing lists
CREATE TABLE destination_packing_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES country_places(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  items TEXT[] NOT NULL,
  season TEXT,
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Destination local phrases
CREATE TABLE destination_local_phrases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES country_places(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  phrase TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================================================
-- TRIPS
-- =============================================================================

-- Trips main table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  start_date DATE,
  end_date DATE,
  status trip_status NOT NULL DEFAULT 'draft',
  traveler_count INTEGER NOT NULL DEFAULT 1,
  adult_count INTEGER NOT NULL DEFAULT 1,
  child_count INTEGER NOT NULL DEFAULT 0,
  budget_level budget_level DEFAULT 'mid_range',
  estimated_budget DECIMAL(12,2),
  actual_budget DECIMAL(12,2),
  currency currency_code DEFAULT 'usd',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  share_token TEXT UNIQUE,
  notes TEXT,
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  ai_prompt TEXT,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Trip statistics (computed/cached values)
CREATE TABLE trip_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL UNIQUE REFERENCES trips(id) ON DELETE CASCADE,
  total_days INTEGER NOT NULL DEFAULT 0,
  total_cities INTEGER NOT NULL DEFAULT 0,
  total_activities INTEGER NOT NULL DEFAULT 0,
  total_restaurants INTEGER NOT NULL DEFAULT 0,
  total_hotels INTEGER NOT NULL DEFAULT 0,
  total_transports INTEGER NOT NULL DEFAULT 0,
  total_distance_km DECIMAL(10,2),
  total_cost DECIMAL(12,2),
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- City stops (cities visited in a trip)
CREATE TABLE city_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  place_id UUID REFERENCES country_places(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  country_name TEXT,
  country_slug TEXT,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  nights INTEGER,
  sequence_order INTEGER NOT NULL DEFAULT 0,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  notes TEXT,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Day plans
CREATE TABLE day_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_stop_id UUID REFERENCES city_stops(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL,
  date DATE,
  day_of_week TEXT,
  title TEXT,
  description TEXT,
  weather TEXT,
  weather_icon TEXT,
  temperature_celsius DECIMAL(4,1),
  temperature_fahrenheit DECIMAL(4,1),
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Activities (items in day plans)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_plan_id UUID NOT NULL REFERENCES day_plans(id) ON DELETE CASCADE,
  place_id UUID REFERENCES country_places(id) ON DELETE SET NULL,
  type activity_type NOT NULL DEFAULT 'activity',
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  address TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  start_time TIME,
  end_time TIME,
  duration_minutes INTEGER,
  price DECIMAL(10,2),
  price_currency currency_code DEFAULT 'usd',
  price_per_person BOOLEAN NOT NULL DEFAULT TRUE,
  persons INTEGER DEFAULT 1,
  booking_url TEXT,
  booking_reference TEXT,
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  sequence_order INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================================================
-- ACCOMMODATIONS
-- =============================================================================

-- Accommodations
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_stop_id UUID REFERENCES city_stops(id) ON DELETE SET NULL,
  place_id UUID REFERENCES country_places(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type accommodation_type NOT NULL DEFAULT 'hotel',
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  thumbnail_url TEXT,
  images TEXT[],
  description TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  check_in_date DATE,
  check_out_date DATE,
  check_in_time TIME,
  check_out_time TIME,
  nights INTEGER,
  room_type TEXT,
  room_count INTEGER DEFAULT 1,
  guest_count INTEGER DEFAULT 1,
  price DECIMAL(10,2),
  price_per_night DECIMAL(10,2),
  price_currency currency_code DEFAULT 'usd',
  provider TEXT,
  provider_url TEXT,
  booking_url TEXT,
  booking_reference TEXT,
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  cancellation_policy TEXT,
  amenities TEXT[],
  notes TEXT,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================================================
-- TRANSPORTS
-- =============================================================================

-- Transports
CREATE TABLE transports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  type transport_type NOT NULL,
  title TEXT,
  description TEXT,
  carrier TEXT,
  carrier_code TEXT,
  carrier_logo_url TEXT,
  -- Origin
  from_location TEXT NOT NULL,
  from_code TEXT,
  from_city TEXT,
  from_country TEXT,
  from_address TEXT,
  from_latitude DECIMAL(10,7),
  from_longitude DECIMAL(10,7),
  -- Destination
  to_location TEXT NOT NULL,
  to_code TEXT,
  to_city TEXT,
  to_country TEXT,
  to_address TEXT,
  to_latitude DECIMAL(10,7),
  to_longitude DECIMAL(10,7),
  -- Schedule
  departure_date DATE NOT NULL,
  departure_time TIME,
  arrival_date DATE,
  arrival_time TIME,
  duration_minutes INTEGER,
  -- Flight specific
  flight_number TEXT,
  aircraft_type TEXT,
  cabin_class TEXT,
  seat_numbers TEXT[],
  stops INTEGER DEFAULT 0,
  stop_locations TEXT[],
  -- Pricing
  price DECIMAL(10,2),
  price_currency currency_code DEFAULT 'usd',
  price_per_person BOOLEAN NOT NULL DEFAULT TRUE,
  travelers INTEGER DEFAULT 1,
  -- Booking
  provider TEXT,
  booking_url TEXT,
  booking_reference TEXT,
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  cancellation_policy TEXT,
  baggage_allowance TEXT,
  notes TEXT,
  sequence_order INTEGER NOT NULL DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================================================
-- FAVORITES & RECENTLY VIEWED
-- =============================================================================

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category favorite_category NOT NULL,
  country_slug TEXT,
  country_name TEXT,
  place_id UUID REFERENCES country_places(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_image_url TEXT,
  item_rating DECIMAL(3,2),
  notes TEXT,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (user_id, category, place_id)
);

-- Recently viewed items
CREATE TABLE recently_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES country_places(id) ON DELETE CASCADE,
  country_slug TEXT,
  country_name TEXT,
  country_flag TEXT,
  item_name TEXT NOT NULL,
  item_image_url TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  view_count INTEGER NOT NULL DEFAULT 1,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- REVIEWS
-- =============================================================================

-- Reviews (for activities, accommodations, destinations)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  place_id UUID REFERENCES country_places(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  accommodation_id UUID REFERENCES accommodations(id) ON DELETE CASCADE,
  -- Author info (denormalized for external reviews)
  author_name TEXT,
  author_avatar_url TEXT,
  author_country TEXT,
  author_review_count INTEGER,
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  positives TEXT,
  negatives TEXT,
  visit_type review_visit_type,
  visit_date DATE,
  -- Rating breakdown
  rating_location INTEGER CHECK (rating_location >= 1 AND rating_location <= 5),
  rating_cleanliness INTEGER CHECK (rating_cleanliness >= 1 AND rating_cleanliness <= 5),
  rating_service INTEGER CHECK (rating_service >= 1 AND rating_service <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  -- Flags
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_external BOOLEAN NOT NULL DEFAULT FALSE,
  external_source TEXT,
  -- Engagement
  helpful_count INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Ensure review is for exactly one entity
  CONSTRAINT review_target_check CHECK (
    (place_id IS NOT NULL)::int +
    (activity_id IS NOT NULL)::int +
    (accommodation_id IS NOT NULL)::int = 1
  )
);

-- Review photos
CREATE TABLE review_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Review helpful votes
CREATE TABLE review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (review_id, user_id)
);

-- =============================================================================
-- TRIP SHARING & COLLABORATION
-- =============================================================================

-- Trip shares
CREATE TABLE trip_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shared_with_email TEXT,
  permission share_permission NOT NULL DEFAULT 'view',
  share_token TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  accepted_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER NOT NULL DEFAULT 0,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Trip collaborators (accepted shares become collaborators)
CREATE TABLE trip_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission share_permission NOT NULL DEFAULT 'view',
  is_owner BOOLEAN NOT NULL DEFAULT FALSE,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (trip_id, user_id)
);

-- =============================================================================
-- AI CHAT & TRIP GENERATION
-- =============================================================================

-- AI chat sessions
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  mode TEXT NOT NULL DEFAULT 'create', -- 'create', 'modify', 'inspire'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ
);

-- AI chat messages
CREATE TABLE ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  metadata JSONB,
  tokens_used INTEGER,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- MEDIA & FILES
-- =============================================================================

-- User uploaded files
CREATE TABLE user_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL, -- 'profile_photo', 'trip_photo', 'review_photo'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  -- Auditing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;

-- User profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id) WHERE deleted_at IS NULL;

-- Countries
CREATE INDEX idx_countries_slug ON countries(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_countries_is_featured ON countries(is_featured, display_order) WHERE deleted_at IS NULL;

-- Country places
CREATE INDEX idx_country_places_country ON country_places(country_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_country_places_slug ON country_places(slug) WHERE deleted_at IS NULL AND slug IS NOT NULL;
CREATE INDEX idx_country_places_featured ON country_places(is_featured, display_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_country_places_rating ON country_places(rating DESC NULLS LAST) WHERE deleted_at IS NULL;

-- Trips
CREATE INDEX idx_trips_user ON trips(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_dates ON trips(start_date, end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_status ON trips(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_share_token ON trips(share_token) WHERE share_token IS NOT NULL;

-- City stops
CREATE INDEX idx_city_stops_trip ON city_stops(trip_id, sequence_order) WHERE deleted_at IS NULL;

-- Day plans
CREATE INDEX idx_day_plans_trip ON day_plans(trip_id, day_number) WHERE deleted_at IS NULL;

-- Activities
CREATE INDEX idx_activities_day_plan ON activities(day_plan_id, sequence_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_trip ON activities(trip_id) WHERE deleted_at IS NULL;

-- Accommodations
CREATE INDEX idx_accommodations_trip ON accommodations(trip_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_accommodations_city_stop ON accommodations(city_stop_id) WHERE deleted_at IS NULL;

-- Transports
CREATE INDEX idx_transports_trip ON transports(trip_id, sequence_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_transports_dates ON transports(departure_date) WHERE deleted_at IS NULL;

-- Favorites
CREATE INDEX idx_favorites_user ON favorites(user_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_favorites_place ON favorites(place_id) WHERE deleted_at IS NULL;

-- Recently viewed
CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC);

-- Reviews
CREATE INDEX idx_reviews_place ON reviews(place_id, rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_reviews_activity ON reviews(activity_id) WHERE deleted_at IS NULL AND activity_id IS NOT NULL;
CREATE INDEX idx_reviews_accommodation ON reviews(accommodation_id) WHERE deleted_at IS NULL AND accommodation_id IS NOT NULL;
CREATE INDEX idx_reviews_user ON reviews(user_id) WHERE deleted_at IS NULL AND user_id IS NOT NULL;

-- Trip shares
CREATE INDEX idx_trip_shares_trip ON trip_shares(trip_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trip_shares_user ON trip_shares(shared_with_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trip_shares_token ON trip_shares(share_token) WHERE share_token IS NOT NULL;

-- Trip collaborators
CREATE INDEX idx_trip_collaborators_trip ON trip_collaborators(trip_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trip_collaborators_user ON trip_collaborators(user_id) WHERE deleted_at IS NULL;

-- AI chat
CREATE INDEX idx_ai_chat_sessions_user ON ai_chat_sessions(user_id, status);
CREATE INDEX idx_ai_chat_messages_session ON ai_chat_messages(session_id, created_at);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC) WHERE deleted_at IS NULL;

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_country_places_updated_at BEFORE UPDATE ON country_places FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destination_extras_updated_at BEFORE UPDATE ON destination_extras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destination_transport_options_updated_at BEFORE UPDATE ON destination_transport_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destination_packing_lists_updated_at BEFORE UPDATE ON destination_packing_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destination_local_phrases_updated_at BEFORE UPDATE ON destination_local_phrases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trip_stats_updated_at BEFORE UPDATE ON trip_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_stops_updated_at BEFORE UPDATE ON city_stops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_day_plans_updated_at BEFORE UPDATE ON day_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON accommodations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transports_updated_at BEFORE UPDATE ON transports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trip_shares_updated_at BEFORE UPDATE ON trip_shares FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trip_collaborators_updated_at BEFORE UPDATE ON trip_collaborators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_chat_sessions_updated_at BEFORE UPDATE ON ai_chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
