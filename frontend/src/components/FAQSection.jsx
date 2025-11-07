import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does Wise Wallet AI work and is my data safe?",
    answer: `Wise Wallet is powered by Google's advanced Gemini AI model, OpenAI ChatGPT, and IBM Watson Granite model.
    When you chat, we send detailed system instructions along with your query. This includes your profile (name, persona, goals)
    and behavioral rules for the AI—making responses personalized and natural. <br/><br/>
    <strong>Your privacy is our top priority.</strong> Your conversations and uploaded files are used only during your session.
    We do not store or reuse your chat history or personal data. Every session is stateless and secure.`,
  },
  {
    question: "What is the Financial Planner and how does it allocate savings?",
    answer: `The Financial Planner helps manage your debts and savings goals dynamically. You assign a 1–5 star
    importance to each item. Wise Wallet first ensures all minimum debt payments are covered. Any leftover savings are distributed
    proportionally by importance—so 5-star items get a higher share of savings.`,
  },
  {
    question: "Is the tax advice from the dashboard legally binding?",
    answer: `<strong>No, it’s not legally binding.</strong> The Tax & Investment Estimator provides educational insights
    based on the latest Indian tax regime. Consult a certified Chartered Accountant for official tax planning.`,
  },
  {
    question: "How can I edit or delete the goals and debts I've added?",
    answer: `You can manage your entries directly in the Financial Planner. Use the <strong>✏️ pencil icon</strong> to edit
    or the <strong>🗑️ trash icon</strong> to delete a goal or debt instantly.`,
  },
  {
    question: "What happens if my savings don't cover my minimum debt payments?",
    answer: `Wise Wallet alerts you immediately. If your entered savings are less than required debt minimums,
    an on-screen warning appears and the allocation plan is paused until you adjust your budget.`,
  },
  {
    question: "How does Wise Wallet personalize the conversation for me?",
    answer: `During onboarding, you provide your name, role (Student/Professional), and main goal.
    This information is sent to the AI with every query, allowing it to tailor tone, explanations, and suggestions.`,
  },
  {
    question: "What are the limitations of Wise Wallet AI?",
    answer: `Wise Wallet is an AI assistant — not a licensed financial advisor.
    It cannot access real-time markets or execute transactions.
    Use it for education, insights, and planning, but verify critical information independently.`,
  },
  {
    question: "What is the difference between the 'Snowball' and 'Avalanche' debt strategies?",
    answer: `The <strong>Snowball Method</strong> targets your smallest debts first to gain momentum,
    while the <strong>Avalanche Method</strong> pays off the highest-interest debts first to save money overall.
    Wise Wallet's Financial Planner uses a more flexible importance-based approach, but you can request either plan in chat.`,
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#072146] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-[#1FA2B6]">
          💡 Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="w-full flex justify-between items-center text-left px-6 py-4 focus:outline-none hover:bg-[#EAF8FB] transition"
              >
                <span className="font-semibold text-[#072146]">
                  {faq.question}
                </span>
                {activeIndex === index ? (
                  <ChevronUp className="text-[#1FA2B6]" />
                ) : (
                  <ChevronDown className="text-[#1FA2B6]" />
                )}
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 text-gray-700 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
