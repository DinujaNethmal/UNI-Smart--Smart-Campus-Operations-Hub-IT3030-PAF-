# Smart Campus Operations Hub — IT3030 PAF 2026

A comprehensive university operations management system built with **Spring Boot** and **React**. This platform modernizes campus life by centralizing facility bookings and maintenance incident handling.

## 🚀 Project Overview
The Smart Campus Operations Hub enables students and staff to browse campus resources, manage time-sensitive bookings, and report maintenance issues. The system implements a robust role-based access control (RBAC) system for Users and Admins.

---

## 🛠️ Tech Stack
- **Backend:** Java 21, Spring Boot 3.2.5, Spring Data JPA, Hibernate, Jakarta Validation.
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Database:** MySQL 8.0.
- **Tools:** Maven, Git, GitHub Actions (CI/CD).

---

## 👥 Team Contributions & Module Allocation
To support individual assessment, the system is divided into focused modules.

### **Member 1 (You): Facilities & Assets Catalogue (Module A)**
Implemented the end-to-end resource management lifecycle:
- **REST API:** Developed 5 endpoints (`GET`, `POST`, `PUT`, `DELETE`) for facility management.
- **Metadata Management:** Tracking capacity, category, location, and status (ACTIVE/OUT_OF_SERVICE).
- **Availability Windows:** Implemented operating hour windows for every campus resource.
- **Advanced Filtering:** Built a multi-level search system (Search text + Type dropdown + Status dropdown + Minimum Capacity filter).
- **Backend Persistence:** Designed the MySQL schema for facilities.

### **Member 2: Booking Management (Module B)**
- Booking workflow (PENDING → APPROVED/REJECTED).
- Real-time status updates and conflict avoidance logic.
- Admin dashboard for request reviews.

*(Additional members for Module C & D)*

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- JDK 21 or higher
- Node.js (v18+) & npm
- MySQL Server

### 2. Database Configuration
1. Create a MySQL database named `smart_campus_db`.
2. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_db
   spring.datasource.username=root
   spring.datasource.password=12345
   ```

### 3. Running the Backend
```bash
cd backend
./mvnw spring-boot:run
```
*API runs on: [http://localhost:8081](http://localhost:8081)*

### 4. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
*App runs on: [http://localhost:5173](http://localhost:5173)*

---

## 📑 API Endpoints (Module A - Member 1)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/facilities` | Retrieve all facilities with optional filters. |
| `GET` | `/api/v1/facilities/{id}` | Get detailed metadata for a specific resource. |
| `POST` | `/api/v1/facilities` | Create a new campus resource (Admin Only). |
| `PUT` | `/api/v1/facilities/{id}` | Update existing resource metadata/availability. |
| `DELETE` | `/api/v1/facilities/{id}` | Remove a resource from the catalogue. |

---

## 🎨 UI/UX Design
The project uses a premium, modern design language featuring:
- **Glassmorphic components** and subtle micro-animations.
- **Role-based Dashboards** for Students and Admins.
- **Dynamic Status Badges** for real-time visibility.

---
**SLIIT - Faculty of Computing**  
*IT3030 – Programming Applications and Frameworks*
