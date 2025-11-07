import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Baljeet Kumar Patel",
    role: "Software Engineer, Bengaluru",
    feedback:
      "Wise Wallet completely changed how I manage my finances. The AI insights helped me understand my spending habits and optimize my savings plan. It feels like having a personal finance coach!",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Saksham Agrwal",
    role: "Entrepreneur, Mumbai",
    feedback:
      "The Financial Planner feature is brilliant. It helped me balance my business debts and personal goals effortlessly. The AI allocation plan is truly next-level!",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Sania saikh Teehseen",
    role: "Data Analyst, Kochi",
    feedback:
      "I used to feel overwhelmed by budgeting, but Wise Wallet made it simple and actionable. The interface is beautiful, and I love how it explains things clearly.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Rohit Mehta",
    role: "CA Aspirant, Delhi",
    feedback:
      "The Tax & Investment Estimator is a game-changer. It gives me clarity on tax planning and legal investment options every year. Highly recommended for professionals.",
    image: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    name: "Aditi Verma",
    role: "Student, Pune",
    feedback:
      "As a student, I started tracking my expenses early with Wise Wallet. The AI chatbot is friendly and motivates me to save smarter every month!",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#F4F7FB] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#072146] mb-10">
          💬 What Our Users Say
        </h2>

        {/* Scrollable Container */}
        <motion.div
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
          whileTap={{ cursor: "grabbing" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="min-w-[320px] md:min-w-[360px] bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#1FA2B6] mr-4"
                />
                <div>
                  <p className="font-semibold text-[#072146]">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>

              <div className="flex-1">
                <Quote className="text-[#1FA2B6] mb-2" size={20} />
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  “{t.feedback}”
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
