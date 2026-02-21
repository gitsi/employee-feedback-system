# 🚀 Employee Feedback System

A professional, high-performance MERN stack application designed for peer-to-peer feedback. This system focuses on security, scalability, and clean modular architecture, making it an ideal showcase for modern web development practices.

---

## 📖 1. Usecase
The **Employee Feedback System** serves as a centralized hub for organizations to maintain a transparent and constructive feedback culture. 
- **Peer Recognition**: Allows team members to acknowledge each other's contributions.
- **Performance Tracking**: Provides a consolidated view of an employee's received and given feedback.
- **Data-Driven Insights**: Calculates real-time average ratings to help managers identify top performers.
- **Accountability**: Ensures all feedback is attributed to a reviewer while maintaining professional standards.

---

## 🏗️ 2. Architecture & Design
The system follows the **SoC (Separation of Concerns)** principle with a clean two-tier architecture.

### **Server (Node.js/Express/MongoDB)**
- **Pattern**: MVC (Model-View-Controller) for decoupled logic.
- **Models**: Mongoose schemas with strict validation and custom text-indexes for search.
- **Routes**: RESTful API design with semantic endpoint naming (`/api/employees`, `/api/feedback`).
- **Middleware**: Integrated security layers (Helmet, Rate Limiting) and custom payload protection.

### **Client (React/Vite)**
- **Atomic Components**: Small, reusable UI units (Buttons, Inputs, Cards).
- **Pages (Orchestrators)**: High-level views (HomePage, EmployeeFeedbackPage) that manage data flow.
- **Custom Hooks**: Business logic extracted into reusable hooks (e.g., `useDebounce` for search).
- **Service Layer**: Dedicated `API.js` service for centralized Axios configurations.

---

## 💎 3. Core Values
### ⚡ **Optimized**
- **Server-Side Pagination**: Only fetches data chunks needed for the current view, reducing memory footprint.
- **Text Indexing**: MongoDB text indexes on Name and Department fields for ultra-fast search results.
- **Debounced Interaction**: Search inputs are debounced to prevent unnecessary API hammering.

### ♻️ **Reusable**
- **Modular CSS**: Shared variables and utility classes in `index.css`.
- **Generic Components**: Components like `FeedbackList` are built to be context-agnostic.
- **Custom Hooks**: The `useDebounce` hook can be dropped into any other project.

### 🛡️ **Secure**
- **No Self-Feedback**: Business logic prevents employees from rating themselves.
- **Rate Limiting**: Integrated 24-hour limit on feedback between pairs to prevent spam.
- **Soft Deletes**: Ensures data integrity and prevents bypassing rate limits through deletions.
- **Security Headers**: Helmet integration to protect against common web vulnerabilities.

### 🛡️ **Reliable & Efficient**
- **Graceful Error Handling**: Custom UI feedback for connection drops or rate-limit triggers.
- **RESTful State**: Stateless backend ensuring predictable behavior and easier horizontal scaling.

---

## 📚 4. Topics Covered

### **React (Frontend)**
- **Modern Hooks**: `useState`, `useEffect`, `useCallback`, `useMemo`, `useParams`.
- **Custom Hooks**: Extraction of side-effect logic (e.g., `useDebounce`).
- **Conditional Rendering**: Handling loading, error, and empty states.
- **Advanced CSS**: Dark-mode glassmorphism and smooth micro-animations.

### **Node.js & Express (Backend)**
- **Middleware Integration**: CORS, Helmet, Rate-Limiting.
- **RESTful API**: CRUD operations, URL parameters, and Query filtering.
- **Validation**: Schema-level and middleware-level request validation.

### **MongoDB (Database)**
- **Schema Design**: Relational-style modeling using ObjectIDs.
- **Indexing**: Creating and utilizing Text Indexes for performance.
- **Soft Delete Pattern**: Flag-based deletion for data retention.

---

## 🛠️ 5. Setup Guide

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB instance (Local or Atlas)

### **Step 1: Clone and Install**
```bash
# Clone the repository
git clone https://github.com/gitsi/employee-feedback-system.git
cd employee-feedback-system

# Install Frontend Dependencies
cd client && npm install

# Install Backend Dependencies
cd ../server && npm install
```

### **Step 2: Environment Setup**
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### **Step 3: Seed Data (Optional)**
```bash
cd server
npm run seed
```

### **Step 4: Run the Application**
```bash
# Terminal 1 (Server)
cd server
npm run dev

# Terminal 2 (Client)
cd client
npm run dev
```

---

## 🚀 6. Terminal Commands
- **Install All**: `npm install` (in both directories)
- **Run Dev**: `npm run dev`
- **Build Client**: `npm run build`
- **Seed DB**: `node seed.js` (inside `server/`)

🏆 *Built with precision for professional peer-to-peer feedback.*
