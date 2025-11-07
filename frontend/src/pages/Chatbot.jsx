// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import rehypeSanitize from "rehype-sanitize";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Chatbot({ user }) {
//   const [messages, setMessages] = useState([
//     {
//       sender: "bot",
//       text: "👋 **Hello!** I’m *Wise Wallet Assistant.*\n\nAsk me anything about savings, investments, or personal finance!",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const messagesEndRef = useRef(null);

//   const userId = user?.id || "guest";

//   // Auto-scroll on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Fetch chat history
//   const fetchChatHistory = async () => {
//   try {
//     const res = await axios.get(`http://localhost:8000/chatbot/history/${userId}`);
//     console.log("📜 Chat history API response:", res.data);
//     const history = res.data.history || res.data || [];
//     setChatHistory(history);
//   } catch (error) {
//     console.error("❌ Error fetching chat history:", error);
//   }
// };

//   useEffect(() => {
//     fetchChatHistory();
//   }, [userId]);

//   // Send message to backend
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:8000/chatbot/", {
//         message: input,
//         user_id: userId,
//       });

//       const botReply = res.data.response || "Sorry, I didn’t quite understand that.";
//       setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
//       fetchChatHistory(); // refresh history
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load a past conversation
//   const loadConversation = (q, r) => {
//     setMessages([
//       { sender: "user", text: q },
//       { sender: "bot", text: r },
//     ]);
//   };

//   return (
//     <div className="pt-[80px] flex justify-center bg-[#F4F7FB] min-h-screen font-[Inter]">
//       <div className="w-full max-w-6xl flex h-[80vh] shadow-2xl rounded-2xl overflow-hidden">
//         {/* Left Side: Chat History */}
        
//           <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto p-4">
//             <h2 className="text-lg font-semibold text-[#072146] mb-3 flex items-center gap-2">
//               🕒 Chat History
//             </h2>
//             {chatHistory.length === 0 ? (
//               <p className="text-sm text-gray-500">No previous chats found.</p>
//             ) : (
//               <div className="space-y-3">
//                 {chatHistory.map((chat) => (
//                   <div
//                     key={chat._id}
//                     className="relative group p-3 rounded-xl bg-gray-50 hover:bg-[#1FA2B6]/10 cursor-pointer border border-gray-200"
//                     onClick={() => loadConversation(chat.question, chat.response)}
//                   >
//                     <p className="font-medium text-[#072146] truncate pr-6">
//                       {chat.question}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {new Date(chat.timestamp).toLocaleString()}
//                     </p>

//                     {/* 🗑 Delete Button on hover */}
//                     <button
//                       onClick={async (e) => {
//                         e.stopPropagation(); // prevent opening chat
//                         if (!window.confirm("Are you sure you want to delete this chat?")) return;

//                         try {
//                           await axios.delete(`http://localhost:8000/chatbot/delete/${chat._id}`);
//                           setChatHistory((prev) => prev.filter((c) => c._id !== chat._id));
//                         } catch (err) {
//                           console.error("Error deleting chat:", err);
//                           alert("Failed to delete chat");
//                         }
//                       }}
//                       className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
//                       title="Delete chat"
//                     >
//                       🗑
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>


//         {/* Right Side: Chat Interface */}
//         <div className="flex-1 bg-white flex flex-col">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-[#072146] to-[#1FA2B6] text-white py-4 text-center font-semibold text-lg shadow">
//             💬 Wise Wallet Chatbot
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#1FA2B6]/50 scrollbar-track-transparent">
//             <AnimatePresence>
//               {messages.map((msg, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap leading-relaxed ${
//                       msg.sender === "user"
//                         ? "bg-[#1FA2B6] text-white rounded-br-none"
//                         : "bg-gray-100 text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
//                       {msg.text}
//                     </ReactMarkdown>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>

//             {loading && (
//               <div className="text-gray-500 italic text-sm animate-pulse pl-2">
//                 Wise Wallet Assistant is typing...
//               </div>
//             )}

//             <div ref={messagesEndRef}></div>
//           </div>

//           {/* Input Box */}
//           <form
//             onSubmit={sendMessage}
//             className="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3"
//           >
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1FA2B6] transition-all"
//             />
//             <button
//               type="submit"
//               className="bg-[#1FA2B6] hover:bg-[#148a9c] text-white px-5 py-2.5 rounded-xl shadow-md transition"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import rehypeSanitize from "rehype-sanitize";
// import { motion, AnimatePresence } from "framer-motion";
// import { History } from "lucide-react";

// export default function Chatbot({ user }) {
//   const [messages, setMessages] = useState([
//     {
//       sender: "bot",
//       text: "👋 **Hello!** I’m *Wise Wallet Assistant.*\n\nAsk me anything about savings, investments, or personal finance!",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);
//   const messagesEndRef = useRef(null);

//   const userId = user?.id || "guest";

//   // 🔽 Auto-scroll on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 🧾 Fetch chat history
//   const fetchChatHistory = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8000/chatbot/history/${userId}`);
//       const history = res.data.history || [];
//       setChatHistory(history);
//     } catch (error) {
//       console.error("❌ Error fetching chat history:", error);
//     }
//   };

//   useEffect(() => {
//     fetchChatHistory();
//   }, [userId]);

//   // 💬 Send message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:8000/chatbot/", {
//         message: input,
//         user_id: userId,
//       });

//       const botReply = res.data.response || "Sorry, I didn’t quite understand that.";
//       const sentiment = res.data.sentiment || "Neutral";

//       setMessages((prev) => [...prev, { sender: "bot", text: botReply, sentiment }]);
//       fetchChatHistory(); // refresh history
//     } catch (err) {
//       console.error("⚠️ Error sending message:", err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📜 Load previous conversation
//   const loadConversation = (q, r, sentiment) => {
//     setMessages([
//       { sender: "user", text: q },
//       { sender: "bot", text: r, sentiment },
//     ]);
//   };

//   // 🎨 Sentiment badge color
//   const getSentimentColor = (sentiment) => {
//     switch (sentiment) {
//       case "Positive":
//         return "bg-green-100 text-green-700 border-green-300";
//       case "Negative":
//         return "bg-red-100 text-red-700 border-red-300";
//       default:
//         return "bg-gray-100 text-gray-600 border-gray-300";
//     }
//   };

//   return (
//     <div className="pt-[80px] flex justify-center bg-[#F4F7FB] min-h-screen font-[Inter]">
//       <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#072146] to-[#1FA2B6] text-white py-4 px-6 flex justify-between items-center shadow">
//           <h2 className="font-semibold text-lg">💬 Wise Wallet Chatbot</h2>
//           <button
//             onClick={() => setShowHistory(!showHistory)}
//             className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
//           >
//             <History className="w-4 h-4" />
//             <span className="text-sm">{showHistory ? "Hide" : "View"} History</span>
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#1FA2B6]/50 scrollbar-track-transparent">
//           <AnimatePresence>
//             {messages.map((msg, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap leading-relaxed ${
//                     msg.sender === "user"
//                       ? "bg-[#1FA2B6] text-white rounded-br-none"
//                       : "bg-gray-100 text-gray-800 rounded-bl-none"
//                   }`}
//                 >
//                   {msg.sender === "bot" && msg.sentiment && (
//                     <p
//                       className={`text-xs font-medium mb-1 px-2 py-0.5 inline-block rounded-full border ${getSentimentColor(
//                         msg.sentiment
//                       )}`}
//                     >
//                       {msg.sentiment}
//                     </p>
//                   )}
//                   <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{msg.text}</ReactMarkdown>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {loading && (
//             <div className="text-gray-500 italic text-sm animate-pulse pl-2">
//               Wise Wallet Assistant is typing...
//             </div>
//           )}

//           <div ref={messagesEndRef}></div>
//         </div>

//         {/* Input Box */}
//         <form
//           onSubmit={sendMessage}
//           className="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3"
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1FA2B6] transition-all"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-[#1FA2B6] hover:bg-[#148a9c] text-white px-5 py-2.5 rounded-xl shadow-md transition"
//           >
//             {loading ? "..." : "Send"}
//           </button>
//         </form>

//         {/* History Section (Collapsible) */}
//         <AnimatePresence>
//           {showHistory && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.4 }}
//               className="border-t border-gray-200 bg-white p-4 overflow-y-auto max-h-[250px]"
//             >
//               <h3 className="text-[#072146] font-semibold mb-3 flex items-center gap-2">
//                 🕒 Recent Chat History
//               </h3>
//               {chatHistory.length > 0 ? (
//                 <ul className="space-y-3">
//                   {chatHistory.map((chat) => (
//                     <li
//                       key={chat._id}
//                       className="relative group border border-gray-100 hover:border-[#1FA2B6]/40 rounded-lg p-3 bg-gray-50 hover:bg-[#1FA2B6]/10 cursor-pointer transition"
//                       onClick={() =>
//                         loadConversation(chat.question, chat.response, chat.sentiment)
//                       }
//                     >
//                       <div className="flex justify-between items-center">
//                         <p className="font-medium text-[#072146] truncate pr-6">
//                           {chat.question}
//                         </p>
//                         {chat.sentiment && (
//                           <span
//                             className={`text-xs px-2 py-1 rounded-full border ${getSentimentColor(
//                               chat.sentiment
//                             )}`}
//                           >
//                             {chat.sentiment}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(chat.timestamp).toLocaleString()}
//                       </p>
//                       {/* 🗑 Delete */}
//                       <button
//                         onClick={async (e) => {
//                           e.stopPropagation();
//                           if (!window.confirm("Delete this chat?")) return;
//                           try {
//                             await axios.delete(`http://localhost:8000/chatbot/delete/${chat._id}`);
//                             setChatHistory((prev) =>
//                               prev.filter((c) => c._id !== chat._id)
//                             );
//                           } catch (err) {
//                             alert("Failed to delete chat");
//                           }
//                         }}
//                         className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
//                       >
//                         🗑
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-sm italic">
//                   No chat history available yet.
//                 </p>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { motion, AnimatePresence } from "framer-motion";
import { History, Bot, User } from "lucide-react";

export default function Chatbot({ user }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 **Hello!** I’m *Wise Wallet Assistant.*\n\nAsk me anything about savings, investments, or personal finance!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const userId = user?.id || "guest";

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/chatbot/history/${userId}`);
      setChatHistory(res.data.history || []);
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
    }
  };
  useEffect(() => {
    fetchChatHistory();
  }, [userId]);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chatbot/", {
        message: input,
        user_id: userId,
      });

      const botReply = res.data.response || "Sorry, I didn’t quite understand that.";
      const sentiment = res.data.sentiment || "Neutral";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply, sentiment },
      ]);
      fetchChatHistory();
    } catch (err) {
      console.error("⚠️ Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load past chat
  const loadConversation = (q, r, sentiment) => {
    setMessages([
      { sender: "user", text: q },
      { sender: "bot", text: r, sentiment },
    ]);
  };

  // Sentiment badge color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-700 border-green-300";
      case "Negative":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="pt-[80px] flex justify-center bg-[#F4F7FB] min-h-screen font-[Inter]">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#072146] to-[#1FA2B6] text-white py-4 px-6 flex justify-between items-center shadow">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            💬 Wise Wallet Chatbot
          </h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
          >
            <History className="w-4 h-4" />
            <span className="text-sm">{showHistory ? "Hide" : "View"} History</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-[#1FA2B6]/50 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="flex-shrink-0 bg-[#E0F7FA] p-2 rounded-full shadow-sm">
                    <Bot className="w-5 h-5 text-[#1FA2B6]" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                 className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm leading-relaxed text-[15px] 
                    break-words whitespace-pre-wrap overflow-x-auto overflow-y-auto max-h-[350px] 
                    scrollbar-thin scrollbar-thumb-[#1FA2B6]/40 scrollbar-track-transparent 
                    ${
                      msg.sender === "user"
                        ? "bg-[#1FA2B6] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                >
                  {msg.sender === "bot" && msg.sentiment && (
                    <span
                      className={`text-xs font-medium mb-1 inline-block px-2 py-0.5 rounded-full border ${getSentimentColor(
                        msg.sentiment
                      )}`}
                    >
                      {msg.sentiment}
                    </span>
                  )}

                  {/* ✅ Fixed ReactMarkdown styling */}
                  <ReactMarkdown
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          {...props}
                          className="break-words whitespace-pre-wrap leading-relaxed"
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          {...props}
                          className="font-semibold text-[#072146]"
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          {...props}
                          className="list-disc list-inside space-y-1"
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li {...props} className="break-words text-[15px]" />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {msg.sender === "user" && (
                  <div className="flex-shrink-0 bg-[#1FA2B6]/10 p-2 rounded-full shadow-sm">
                    <User className="w-5 h-5 text-[#1FA2B6]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing animation */}
          {loading && (
            <div className="flex items-center gap-3 justify-start text-gray-600 mt-2">
              <div className="flex-shrink-0 bg-[#E0F7FA] p-2 rounded-full shadow-sm">
                <Bot className="w-5 h-5 text-[#1FA2B6]" />
              </div>
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl shadow-sm rounded-bl-none flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                ></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Box */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your financial question..."
            className="flex-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1FA2B6] transition-all break-words"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1FA2B6] hover:bg-[#148a9c] text-white px-5 py-2.5 rounded-xl shadow-md transition"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

        {/* History Section */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="border-t border-gray-200 bg-white p-4 overflow-y-auto max-h-[250px]"
            >
              <h3 className="text-[#072146] font-semibold mb-3 flex items-center gap-2">
                🕒 Recent Chat History
              </h3>
              {chatHistory.length > 0 ? (
                <ul className="space-y-3">
                  {chatHistory.map((chat) => (
                    <li
                      key={chat._id}
                      className="relative group border border-gray-100 hover:border-[#1FA2B6]/40 rounded-lg p-3 bg-gray-50 hover:bg-[#1FA2B6]/10 cursor-pointer transition"
                      onClick={() =>
                        loadConversation(chat.question, chat.response, chat.sentiment)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-[#072146] truncate pr-6">
                          {chat.question}
                        </p>
                        {chat.sentiment && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${getSentimentColor(
                              chat.sentiment
                            )}`}
                          >
                            {chat.sentiment}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(chat.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No chat history available yet.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
