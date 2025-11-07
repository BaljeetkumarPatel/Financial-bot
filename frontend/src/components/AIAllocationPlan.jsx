// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { RefreshCw } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function AIAllocationPlan({ userId }) {
//   const [allocation, setAllocation] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const COLORS = {
//     debt: "#ef4444", // red
//     goal: "#22c55e", // green
//     invest: "#8b5cf6", // purple
//   };

//   // 🧠 Fetch AI analysis plan
//   const fetchAIPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/financial-manager/analyze/${userId}`
//       );
//       setAllocation(res.data.ai_analysis);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching AI plan. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧾 Prepare chart data dynamically
//   const getChartData = () => {
//     if (!allocation) return [];
//     const baseData = allocation.allocation?.map((a) => ({
//       name: a.title,
//       value: a.suggested_allocation,
//       type: a.type,
//     }));

//     if (allocation.investment_suggestion) {
//       baseData.push({
//         name: allocation.investment_suggestion.type,
//         value: allocation.investment_suggestion.amount,
//         type: "invest",
//       });
//     }

//     return baseData;
//   };

//   const chartData = getChartData();

//   return (
//     <motion.div
//       className="bg-white rounded-2xl p-6 shadow-md border sticky top-6 h-fit"
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-[#072146]">
//           📊 AI Allocation Plan
//         </h2>
//         <button
//           onClick={fetchAIPlan}
//           disabled={loading}
//           className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed text-white"
//               : "bg-[#1FA2B6] text-white hover:bg-[#148a9c]"
//           }`}
//         >
//           <RefreshCw size={14} />
//           {loading ? "Analyzing..." : "Regenerate"}
//         </button>
//       </div>

//       {/* AI Summary */}
//       {!allocation ? (
//         <p className="text-gray-500 text-sm">
//           No AI plan yet. Click “Regenerate” to analyze your finances.
//         </p>
//       ) : (
//         <>
//           <motion.div
//             className="bg-[#F0F9FB] border border-[#1FA2B6]/30 rounded-xl p-3 mb-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.1 }}
//           >
//             <p className="text-[#072146] text-sm leading-relaxed">
//               {allocation.summary}
//             </p>
//           </motion.div>

//           {/* Pie Chart */}
//           {chartData.length > 0 && (
//             <motion.div
//               className="my-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <h3 className="text-[#072146] font-semibold mb-3 text-center">
//                 💹 Monthly Savings Allocation
//               </h3>
//               <ResponsiveContainer width="100%" height={280}>
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     innerRadius={50}
//                     paddingAngle={3}
//                     label={({ name, value }) =>
//                       `${name}: ₹${value.toLocaleString("en-IN")}`
//                     }
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={
//                           entry.type === "debt"
//                             ? COLORS.debt
//                             : entry.type === "goal"
//                             ? COLORS.goal
//                             : COLORS.invest
//                         }
//                         stroke="white"
//                         strokeWidth={1.5}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
//                   />
//                   <Legend verticalAlign="bottom" height={36} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </motion.div>
//           )}

//           {/* Allocation Breakdown */}
//           <div className="space-y-3">
//             {allocation.allocation?.map((a, i) => (
//               <motion.div
//                 key={i}
//                 className="border rounded-xl p-3 flex justify-between items-center shadow-sm hover:shadow-md transition"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.05 }}
//               >
//                 <div>
//                   <p className="capitalize font-medium text-[#072146]">
//                     {a.title}{" "}
//                     <span
//                       className={`text-xs ml-2 px-2 py-0.5 rounded ${
//                         a.type === "debt"
//                           ? "bg-red-100 text-red-600"
//                           : "bg-green-100 text-green-600"
//                       }`}
//                     >
//                       {a.type}
//                     </span>
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Est. {a.estimated_months} months —{" "}
//                     <span className="italic text-gray-600">{a.strategy}</span>
//                   </p>
//                 </div>
//                 <p className="text-[#1FA2B6] font-semibold">
//                   ₹{a.suggested_allocation.toLocaleString("en-IN")}/mo
//                 </p>
//               </motion.div>
//             ))}
//           </div>

//           {/* Investment Suggestion */}
//           {allocation.investment_suggestion && (
//             <motion.div
//               className="mt-5 p-4 border border-[#1FA2B6]/40 bg-[#F4F8FA] rounded-xl"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <h3 className="text-[#072146] font-semibold mb-2">
//                 💡 Investment Suggestion
//               </h3>
//               <p className="text-sm text-gray-700">
//                 <span className="font-medium text-[#1FA2B6]">
//                   {allocation.investment_suggestion.type}
//                 </span>{" "}
//                 — Invest ₹
//                 {allocation.investment_suggestion.amount.toLocaleString(
//                   "en-IN"
//                 )}{" "}
//                 monthly.
//               </p>
//               <p className="text-xs text-gray-500 mt-1 italic">
//                 {allocation.investment_suggestion.reason}
//               </p>
//             </motion.div>
//           )}
//         </>
//       )}
//     </motion.div>
//   );
// }


import React, { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { RefreshCw, Download } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AIAllocationPlan({ userId, userName = "User" }) {
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const planRef = useRef(null);

  const COLORS = {
    debt: "#ef4444",
    goal: "#22c55e",
    invest: "#8b5cf6",
  };

  // Fetch AI Allocation Plan
  const fetchAIPlan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/financial-manager/analyze/${userId}`
      );
      setAllocation(res.data.ai_analysis);
    } catch (err) {
      console.error(err);
      alert("Error fetching AI plan. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Stable Download Function
  const handleDownloadPDF = async () => {
  if (!planRef.current) return alert("No plan to export yet.");
  setDownloading(true);

  try {
    // ✅ STEP 1: Wait until Recharts chart fully renders
    let retries = 0;
    let chartReady = false;
    while (retries < 10) {
      const svg = planRef.current.querySelector("svg");
      if (svg) {
        const bbox = svg.getBoundingClientRect();
        if (bbox.width > 50 && bbox.height > 50) {
          chartReady = true;
          break;
        }
      }
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    if (!chartReady) {
      throw new Error("Chart not rendered even after waiting.");
    }

    // ✅ STEP 2: Small buffer to allow text/animations to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

    // ✅ STEP 3: Capture with html2canvas
    const element = planRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const today = new Date().toLocaleDateString();

    // ✅ STEP 4: Add header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("💼 AI Financial Planner Report", 20, 20);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(`Name: ${userName}`, 20, 30);
    pdf.text(`Date: ${today}`, 20, 36);

    // Optional Logo (safe)
    try {
      const logo = new Image();
      logo.src = "/logo192.png";
      await new Promise((res) => (logo.onload = res));
      pdf.addImage(logo, "PNG", 160, 10, 30, 20);
    } catch {
      console.log("⚠️ Logo not found — skipping.");
    }

    // ✅ STEP 5: Add captured image
    pdf.addImage(imgData, "PNG", 10, 45, imgWidth, imgHeight);
    pdf.save(`${userName}_AI_Allocation_Report.pdf`);

    console.log("✅ PDF generated successfully");
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    alert("Still rendering chart... wait a few seconds, then retry.");
  } finally {
    setDownloading(false);
  }
};

  // Chart Data
  const getChartData = () => {
    if (!allocation) return [];
    const data = allocation.allocation?.map((a) => ({
      name: a.title,
      value: a.suggested_allocation,
      type: a.type,
    }));

    if (allocation.investment_suggestion) {
      data.push({
        name: allocation.investment_suggestion.type,
        value: allocation.investment_suggestion.amount,
        type: "invest",
      });
    }

    return data;
  };

  const chartData = getChartData();

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-md border sticky top-6 h-fit"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#072146]">
          📊 AI Allocation Plan
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchAIPlan}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#1FA2B6] text-white hover:bg-[#148a9c]"
            }`}
          >
            <RefreshCw size={14} />
            {loading ? "Analyzing..." : "Regenerate"}
          </button>

          {allocation && (
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                downloading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#072146] text-white hover:bg-[#0a305f]"
              }`}
            >
              <Download size={14} />
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div ref={planRef}>
        {!allocation ? (
          <p className="text-gray-500 text-sm">
            No AI plan yet. Click “Regenerate” to analyze your finances.
          </p>
        ) : (
          <>
            {/* Summary */}
            <motion.div
              className="bg-[#F0F9FB] border border-[#1FA2B6]/30 rounded-xl p-3 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-[#072146] text-sm leading-relaxed">
                {allocation.summary}
              </p>
            </motion.div>

            {/* Pie Chart */}
            {/* Pie Chart */}
{chartData.length > 0 && (
  <motion.div
    className="my-6 flex flex-col items-center justify-center bg-[#F8FAFC] rounded-xl shadow-sm p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <h3 className="text-[#072146] font-semibold mb-4 text-lg">
      💹 Monthly Savings Allocation
    </h3>

    <div className="w-full flex justify-center">
      <ResponsiveContainer width="95%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={140}   // 🟢 increased size
            innerRadius={70}    // 🟢 gives better donut shape
            paddingAngle={3}
            label={({ name, value }) =>
              `${name}: ₹${value.toLocaleString("en-IN")}`
            }
          >
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.type === "debt"
                    ? COLORS.debt
                    : entry.type === "goal"
                    ? COLORS.goal
                    : COLORS.invest
                }
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Legend verticalAlign="bottom" height={50} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <p className="text-gray-500 text-sm italic text-center mt-3">
      💡 Hover over slices to explore fund allocation by category.
    </p>
  </motion.div>
)}

            {/* Breakdown */}
            <div className="space-y-3">
              {allocation.allocation?.map((a, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-3 flex justify-between items-center shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="capitalize font-medium text-[#072146]">
                      {a.title}{" "}
                      <span
                        className={`text-xs ml-2 px-2 py-0.5 rounded ${
                          a.type === "debt"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {a.type}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Est. {a.estimated_months} months —{" "}
                      <span className="italic text-gray-600">{a.strategy}</span>
                    </p>
                  </div>
                  <p className="text-[#1FA2B6] font-semibold">
                    ₹{a.suggested_allocation.toLocaleString("en-IN")}/mo
                  </p>
                </div>
              ))}
            </div>

            {/* Investment Suggestion */}
            {allocation.investment_suggestion && (
              <div className="mt-5 p-4 border border-[#1FA2B6]/40 bg-[#F4F8FA] rounded-xl">
                <h3 className="text-[#072146] font-semibold mb-2">
                  💡 Investment Suggestion
                </h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-[#1FA2B6]">
                    {allocation.investment_suggestion.type}
                  </span>{" "}
                  — Invest ₹
                  {allocation.investment_suggestion.amount.toLocaleString(
                    "en-IN"
                  )}{" "}
                  monthly.
                </p>
                <p className="text-xs text-gray-500 mt-1 italic">
                  {allocation.investment_suggestion.reason}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

