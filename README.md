# Admin credential
Mail - admin@gmail.com
Password - 123456



# Smart Campus Operations Hub — IT3030 PAF 2026

A comprehensive university operations management system built with **Spring Boot** and **React**. This platform modernizes campus life by centralizing facility bookings and maintenance incident handling.

## 🚀 Project Overview
The Smart Campus Operations Hub enables students and staff to browse campus resources, manage time-sensitive bookings, and report maintenance issues. The system implements a robust role-based access control (RBAC) system for Users and Admins.

---

## 👥 Team Contributions & Module Allocation
To support individual assessment, the system is divided into focused modules.

### **Member 1: Facilities & Assets Catalogue (Module A)**
**Implemented by: Dinuja Nethmal**
- **REST API:** Developed 5 endpoints (`GET`, `POST`, `PUT`, `DELETE`) for facility management.
- **Metadata Management:** Tracking capacity, category, location, and status (ACTIVE/OUT_OF_SERVICE).
- **Availability Windows:** Implemented operating hour windows for every campus resource.
- **Advanced Filtering:** Built a multi-level search system (Search text + Type dropdown + Status dropdown + Minimum Capacity filter).

### **Member 2: Booking Management (Module B)**
**Implemented by: Tarini Nanayakkara**
- **Booking Workflow:** PENDING → APPROVED/REJECTED/CANCELLED lifecycle management.
- **Conflict Detection:** Logic to prevent overlapping bookings on the same resource.
- **Admin Panel:** Specialized UI for reviewing and responding to booking requests.

---

## 🛠️ Tech Stack
- **Backend:** Java 17+, Spring Boot 3.2.5, Spring Data JPA, Hibernate, MySQL.
- **Frontend:** React 19, Vite, Tailwind CSS v4, Axios, Lucide Icons.
- **CI/CD:** GitHub Actions.

---

## ⚙️ Setup & Installation

### 1. Database Configuration
1. Create a MySQL database named `smart_campus_db`.
2. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_db
   spring.datasource.username=root
   spring.datasource.password=12345
   ```

### 2. Running the Backend
```bash
cd backend
./mvnw spring-boot:run
```
*API runs on: http://localhost:8081*

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
*App runs on: http://localhost:5173*

---

## 📑 API documentation (Key Endpoints)

### Module A (Facility Management)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/facilities` | Retrieve all facilities with optional filters. |
| `POST` | `/api/v1/facilities` | Create a new campus resource (Admin Only). |
| `PUT` | `/api/v1/facilities/{id}` | Update resource metadata/availability. |

### Module B (Booking Management)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/bookings` | Create a new booking request. |
| `PATCH` | `/api/v1/bookings/{id}/review` | Approve/Reject a booking (Admin). |
| `DELETE` | `/api/v1/bookings/{id}` | Cancel an existing booking. |

---
**SLIIT - Faculty of Computing**  
*IT3030 – Programming Applications and Frameworks*
