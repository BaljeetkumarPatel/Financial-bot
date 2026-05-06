import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SafeMarkdown from "../components/SafeMarkdown";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#6366f1", "#ef4444", "#14b8a6"];

export default function StatementAnalyzer() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [tips, setTips] = useState([]);
  const [topTransactions, setTopTransactions] = useState([]);
  const [spendByChannel, setSpendByChannel] = useState([]);
  const [expectedTxMap, setExpectedTxMap] = useState(() => {
    try {
      const raw = localStorage.getItem("expected_transactions_map");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const reportRef = useRef();

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/statement/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("expected_transactions_map", JSON.stringify(expectedTxMap));
    } catch {
      // no-op for storage failures
    }
  }, [expectedTxMap]);

  const txKey = (tx) =>
    `${tx?.date || ""}|${tx?.description || ""}|${Number(tx?.amount || 0)}`;

  const isExpectedTx = (tx) => Boolean(expectedTxMap[txKey(tx)]);

  const toggleExpectedTx = (tx) => {
    const key = txKey(tx);
    setExpectedTxMap((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  };

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
      const res = await axios.post("http://localhost:8000/statement/analyze-statement", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      setAnalysis(data);

      const months = Array.isArray(data.months) ? data.months : [];
      if (months.length > 0) {
        setChartData(months.map((m) => ({ month: m.month, spending: m.spending })));
      } else {
        setChartData([]);
      }

      setCategoryData(Array.isArray(data.categories) ? data.categories : []);
      setTips(Array.isArray(data.spend_reduction_tips) ? data.spend_reduction_tips : []);
      setTopTransactions(Array.isArray(data.top_transactions) ? data.top_transactions : []);
      setSpendByChannel(Array.isArray(data.spend_by_channel) ? data.spend_by_channel : []);

      fetchHistory();
    } catch (err) {
      console.error("Error analyzing statement:", err);
      const msg = err?.response?.data?.detail || "Error analyzing statement. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await axios.delete(`http://localhost:8000/statement/history/${id}`);
      if (res.data?.message) {
        alert(res.data.message);
        fetchHistory();
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Failed to delete record:", err.response?.data || err.message);
      alert(`Error deleting history item: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const reportElement = reportRef.current;
      if (!reportElement) {
        alert("No report found to export.");
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
      console.error("PDF generation failed:", err);
      alert("Error generating PDF. Check console logs for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center py-16 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-semibold text-[#072146] mb-8 text-center"
      >
        AI Statement Analyzer
      </motion.h1>

      <motion.form onSubmit={handleUpload} className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md flex flex-col items-center">
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

      {analysis && (
        <div ref={reportRef} className="bg-white shadow-xl rounded-2xl mt-10 p-8 w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-[#1FA2B6] mb-4">Financial Insights Report</h2>

          <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed prose prose-sm max-w-none">
            <SafeMarkdown
              content={typeof analysis.insight === "string" ? analysis.insight : "Invalid report format received."}
            />
          </div>

          {chartData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#1FA2B6] mb-3">Month-wise Spending Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => `INR ${Number(v).toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="spending" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {categoryData.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-[#1FA2B6] mb-3">Category-wise Spend Distribution</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={categoryData} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={110} label>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `INR ${Number(v).toLocaleString("en-IN")}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {tips.length > 0 && (
            <div className="mt-8 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#0369A1] mb-3">How to Reduce Your Spend</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {spendByChannel.length > 0 && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#1FA2B6] mb-3">Where You Spent</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {spendByChannel.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{item.channel}</p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      INR {Number(item.amount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topTransactions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#1FA2B6] mb-3">Top 5 High / Suspicious Transactions</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                      <th className="px-3 py-2 text-left">Risk</th>
                      <th className="px-3 py-2 text-left">Reason</th>
                      <th className="px-3 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTransactions.map((tx, idx) => (
                      <tr key={idx} className={`border-t ${isExpectedTx(tx) ? "bg-green-50/40" : ""}`}>
                        <td className="px-3 py-2">{tx.date || "-"}</td>
                        <td className="px-3 py-2">
                          {tx.description || "-"}
                          {isExpectedTx(tx) ? (
                            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              Expected
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2 text-right">INR {Number(tx.amount || 0).toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isExpectedTx(tx)
                                ? "bg-green-100 text-green-700"
                                : tx.risk_level === "high"
                                ? "bg-red-100 text-red-700"
                                : tx.risk_level === "medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isExpectedTx(tx) ? "EXPECTED" : (tx.risk_level || "low").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2">{tx.reason || "-"}</td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => toggleExpectedTx(tx)}
                            className={`rounded-md px-2 py-1 text-xs font-semibold ${
                              tx.risk_level === "high"
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {isExpectedTx(tx) ? "Unmark" : "Mark as Expected"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button onClick={handleDownloadPDF} className="bg-[#10b981] text-white px-5 py-2 rounded-lg hover:bg-[#059669] transition">
              Download Report as PDF
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-12 bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl">
          <h3 className="text-lg font-semibold text-[#1FA2B6] mb-4">Past Analyses</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {history.map((item) => (
              <div key={item._id} className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedItem(item)}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs bg-[#1FA2B6]/10 text-[#1FA2B6] px-2 py-1 rounded">{item.months?.length || 0} months</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="text-red-500 hover:text-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{(item.insight || "").slice(0, 150)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto relative">
            <button onClick={() => setSelectedItem(null)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              x
            </button>
            <h3 className="text-xl font-semibold text-[#1FA2B6] mb-4">Financial Report ({new Date(selectedItem.created_at).toLocaleDateString()})</h3>
            <SafeMarkdown content={selectedItem.insight} />
          </div>
        </div>
      )}
    </div>
  );
}
