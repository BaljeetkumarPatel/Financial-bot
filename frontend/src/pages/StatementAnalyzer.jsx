// import React, { useState, useRef } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function StatementAnalyzer() {
//   const [file, setFile] = useState(null);
//   const [text, setText] = useState("");
//   const [history, setHistory] = useState([]);
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [chartData, setChartData] = useState([]);
//   const reportRef = useRef();


//   const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#6366f1", "#84cc16", "#ef4444"];

//   const handleUpload = async (e, regenerate = false) => {
//     e?.preventDefault();

//     if (!file && !text.trim() && !regenerate) {
//       alert("Please upload a statement file or enter text to analyze.");
//       return;
//     }

//     const formData = new FormData();
//     if (file) formData.append("file", file);
//     if (text.trim()) formData.append("text", text.trim());

//     setLoading(true);
//     setAnalysis(null);

//     try {
//       const res = await axios.post("http://localhost:8000/statement/analyze-statement", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const data = res.data;
//       setAnalysis(data);

//       // Example: detect month-based spending data from response (if Gemini includes it)
//       const monthPattern = /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b).*?₹([\d,]+)/gi;
//       const matches = [...data.insight.matchAll(monthPattern)];

//       if (matches.length > 0) {
//         const parsed = matches.slice(0, 3).map((m) => ({
//           month: m[1],
//           spending: parseInt(m[2].replace(/,/g, "")),
//         }));
//         setChartData(parsed);
//       } else {
//         setChartData([]);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error analyzing statement. Check backend logs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download report as PDF
//   const handleDownloadPDF = async () => {
//   try {
//     const reportElement = reportRef.current;

//     if (!reportElement) {
//       alert("⚠️ No report found to export!");
//       return;
//     }

//     // 🕒 Wait for charts and markdown to finish rendering
//     await new Promise((res) => setTimeout(res, 600));

//     // ✅ Create a canvas from report section
//     const canvas = await html2canvas(reportElement, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       logging: false,
//       windowWidth: reportElement.scrollWidth,
//       windowHeight: reportElement.scrollHeight,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const imgHeight = (canvas.height * pageWidth) / canvas.width;

//     // 🧾 Header details
//     const reportTitle = "AI Financial Insights Report";
//     const currentDate = new Date().toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });

//     // 🧩 Helper function for header/footer
//     const addHeaderFooter = (pageNum, totalPages) => {
//       pdf.setFontSize(14);
//       pdf.setTextColor(31, 162, 182);
//       pdf.text(reportTitle, 14, 15);

//       pdf.setFontSize(10);
//       pdf.setTextColor(100);
//       pdf.text(`Generated on: ${currentDate}`, 14, 22);

//       pdf.setFontSize(10);
//       pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 35, pageHeight - 10);

//       // Horizontal divider
//       pdf.setDrawColor(200);
//       pdf.line(10, 25, pageWidth - 10, 25);
//       pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
//     };

//     // 📄 Add image as content with proper scaling
//     let position = 30;
//     pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight - 20);

//     // If content overflows to multiple pages
//     let heightLeft = imgHeight - (pageHeight - 40);
//     let pageNum = 1;

//     while (heightLeft > 0) {
//       pageNum++;
//       pdf.addPage();
//       addHeaderFooter(pageNum, pageNum); // Add header/footer to new page
//       position = heightLeft - imgHeight + 30;
//       pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight - 20);
//       heightLeft -= pageHeight - 40;
//     }

//     // Add header/footer on first page
//     pdf.setPage(1);
//     addHeaderFooter(1, pageNum);

//     // 💾 Save the PDF
//     pdf.save(`AI_Financial_Report_${currentDate.replace(/\s+/g, "_")}.pdf`);
//     console.log("✅ PDF exported successfully!");
//   } catch (err) {
//     console.error("❌ PDF generation failed:", err);
//     alert("Error generating PDF. Check console logs for details.");
//   }
// };

//   return (
//     <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center py-16 px-4">
//       {/* Title */}
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-3xl font-semibold text-[#072146] mb-8 text-center"
//       >
//         💹 AI Statement Analyzer
//       </motion.h1>

//       {/* Upload Box */}
//       <motion.form
//         onSubmit={handleUpload}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md flex flex-col items-center"
//       >
//         <label className="text-gray-700 text-sm font-medium mb-3">
//           Upload your Bank Statement (.pdf or .txt) or paste text below
//         </label>

//         <input
//           type="file"
//           accept=".pdf,.txt"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="border rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-[#1FA2B6]"
//         />

//         <textarea
//           placeholder="Paste your bank statement text here..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="w-full border rounded-lg p-3 h-28 outline-none mb-4 focus:ring-2 focus:ring-[#1FA2B6]"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded-lg text-white font-medium transition ${
//             loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1FA2B6] hover:bg-[#148a9c]"
//           }`}
//         >
//           {loading ? "Analyzing..." : "Analyze Statement"}
//         </button>
//       </motion.form>

//       {/* Analysis Results */}
//       {analysis && (
//         <motion.div
//           ref={reportRef}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="bg-white shadow-xl rounded-2xl mt-10 p-8 w-full max-w-4xl"
//         >
//           <h2 className="text-xl font-semibold text-[#1FA2B6] mb-4">
//             💬 Financial Insights Report
//           </h2>

//           {/* Markdown Report */}
//           {analysis.insight ? (
//             <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed prose prose-sm max-w-none">
//               <ReactMarkdown>{analysis.insight}</ReactMarkdown>
//             </div>
//           ) : (
//             <p className="text-gray-500 italic">
//               ⚠️ No insights generated. Please check your input.
//             </p>
//           )}

//           {/* Visualization */}
//           {chartData.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold text-[#1FA2B6] mb-3">
//                 📊 Last 3-Month Spending Comparison
//               </h3>

//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
//                   <Legend />
//                   <Bar dataKey="spending" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>

//               <p className="text-gray-500 text-sm italic text-center mt-3">
//                 💡 This compares your average spending across the last three months.
//               </p>
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex flex-wrap justify-center gap-4 mt-8">
//             <button
//               onClick={handleDownloadPDF}
//               className="bg-[#10b981] text-white px-5 py-2 rounded-lg hover:bg-[#059669] transition"
//             >
//               ⬇️ Download Report as PDF
//             </button>
//             <button
//               onClick={(e) => handleUpload(e, true)}
//               className="bg-[#6366f1] text-white px-5 py-2 rounded-lg hover:bg-[#4f46e5] transition"
//             >
//               🔁 Regenerate Report
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }


// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import SafeMarkdown from "../components/SafeMarkdown";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function StatementAnalyzer() {
//   const [file, setFile] = useState(null);
//   const [text, setText] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [chartData, setChartData] = useState([]);
//   const reportRef = useRef();

//   const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#6366f1", "#84cc16", "#ef4444"];

//   // Fetch previous analyses
//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/statement/history");
//       setHistory(res.data);
//     } catch (err) {
//       console.error("⚠️ Error fetching history:", err);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   // Handle file upload or pasted text
//   const handleUpload = async (e, regenerate = false) => {
//     e?.preventDefault();

//     if (!file && !text.trim() && !regenerate) {
//       alert("Please upload a statement file or enter text to analyze.");
//       return;
//     }

//     const formData = new FormData();
//     if (file) formData.append("file", file);
//     if (text.trim()) formData.append("text", text.trim());

//     setLoading(true);
//     setAnalysis(null);

//     try {
//       const res = await axios.post(
//         "http://localhost:8000/statement/analyze-statement",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       const data = res.data;
//       setAnalysis(data);

//       // Parse spending data from response
//       const months = data.months || [];
//       if (months.length > 0) {
//         setChartData(
//           months.map((m) => ({
//             month: m.month,
//             spending: m.spending,
//           }))
//         );
//       } else {
//         const monthPattern =
//           /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b).*?₹([\d,]+)/gi;
//         const matches = [...(data.insight || "").matchAll(monthPattern)];
//         if (matches.length > 0) {
//           const parsed = matches.slice(0, 3).map((m) => ({
//             month: m[1],
//             spending: parseInt(m[2].replace(/,/g, "")),
//           }));
//           setChartData(parsed);
//         } else {
//           setChartData([]);
//         }
//       }

//       fetchHistory();
//     } catch (err) {
//       console.error("❌ Error analyzing statement:", err);
//       alert("Error analyzing statement. Check backend logs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download report as PDF
//   const handleDownloadPDF = async () => {
//     try {
//       const reportElement = reportRef.current;
//       if (!reportElement) {
//         alert("⚠️ No report found to export!");
//         return;
//       }

//       await new Promise((res) => setTimeout(res, 600));

//       const canvas = await html2canvas(reportElement, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         logging: false,
//         windowWidth: reportElement.scrollWidth,
//         windowHeight: reportElement.scrollHeight,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgHeight = (canvas.height * pageWidth) / canvas.width;

//       const reportTitle = "AI Financial Insights Report";
//       const currentDate = new Date().toLocaleDateString("en-IN", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });

//       const addHeaderFooter = (pageNum, totalPages) => {
//         pdf.setFontSize(14);
//         pdf.setTextColor(31, 162, 182);
//         pdf.text(reportTitle, 14, 15);

//         pdf.setFontSize(10);
//         pdf.setTextColor(100);
//         pdf.text(`Generated on: ${currentDate}`, 14, 22);
//         pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 35, pageHeight - 10);

//         pdf.setDrawColor(200);
//         pdf.line(10, 25, pageWidth - 10, 25);
//         pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
//       };

//       let position = 30;
//       pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight - 20);

//       let heightLeft = imgHeight - (pageHeight - 40);
//       let pageNum = 1;

//       while (heightLeft > 0) {
//         pageNum++;
//         pdf.addPage();
//         addHeaderFooter(pageNum, pageNum);
//         position = heightLeft - imgHeight + 30;
//         pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight - 20);
//         heightLeft -= pageHeight - 40;
//       }

//       pdf.setPage(1);
//       addHeaderFooter(1, pageNum);

//       pdf.save(`AI_Financial_Report_${currentDate.replace(/\s+/g, "_")}.pdf`);
//       console.log("✅ PDF exported successfully!");
//     } catch (err) {
//       console.error("❌ PDF generation failed:", err);
//       alert("Error generating PDF. Check console logs for details.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center py-16 px-4">
//       {/* Title */}
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-3xl font-semibold text-[#072146] mb-8 text-center"
//       >
//         💹 AI Statement Analyzer
//       </motion.h1>

//       {/* Upload Form */}
//       <motion.form
//         onSubmit={handleUpload}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md flex flex-col items-center"
//       >
//         <label className="text-gray-700 text-sm font-medium mb-3">
//           Upload your Bank Statement (.pdf or .txt) or paste text below
//         </label>

//         <input
//           type="file"
//           accept=".pdf,.txt"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="border rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-[#1FA2B6]"
//         />

//         <textarea
//           placeholder="Paste your bank statement text here..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="w-full border rounded-lg p-3 h-28 outline-none mb-4 focus:ring-2 focus:ring-[#1FA2B6]"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded-lg text-white font-medium transition ${
//             loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1FA2B6] hover:bg-[#148a9c]"
//           }`}
//         >
//           {loading ? "Analyzing..." : "Analyze Statement"}
//         </button>
//       </motion.form>

//       {/* Analysis Report */}
//       {analysis && (
//         <motion.div
//           ref={reportRef}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="bg-white shadow-xl rounded-2xl mt-10 p-8 w-full max-w-4xl"
//         >
//           <h2 className="text-xl font-semibold text-[#1FA2B6] mb-4">
//             💬 Financial Insights Report
//           </h2>

//           {/* Safe Markdown Rendering */}
//           {analysis.insight ? (
//             <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed prose prose-sm max-w-none">
//               <SafeMarkdown
//                 className="prose prose-sm max-w-none text-gray-700"
//                 content={
//                   typeof analysis.insight === "string"
//                     ? analysis.insight
//                     : "⚠️ Invalid report format received."
//                 }
//               />
//             </div>
//           ) : (
//             <p className="text-gray-500 italic">
//               ⚠️ No insights generated. Please check your input.
//             </p>
//           )}

//           {/* Visualization */}
//           {chartData.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold text-[#1FA2B6] mb-3">
//                 📊 Last 3-Month Spending Comparison
//               </h3>

//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
//                   <Legend />
//                   <Bar dataKey="spending" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>

//               <p className="text-gray-500 text-sm italic text-center mt-3">
//                 💡 This compares your average spending across the last three months.
//               </p>
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex flex-wrap justify-center gap-4 mt-8">
//             <button
//               onClick={handleDownloadPDF}
//               className="bg-[#10b981] text-white px-5 py-2 rounded-lg hover:bg-[#059669] transition"
//             >
//               ⬇️ Download Report as PDF
//             </button>
//             <button
//               onClick={(e) => handleUpload(e, true)}
//               className="bg-[#6366f1] text-white px-5 py-2 rounded-lg hover:bg-[#4f46e5] transition"
//             >
//               🔁 Regenerate Report
//             </button>
//           </div>
//         </motion.div>
//       )}

//       {/* History Section */}
//       {history.length > 0 && (
//         <div className="mt-12 bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl">
//           <h3 className="text-lg font-semibold text-[#1FA2B6] mb-4">📜 Past Analyses</h3>
//           <div className="space-y-4 max-h-80 overflow-y-auto">
//             {history.map((item) => (
//               <div key={item._id} className="border rounded-lg p-4 hover:bg-gray-50">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="text-sm text-gray-500">
//                     {new Date(item.created_at).toLocaleString()}
//                   </p>
//                   <p className="text-xs bg-[#1FA2B6]/10 text-[#1FA2B6] px-2 py-1 rounded">
//                     {item.months?.length || 0} months
//                   </p>
//                 </div>

//                 <SafeMarkdown
//                   className="prose prose-sm max-w-none text-gray-700"
//                   content={
//                     typeof item.insight === "string"
//                       ? item.insight.slice(0, 400) +
//                         (item.insight.length > 400 ? "..." : "")
//                       : "⚠️ No valid insight data available."
//                   }
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SafeMarkdown from "../components/SafeMarkdown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function StatementAnalyzer() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // 🆕 For popup
  const reportRef = useRef();

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/statement/history");
      setHistory(res.data);
    } catch (err) {
      console.error("⚠️ Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 📂 Upload + Analyze
  const handleUpload = async (e, regenerate = false) => {
    e?.preventDefault();

    if (!file && !text.trim() && !regenerate) {
      alert("Please upload a statement file or enter text to analyze.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text.trim()) formData.append("text", text.trim());

    setLoading(true);
    setAnalysis(null);

    try {
      const res = await axios.post(
        "http://localhost:8000/statement/analyze-statement",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const data = res.data;
      setAnalysis(data);

      const months = data.months || [];
      if (months.length > 0) {
        setChartData(months.map((m) => ({ month: m.month, spending: m.spending })));
      } else {
        const monthPattern =
          /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b).*?₹([\d,]+)/gi;
        const matches = [...(data.insight || "").matchAll(monthPattern)];
        if (matches.length > 0) {
          const parsed = matches.slice(0, 3).map((m) => ({
            month: m[1],
            spending: parseInt(m[2].replace(/,/g, "")),
          }));
          setChartData(parsed);
        } else {
          setChartData([]);
        }
      }

      fetchHistory();
    } catch (err) {
      console.error("❌ Error analyzing statement:", err);
      alert("Error analyzing statement. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete history item
  const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;

        try {
          const res = await axios.delete(`http://localhost:8000/statement/history/${id}`);
          if (res.data?.message) {
            alert(res.data.message); // ✅ show “Deleted successfully ✅”
            fetchHistory(); // Refresh UI
          } else {
            alert("⚠️ Unexpected response from server.");
          }
        } catch (err) {
          console.error("❌ Failed to delete record:", err.response?.data || err.message);
          alert(`Error deleting history item: ${err.response?.data?.detail || err.message}`);
        }
      };


  // 💾 Download report as PDF (unchanged)
  const handleDownloadPDF = async () => {
    try {
      const reportElement = reportRef.current;
      if (!reportElement) {
        alert("⚠️ No report found to export!");
        return;
      }

      await new Promise((res) => setTimeout(res, 600));
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: reportElement.scrollWidth,
        windowHeight: reportElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      const reportTitle = "AI Financial Insights Report";
      const currentDate = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const addHeaderFooter = (pageNum, totalPages) => {
        pdf.setFontSize(14);
        pdf.setTextColor(31, 162, 182);
        pdf.text(reportTitle, 14, 15);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Generated on: ${currentDate}`, 14, 22);
        pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 35, pageHeight - 10);
        pdf.setDrawColor(200);
        pdf.line(10, 25, pageWidth - 10, 25);
        pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
      };

      let position = 30;
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight - 20);
      let heightLeft = imgHeight - (pageHeight - 40);
      let pageNum = 1;

      while (heightLeft > 0) {
        pageNum++;
        pdf.addPage();
        addHeaderFooter(pageNum, pageNum);
        position = heightLeft - imgHeight + 30;
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight - 20);
        heightLeft -= pageHeight - 40;
      }

      pdf.setPage(1);
      addHeaderFooter(1, pageNum);
      pdf.save(`AI_Financial_Report_${currentDate.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
      alert("Error generating PDF. Check console logs for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center py-16 px-4">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-semibold text-[#072146] mb-8 text-center"
      >
        💹 AI Statement Analyzer
      </motion.h1>

      {/* Upload Form */}
      <motion.form
        onSubmit={handleUpload}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md flex flex-col items-center"
      >
        <label className="text-gray-700 text-sm font-medium mb-3">
          Upload your Bank Statement (.pdf or .txt) or paste text below
        </label>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="border rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-[#1FA2B6]"
        />
        <textarea
          placeholder="Paste your bank statement text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-lg p-3 h-28 outline-none mb-4 focus:ring-2 focus:ring-[#1FA2B6]"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1FA2B6] hover:bg-[#148a9c]"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Statement"}
        </button>
      </motion.form>

      {/* Main Report */}
      {analysis && (
        <div
          ref={reportRef}
          className="bg-white shadow-xl rounded-2xl mt-10 p-8 w-full max-w-4xl"
        >
          <h2 className="text-xl font-semibold text-[#1FA2B6] mb-4">
            💬 Financial Insights Report
          </h2>

          <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed prose prose-sm max-w-none">
            <SafeMarkdown
              content={
                typeof analysis.insight === "string"
                  ? analysis.insight
                  : "⚠️ Invalid report format received."
              }
            />
          </div>

          {chartData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#1FA2B6] mb-3">
                📊 Last 3-Month Spending Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="spending" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={handleDownloadPDF}
              className="bg-[#10b981] text-white px-5 py-2 rounded-lg hover:bg-[#059669] transition"
            >
              ⬇️ Download Report as PDF
            </button>
          </div>
        </div>
      )}

      {/* 🕒 History */}
      {history.length > 0 && (
        <div className="mt-12 bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl">
          <h3 className="text-lg font-semibold text-[#1FA2B6] mb-4">📜 Past Analyses</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => setSelectedItem(item)} // 🆕 Open modal on click
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs bg-[#1FA2B6]/10 text-[#1FA2B6] px-2 py-1 rounded">
                      {item.months?.length || 0} months
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="text-red-500 hover:text-red-700 transition text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.insight.slice(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🪟 Popup Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold text-[#1FA2B6] mb-4">
              📄 Financial Report ({new Date(selectedItem.created_at).toLocaleDateString()})
            </h3>
            <SafeMarkdown content={selectedItem.insight} />
          </div>
        </div>
      )}
    </div>
  );
}
