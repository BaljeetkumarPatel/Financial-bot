// // src/components/BudgetHistory.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Trash2, Clock, Target, Wallet } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function BudgetHistory() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch saved plans
//   const fetchPlans = async () => {
//   try {
//     const res = await axios.get("http://localhost:8000/budget/plans");
//     console.log("✅ API response:", res.data);
//     setPlans(res.data.plans || []);
//   } catch (err) {
//     console.error("❌ Error fetching plans:", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   // Delete plan by ID
//   const deletePlan = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8000/budget/plan/${id}`);
//       setPlans((prev) => prev.filter((plan) => plan._id !== id));
//     } catch (err) {
//       console.error("Error deleting plan:", err);
//     }
//   };

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-[70vh] text-gray-500">
//         ⏳ Loading your budget history...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#F4F7FB] pt-[90px] px-6 pb-12 flex justify-center items-start">
//       <motion.div
//         className="w-full md:w-3/5 bg-white rounded-2xl shadow-xl p-6 min-h-[80vh] overflow-y-auto"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2 className="text-xl font-semibold text-[#072146] mb-6 flex items-center gap-2">
//           <Clock className="w-5 h-5 text-[#1FA2B6]" /> Saved Budget Plans
//         </h2>

//         {plans.length === 0 ? (
//           <p className="text-gray-500 italic text-sm mt-4">
//             You haven’t generated any budget plans yet.
//           </p>
//         ) : (
//           plans.map((plan) => (
//             <motion.div
//               key={plan._id}
//               className="p-4 rounded-xl mb-4 border bg-gray-50 hover:bg-[#e0f7fa] cursor-pointer shadow-sm transition-all"
//               whileHover={{ scale: 1.01 }}
//               onClick={() => navigate(`/budget/generated/${plan._id}`)}
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-semibold text-[#072146] text-base">
//                     <Target className="inline-block w-4 h-4 mr-1 text-[#1FA2B6]" />
//                     {plan.goal || "Unnamed Goal"}
//                   </p>
//                   <p className="text-sm text-gray-700 mt-1">
//                     <Wallet className="inline-block w-4 h-4 mr-1 text-gray-400" />
//                     Income: ₹{plan.income?.toLocaleString("en-IN")}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {new Date(plan.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     deletePlan(plan._id);
//                   }}
//                   className="text-red-500 hover:text-red-700 transition"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </motion.div>
//     </div>
//   );
// }


// src/components/BudgetHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, Target, Wallet, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function BudgetHistory() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planContent, setPlanContent] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Fetch saved plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8000/budget/plans");
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single plan by ID
  const fetchPlanById = async (id) => {
    try {
      setLoadingPlan(true);
      const res = await axios.get(`http://localhost:8000/budget/plan/${id}`);
      setPlanContent(res.data.plan);
    } catch (err) {
      console.error("Error fetching plan:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  // Delete plan by ID
  const deletePlan = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/budget/plan/${id}`);
      setPlans((prev) => prev.filter((plan) => plan._id !== id));
      if (selectedPlan === id) {
        setSelectedPlan(null);
        setPlanContent(null);
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCardClick = (id) => {
    setSelectedPlan(id);
    fetchPlanById(id);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500">
        ⏳ Loading your budget history...
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] pt-[90px] px-6 pb-12 flex justify-center items-start">
      {/* LEFT: History List */}
      <motion.div
        className="w-full md:w-3/5 bg-white rounded-2xl shadow-xl p-6 min-h-[80vh] overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-[#072146] mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1FA2B6]" /> Saved Budget Plans
        </h2>

        {plans.length === 0 ? (
          <p className="text-gray-500 italic text-sm mt-4">
            You haven’t generated any budget plans yet.
          </p>
        ) : (
          plans.map((plan) => (
            <motion.div
              key={plan._id}
              className={`p-4 rounded-xl mb-4 border cursor-pointer shadow-sm transition-all ${
                selectedPlan === plan._id
                  ? "bg-[#e0f7fa]"
                  : "bg-gray-50 hover:bg-[#f0fdfa]"
              }`}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleCardClick(plan._id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-[#072146] text-base">
                    <Target className="inline-block w-4 h-4 mr-1 text-[#1FA2B6]" />
                    {plan.goal || "Unnamed Goal"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <Wallet className="inline-block w-4 h-4 mr-1 text-gray-400" />
                    Income: ₹{plan.income?.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(plan.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlan(plan._id);
                  }}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* RIGHT SLIDE-IN PANEL */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedPlan(null);
                setPlanContent(null);
              }}
            />

            {/* Slide-in panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
            >
              <div className="flex justify-between items-center p-5 border-b">
                <h3 className="text-lg font-semibold text-[#072146]">
                  📊 Generated Budget Plan
                </h3>
                <button
                  onClick={() => {
                    setSelectedPlan(null);
                    setPlanContent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loadingPlan ? (
                  <p className="text-gray-500 text-sm italic">
                    ⏳ Loading plan details...
                  </p>
                ) : planContent ? (
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown>{planContent.plan}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    No plan content found.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
