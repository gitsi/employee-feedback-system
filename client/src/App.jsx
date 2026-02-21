import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const HomePage = lazy(() => import('./pages/HomePage'));
const EmployeeFeedbackPage = lazy(() => import('./pages/EmployeeFeedbackPage'));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div className="container">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/employee/:id" element={<EmployeeFeedbackPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
