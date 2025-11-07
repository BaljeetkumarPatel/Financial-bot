// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Sparkles, TrendingUp, Lightbulb, Loader2 } from "lucide-react";

// export default function ForecastCard() {
//   const [forecast, setForecast] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchForecast = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/dashboard/forecast");
//         setForecast(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching forecast:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForecast();
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full"
//     >
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-10 text-[#1FA2B6]">
//           <Loader2 className="animate-spin w-8 h-8 mb-2" />
//           <p>Generating your financial forecast...</p>
//         </div>
//       ) : forecast ? (
//         <div className="space-y-5">
//           {/* Forecast Summary */}
//           <div className="flex items-center gap-3">
//             <TrendingUp className="text-[#1FA2B6] w-6 h-6" />
//             <p className="text-gray-700 text-base leading-relaxed">
//               {forecast.forecast}
//             </p>
//           </div>

//           {/* Tips Section */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#072146] flex items-center gap-2 mb-2">
//               <Lightbulb className="text-[#1FA2B6] w-5 h-5" /> AI Tips
//             </h3>
//             <ul className="list-disc list-inside text-gray-700 space-y-1">
//               {forecast.tips && forecast.tips.length > 0 ? (
//                 forecast.tips.map((tip, i) => (
//                   <li key={i} className="text-sm">
//                     {tip}
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-sm italic text-gray-500">
//                   No tips available yet.
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Motivational Message */}
//           <div className="bg-[#E0F7FA] border border-[#1FA2B6]/40 rounded-lg p-4 text-[#072146] shadow-sm">
//             <Sparkles className="inline w-4 h-4 text-[#1FA2B6] mr-2" />
//             <span className="text-sm font-medium">
//               {forecast.message || "Keep striving for financial balance 💪"}
//             </span>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-500 italic text-center">
//           ⚠️ Unable to generate forecast. Try again later.
//         </p>
//       )}
//     </motion.div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   Sparkles,
//   TrendingUp,
//   Lightbulb,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";

// export default function ForecastCard() {
//   const [forecast, setForecast] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchForecast = async () => {
//     try {
//       if (!refreshing) setLoading(true);
//       const res = await axios.get("http://localhost:8000/dashboard/forecast");
//       setForecast(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching forecast:", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Fetch on component mount
//   useEffect(() => {
//     fetchForecast();
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full"
//     >
//       {/* 🔁 Regenerate Button */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-[#072146] flex items-center gap-2">
//           <Sparkles className="text-[#1FA2B6] w-5 h-5" /> AI Forecast Insights
//         </h2>
//         <button
//           onClick={() => {
//             setRefreshing(true);
//             fetchForecast();
//           }}
//           className="flex items-center gap-2 bg-[#1FA2B6]/90 hover:bg-[#148a9c] text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
//         >
//           {refreshing ? (
//             <>
//               <Loader2 className="animate-spin w-4 h-4" /> Regenerating...
//             </>
//           ) : (
//             <>
//               <RefreshCw className="w-4 h-4" /> Regenerate
//             </>
//           )}
//         </button>
//       </div>

//       {/* 🧠 Forecast Content */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-10 text-[#1FA2B6]">
//           <Loader2 className="animate-spin w-8 h-8 mb-2" />
//           <p>Generating your financial forecast...</p>
//         </div>
//       ) : forecast ? (
//         <div className="space-y-5">
//           {/* Forecast Summary */}
//           <div className="flex items-start gap-3">
//             <TrendingUp className="text-[#1FA2B6] w-6 h-6 mt-1" />
//             <p className="text-gray-700 text-base leading-relaxed">
//               {forecast.forecast || "No forecast data available."}
//             </p>
//           </div>

//           {/* AI Tips */}
//           <div>
//             <h3 className="text-lg font-semibold text-[#072146] flex items-center gap-2 mb-2">
//               <Lightbulb className="text-[#1FA2B6] w-5 h-5" /> AI Tips
//             </h3>
//             <ul className="list-disc list-inside text-gray-700 space-y-1">
//               {forecast.tips && forecast.tips.length > 0 ? (
//                 forecast.tips.map((tip, i) => (
//                   <li key={i} className="text-sm">
//                     {tip}
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-sm italic text-gray-500">
//                   No tips available yet.
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Motivation Message */}
//           <div className="bg-[#E0F7FA] border border-[#1FA2B6]/40 rounded-lg p-4 text-[#072146] shadow-sm">
//             <Sparkles className="inline w-4 h-4 text-[#1FA2B6] mr-2" />
//             <span className="text-sm font-medium">
//               {forecast.message || "Keep striving for financial balance 💪"}
//             </span>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-500 italic text-center">
//           ⚠️ Unable to generate forecast. Try again later.
//         </p>
//       )}
//     </motion.div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  Loader2,
  RefreshCw,
  History,
  Clock,
} from "lucide-react";

export default function ForecastCard() {
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch forecast
  const fetchForecast = async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await axios.get("http://localhost:8000/dashboard/forecast");
      setForecast(res.data);
      fetchHistory(); // refresh history after new forecast
    } catch (err) {
      console.error("❌ Error fetching forecast:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch forecast history
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/dashboard/forecast/history");
      setHistory(res.data || []);
    } catch (err) {
      console.error("⚠️ Error fetching forecast history:", err);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* 🔁 Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#072146] flex items-center gap-2">
          <Sparkles className="text-[#1FA2B6] w-5 h-5" /> AI Forecast Insights
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-[#E0F7FA] hover:bg-[#C5F4F7] text-[#072146] px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            <History className="w-4 h-4" /> {showHistory ? "Hide" : "View"} History
          </button>
          <button
            onClick={() => {
              setRefreshing(true);
              fetchForecast();
            }}
            className="flex items-center gap-2 bg-[#1FA2B6]/90 hover:bg-[#148a9c] text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
          >
            {refreshing ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> Regenerate
              </>
            )}
          </button>
        </div>
      </div>

      {/* 🧠 Forecast Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-[#1FA2B6]">
          <Loader2 className="animate-spin w-8 h-8 mb-2" />
          <p>Generating your financial forecast...</p>
        </div>
      ) : forecast ? (
        <div className="space-y-5">
          {/* Forecast Summary */}
          <div className="flex items-start gap-3">
            <TrendingUp className="text-[#1FA2B6] w-6 h-6 mt-1" />
            <p className="text-gray-700 text-base leading-relaxed">
              {forecast.forecast || "No forecast data available."}
            </p>
          </div>

          {/* AI Tips */}
          <div>
            <h3 className="text-lg font-semibold text-[#072146] flex items-center gap-2 mb-2">
              <Lightbulb className="text-[#1FA2B6] w-5 h-5" /> AI Tips
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {forecast.tips && forecast.tips.length > 0 ? (
                forecast.tips.map((tip, i) => (
                  <li key={i} className="text-sm">
                    {tip}
                  </li>
                ))
              ) : (
                <li className="text-sm italic text-gray-500">
                  No tips available yet.
                </li>
              )}
            </ul>
          </div>

          {/* Motivation Message */}
          <div className="bg-[#E0F7FA] border border-[#1FA2B6]/40 rounded-lg p-4 text-[#072146] shadow-sm">
            <Sparkles className="inline w-4 h-4 text-[#1FA2B6] mr-2" />
            <span className="text-sm font-medium">
              {forecast.message || "Keep striving for financial balance 💪"}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic text-center">
          ⚠️ Unable to generate forecast. Try again later.
        </p>
      )}

      {/* 📜 Forecast History Section */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-white border border-[#1FA2B6]/20 rounded-xl p-4 shadow-inner"
          >
            <h3 className="text-[#072146] font-semibold mb-3 flex items-center gap-2">
              <Clock className="text-[#1FA2B6] w-5 h-5" /> Recent Forecasts
            </h3>

            {history.length > 0 ? (
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((item) => (
                  <li
                    key={item._id}
                    className="border-b border-gray-100 pb-2 mb-2 last:border-none"
                  >
                    <p className="text-sm text-gray-700">{item.forecast}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      🕒 {item.created_at}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No past forecasts found.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
