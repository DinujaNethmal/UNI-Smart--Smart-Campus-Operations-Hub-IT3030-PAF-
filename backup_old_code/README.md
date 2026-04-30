# Smart Campus Operations Hub - Member 1

This repository contains the implementation for **Module A: Facilities & Assets Catalogue** as part of the Programming Applications and Frameworks (IT3030) assignment.

## Member 1 Contribution
- **REST API Development**: Spring Boot implementation for resource management.
- **Frontend Development**: React-based catalogue UI with premium aesthetics.
- **Database**: H2 In-memory SQL database for persistence.

## Features
- ✅ **Catalogue Management**: CRUD operations for lecture halls, labs, rooms, and equipment.
- ✅ **Search & Filter**: Real-time filtering by type, capacity, and location.
- ✅ **Metadata Tracking**: Status monitoring (ACTIVE/OUT_OF_SERVICE), capacity, and availability windows.
- ✅ **Validation**: Backend input validation and meaningful error responses.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, Lombok, Validation.
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Axios.
- **Styling**: Vanilla CSS with Glassmorphic design principles.

## Getting Started

### 1. Run Backend
```bash
cd backend
mvn spring-boot:run
```
The API will be available at `http://localhost:8080/api/facilities`.
You can access H2 Console at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:campusdb`).

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at the local development port (usually 5173).

## API Endpoints
- `GET /api/facilities` - List all facilities (supports optional query params: `type`, `location`, `minCapacity`).
- `GET /api/facilities/{id}` - Get single facility details.
- `POST /api/facilities` - Create a new resource.
- `PUT /api/facilities/{id}` - Update existing resource.
- `DELETE /api/facilities/{id}` - Remove a resource.
