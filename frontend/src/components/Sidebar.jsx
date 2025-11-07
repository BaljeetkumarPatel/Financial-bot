// import React from 'react';

// export default function Sidebar({ open }) {
//   if (!open) return null;
//   return (
//     <div className="fixed left-4 top-20 bg-white shadow-lg rounded-lg w-60 p-4">
//       <ul className="space-y-3 text-[#072146] font-medium">
//         <li><a href="/dashboard/profile">Profile</a></li>
//         <li><a href="/dashboard/accounts">Accounts</a></li>
//         <li><a href="/dashboard/transactions">Transactions</a></li>
//         <li><a href="/dashboard/settings">Settings</a></li>
//       </ul>
//     </div>
//   );
// }


import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Sidebar({ open, toggleSidebar, setUser }) {
   const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
      setUser(null);
      toggleSidebar();
    } catch (err) {
      console.error("Logout failed:", err);
      // still close the sidebar even if logout fails locally
      toggleSidebar();
    }
  };

  return (
    <>
      {/* ---- Background Overlay ---- */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* ---- Sidebar Panel ---- */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-500 z-50 flex flex-col justify-between ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ---- Sidebar Top ---- */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#072146]">Dashboard</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-[#1FA2B6] text-2xl font-bold transition-transform duration-200 hover:scale-110"
              title="Close Sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-4 text-[#072146] font-medium">
            <li>
              <a href="/dashboard/profile" className="sidebar-btn">
                👤 Profile
              </a>
            </li>
            <li>
              <a href="/statement-analyzer" className="sidebar-btn">
                💳 Statement Analyzer
              </a>
            </li>
            <li>
              <a href="/budget-planner" className="sidebar-btn">
                🧮  Budget Planner
              </a>
            </li>
            <li>
              <a href="/tax-estimator" className="sidebar-btn">
                📊  AI Accountant
              </a>
            </li>
            <li>
              <a href="/financial-planner" className="sidebar-btn">
                🎯 Financial Planner
              </a>
            </li>
          </ul>
        </div>

        {/* ---- Logout Button (Bottom) ---- */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-[#1FA2B6] text-white py-2.5 rounded-lg font-medium hover:opacity-90 hover:translate-y-[-2px] transition-all"
          >
            🚪 Logout
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Wise Wallet © 2025
          </p>
        </div>

        {/* ---- Inline Styling ---- */}
        <style>{`
          .sidebar-btn {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
            background-color: #f4f7fb;
          }
          .sidebar-btn:hover {
            background-color: #1FA2B6;
            color: white;
            transform: translateX(4px);
          }
        `}</style>
      </div>
    </>
  );
}

