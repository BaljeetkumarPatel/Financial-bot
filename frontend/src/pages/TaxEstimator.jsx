import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function TaxEstimator() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!income) return alert("Please enter your annual income.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/tax/estimate", {
        income: parseFloat(income),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching tax estimate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col lg:flex-row">
      {/* LEFT PANEL - FIXED INPUT FORM */}
      <div className="lg:w-1/3 w-full bg-white shadow-xl border-r border-gray-200 p-8 lg:sticky top-0 h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title Inside Input Div */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-[#072146] mb-2">
              💼 Tax & Investment Estimator
            </h1>
            <p className="text-gray-600 text-sm">
              Estimate your annual tax and explore smart, AI-powered investment
              ideas to save more.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <label className="text-gray-700 text-sm font-medium">
              Annual Income (₹)
            </label>
            <input
              type="number"
              placeholder="Enter your income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#1FA2B6]"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1FA2B6] hover:bg-[#148a9c]"
              }`}
            >
              {loading ? "Calculating..." : "Calculate & Suggest"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-8 italic text-center">
            *Based on FY 2024–25 new regime.  
            AI suggestions are for guidance only.
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL - SCROLLABLE OUTPUT */}
      <div className="lg:w-2/3 w-full overflow-y-auto max-h-screen p-20">
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* TAX SUMMARY */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-[#072146] mb-4">
                📊 Tax Summary
              </h2>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Tax Slab</p>
                  <h2 className="text-2xl font-semibold text-[#1FA2B6] mt-1">
                    {result.tax_slab}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Estimated Annual Tax</p>
                  <h2 className="text-3xl font-bold text-[#072146] mt-1">
                    ₹{result.estimated_tax}
                  </h2>
                </div>
              </div>
            </div>

            {/* SAVINGS SUGGESTIONS */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-[#072146] text-xl mb-4">
                💡 AI-Generated Savings Suggestions
              </h3>
              <div className="space-y-4">
                {result.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="text-[#1FA2B6] font-semibold text-lg">
                      {s.title}{" "}
                      <span className="text-gray-500 text-sm">
                        (Section {s.section})
                      </span>
                    </h4>
                    <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* DISCLAIMER */}
            <div className="bg-[#F1F5F9] rounded-xl p-4 text-gray-600 text-sm italic border border-gray-200">
              This estimate is based on the new Indian tax regime.  
              Always consult a certified tax advisor for personalized planning.
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg font-medium text-center mb-1">
              Enter your annual income to get AI-powered tax insights.
            </p>
            <p className="text-sm text-center">
              The system will calculate your slab and suggest smart investments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
