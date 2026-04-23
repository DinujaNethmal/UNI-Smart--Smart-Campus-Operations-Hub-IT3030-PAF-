# UNI-Smart--Smart-Campus-Operations-Hub-IT3030-PAF-
Smart Campus Operations Hub
# Smart Campus Operations Hub

## Module C — Ticket Management  


---

## 📌 Overview

The Ticket Management module handles incident reporting and support requests within the Smart Campus system. Users can create and track tickets, while admins/technicians manage, assign, and resolve them.

### Key Features
- Create support/incident tickets
- Track ticket status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- Add attachments (screenshots, logs, documents)
- Admin/Technician assignment and resolution handling
- Role-based access control

---

## 🔄 Ticket Workflow
OPEN → IN_PROGRESS → RESOLVED → CLOSED
OPEN → REJECTED

## 🌐 Base URL
http://localhost:8081/api/v1/tickets

## 📡 REST API Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | /api/v1/tickets | Create ticket | USER |
| GET | /api/v1/tickets/me | Get my tickets | USER |
| GET | /api/v1/tickets | Get all tickets | ADMIN / TECH |
| GET | /api/v1/tickets/{id} | Get ticket by ID | USER / ADMIN |
| PATCH | /api/v1/tickets/{id}/status | Update status | ADMIN / TECH |
| PATCH | /api/v1/tickets/{id}/assign | Assign technician | ADMIN |
| POST | /api/v1/tickets/{id}/attachments | Upload file | USER / TECH |
| DELETE | /api/v1/tickets/{id} | Delete ticket | ADMIN |

---

## 📝 Create Ticket

### Request
```json
{
  "title": "WiFi not working in Lab 3",
  "description": "Cannot connect to campus WiFi",
  "category": "NETWORK",
  "priority": "HIGH"
}

Response
{
  "id": 101,
  "title": "WiFi not working in Lab 3",
  "status": "OPEN",
  "priority": "HIGH",
  "createdAt": "2026-04-23T10:15:00"
}

🔄 Update Ticket Status
Request
{
  "status": "IN_PROGRESS"
}

or

{
  "status": "RESOLVED",
  "resolutionNote": "Issue fixed by resetting router"
}
👨‍💻 Assign Technician
{
  "technicianId": 3
}

🚀 Setup Instructions
Backend
cd backend
mvn spring-boot:run

Runs on:

http://localhost:8081
Frontend
cd frontend
npm install
npm run dev

Runs on:

http://localhost:5173

