# 📔 Technical Handover: Employee Feedback System

This document provides a complete overview of the architecture, data flow, and technical implementation of the project to help you explain it during your MERN stack interview.

## 🏗️ 1. Architecture & Design Pattern
The project follows the **MVC (Model-View-Controller)** pattern, which separates data (Model), logic (Controller), and UI (View/React).

### Folder Structure
```text
Hackathon/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic (e.g., feedbackController.js)
│   │   ├── middleware/     # Security and validation (validation.js)
│   │   ├── models/         # Mongoose schemas (e.g., Employee.js)
│   │   ├── routes/         # Endpoint definitions
│   │   └── index.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, EmployeeCard, Pagination, etc.)
│   │   ├── pages/          # Main views (HomePage, ProfilePage)
│   │   ├── services/       # API configuration (axios instance)
│   │   └── App.jsx         # Root component & Routing
```

---

## 🛠️ 2. Tech Stack & Dependencies
### **Backend (Node.js/Express)**
- **Express (^5.2.1)**: Web framework for building RESTful APIs.
- **Mongoose (^9.2.1)**: ODM for MongoDB (Object Data Modeling).
- **CORS (^2.8.6)**: Middleware to allow frontend-backend communication.
- **Dotenv (^17.3.1)**: Environment variable management.

### **Frontend (Vite/React)**
- **React (^19.2.0)**: Modern component-based UI.
- **Vite (^7.3.1)**: Ultra-fast build tool and dev server.
- **Axios (^1.13.5)**: Promise-based HTTP client for API calls.
- **React Router Dom (^7.13.0)**: Client-side routing.
- **Lucide React (^0.575.0)**: Clean, professional iconography.
- **Modular Refactoring**: Split 1000+ lines of page code into 6 cohesive sub-components.

---

## 💾 3. Data Schema & MVC Logic
### **Employee Schema**
```javascript
{
  name: String,
  email: String (unique),
  department: String (Engineering, Design, HR, etc.)
}
```
### **Feedback Schema (with Soft Delete)**
```javascript
{
  rating: Number (1-5),
  comment: String,
  givenBy: ObjectId (ref: 'Employee'),
  givenTo: ObjectId (ref: 'Employee'),
  isDeleted: Boolean (default: false),
  deletedAt: Date
}
```

---

## 🛡️ 4. Security & Middlewares
- **Middleware**: Used `express.json()` to parse request bodies and `cors()` for cross-origin access.
- **Helmet**: Integrated for setting secure HTTP headers (XSS, Clickjacking protection).
- **Express-Validator**: Implemented strict schema validation and HTML sanitization on all POST routes.
- **Rate Limiting**: Added `express-rate-limit` to restrict requests to 100 per 15 minutes per IP.
- **Payload Protection**: Restricts raw JSON body sizes to **10kb** to prevent Denial-of-Service attacks.
- **DB Optimization**: Compounded **Text Indexing** added to Employee model for efficient regex-based search.
- **Constraints**: 
  - **No Self-Feedback**: Backend check `if (givenBy === givenTo)`.
  - **24h Rate Limit**: Queries the database for existing matches within the last 24h before allowing a new POST.
  - **Soft Delete**: Uses `isDeleted` flag so that even "removed" feedback still blocks the 24h limit.

---

## ⚡ 5. Hooks & Optimizations
### **Hooks Used**
- `useState`: For local states (employees, searchTerm, errors).
- `useEffect`: For lifecycle management (fetching data on load).
- `useMemo`: Optimized the search filtering and average rating calculations.
- `useCallback`: Memoized fetch functions to prevent unnecessary re-renders.
- `useParams`: To extract the employee ID from the URL in `ProfilePage`.

### **Optimizations**
- **Debounced Search**: Waits 500ms after the user stops typing before sending a search request to the server (saves API calls).
- **Server-Side Pagination**: Only fetches 10 employees at a time.
- **React.lazy**: Used for route splitting to reduce the initial bundle size.

---

## 📡 6. REST API Reference (Postman)

| Method | Endpoint | Body Params (JSON) | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/employees` | `{ "name", "email", "department" }` | Create new employee |
| **GET** | `/api/employees` | Query params: `page`, `limit`, `search` | Paginated list + Search |
| **GET** | `/api/employees/:id` | | Get single profile |
| **POST** | `/api/feedback` | `{ "rating", "comment", "givenBy", "givenTo" }` | Submit feedback |
| **GET** | `/api/feedback/received/:id` | | Feed of feedback received (active only) |
| **GET** | `/api/feedback/given/:id` | | History of feedback given (includes deleted) |
| **DELETE** | `/api/feedback/:id` | Query params: `employeeId` | Soft deletes feedback |

---

## 🚀 7. Run Commands
- **Backend**: `npm run dev` (uses nodemon)
- **Frontend**: `npm run dev` (starts Vite)
- **Production Build**: `npm run build` (generates `dist` folder)

---

### 💡 Interview Tip
"We used **Soft Deletes** specifically to maintain a 'log' for security. If we hard-deleted the records, a user could delete their feedback and immediately send a new one to bypass the 24-hour rule. By keeping the record with an `isDeleted` flag, the backend can still verify the submission time while hiding it from the recipient's profile."
