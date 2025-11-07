// import React, { useEffect, useState } from "react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { Brain, Target, CreditCard, PiggyBank, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function DashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const COLORS = ["#1FA2B6", "#22c55e", "#f97316", "#6366f1", "#ef4444"];
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get("http://localhost:8000/dashboard/overview");
        setOverview(res.data);
      } catch (err) {
        console.error("❌ Error fetching dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-10">Loading overview...</p>;
  if (!overview) return <p className="text-center text-red-500 py-10">No dashboard data available.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white mt-12 p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-[#072146] mb-8">📊 Financial Overview</h2>

      {/* Cards Row */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="summary-card">
          <PiggyBank className="text-[#1FA2B6] w-7 h-7 mb-2" />
          <h3 className="text-gray-500 text-sm">Estimated Monthly Savings</h3>
          <p className="text-xl font-bold text-[#072146]">₹{overview.estimated_savings.toLocaleString("en-IN")}</p>
        </div>

        <div className="summary-card">
          <CreditCard className="text-red-500 w-7 h-7 mb-2" />
          <h3 className="text-gray-500 text-sm">Total Debt</h3>
          <p className="text-xl font-bold text-[#072146]">₹{overview.total_debt.toLocaleString("en-IN")}</p>
        </div>

        <div className="summary-card">
          <Target className="text-green-500 w-7 h-7 mb-2" />
          <h3 className="text-gray-500 text-sm">Goal Progress</h3>
          <p className="text-xl font-bold text-[#072146]">{overview.goal_progress}%</p>
        </div>
      </div>

      
            {/* 💬 AI Insight Section — Click to go to Chatbot */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/chatbot")} // ✅ Navigate to chatbot
            className="relative bg-gradient-to-r from-[#f9fcfd] via-[#f0fbfd] to-[#f9fcfd] border border-[#d1e7ec] rounded-2xl p-6 mb-8 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-transform duration-300"
            >
            <div className="flex items-center mb-3">
                <Brain className="w-6 h-6 text-[#1FA2B6] mr-2" />
                <h3 className="text-lg font-semibold text-[#072146]">AI Financial Insight</h3>
            </div>

            {/* 💡 Insight Message */}
            <div
                className={`p-4 rounded-xl text-[15px] leading-relaxed transition-all duration-300
                ${
                    overview.ai_insight?.includes("🚨") || overview.ai_insight?.includes("⚠️")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : overview.ai_insight?.includes("✅") || overview.ai_insight?.includes("Excellent")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
            >
                <p className="italic">
                “
                {overview.ai_insight?.includes("Hello! I'm an artificial intelligence")
                    ? "Hi there 👋 I'm your AI finance assistant. Tap here to chat and get smarter insights about your spending!"
                    : overview.ai_insight ||
                    "No recent insights yet — tap here to ask me anything about your finances."}
                ”
                </p>
            </div>

            {/* 🌟 Footer */}
            <p className="text-gray-500 text-xs mt-3 text-right italic">
                — Your Personal AI Finance Assistant
            </p>

            {/* 💬 Hover Hint */}
            <p className="absolute bottom-2 left-4 text-[12px] text-[#1FA2B6] italic opacity-80">
                💬 Click to chat with your AI assistant
            </p>
            </motion.div>


      {/* Visualization */}
      {overview.chart_data?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[#1FA2B6] mb-4">Category-wise Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overview.chart_data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name }) => name}
              >
                {overview.chart_data.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <style>{`
        .summary-card {
          background: #f9fcfd;
          border: 1px solid #e0e7eb;
          border-radius: 14px;
          padding: 1.2rem;
          text-align: center;
          box-shadow: 0 4px 10px rgba(31,162,182,0.05);
          transition: all 0.3s ease;
        }
        .summary-card:hover {
          transform: translateY(-3px);
          background: #f0fbfd;
          box-shadow: 0 8px 18px rgba(31,162,182,0.1);
        }
      `}</style>
    </motion.div>
  );
}
