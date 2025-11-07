import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import axios from 'axios';
import Chatbot from './pages/Chatbot';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BudgetPlanner from './pages/BudgetPlanner';
import StatementAnalyzer from './pages/StatementAnalyzer';
import ProtectedRoute from './components/ProctedRoute';
import TaxEstimator from './pages/TaxEstimator';
import FinancialPlanner from './pages/FinancialPlanner';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';


export default function App() {
  const [user, setUser] = useState(null);
  const [sidebar, setSidebar] = useState(false);

  // useEffect(() => {
  //   axios.get('http://localhost:8000/auth/dashboard', { withCredentials: true })
  //     .then(res => setUser(res.data.user))
  //     .catch(() => setUser(null));
  // }, []);
  useEffect(() => {
      const checkUser = async () => {
        try {
          const res = await axios.get("http://localhost:8000/auth/dashboard", { withCredentials: true });
          setUser(res.data.user);
        } catch (err) {
          if (err.response?.status !== 401) {
            console.error("Error fetching user:", err);
          }
          setUser(null);
        }
      };
      checkUser();
    }, []);

  const toggleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  return (
    <BrowserRouter>
     <Navbar user={user} setUser={setUser} toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebar} toggleSidebar={toggleSidebar} setUser={setUser} />
      <Routes>
            <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chatbot"
          element={user ? <Chatbot /> : <Navigate to="/login" replace />}
        />
        <Route path="/budget-planner" element={<BudgetPlanner />} />
        <Route path="/statement-analyzer" element={<StatementAnalyzer />} />
        <Route path="/tax-estimator" element={<TaxEstimator />} />
        <Route path="/financial-planner" element={<FinancialPlanner />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
