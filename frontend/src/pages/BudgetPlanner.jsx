import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import BudgetHistory from "../components/BudgetHistory";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function BudgetPlanner() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([{ category: "", amount: "" }]);
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPercent, setShowPercent] = useState(false);

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { category: "", amount: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    setChartData([]);

    const expenseObj = expenses.reduce((acc, cur) => {
      if (cur.category && cur.amount)
        acc[cur.category] = parseFloat(cur.amount);
      return acc;
    }, {});

    try {
      const res = await axios.post("http://localhost:8000/budget/plan", {
        income: parseFloat(income),
        expenses: expenseObj,
        goal,
      });

      const responseText = res.data.budget_plan;
      setPlan(responseText);

      const totalExpenses = Object.values(expenseObj).reduce(
        (a, b) => a + b,
        0
      );
      const totalIncome = parseFloat(income);
      const savingsValue = Math.max(totalIncome - totalExpenses, 0);

      // Build chart: dynamic savings + expense breakdown
      const chart = [
        { name: "Savings", value: savingsValue },
        ...Object.entries(expenseObj).map(([key, val]) => ({
          name: key,
          value: val,
        })),
      ];

      setChartData(chart);
    } catch (err) {
      console.error(err);
      setPlan("⚠️ Error generating plan.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#10b981",
    "#f59e0b",
    "#6366f1",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#1FA2B6",
    "#0ea5e9",
    "#34d399",
    "#fbbf24"
  ];

  return (
    <>
    <div className="pt-[90px] min-h-screen bg-[#F4F7FB] flex justify-center items-start px-6 pb-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-7xl flex flex-col md:flex-row overflow-hidden">
        {/* LEFT: INPUT FORM */}
        <div className="w-full md:w-2/5 p-8 border-r bg-[#f8fafc]">
          <h1 className="text-2xl font-semibold text-[#072146] mb-6 text-center">
            💰 Smart Budget Planner
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
                className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-[#1FA2B6]"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">Expenses</label>
              {expenses.map((exp, i) => (
                <div key={i} className="flex gap-3 mt-2">
                  <input
                    type="text"
                    placeholder="Category"
                    value={exp.category}
                    onChange={(e) =>
                      handleExpenseChange(i, "category", e.target.value)
                    }
                    className="flex-1 border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#1FA2B6]"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={exp.amount}
                    onChange={(e) =>
                      handleExpenseChange(i, "amount", e.target.value)
                    }
                    className="w-28 border rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#1FA2B6]"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addExpense}
                className="text-[#1FA2B6] mt-2 text-sm hover:underline"
              >
                + Add another expense
              </button>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium">Goal</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Save for child's education"
                className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 focus:ring-[#1FA2B6]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1FA2B6] text-white py-2 rounded-lg hover:bg-[#148a9c] transition"
            >
              {loading ? "Generating Plan..." : "Generate Budget Plan"}
            </button>
          </form>
        </div>

        {/* RIGHT: OUTPUT */}
        <div className="w-full md:w-3/5 p-8 bg-gray-50 flex flex-col justify-between">
          {!plan ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-500 text-center space-y-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712023.png"
                alt="budget icon"
                className="w-24 opacity-80"
              />
              <p className="text-sm italic">
                Enter your income and expenses to generate a personalized budget plan ✨
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-[#072146] mb-4 flex items-center gap-2">
                📊 Personalized Budget Plan
              </h2>
              <div className="prose prose-sm max-w-none leading-relaxed text-gray-800 bg-white p-4 rounded-xl shadow-sm border">
                <ReactMarkdown>{plan}</ReactMarkdown>
              </div>
              <p className="text-sm text-gray-500 italic mt-2 mb-6">
                ✨ This plan is crafted based on your financial inputs and goals.
              </p>

              <motion.hr
                className="my-6 border-gray-300"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8 }}
              />

              {/* PIE CHART */}
              <div className="relative">
                <h3 className="text-lg font-semibold text-[#1FA2B6] mb-2 flex items-center gap-2">
                  🧩 Savings & Expense Breakdown
                </h3>

                {/* Toggle for % or ₹ */}
                <div className="flex justify-end mb-4 items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Show as:</span>
                  <button
                    onClick={() => setShowPercent(!showPercent)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      showPercent
                        ? "bg-[#1FA2B6] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {showPercent ? "% Percentage" : "₹ Amount"}
                  </button>
                </div>

                {/* Pie Chart */}
                {(() => {
                  const totalValue =
                    chartData.reduce((sum, item) => sum + (item.value || 0), 0) ||
                    1;
                  const pieData = chartData.map((item) => ({
                    ...item,
                    displayValue: showPercent
                      ? ((item.value / totalValue) * 100).toFixed(1)
                      : item.value,
                  }));

                  return (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          innerRadius={50}
                          paddingAngle={4}
                          cornerRadius={6}
                          label={({ name, displayValue }) =>
                            `${name}: ${
                              showPercent
                                ? displayValue + "%"
                                : "₹" + displayValue.toLocaleString("en-IN")
                            }`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="white"
                              strokeWidth={1.5}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val) =>
                            showPercent
                              ? `${val}%`
                              : `₹${Number(val).toLocaleString("en-IN")}`
                          }
                        />
                        <Legend verticalAlign="bottom" height={50} />
                      </PieChart>
                    </ResponsiveContainer>
                  );
                })()}

                <p className="text-sm text-gray-500 italic mt-4 text-center">
                  💡 Hover on any segment to see detailed values — toggle between % and ₹ view.
                </p>
              </div>

              <motion.hr
                className="my-6 border-gray-300"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8 }}
              />

              <motion.p
                className="text-gray-600 italic text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                🏆 Stay consistent — small savings today lead to big financial freedom tomorrow!
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
      </div>
      <BudgetHistory />
      </>
  );
}
