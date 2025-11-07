import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Activity, Database, Cpu, Clock } from "lucide-react";

export default function UsageDashboard() {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const COLORS = ["#1FA2B6", "#148a9c", "#0b6b81", "#054a5b"];

  useEffect(() => {
        fetchUsageData();
        const interval = setInterval(fetchUsageData, 60000); // refresh every 1 min
        return () => clearInterval(interval);
        }, [days]);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      const [statsRes, trendRes] = await Promise.all([
        axios.get(`http://localhost:8000/usage/stats?days=${days}`),
        axios.get(`http://localhost:8000/usage/daily?days=${days}`),
      ]);
      setStats(statsRes.data);
      setTrend(trendRes.data.trend || []);
    } catch (err) {
      console.error("⚠️ Error fetching usage data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-[#1FA2B6] font-semibold text-lg">
        <Activity className="animate-spin mr-3" /> Loading Usage Dashboard...
      </div>
    );

  if (!stats)
    return <p className="text-center text-gray-500 mt-10">No usage data found.</p>;

  // Prepare chart data
  const featureData = Object.entries(stats.feature_breakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const modelData = Object.entries(stats.model_breakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-[#F4F7FB] min-h-screen font-[Inter]"
    >
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#072146] flex items-center gap-2">
            <Cpu className="text-[#1FA2B6]" /> AI Usage Dashboard
          </h1>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-[#072146] focus:ring-2 focus:ring-[#1FA2B6]"
          >
            <option value={7}>Last 7 Days</option>
            <option value={15}>Last 15 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-[#E0F7FA] p-5 rounded-xl shadow-md flex items-center gap-4">
            <Database className="text-[#1FA2B6] w-6 h-6" />
            <div>
              <p className="text-gray-600 text-sm">Total API Calls</p>
              <h3 className="text-xl font-bold text-[#072146]">{stats.total_calls}</h3>
            </div>
          </div>
          <div className="bg-[#E0F7FA] p-5 rounded-xl shadow-md flex items-center gap-4">
            <Cpu className="text-[#1FA2B6] w-6 h-6" />
            <div>
              <p className="text-gray-600 text-sm">Total Tokens Used</p>
              <h3 className="text-xl font-bold text-[#072146]">
                {stats.total_tokens.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="bg-[#E0F7FA] p-5 rounded-xl shadow-md flex items-center gap-4">
            <Clock className="text-[#1FA2B6] w-6 h-6" />
            <div>
              <p className="text-gray-600 text-sm">Tracking Period</p>
              <h3 className="text-xl font-bold text-[#072146]">{days} days</h3>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-8">
          {/* 📊 Feature Bar Chart */}
          <div className="bg-[#F4F7FB] p-5 rounded-xl shadow-inner">
            <h3 className="text-[#072146] font-semibold mb-3">Feature-wise Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1FA2B6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🧠 Model Pie Chart */}
          <div className="bg-[#F4F7FB] p-5 rounded-xl shadow-inner">
            <h3 className="text-[#072146] font-semibold mb-3">Model Usage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modelData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {modelData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📈 Daily Trend Line Chart */}
        <div className="bg-[#F4F7FB] p-5 rounded-xl shadow-inner mt-10">
          <h3 className="text-[#072146] font-semibold mb-3">Daily Usage Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#1FA2B6"
                strokeWidth={2}
                name="API Calls"
              />
              <Line
                type="monotone"
                dataKey="tokens"
                stroke="#072146"
                strokeWidth={2}
                name="Tokens Used"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Last Updated: {stats.last_updated}
        </p>
      </div>
    </motion.div>
  );
}
