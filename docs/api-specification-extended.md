# Layla Travel App - API Documentation (Extended)

## Overview

This document provides the complete API specification for the Layla Travel application, extending the existing endpoints with all new functionality required by the mobile app.

### Base URL
```
https://api.layla.travel/v1.0
```

### Authentication
Protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

### Common Response Formats

**Paginated Response:**
```json
{
  "items": [...],
  "next_cursor": "cursor_token",
  "has_more": true,
  "total_count": 100
}
```

**Error Response:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

---

## Table of Contents

1. [Health & Public](#1-health--public)
2. [Authentication](#2-authentication)
3. [Magic Link Sign-in](#3-magic-link-sign-in)
4. [Current User](#4-current-user)
5. [User Profile](#5-user-profile)
6. [Team Members](#6-team-members)
7. [Notifications](#7-notifications)
8. [Countries](#8-countries)
9. [Destinations & Places](#9-destinations--places)
10. [Trips](#10-trips)
11. [City Stops](#11-city-stops)
12. [Day Plans](#12-day-plans)
13. [Activities](#13-activities)
14. [Accommodations](#14-accommodations)
15. [Transports](#15-transports)
16. [Favorites](#16-favorites)
17. [Recently Viewed](#17-recently-viewed)
18. [Reviews](#18-reviews)
19. [Trip Sharing](#19-trip-sharing)
20. [AI Chat & Trip Generation](#20-ai-chat--trip-generation)
21. [File Uploads](#21-file-uploads)

---

## 1. Health & Public

### GET /ping
Simple health check for the API.

**Response (200 OK):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-02-01T12:00:00Z"
}
```

---

### GET /public/ping
Public ping endpoint.

**Response (200 OK):**
```json
{
  "message": "pong"
}
```

---

## 2. Authentication

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "super-secure-password",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "is_active": true,
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### POST /auth/token
Authenticate a user and return a JWT access token.

**Request (form data):**
```
username=user@example.com
password=super-secure-password
```

**Response (200 OK):**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "is_active": true
  }
}
```

---

### POST /auth/refresh
Refresh an access token.

**Request:**
```json
{
  "refresh_token": "<jwt>"
}
```

**Response (200 OK):**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### POST /auth/logout
Invalidate the current session.

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### POST /auth/social
Authenticate via social provider (Google, Apple, Facebook).

**Request:**
```json
{
  "provider": "google",
  "id_token": "<provider_id_token>",
  "access_token": "<provider_access_token>"
}
```

**Response (200 OK):**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600,
  "is_new_user": false,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe"
  }
}
```

---

## 3. Magic Link Sign-in

### POST /signin
Send a magic link for passwordless sign-in.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (201 Created):**
```json
{
  "message": "Magic link sent",
  "expires_at": "2024-02-01T12:15:00Z"
}
```

---

### POST /signin/confirm
Confirm a magic link and return a JWT access token.

**Request:**
```json
{
  "email": "user@example.com",
  "token": "<magic_token>"
}
```

**Response (200 OK):**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 3600,
  "is_new_user": false,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "team_member_status": "accepted"
  }
}
```

---

## 4. Current User

### GET /users/me
Get the current user's basic info.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "default_account_id": "account_uuid",
  "created_at": "2024-02-01T12:00:00Z",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /users/me
Update the current user's basic info.

**Request:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "default_account_id": "account_uuid",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /users/me
Delete the current user's account (soft delete).

**Response (200 OK):**
```json
{
  "message": "Account deleted successfully"
}
```

---

## 5. User Profile

### GET /users/me/profile
Get the current user's full profile.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "profile_photo_url": "https://...",
  "profile_photo_thumbnail_url": "https://...",
  "language": "en",
  "currency": "usd",
  "timezone": "America/New_York",
  "bio": "Travel enthusiast",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-15",
  "notifications_enabled": true,
  "email_notifications": true,
  "push_notifications": true,
  "marketing_notifications": false,
  "trip_reminders": true,
  "subscription_tier": "premium",
  "subscription_expires_at": "2025-02-01T12:00:00Z",
  "created_at": "2024-02-01T12:00:00Z",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /users/me/profile
Update the current user's profile.

**Request:**
```json
{
  "language": "es",
  "currency": "eur",
  "timezone": "Europe/Madrid",
  "bio": "Love exploring new places",
  "notifications_enabled": true,
  "email_notifications": false,
  "push_notifications": true,
  "marketing_notifications": false,
  "trip_reminders": true
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "language": "es",
  "currency": "eur",
  "timezone": "Europe/Madrid",
  "bio": "Love exploring new places",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### POST /users/me/profile/photo
Upload a profile photo.

**Request (multipart/form-data):**
- `file`: Image file (JPEG, PNG, WebP)
- `crop_x`: X coordinate of crop area (optional)
- `crop_y`: Y coordinate of crop area (optional)
- `crop_width`: Width of crop area (optional)
- `crop_height`: Height of crop area (optional)

**Response (200 OK):**
```json
{
  "profile_photo_url": "https://...",
  "profile_photo_thumbnail_url": "https://..."
}
```

---

### DELETE /users/me/profile/photo
Remove the current user's profile photo.

**Response (200 OK):**
```json
{
  "message": "Profile photo removed"
}
```

---

## 6. Team Members

### POST /team_members/invite
Invite a user to the current user's default account.

**Request:**
```json
{
  "email": "invitee@example.com",
  "role": "traveler"
}
```

**Response (201 Created):**
```json
{
  "message": "Invitation sent successfully",
  "email": "invitee@example.com",
  "user_exists": true,
  "status": "invited"
}
```

---

### GET /team_members
List team members for the default account.

**Query Parameters:**
- `statuses` (optional, repeatable): `invited`, `accepted`, `rejected`
- `limit` (optional): max 100, default 20
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "member_uuid",
      "role": "traveler",
      "user_id": "user_uuid",
      "status": "accepted",
      "name": "Jane Doe",
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane@example.com",
      "profile_photo_url": "https://...",
      "joined_at": "2024-02-01T12:00:00Z",
      "created_at": "2024-02-01T12:00:00Z"
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true
}
```

---

### GET /team_members/{member_id}
Get a specific team member by ID.

**Response (200 OK):**
```json
{
  "id": "member_uuid",
  "role": "traveler",
  "user_id": "user_uuid",
  "status": "accepted",
  "name": "Jane Doe",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "profile_photo_url": "https://...",
  "joined_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /team_members/{member_id}
Update a team member's role or status.

**Request:**
```json
{
  "role": "creator",
  "status": "accepted"
}
```

**Response (200 OK):**
```json
{
  "message": "Team member updated successfully",
  "id": "member_uuid",
  "role": "creator",
  "status": "accepted"
}
```

---

### DELETE /team_members/{member_id}
Soft delete a team member.

**Response (200 OK):**
```json
{
  "message": "Team member removed successfully",
  "id": "member_uuid"
}
```

---

## 7. Notifications

### GET /notifications
List notifications for the current user.

**Query Parameters:**
- `is_read` (optional): filter by read status
- `type` (optional): filter by notification type
- `limit` (optional): max 100, default 20
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "notification_uuid",
      "user_id": "user_uuid",
      "subject": "Welcome to Layla!",
      "body": "Start planning your next adventure...",
      "type": "welcome",
      "details": null,
      "cta": "/new-trip-planner",
      "is_read": false,
      "read_at": null,
      "created_at": "2024-02-01T12:00:00Z"
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true
}
```

---

### GET /notifications/count
Return notification counts.

**Query Parameters:**
- `is_read` (optional): filter by read status

**Response (200 OK):**
```json
{
  "total": 25,
  "unread": 12
}
```

---

### GET /notifications/{notification_id}
Fetch a single notification.

**Response (200 OK):**
```json
{
  "id": "notification_uuid",
  "user_id": "user_uuid",
  "subject": "Welcome",
  "body": "Thanks for joining...",
  "type": "welcome",
  "details": null,
  "cta": null,
  "is_read": false,
  "read_at": null,
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### POST /notifications/read
Mark all notifications as read.

**Response (200 OK):**
```json
{
  "message": "All notifications marked as read",
  "count": 12
}
```

---

### POST /notifications/{notification_id}/read
Mark a single notification as read.

**Response (200 OK):**
```json
{
  "id": "notification_uuid",
  "is_read": true,
  "read_at": "2024-02-01T12:10:00Z"
}
```

---

### DELETE /notifications/{notification_id}
Delete a notification.

**Response (200 OK):**
```json
{
  "message": "Notification deleted",
  "id": "notification_uuid"
}
```

---

## 8. Countries

### GET /countries
List all countries.

**Query Parameters:**
- `featured` (optional): filter featured countries only
- `continent` (optional): filter by continent
- `search` (optional): search by name
- `limit` (optional): max 200, default 50
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "slug": "spain",
      "name": "Spain",
      "native_name": "Espa\u00f1a",
      "flag": "https://...",
      "flag_emoji": "\ud83c\uddea\ud83c\uddf8",
      "hero_image_url": "https://...",
      "continent": "Europe",
      "region": "Southern Europe",
      "capital": "Madrid",
      "is_featured": true,
      "place_count": {
        "destinations": 12,
        "cities": 8,
        "restaurants": 45,
        "museums": 23,
        "historical_sites": 34,
        "natural_attractions": 18,
        "amenities": 56
      }
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true,
  "total_count": 195
}
```

---

### GET /countries/{slug}
Get a country by slug.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "slug": "spain",
  "name": "Spain",
  "native_name": "Espa\u00f1a",
  "flag": "https://...",
  "flag_emoji": "\ud83c\uddea\ud83c\uddf8",
  "hero_image_url": "https://...",
  "description": "Spain is a country on Europe's Iberian Peninsula...",
  "continent": "Europe",
  "region": "Southern Europe",
  "capital": "Madrid",
  "official_language": "Spanish",
  "local_currency": "EUR",
  "phone_code": "+34",
  "is_featured": true
}
```

---

### GET /countries/{slug}/places
Get places for a country by category.

**Query Parameters:**
- `category` (required): `destinations`, `cities`, `restaurants`, `museums`, `historical_sites`, `natural_attractions`, `amenities`
- `featured` (optional): filter featured places only
- `min_rating` (optional): minimum rating filter
- `limit` (optional): max 100, default 20
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Costa del Sol",
      "slug": "costa-del-sol",
      "image_url": "https://...",
      "thumbnail_url": "https://...",
      "description": "Sun-drenched beaches...",
      "short_description": "Beautiful coastal region",
      "rating": 4.7,
      "review_count": 1234,
      "city": "Malaga",
      "region": "Andalusia",
      "is_featured": true,
      "tags": ["beach", "coastal", "nightlife"]
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true
}
```

---

## 9. Destinations & Places

### GET /places/{place_id}
Get full details for a place.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "country": {
    "slug": "spain",
    "name": "Spain",
    "flag_emoji": "\ud83c\uddea\ud83c\uddf8"
  },
  "category": "destinations",
  "name": "Costa del Sol",
  "slug": "costa-del-sol",
  "image_url": "https://...",
  "thumbnail_url": "https://...",
  "description": "Full description...",
  "short_description": "Short description",
  "rating": 4.7,
  "review_count": 1234,
  "latitude": 36.7213,
  "longitude": -4.4214,
  "address": "Costa del Sol, Malaga, Spain",
  "city": "Malaga",
  "region": "Andalusia",
  "phone": "+34 123 456 789",
  "website": "https://...",
  "opening_hours": {
    "monday": "09:00-18:00",
    "tuesday": "09:00-18:00"
  },
  "price_level": 3,
  "avg_temperature_celsius": 22.5,
  "best_visit_months": [4, 5, 6, 9, 10],
  "tags": ["beach", "coastal", "nightlife"],
  "is_featured": true,
  "is_favorite": false,
  "extras": {
    "budget": {
      "currency": "eur",
      "accommodation": { "low": 40, "mid": 100, "high": 250 },
      "food": { "low": 20, "mid": 50, "high": 100 },
      "activities": { "low": 10, "mid": 30, "high": 80 },
      "transport": 15
    },
    "transport_options": [
      {
        "type": "flight",
        "name": "Malaga Airport",
        "description": "International airport with connections...",
        "estimated_cost": 150,
        "currency": "eur"
      }
    ],
    "packing_list": [
      {
        "category": "Essentials",
        "items": ["Sunscreen", "Sunglasses", "Hat"]
      }
    ],
    "local_phrases": [
      {
        "language": "Spanish",
        "phrase": "Hola",
        "translation": "Hello",
        "pronunciation": "OH-lah"
      }
    ]
  }
}
```

---

### GET /places/{place_id}/reviews
Get reviews for a place.

**Query Parameters:**
- `rating` (optional): filter by rating (1-5)
- `visit_type` (optional): filter by visit type
- `sort` (optional): `recent`, `helpful`, `rating_high`, `rating_low`
- `limit` (optional): max 50, default 20
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "author_name": "John D.",
      "author_avatar_url": "https://...",
      "author_country": "United States",
      "rating": 5,
      "title": "Amazing experience!",
      "content": "We had such a wonderful time...",
      "positives": "Beautiful beaches, great food",
      "negatives": "Can be crowded in summer",
      "visit_type": "couple",
      "visit_date": "2024-01-15",
      "photos": [
        { "url": "https://...", "thumbnail_url": "https://..." }
      ],
      "helpful_count": 42,
      "is_verified": true,
      "created_at": "2024-01-20T12:00:00Z"
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true,
  "rating_summary": {
    "average": 4.7,
    "total": 1234,
    "breakdown": {
      "5": 800,
      "4": 300,
      "3": 100,
      "2": 25,
      "1": 9
    }
  }
}
```

---

### GET /places/search
Search places across all countries.

**Query Parameters:**
- `q` (required): search query
- `category` (optional): filter by category
- `country` (optional): filter by country slug
- `limit` (optional): max 50, default 20

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Costa del Sol",
      "category": "destinations",
      "country_slug": "spain",
      "country_name": "Spain",
      "image_url": "https://...",
      "rating": 4.7
    }
  ],
  "total_count": 45
}
```

---

## 10. Trips

### GET /trips
List trips for the current user.

**Query Parameters:**
- `status` (optional, repeatable): `draft`, `upcoming`, `ongoing`, `completed`, `cancelled`
- `sort` (optional): `created`, `start_date`, `updated`
- `limit` (optional): max 50, default 20
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "7-Day Spain Adventure",
      "subtitle": "Barcelona to Madrid",
      "image_url": "https://...",
      "thumbnail_url": "https://...",
      "start_date": "2024-06-15",
      "end_date": "2024-06-22",
      "status": "upcoming",
      "traveler_count": 2,
      "stats": {
        "total_days": 7,
        "total_cities": 3,
        "total_activities": 15,
        "total_hotels": 3,
        "total_transports": 4
      },
      "city_stops": [
        { "name": "Barcelona", "image_url": "https://..." },
        { "name": "Valencia", "image_url": "https://..." },
        { "name": "Madrid", "image_url": "https://..." }
      ],
      "is_shared": false,
      "collaborator_count": 0,
      "created_at": "2024-02-01T12:00:00Z",
      "updated_at": "2024-02-01T12:00:00Z"
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true
}
```

---

### POST /trips
Create a new trip.

**Request:**
```json
{
  "title": "7-Day Spain Adventure",
  "subtitle": "Barcelona to Madrid",
  "description": "An amazing journey through Spain...",
  "start_date": "2024-06-15",
  "end_date": "2024-06-22",
  "adult_count": 2,
  "child_count": 0,
  "budget_level": "mid_range",
  "currency": "eur"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "title": "7-Day Spain Adventure",
  "subtitle": "Barcelona to Madrid",
  "status": "draft",
  "start_date": "2024-06-15",
  "end_date": "2024-06-22",
  "adult_count": 2,
  "child_count": 0,
  "traveler_count": 2,
  "budget_level": "mid_range",
  "currency": "eur",
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### GET /trips/{trip_id}
Get full trip details.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "7-Day Spain Adventure",
  "subtitle": "Barcelona to Madrid",
  "description": "An amazing journey through Spain...",
  "image_url": "https://...",
  "thumbnail_url": "https://...",
  "start_date": "2024-06-15",
  "end_date": "2024-06-22",
  "status": "upcoming",
  "traveler_count": 2,
  "adult_count": 2,
  "child_count": 0,
  "budget_level": "mid_range",
  "estimated_budget": 3500.00,
  "currency": "eur",
  "is_public": false,
  "share_token": "abc123",
  "ai_generated": true,
  "stats": {
    "total_days": 7,
    "total_cities": 3,
    "total_activities": 15,
    "total_restaurants": 8,
    "total_hotels": 3,
    "total_transports": 4,
    "total_distance_km": 620,
    "total_cost": 3200.00
  },
  "city_stops": [
    {
      "id": "uuid",
      "name": "Barcelona",
      "country_name": "Spain",
      "image_url": "https://...",
      "start_date": "2024-06-15",
      "end_date": "2024-06-18",
      "nights": 3,
      "sequence_order": 0,
      "latitude": 41.3851,
      "longitude": 2.1734
    }
  ],
  "day_plans": [
    {
      "id": "uuid",
      "day_number": 1,
      "date": "2024-06-15",
      "day_of_week": "Saturday",
      "title": "Arrival in Barcelona",
      "weather": "Sunny",
      "temperature_celsius": 25,
      "items": [
        {
          "id": "uuid",
          "type": "activity",
          "title": "Sagrada Familia",
          "location": "Barcelona",
          "image_url": "https://...",
          "rating": 4.9,
          "review_count": 5000,
          "start_time": "10:00",
          "duration_minutes": 120,
          "price": 26.00,
          "price_currency": "eur",
          "is_booked": false,
          "sequence_order": 0
        }
      ]
    }
  ],
  "accommodations": [
    {
      "id": "uuid",
      "name": "Hotel Arts Barcelona",
      "type": "hotel",
      "stars": 5,
      "rating": 4.8,
      "review_count": 2500,
      "image_url": "https://...",
      "check_in_date": "2024-06-15",
      "check_out_date": "2024-06-18",
      "nights": 3,
      "price": 450.00,
      "price_per_night": 150.00,
      "price_currency": "eur",
      "provider": "Booking.com",
      "is_booked": false
    }
  ],
  "transports": [
    {
      "id": "uuid",
      "type": "flight",
      "title": "New York to Barcelona",
      "carrier": "Iberia",
      "carrier_code": "IB",
      "from_location": "JFK Airport",
      "from_code": "JFK",
      "to_location": "Barcelona Airport",
      "to_code": "BCN",
      "departure_date": "2024-06-15",
      "departure_time": "18:00",
      "arrival_date": "2024-06-16",
      "arrival_time": "08:00",
      "duration_minutes": 480,
      "flight_number": "IB6252",
      "price": 650.00,
      "price_currency": "eur",
      "travelers": 2,
      "is_booked": false,
      "sequence_order": 0
    }
  ],
  "collaborators": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Jane Doe",
      "profile_photo_url": "https://...",
      "permission": "edit",
      "is_owner": true
    }
  ],
  "created_at": "2024-02-01T12:00:00Z",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /trips/{trip_id}
Update a trip.

**Request:**
```json
{
  "title": "8-Day Spain Adventure",
  "start_date": "2024-06-14",
  "end_date": "2024-06-22",
  "adult_count": 2,
  "child_count": 1,
  "budget_level": "luxury",
  "status": "upcoming"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "8-Day Spain Adventure",
  "status": "upcoming",
  "start_date": "2024-06-14",
  "end_date": "2024-06-22",
  "traveler_count": 3,
  "adult_count": 2,
  "child_count": 1,
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /trips/{trip_id}
Delete a trip (soft delete).

**Response (200 OK):**
```json
{
  "message": "Trip deleted successfully",
  "id": "uuid"
}
```

---

### POST /trips/{trip_id}/duplicate
Duplicate a trip.

**Request:**
```json
{
  "title": "Copy of 7-Day Spain Adventure",
  "start_date": "2024-09-15"
}
```

**Response (201 Created):**
```json
{
  "id": "new_uuid",
  "title": "Copy of 7-Day Spain Adventure",
  "status": "draft",
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

## 11. City Stops

### GET /trips/{trip_id}/city-stops
List city stops for a trip.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Barcelona",
      "country_name": "Spain",
      "country_slug": "spain",
      "image_url": "https://...",
      "start_date": "2024-06-15",
      "end_date": "2024-06-18",
      "nights": 3,
      "sequence_order": 0,
      "latitude": 41.3851,
      "longitude": 2.1734
    }
  ]
}
```

---

### POST /trips/{trip_id}/city-stops
Add a city stop to a trip.

**Request:**
```json
{
  "name": "Valencia",
  "country_name": "Spain",
  "country_slug": "spain",
  "place_id": "uuid",
  "start_date": "2024-06-18",
  "end_date": "2024-06-20",
  "sequence_order": 1
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "Valencia",
  "country_name": "Spain",
  "start_date": "2024-06-18",
  "end_date": "2024-06-20",
  "nights": 2,
  "sequence_order": 1,
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /trips/{trip_id}/city-stops/{stop_id}
Update a city stop.

**Request:**
```json
{
  "start_date": "2024-06-18",
  "end_date": "2024-06-21",
  "sequence_order": 1
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Valencia",
  "start_date": "2024-06-18",
  "end_date": "2024-06-21",
  "nights": 3,
  "sequence_order": 1,
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /trips/{trip_id}/city-stops/{stop_id}
Remove a city stop from a trip.

**Response (200 OK):**
```json
{
  "message": "City stop removed",
  "id": "uuid"
}
```

---

### PUT /trips/{trip_id}/city-stops/reorder
Reorder city stops.

**Request:**
```json
{
  "order": ["uuid1", "uuid2", "uuid3"]
}
```

**Response (200 OK):**
```json
{
  "message": "City stops reordered",
  "items": [
    { "id": "uuid1", "sequence_order": 0 },
    { "id": "uuid2", "sequence_order": 1 },
    { "id": "uuid3", "sequence_order": 2 }
  ]
}
```

---

## 12. Day Plans

### GET /trips/{trip_id}/day-plans
List day plans for a trip.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "day_number": 1,
      "date": "2024-06-15",
      "day_of_week": "Saturday",
      "title": "Arrival in Barcelona",
      "weather": "Sunny",
      "temperature_celsius": 25,
      "city_stop_id": "uuid",
      "city_name": "Barcelona",
      "activity_count": 4
    }
  ]
}
```

---

### GET /trips/{trip_id}/day-plans/{day_plan_id}
Get a day plan with all activities.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "day_number": 1,
  "date": "2024-06-15",
  "day_of_week": "Saturday",
  "title": "Arrival in Barcelona",
  "description": "Explore the Gothic Quarter...",
  "weather": "Sunny",
  "weather_icon": "sunny",
  "temperature_celsius": 25,
  "temperature_fahrenheit": 77,
  "city_stop_id": "uuid",
  "items": [
    {
      "id": "uuid",
      "type": "activity",
      "title": "Sagrada Familia",
      "description": "Visit Gaudi's masterpiece...",
      "location": "Barcelona",
      "address": "Carrer de Mallorca, 401",
      "image_url": "https://...",
      "rating": 4.9,
      "review_count": 5000,
      "start_time": "10:00",
      "end_time": "12:00",
      "duration_minutes": 120,
      "price": 26.00,
      "price_currency": "eur",
      "latitude": 41.4036,
      "longitude": 2.1744,
      "is_booked": false,
      "booking_url": "https://...",
      "sequence_order": 0
    }
  ]
}
```

---

### POST /trips/{trip_id}/day-plans
Create a day plan.

**Request:**
```json
{
  "day_number": 1,
  "date": "2024-06-15",
  "title": "Arrival in Barcelona",
  "city_stop_id": "uuid"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "day_number": 1,
  "date": "2024-06-15",
  "day_of_week": "Saturday",
  "title": "Arrival in Barcelona",
  "city_stop_id": "uuid",
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /trips/{trip_id}/day-plans/{day_plan_id}
Update a day plan.

**Request:**
```json
{
  "title": "Exploring Barcelona",
  "description": "A day of architectural wonders"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Exploring Barcelona",
  "description": "A day of architectural wonders",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /trips/{trip_id}/day-plans/{day_plan_id}
Delete a day plan.

**Response (200 OK):**
```json
{
  "message": "Day plan deleted",
  "id": "uuid"
}
```

---

## 13. Activities

### POST /trips/{trip_id}/day-plans/{day_plan_id}/activities
Add an activity to a day plan.

**Request:**
```json
{
  "type": "activity",
  "title": "Sagrada Familia",
  "description": "Visit Gaudi's masterpiece",
  "location": "Barcelona",
  "address": "Carrer de Mallorca, 401",
  "place_id": "uuid",
  "start_time": "10:00",
  "duration_minutes": 120,
  "price": 26.00,
  "price_currency": "eur",
  "latitude": 41.4036,
  "longitude": 2.1744
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "type": "activity",
  "title": "Sagrada Familia",
  "start_time": "10:00",
  "duration_minutes": 120,
  "sequence_order": 0,
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### GET /trips/{trip_id}/activities/{activity_id}
Get activity details.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "day_plan_id": "uuid",
  "type": "activity",
  "title": "Sagrada Familia",
  "description": "Visit Gaudi's masterpiece...",
  "location": "Barcelona",
  "address": "Carrer de Mallorca, 401",
  "image_url": "https://...",
  "rating": 4.9,
  "review_count": 5000,
  "start_time": "10:00",
  "end_time": "12:00",
  "duration_minutes": 120,
  "price": 26.00,
  "price_currency": "eur",
  "is_booked": false,
  "booking_url": "https://...",
  "latitude": 41.4036,
  "longitude": 2.1744,
  "reviews": {
    "average": 4.9,
    "total": 5000,
    "breakdown": { "5": 4500, "4": 400, "3": 80, "2": 15, "1": 5 },
    "items": [
      {
        "id": "uuid",
        "author_name": "John D.",
        "rating": 5,
        "content": "Absolutely stunning!",
        "visit_date": "2024-01-15"
      }
    ]
  }
}
```

---

### PATCH /trips/{trip_id}/activities/{activity_id}
Update an activity.

**Request:**
```json
{
  "start_time": "11:00",
  "duration_minutes": 90,
  "is_booked": true,
  "booking_reference": "ABC123"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "start_time": "11:00",
  "duration_minutes": 90,
  "is_booked": true,
  "booking_reference": "ABC123",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /trips/{trip_id}/activities/{activity_id}
Remove an activity.

**Response (200 OK):**
```json
{
  "message": "Activity removed",
  "id": "uuid"
}
```

---

### PUT /trips/{trip_id}/day-plans/{day_plan_id}/activities/reorder
Reorder activities in a day plan.

**Request:**
```json
{
  "order": ["uuid1", "uuid2", "uuid3"]
}
```

**Response (200 OK):**
```json
{
  "message": "Activities reordered"
}
```

---

## 14. Accommodations

### GET /trips/{trip_id}/accommodations
List accommodations for a trip.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Hotel Arts Barcelona",
      "type": "hotel",
      "stars": 5,
      "rating": 4.8,
      "review_count": 2500,
      "image_url": "https://...",
      "city": "Barcelona",
      "check_in_date": "2024-06-15",
      "check_out_date": "2024-06-18",
      "nights": 3,
      "price": 450.00,
      "price_per_night": 150.00,
      "price_currency": "eur",
      "is_booked": false
    }
  ]
}
```

---

### POST /trips/{trip_id}/accommodations
Add an accommodation to a trip.

**Request:**
```json
{
  "name": "Hotel Arts Barcelona",
  "type": "hotel",
  "stars": 5,
  "city_stop_id": "uuid",
  "check_in_date": "2024-06-15",
  "check_out_date": "2024-06-18",
  "room_type": "Deluxe Sea View",
  "room_count": 1,
  "guest_count": 2,
  "price": 450.00,
  "price_currency": "eur",
  "provider": "Booking.com",
  "booking_url": "https://..."
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "Hotel Arts Barcelona",
  "type": "hotel",
  "check_in_date": "2024-06-15",
  "check_out_date": "2024-06-18",
  "nights": 3,
  "price": 450.00,
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### GET /trips/{trip_id}/accommodations/{accommodation_id}
Get accommodation details.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Hotel Arts Barcelona",
  "type": "hotel",
  "stars": 5,
  "rating": 4.8,
  "review_count": 2500,
  "image_url": "https://...",
  "images": ["https://...", "https://..."],
  "description": "Luxury beachfront hotel...",
  "address": "Carrer de la Marina, 19-21",
  "city": "Barcelona",
  "country": "Spain",
  "latitude": 41.3869,
  "longitude": 2.1936,
  "check_in_date": "2024-06-15",
  "check_out_date": "2024-06-18",
  "check_in_time": "15:00",
  "check_out_time": "11:00",
  "nights": 3,
  "room_type": "Deluxe Sea View",
  "room_count": 1,
  "guest_count": 2,
  "price": 450.00,
  "price_per_night": 150.00,
  "price_currency": "eur",
  "provider": "Booking.com",
  "booking_url": "https://...",
  "is_booked": false,
  "cancellation_policy": "Free cancellation until June 12",
  "amenities": ["wifi", "pool", "spa", "gym", "restaurant", "bar", "room_service", "parking"],
  "reviews": {
    "average": 4.8,
    "total": 2500,
    "breakdown": { "5": 2000, "4": 400, "3": 80, "2": 15, "1": 5 }
  }
}
```

---

### PATCH /trips/{trip_id}/accommodations/{accommodation_id}
Update an accommodation.

**Request:**
```json
{
  "check_in_date": "2024-06-15",
  "check_out_date": "2024-06-19",
  "is_booked": true,
  "booking_reference": "HTL123456"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "nights": 4,
  "is_booked": true,
  "booking_reference": "HTL123456",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /trips/{trip_id}/accommodations/{accommodation_id}
Remove an accommodation.

**Response (200 OK):**
```json
{
  "message": "Accommodation removed",
  "id": "uuid"
}
```

---

### GET /accommodations/search
Search for available accommodations.

**Query Parameters:**
- `city` (required): City name
- `country` (optional): Country name
- `check_in` (required): Check-in date
- `check_out` (required): Check-out date
- `guests` (optional): Number of guests
- `rooms` (optional): Number of rooms
- `type` (optional): Accommodation type
- `min_stars` (optional): Minimum star rating
- `min_rating` (optional): Minimum user rating
- `max_price` (optional): Maximum price per night
- `amenities` (optional, repeatable): Required amenities
- `sort` (optional): `price`, `rating`, `stars`, `distance`
- `limit` (optional): max 50, default 20
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Hotel Arts Barcelona",
      "type": "hotel",
      "stars": 5,
      "rating": 4.8,
      "review_count": 2500,
      "image_url": "https://...",
      "address": "Carrer de la Marina, 19-21",
      "distance_km": 2.5,
      "price_per_night": 150.00,
      "total_price": 450.00,
      "price_currency": "eur",
      "provider": "Booking.com",
      "amenities": ["wifi", "pool", "spa"],
      "free_cancellation": true
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true,
  "filters": {
    "price_range": { "min": 50, "max": 500 },
    "available_amenities": ["wifi", "pool", "spa", "gym"]
  }
}
```

---

## 15. Transports

### GET /trips/{trip_id}/transports
List transports for a trip.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "flight",
      "title": "New York to Barcelona",
      "carrier": "Iberia",
      "from_location": "JFK Airport",
      "from_code": "JFK",
      "to_location": "Barcelona Airport",
      "to_code": "BCN",
      "departure_date": "2024-06-15",
      "departure_time": "18:00",
      "arrival_date": "2024-06-16",
      "arrival_time": "08:00",
      "duration_minutes": 480,
      "price": 650.00,
      "price_currency": "eur",
      "travelers": 2,
      "is_booked": false,
      "sequence_order": 0
    }
  ]
}
```

---

### POST /trips/{trip_id}/transports
Add a transport to a trip.

**Request:**
```json
{
  "type": "flight",
  "carrier": "Iberia",
  "carrier_code": "IB",
  "from_location": "JFK Airport",
  "from_code": "JFK",
  "to_location": "Barcelona Airport",
  "to_code": "BCN",
  "departure_date": "2024-06-15",
  "departure_time": "18:00",
  "arrival_date": "2024-06-16",
  "arrival_time": "08:00",
  "flight_number": "IB6252",
  "price": 650.00,
  "price_currency": "eur",
  "travelers": 2
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "type": "flight",
  "from_code": "JFK",
  "to_code": "BCN",
  "departure_date": "2024-06-15",
  "departure_time": "18:00",
  "duration_minutes": 480,
  "price": 650.00,
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /trips/{trip_id}/transports/{transport_id}
Update a transport.

**Request:**
```json
{
  "is_booked": true,
  "booking_reference": "ABCDEF",
  "seat_numbers": ["12A", "12B"]
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "is_booked": true,
  "booking_reference": "ABCDEF",
  "seat_numbers": ["12A", "12B"],
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /trips/{trip_id}/transports/{transport_id}
Remove a transport.

**Response (200 OK):**
```json
{
  "message": "Transport removed",
  "id": "uuid"
}
```

---

## 16. Favorites

### GET /favorites
List all favorites for the current user.

**Query Parameters:**
- `category` (optional): filter by category
- `limit` (optional): max 100, default 50
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "category": "destinations",
      "country_slug": "spain",
      "country_name": "Spain",
      "place_id": "uuid",
      "item_name": "Costa del Sol",
      "item_image_url": "https://...",
      "item_rating": 4.7,
      "created_at": "2024-02-01T12:00:00Z"
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true
}
```

---

### GET /favorites/count
Get favorite counts by category.

**Response (200 OK):**
```json
{
  "total": 25,
  "by_category": {
    "destinations": 5,
    "cities": 8,
    "restaurants": 7,
    "museums": 2,
    "historical_sites": 1,
    "natural_attractions": 2,
    "amenities": 0,
    "accommodations": 0,
    "activities": 0
  }
}
```

---

### POST /favorites
Add a favorite.

**Request:**
```json
{
  "category": "destinations",
  "place_id": "uuid",
  "country_slug": "spain",
  "country_name": "Spain",
  "item_name": "Costa del Sol",
  "item_image_url": "https://...",
  "item_rating": 4.7
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "category": "destinations",
  "place_id": "uuid",
  "item_name": "Costa del Sol",
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /favorites/{favorite_id}
Remove a favorite.

**Response (200 OK):**
```json
{
  "message": "Favorite removed",
  "id": "uuid"
}
```

---

### DELETE /favorites
Remove a favorite by place.

**Query Parameters:**
- `category` (required): category
- `place_id` (required): place ID

**Response (200 OK):**
```json
{
  "message": "Favorite removed"
}
```

---

### GET /favorites/check
Check if an item is favorited.

**Query Parameters:**
- `category` (required): category
- `place_id` (required): place ID

**Response (200 OK):**
```json
{
  "is_favorite": true,
  "favorite_id": "uuid"
}
```

---

## 17. Recently Viewed

### GET /recently-viewed
List recently viewed items.

**Query Parameters:**
- `limit` (optional): max 50, default 10

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "place_id": "uuid",
      "country_slug": "spain",
      "country_name": "Spain",
      "country_flag": "\ud83c\uddea\ud83c\uddf8",
      "item_name": "Costa del Sol",
      "item_image_url": "https://...",
      "viewed_at": "2024-02-01T12:00:00Z",
      "view_count": 3
    }
  ]
}
```

---

### POST /recently-viewed
Record a view.

**Request:**
```json
{
  "place_id": "uuid",
  "country_slug": "spain",
  "country_name": "Spain",
  "country_flag": "\ud83c\uddea\ud83c\uddf8",
  "item_name": "Costa del Sol",
  "item_image_url": "https://..."
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "viewed_at": "2024-02-01T12:00:00Z",
  "view_count": 4
}
```

---

### DELETE /recently-viewed
Clear all recently viewed items.

**Response (200 OK):**
```json
{
  "message": "Recently viewed cleared"
}
```

---

## 18. Reviews

### POST /reviews
Create a review.

**Request:**
```json
{
  "place_id": "uuid",
  "rating": 5,
  "title": "Amazing experience!",
  "content": "We had such a wonderful time...",
  "positives": "Beautiful beaches, great food",
  "negatives": "Can be crowded in summer",
  "visit_type": "couple",
  "visit_date": "2024-01-15",
  "rating_location": 5,
  "rating_cleanliness": 5,
  "rating_service": 4,
  "rating_value": 5
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "rating": 5,
  "title": "Amazing experience!",
  "is_verified": false,
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### PATCH /reviews/{review_id}
Update a review.

**Request:**
```json
{
  "rating": 5,
  "content": "Updated review content..."
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "rating": 5,
  "content": "Updated review content...",
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /reviews/{review_id}
Delete a review.

**Response (200 OK):**
```json
{
  "message": "Review deleted",
  "id": "uuid"
}
```

---

### POST /reviews/{review_id}/photos
Add photos to a review.

**Request (multipart/form-data):**
- `files`: Image files (up to 5)
- `captions`: Array of captions (optional)

**Response (200 OK):**
```json
{
  "photos": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "thumbnail_url": "https://..."
    }
  ]
}
```

---

### POST /reviews/{review_id}/helpful
Mark a review as helpful.

**Request:**
```json
{
  "is_helpful": true
}
```

**Response (200 OK):**
```json
{
  "helpful_count": 43
}
```

---

### POST /reviews/{review_id}/report
Report a review.

**Request:**
```json
{
  "reason": "inappropriate",
  "details": "Optional details..."
}
```

**Response (200 OK):**
```json
{
  "message": "Review reported"
}
```

---

## 19. Trip Sharing

### POST /trips/{trip_id}/share
Share a trip.

**Request:**
```json
{
  "email": "friend@example.com",
  "permission": "view",
  "message": "Check out my trip!"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "share_token": "abc123xyz",
  "share_url": "https://app.layla.travel/shared/abc123xyz",
  "permission": "view",
  "expires_at": "2024-03-01T12:00:00Z"
}
```

---

### GET /trips/{trip_id}/shares
List shares for a trip.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "shared_with_email": "friend@example.com",
      "shared_with_user": {
        "id": "uuid",
        "name": "Friend Name",
        "profile_photo_url": "https://..."
      },
      "permission": "view",
      "is_active": true,
      "accepted_at": "2024-02-01T12:00:00Z",
      "last_accessed_at": "2024-02-01T12:00:00Z",
      "access_count": 5,
      "created_at": "2024-02-01T12:00:00Z"
    }
  ]
}
```

---

### PATCH /trips/{trip_id}/shares/{share_id}
Update a share.

**Request:**
```json
{
  "permission": "edit",
  "is_active": true
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "permission": "edit",
  "is_active": true,
  "updated_at": "2024-02-01T12:00:00Z"
}
```

---

### DELETE /trips/{trip_id}/shares/{share_id}
Revoke a share.

**Response (200 OK):**
```json
{
  "message": "Share revoked",
  "id": "uuid"
}
```

---

### GET /shared/{share_token}
Access a shared trip (public endpoint).

**Response (200 OK):**
```json
{
  "trip": {
    "id": "uuid",
    "title": "7-Day Spain Adventure",
    "...": "..."
  },
  "permission": "view",
  "shared_by": {
    "name": "Jane Doe",
    "profile_photo_url": "https://..."
  }
}
```

---

### POST /shared/{share_token}/accept
Accept a trip share invitation.

**Response (200 OK):**
```json
{
  "message": "Share accepted",
  "trip_id": "uuid"
}
```

---

### GET /trips/{trip_id}/collaborators
List collaborators for a trip.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Jane Doe",
      "profile_photo_url": "https://...",
      "permission": "admin",
      "is_owner": true,
      "created_at": "2024-02-01T12:00:00Z"
    }
  ]
}
```

---

### DELETE /trips/{trip_id}/collaborators/{collaborator_id}
Remove a collaborator.

**Response (200 OK):**
```json
{
  "message": "Collaborator removed",
  "id": "uuid"
}
```

---

## 20. AI Chat & Trip Generation

### POST /ai/chat/sessions
Create a new AI chat session.

**Request:**
```json
{
  "mode": "create",
  "trip_id": null,
  "initial_message": "Plan a 7-day trip to Spain for 2 people"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "mode": "create",
  "status": "active",
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### POST /ai/chat/sessions/{session_id}/messages
Send a message to the AI.

**Request:**
```json
{
  "content": "I want to visit Barcelona and Madrid"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "role": "assistant",
  "content": "Great choice! Let me suggest an itinerary...",
  "metadata": {
    "trip_preview": {
      "title": "7-Day Spain Adventure",
      "cities": ["Barcelona", "Madrid"],
      "...": "..."
    }
  },
  "created_at": "2024-02-01T12:00:00Z"
}
```

---

### GET /ai/chat/sessions/{session_id}/messages
Get chat history.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Plan a 7-day trip to Spain",
      "created_at": "2024-02-01T12:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "I'd be happy to help...",
      "created_at": "2024-02-01T12:00:01Z"
    }
  ]
}
```

---

### POST /ai/chat/sessions/{session_id}/generate-trip
Generate a trip from the chat session.

**Response (201 Created):**
```json
{
  "trip_id": "uuid",
  "message": "Trip created successfully"
}
```

---

### GET /ai/chat/sessions
List chat sessions.

**Query Parameters:**
- `status` (optional): `active`, `completed`, `abandoned`
- `limit` (optional): max 50, default 20
- `cursor` (optional): pagination cursor

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "mode": "create",
      "status": "completed",
      "trip_id": "uuid",
      "trip_title": "7-Day Spain Adventure",
      "message_count": 5,
      "created_at": "2024-02-01T12:00:00Z",
      "updated_at": "2024-02-01T12:30:00Z"
    }
  ],
  "next_cursor": "cursor_token",
  "has_more": true
}
```

---

### POST /ai/inspire
Get travel inspiration.

**Request:**
```json
{
  "preferences": {
    "budget": "mid_range",
    "duration_days": 7,
    "travelers": 2,
    "interests": ["beach", "culture", "food"],
    "climate": "warm",
    "continent": "Europe"
  }
}
```

**Response (200 OK):**
```json
{
  "recommendations": [
    {
      "destination": "Costa del Sol, Spain",
      "country_slug": "spain",
      "place_id": "uuid",
      "image_url": "https://...",
      "description": "Sun-drenched beaches and vibrant nightlife...",
      "highlights": ["Beautiful beaches", "Delicious tapas", "Rich history"],
      "best_time": "May - October",
      "estimated_budget": 2500
    }
  ]
}
```

---

### POST /ai/trips/{trip_id}/modify
Modify an existing trip with AI.

**Request:**
```json
{
  "action": "add_city",
  "parameters": {
    "city": "Valencia",
    "after_city": "Barcelona",
    "nights": 2
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Trip modified successfully",
  "changes": {
    "added_city_stop": {
      "id": "uuid",
      "name": "Valencia",
      "nights": 2
    },
    "updated_day_plans": [...]
  }
}
```

---

### POST /ai/trips/{trip_id}/apply-budget
Apply budget changes to a trip.

**Request:**
```json
{
  "budget_level": "budget",
  "max_budget": 2000,
  "currency": "eur"
}
```

**Response (200 OK):**
```json
{
  "message": "Budget changes applied",
  "original_cost": 3500,
  "new_cost": 1950,
  "changes": {
    "accommodations": [...],
    "activities": [...],
    "restaurants": [...]
  }
}
```

---

## 21. File Uploads

### POST /files/upload
Upload a file.

**Request (multipart/form-data):**
- `file`: File to upload
- `type`: `profile_photo`, `trip_photo`, `review_photo`
- `trip_id` (optional): Associated trip ID
- `resize` (optional): Resize options

**Response (200 OK):**
```json
{
  "id": "uuid",
  "file_url": "https://...",
  "thumbnail_url": "https://...",
  "file_name": "photo.jpg",
  "file_size": 245000,
  "mime_type": "image/jpeg",
  "width": 1920,
  "height": 1080
}
```

---

### DELETE /files/{file_id}
Delete a file.

**Response (200 OK):**
```json
{
  "message": "File deleted",
  "id": "uuid"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required or invalid token |
| `FORBIDDEN` | Permission denied |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `CONFLICT` | Resource already exists |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## Rate Limits

| Endpoint Category | Limit |
|-------------------|-------|
| Authentication | 10 requests/minute |
| AI Chat | 20 requests/minute |
| General API | 100 requests/minute |
| File Uploads | 30 requests/minute |

---

## Webhooks (Future)

The API will support webhooks for the following events:
- `trip.created`
- `trip.updated`
- `trip.deleted`
- `trip.shared`
- `share.accepted`
- `review.created`
- `booking.confirmed`
