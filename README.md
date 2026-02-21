# 🚀 Employee Feedback Hub - Hackathon Edition

A full-stack MERN application designed for professional colleague feedback with strict security constraints and high-performance directory management.

## 🌟 Key Features
- **Modern Employee Directory**: Paginated directory (10 per page) with real-time global search.
- **Secure Feedback Logic**:
    - **No Self-Feedback**: Prohibited at both frontend and backend levels.
    - **24-Hour Rate Limit**: Strictly enforced between unique pairs of givers and receivers.
    - **Soft Delete**: Records are marked as deleted but retained to prevent rate-limit bypassing.
- **Dynamic Profile Views**: Received vs. Given feedback tracking with average rating calculations.
- **Real-time Team Pulse**: A home screen activity feed showing the 20 most recent interactions.
- **Multi-Layered Security**: Integrated **Helmet**, **Express-Validator**, and **API Rate Limiting** for enterprise-grade protection.
- **DB Optimization**: **Text Indexing** on employee names and departments for lightning-fast search performance.
- **Payload Protection**: Strict limits on incoming request sizes to prevent server overflow attacks.
- **Modular Component Architecture**: Decoupled large page files into reusable sub-components.
- **High-End Aesthetics**: Dark-mode glassmorphism UI with smooth transitions and custom validation.

---

## 🏗️ Technical Architecture (MVC)
The project is built using the **Model-View-Controller** pattern for clean separation of concerns.

### Folder Structure
- `backend/`: Node.js, Express, and MongoDB (Mongoose) logic.
- `frontend/`: React 19, Vite, and Axios for a lightning-fast UI.

---

## 📡 API Specifications (REST)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/employees` | Create new employee profile |
| `GET` | `/api/employees` | Search & Paginated directory |
| `POST` | `/api/feedback` | Submit rating & comments |
| `DELETE` | `/api/feedback/:id` | Soft delete own feedback |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)

### 1. Project Organization
This repo contains two main folders: `backend` and `frontend`.

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your MONGO_URI and PORT
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Interview Talking Points
- **Why Soft Delete?**: We used soft deletion to ensure the 24-hour feedback rule is bulletproof. Even if a user deletes their post, the system "remembers" it to prevent them from immediately re-submitting to the same person.
- **Optimization**: We implemented **Debouncing** on the search bar to save server resources and **Server-side Pagination** to handle thousands of employees efficiently.
- **Clean Code**: Custom inline validation was used to replace default browser tooltips for a more professional, cohesive UX.

---

### 📦 Tech Stack
- **Frontend**: React 19, Vite, Axios, Lucide Icons, Vanilla CSS.
- **Backend**: Node.js, Express 5, Mongoose 9, CORS, Dotenv.
- **Database**: MongoDB.

🏆 *Built for the Hackathon Selection Process.*
