
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit, Trash2 } from "lucide-react";
import AIAllocationPlan from "../components/AIAllocationPlan";

export default function FinancialPlanner() {
  const [userId] = useState("12345");
  const [savings, setSavings] = useState("");
  const [debts, setDebts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");

  // --- Form State ---
  const [debtForm, setDebtForm] = useState({
    _id: null,
    title: "",
    balance: "",
    min_payment: "",
    priority: 1,
  });

  const [goalForm, setGoalForm] = useState({
    _id: null,
    title: "",
    target_amount: "",
    saved_amount: "",
    priority: 1,
  });

  // --- Show flash message ---
  const showFlash = (msg) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(""), 2000);
  };

  // --- Render Stars ---
  const renderStars = (count, onChange) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < count ? "#facc15" : "none"}
        stroke="#facc15"
        className="cursor-pointer inline-block"
        onClick={() => onChange(i + 1)}
      />
    ));

  // --- Fetch user profile ---
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/financial-manager/analyze/${userId}`);
      setDebts(res.data.profile.debts || []);
      setGoals(res.data.profile.goals || []);
      setAllocation(res.data.ai_analysis || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- Save/Update savings ---
  const handleSavingsSubmit = async (e) => {
    e.preventDefault();
    if (!savings) return alert("Please enter savings amount");

    await axios.post("http://localhost:8000/financial-manager/create-profile", {
      user_id: userId,
      estimated_monthly_savings: parseFloat(savings),
    });
    showFlash("💾 Savings saved successfully!");
    fetchProfile();
  };

  // --- Add or Edit Debt ---
  const handleDebtSave = async () => {
    const { _id, title, balance, min_payment, priority } = debtForm;
    if (!title || !balance || !min_payment) return alert("Please fill all fields");

    if (_id) {
      // Update existing debt
      await axios.put(`http://localhost:8000/financial-manager/edit-debt/${userId}/${_id}`, {
        title,
        balance: parseFloat(balance),
        min_payment: parseFloat(min_payment),
        priority,
      });
      showFlash("✅ Debt updated!");
    } else {
      // Add new debt
      await axios.post(`http://localhost:8000/financial-manager/add-debt/${userId}`, {
        title,
        balance: parseFloat(balance),
        min_payment: parseFloat(min_payment),
        priority,
      });
      showFlash("💳 Debt added successfully!");
    }

    setShowDebtForm(false);
    setDebtForm({ _id: null, title: "", balance: "", min_payment: "", priority: 1 });
    fetchProfile();
  };

  // --- Add or Edit Goal ---
  const handleGoalSave = async () => {
    const { _id, title, target_amount, saved_amount, priority } = goalForm;
    if (!title || !target_amount) return alert("Please fill all fields");

    if (_id) {
      await axios.put(`http://localhost:8000/financial-manager/edit-goal/${userId}/${_id}`, {
        title,
        target_amount: parseFloat(target_amount),
        saved_amount: parseFloat(saved_amount || 0),
        priority,
      });
      showFlash("🎯 Goal updated!");
    } else {
      await axios.post(`http://localhost:8000/financial-manager/add-goal/${userId}`, {
        title,
        target_amount: parseFloat(target_amount),
        saved_amount: parseFloat(saved_amount || 0),
        priority,
      });
      showFlash("🎯 Goal added successfully!");
    }

    setShowGoalForm(false);
    setGoalForm({ _id: null, title: "", target_amount: "", saved_amount: "", priority: 1 });
    fetchProfile();
  };

  // --- Delete ---
  const handleDelete = async (type, id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    const endpoint =
      type === "debt"
        ? `http://localhost:8000/financial-manager/delete-debt/${userId}/${id}`
        : `http://localhost:8000/financial-manager/delete-goal/${userId}/${id}`;

    await axios.delete(endpoint);
    showFlash("🗑️ Deleted successfully!");
    fetchProfile();
  };

  // --- Edit Form Fillers ---
  const handleEdit = (type, item) => {
    if (type === "debt") {
      setDebtForm(item);
      setShowDebtForm(true);
    } else {
      setGoalForm(item);
      setShowGoalForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#072146] p-6 relative">
      {/* Flash Message */}
      {flashMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-[#1FA2B6] text-white px-5 py-2 rounded-lg shadow-lg"
        >
          {flashMessage}
        </motion.div>
      )}

      <motion.h1
        className="text-3xl font-semibold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💰 Financial Planner
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Savings Hub */}
          <div className="bg-white rounded-2xl p-6 shadow-md border">
            <h2 className="text-xl font-semibold mb-2">💼 Savings Hub</h2>
            <p className="text-gray-600 text-sm mb-4">
              Enter your total monthly savings. We'll allocate it across your debts and goals.
            </p>
            <form onSubmit={handleSavingsSubmit} className="flex gap-4">
              <input
                type="number"
                placeholder="₹50000"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-[#1FA2B6] outline-none"
              />
              <button
                type="submit"
                className="bg-[#1FA2B6] text-white px-5 py-2 rounded-xl hover:bg-[#148a9c] transition"
              >
                Save
              </button>
            </form>
          </div>

          {/* Debts + Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debts */}
            <div className="bg-white rounded-2xl p-6 shadow-md border">
              <h2 className="text-lg font-semibold mb-3 flex justify-between">
                💳 Your Debts
                <button
                  onClick={() => setShowDebtForm(!showDebtForm)}
                  className="bg-[#1FA2B6] text-white px-3 py-1 text-sm rounded hover:bg-[#148a9c] transition"
                >
                  + Add
                </button>
              </h2>

              <AnimatePresence>
                {showDebtForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 p-3 rounded-xl mb-3"
                  >
                    <input
                      type="text"
                      placeholder="Debt Name"
                      value={debtForm.title}
                      onChange={(e) => setDebtForm({ ...debtForm, title: e.target.value })}
                      className="w-full border p-2 rounded mb-2 outline-none"
                    />
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="Balance (₹)"
                        value={debtForm.balance}
                        onChange={(e) => setDebtForm({ ...debtForm, balance: e.target.value })}
                        className="flex-1 border p-2 rounded outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Min. Payment (₹)"
                        value={debtForm.min_payment}
                        onChange={(e) => setDebtForm({ ...debtForm, min_payment: e.target.value })}
                        className="flex-1 border p-2 rounded outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>{renderStars(debtForm.priority, (val) => setDebtForm({ ...debtForm, priority: val }))}</div>
                      <button
                        onClick={handleDebtSave}
                        className="bg-[#1FA2B6] text-white px-4 py-1 rounded hover:bg-[#148a9c]"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {debts.map((d) => (
                <div
                  key={d._id}
                  className="border rounded-xl p-3 mb-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold capitalize">{d.title}</p>
                    <p className="text-sm text-gray-500">
                      Balance: ₹{d.balance} | Min: ₹{d.min_payment}
                    </p>
                    <div className="mt-1">{renderStars(d.priority, () => {})}</div>
                  </div>
                  <div className="flex gap-2">
                    <Edit
                      size={16}
                      className="text-[#1FA2B6] cursor-pointer"
                      onClick={() => handleEdit("debt", d)}
                    />
                    <Trash2
                      size={16}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete("debt", d._id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Goals */}
            <div className="bg-white rounded-2xl p-6 shadow-md border">
              <h2 className="text-lg font-semibold mb-3 flex justify-between">
                🎯 Your Goals
                <button
                  onClick={() => setShowGoalForm(!showGoalForm)}
                  className="bg-[#1FA2B6] text-white px-3 py-1 text-sm rounded hover:bg-[#148a9c] transition"
                >
                  + Add
                </button>
              </h2>

              <AnimatePresence>
                {showGoalForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 p-3 rounded-xl mb-3"
                  >
                    <input
                      type="text"
                      placeholder="Goal Name"
                      value={goalForm.title}
                      onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                      className="w-full border p-2 rounded mb-2 outline-none"
                    />
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="Target (₹)"
                        value={goalForm.target_amount}
                        onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })}
                        className="flex-1 border p-2 rounded outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Saved (₹)"
                        value={goalForm.saved_amount}
                        onChange={(e) => setGoalForm({ ...goalForm, saved_amount: e.target.value })}
                        className="flex-1 border p-2 rounded outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>{renderStars(goalForm.priority, (val) => setGoalForm({ ...goalForm, priority: val }))}</div>
                      <button
                        onClick={handleGoalSave}
                        className="bg-[#1FA2B6] text-white px-4 py-1 rounded hover:bg-[#148a9c]"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {goals.map((g) => (
                <div
                  key={g._id}
                  className="border rounded-xl p-3 mb-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold capitalize">{g.title}</p>
                    <p className="text-sm text-gray-500">
                      Saved: ₹{g.saved_amount} / ₹{g.target_amount}
                    </p>
                    <div className="mt-1">{renderStars(g.priority, () => {})}</div>
                  </div>
                  <div className="flex gap-2">
                    <Edit
                      size={16}
                      className="text-[#1FA2B6] cursor-pointer"
                      onClick={() => handleEdit("goal", g)}
                    />
                    <Trash2
                      size={16}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete("goal", g._id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AIAllocationPlan userId={userId} />
      </div>
    </div>
  );
}
