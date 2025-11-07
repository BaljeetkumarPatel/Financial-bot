import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardOverview from "../components/DashboardOverview";
import Footer from "../components/Footer";
import ForecastCard from "../components/ForecastCard";
import UsageDashboard from "../components/UsageDashboard";
import {
  BarChart3,
  CreditCard,
  Target,
  Calculator,
  PieChart,
  Info,
  ArrowRight,
} from "lucide-react";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const alertShown = sessionStorage.getItem("goalAlertShown");
    if (!alertShown) {
      setTimeout(() => setShowLoginAlert(true), 1000);
      sessionStorage.setItem("goalAlertShown", "true");
    }
  }, []);

  const handleAlertClick = () => {
    setShowLoginAlert(false);
    navigate("/financial-planner");
  };

  return (
    <>
    <div className="pt-[90px] px-8 pb-10 bg-[#F4F7FB] min-h-screen overflow-x-hidden relative">
      {/* ✨ Login-time Alert Popup */}
      <AnimatePresence>
        {showLoginAlert && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 right-6 z-50 bg-[#E0F7FA] border border-[#1FA2B6] text-[#072146] rounded-xl shadow-lg px-5 py-4 w-[300px] cursor-pointer"
            onClick={handleAlertClick}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-lg text-[#1FA2B6]">Reminder</h3>
                <p className="text-sm leading-snug">
                  Update your <strong>goal</strong> and <strong>debt plan</strong> to stay on track.
                </p>
                <p className="text-xs text-[#148a9c] mt-1 underline">
                  Click here to open Financial Planner →
                </p>
              </div>
            </div>
            <button
              className="absolute top-2 right-3 text-[#148a9c] hover:text-red-500 text-lg font-bold"
              onClick={(e) => {
                e.stopPropagation();
                setShowLoginAlert(false);
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting Section */}
      <div className="mb-10 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-[#072146] mb-2 tracking-tight">
          Welcome back, <span className="text-[#1FA2B6]">{user || "Guest"}</span> 👋
        </h1>
        <p className="text-gray-600 text-sm">
          Here’s your personalized financial dashboard
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
        {/* Statement Analyzer */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="modern-card"
          onClick={() => navigate("/statement-analyzer")}
        >
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="text-[#1FA2B6] w-8 h-8" />
            <h2 className="card-title">Statement Analyzer</h2>
          </div>
          <p className="card-text">
            Upload and analyze your bank statements for insights and spending trends.
          </p>
          <p className="card-link">
            Open Tool <ArrowRight className="inline w-4 h-4 ml-1" />
          </p>
        </motion.div>

        {/* Budget Planner */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="modern-card"
          onClick={() => navigate("/budget-planner")}
        >
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="text-[#1FA2B6] w-8 h-8" />
            <h2 className="card-title">Budget Planner</h2>
          </div>
          <p className="card-text">
            Plan and track your monthly expenses efficiently with category-based breakdowns.
          </p>
          <p className="card-link">
            Open Tool <ArrowRight className="inline w-4 h-4 ml-1" />
          </p>
        </motion.div>

        {/* Financial Planner */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="modern-card"
          onClick={() => navigate("/financial-planner")}
        >
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-[#1FA2B6] w-8 h-8" />
            <h2 className="card-title">Financial Planner</h2>
          </div>
          <p className="card-text">
            Set and monitor your financial goals with personalized insights and progress tracking.
          </p>
          <p className="card-link">
            Open Tool <ArrowRight className="inline w-4 h-4 ml-1" />
          </p>
        </motion.div>
      </div>

      {/* Tax & Spending Section - Full Width Row */}
      <div className="grid gap-8 sm:grid-cols-2 mt-8">
        {/* Tax & Investment Estimator */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="modern-card sm:col-span-1 lg:col-span-1 xl:col-span-1 w-full"
          onClick={() => navigate("/tax-estimator")}
        >
          <div className="flex items-center gap-3 mb-3">
            <Calculator className="text-[#1FA2B6] w-8 h-8" />
            <h2 className="card-title">Tax & Investment Estimator</h2>
          </div>
          <p className="card-text">
            Estimate your taxes and investment returns to align your portfolio with your goals.
          </p>
          <p className="card-link">
            Open Tool <ArrowRight className="inline w-4 h-4 ml-1" />
          </p>
        </motion.div>

        {/* Spending Insight - Full Width */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="modern-card sm:col-span-1 lg:col-span-1 xl:col-span-1 w-full"
          
        >
          <div className="flex items-center gap-3 mb-3">
            <PieChart className="text-[#1FA2B6] w-8 h-8" />
            <h2 className="card-title">Spending Insight</h2>
          </div>
          <p className="card-text mb-3">
            Analyze your spending behavior, detect unnecessary expenses, and find opportunities to save.
          </p>

          {/* 🟡 Dummy Alert */}
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md p-3 mb-3 flex items-start gap-2 shadow-sm">
            <Info className="w-5 h-5 mt-0.5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-700">Spending Alert (Sample)</h3>
              <p className="text-sm">
                Your <strong>food expenses</strong> increased by <strong>30%</strong> this month.
              </p>
            </div>
          </div>
        </motion.div>
        
      </div>

      {/* Inline Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-in-out;
        }

        .animate-slide-up {
          animation: slide-up 0.9s ease-in-out;
        }

        .modern-card {
          background: white;
          border: 1px solid #e0e7eb;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 6px 15px rgba(7, 33, 70, 0.08);
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .modern-card:hover {
          background: #f0fbfd;
          border-color: #1FA2B6;
          box-shadow: 0 10px 25px rgba(31, 162, 182, 0.2);
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #072146;
        }

        .card-text {
          font-size: 0.92rem;
          color: #555;
          line-height: 1.5;
        }

        .card-link {
          font-size: 0.9rem;
          font-weight: 500;
          color: #1FA2B6;
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .card-link:hover {
          color: #148a9c;
          transform: translateX(2px);
        }
      `}</style>
      {/* <DashboardOverview />
      <ForecastCard /> */}

      {/* 🌐 Financial Overview & Forecast Section */}
        <div className="mt-12 w-full flex flex-col lg:flex-row justify-between gap-10 items-start px-4">

          {/* 🧾 Financial Overview */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-[#E0E7EB] shadow-md p-6 hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold text-[#072146] mb-4">
                💰 Financial Overview
              </h2>
              <DashboardOverview />
            </div>
          </div>

          {/* 🔮 AI Forecast */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-[#E0E7EB] shadow-md p-6 hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold text-[#072146] mb-4">
                🔮 AI Financial Forecast
              </h2>
              <ForecastCard />
            </div>
          </div>
          
        </div>
    </div>
    {/* <div className="pt-[80px]">
      <UsageDashboard />
    </div> */}
    <Footer />
    </>
  );
}

