# Smart Campus Operations Hub
# Module B — Booking Management

**Implemented by:** Tarini Nanayakkara

## Overview

Module B handles the full booking lifecycle for campus resources (lecture halls, labs, equipment). Users can request bookings, view their booking history, and cancel requests. Admins can review, approve, or reject bookings with reasons.

### Booking Workflow

```
PENDING → APPROVED → CANCELLED (by user)
PENDING → REJECTED (by admin)
```

## REST API Endpoints

Base URL: `http://localhost:8081/api/v1/bookings`

| Method | Endpoint                     | Description                          | Role Required |
|--------|------------------------------|--------------------------------------|---------------|
| POST   | `/api/v1/bookings`           | Create a new booking request         | USER, ADMIN   |
| GET    | `/api/v1/bookings/me`        | Get current user's bookings          | USER, ADMIN   |
| GET    | `/api/v1/bookings`           | Get all bookings (with status filter)| ADMIN         |
| GET    | `/api/v1/bookings/{id}`      | Get a single booking by ID           | USER, ADMIN   |
| PATCH  | `/api/v1/bookings/{id}/review` | Approve or reject a booking        | ADMIN         |
| DELETE | `/api/v1/bookings/{id}`      | Cancel a booking                     | USER, ADMIN   |

### POST `/api/v1/bookings` — Create Booking

**Request Body:**
```json
{
  "resourceId": 1,
  "bookingDate": "2026-05-15",
  "startTime": "14:00:00",
  "endTime": "16:00:00",
  "purpose": "Guest lecture on machine learning",
  "expectedAttendees": 45
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1,
  "resourceId": 1,
  "userId": 1,
  "bookingDate": "2026-05-15",
  "startTime": "14:00:00",
  "endTime": "16:00:00",
  "purpose": "Guest lecture on machine learning",
  "expectedAttendees": 45,
  "status": "PENDING",
  "rejectionReason": null,
  "createdAt": "2026-04-16T19:04:27",
  "updatedAt": "2026-04-16T19:04:27"
}
```

**Error Response — Conflict:** `409 Conflict`
```json
{
  "timestamp": "2026-04-16T19:05:00",
  "status": 409,
  "error": "Conflict",
  "message": "This resource is already booked during the requested time range"
}
```

**Error Response — Validation:** `400 Bad Request`
```json
{
  "timestamp": "2026-04-16T19:05:00",
  "status": 400,
  "error": "Validation failed",
  "fieldErrors": {
    "purpose": "Purpose is required",
    "startTime": "Start time is required"
  }
}
```

### GET `/api/v1/bookings/me` — My Bookings

Returns all bookings for the authenticated user.

**Success Response:** `200 OK` — Array of booking objects.

### GET `/api/v1/bookings` — All Bookings (Admin)

Optional query parameter: `?status=PENDING` to filter by status.

**Success Response:** `200 OK` — Array of booking objects.

### GET `/api/v1/bookings/{id}` — Single Booking

**Success Response:** `200 OK` — Single booking object.

**Error Response:** `404 Not Found`
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Booking not found with id: 999"
}
```

### PATCH `/api/v1/bookings/{id}/review` — Approve or Reject

**Request Body (Approve):**
```json
{
  "decision": "APPROVE"
}
```

**Request Body (Reject):**
```json
{
  "decision": "REJECT",
  "reason": "Resource unavailable for maintenance"
}
```

**Success Response:** `200 OK` — Updated booking object with new status.

**Error Response:** `400 Bad Request`
```json
{
  "status": 400,
  "message": "Only PENDING bookings can be reviewed. Current status: APPROVED"
}
```

### DELETE `/api/v1/bookings/{id}` — Cancel Booking

Only the booking owner can cancel. Only PENDING or APPROVED bookings can be cancelled.

**Success Response:** `200 OK` — Updated booking with status `CANCELLED`.

## Conflict Detection

The system prevents overlapping bookings on the same resource. Two time ranges overlap when:

```
A.startTime < B.endTime AND A.endTime > B.startTime
```

This check runs at:
1. Booking creation (prevents submitting conflicting requests)
2. Approval time (prevents approving a booking when another was approved in between)

Only PENDING and APPROVED bookings are considered for conflicts. REJECTED and CANCELLED bookings are ignored.

## Database Schema

**Table: `bookings`**

| Column              | Type         | Constraints          |
|---------------------|--------------|----------------------|
| id                  | BIGINT       | PK, auto-increment   |
| resource_id         | BIGINT       | NOT NULL              |
| user_id             | BIGINT       | NOT NULL              |
| booking_date        | DATE         | NOT NULL              |
| start_time          | TIME         | NOT NULL              |
| end_time            | TIME         | NOT NULL              |
| purpose             | VARCHAR(500) | NOT NULL              |
| expected_attendees  | INT          | nullable              |
| status              | ENUM         | PENDING/APPROVED/REJECTED/CANCELLED |
| rejection_reason    | VARCHAR(500) | nullable              |
| created_at          | DATETIME     | auto-set              |
| updated_at          | DATETIME     | auto-set              |

## Frontend Pages (React)

| Route          | Page                  | Description                              |
|----------------|-----------------------|------------------------------------------|
| `/`            | Dashboard             | Stats overview, recent bookings, hero    |
| `/new`         | Create Booking        | Form to submit a new booking request     |
| `/my-bookings` | My Bookings           | Tabbed list with cancel functionality    |
| `/admin`       | Manage Bookings       | Admin review panel with approve/reject   |

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.5, Spring Data JPA, MySQL
- **Frontend:** React 19, Vite 8, Tailwind CSS v4, Axios, Lucide React icons
- **Authentication:** Role-based stub (pending OAuth 2.0 integration from Module E)

## Setup Instructions

### Backend
```bash
cd backend
# Ensure MySQL is running with database 'smart_campus_db'
mvn spring-boot:run
# Runs on http://localhost:8081
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (or next available port)
```
