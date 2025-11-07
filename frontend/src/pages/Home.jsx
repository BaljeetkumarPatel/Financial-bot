import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import walletImg from "../assets/piggy.jpg";
import axios from "axios";

export default function Home() {
  const [visits, setVisits] = useState(null);
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await axios.get("http://localhost:8000/visits");
        setVisits(res.data.count);
      } catch (err) {
        console.error("Failed to fetch visits", err);
      }
    };
    fetchVisits();
  }, []);
  return (
    <div className="bg-[#F4F7FB] text-[#072146]">
      {/* 🌟 Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-8 py-20">
        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to <span className="text-[#1FA2B6]">Wise Wallet</span> — Your Smart Financial Partner 💼
          </h1>
          <p className="text-gray-600 text-lg">
            Simplify your finances with AI — track spending, plan goals, analyze statements,
            and get personalized insights powered by Gemini, ChatGPT, and IBM Watson.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-[#1FA2B6] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#148a9c] transition"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="border border-[#072146] px-6 py-3 rounded-lg hover:bg-[#072146] hover:text-white transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-10 md:mt-0 ">
          <img
            src={walletImg}
            alt="AI Financial Assistant"
            className="w-[400px] mx-auto md:w-[500px]"
          />
        </div>
      </section>

      {/* 💡 Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-[#1FA2B6] mb-12">
            Why Choose Wise Wallet?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#EAF8FB] rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">🤖 AI-Powered Insights</h3>
              <p className="text-gray-600">
                Understand your spending patterns, get automated advice, and plan smarter with Gemini AI.
              </p>
            </div>
            <div className="bg-[#EAF8FB] rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">📊 Financial Planner</h3>
              <p className="text-gray-600">
                Allocate savings intelligently between debts and goals based on priorities you set.
              </p>
            </div>
            <div className="bg-[#EAF8FB] rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">💸 Tax & Investment Estimator</h3>
              <p className="text-gray-600">
                Get instant tax slab estimates and learn smart investment options to save more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ⚙️ How It Works */}
      <section className="bg-[#F4F7FB] py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-[#1FA2B6] mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">1️⃣ Create Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your income, savings, debts, and goals — securely stored and private.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">2️⃣ Get Smart Analysis</h3>
              <p className="text-gray-600">
                Our AI evaluates your finances and suggests personalized saving & debt strategies.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold mb-2">3️⃣ Track & Grow</h3>
              <p className="text-gray-600">
                Visualize progress with charts, reports, and AI-driven recommendations that adapt to you.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Testimonials />

      {/* ❓ FAQ Section */}
      <FAQSection />
      <div className="text-center text-gray-600 text-sm py-6">
        👥 <span className="font-semibold">{visits ?? "Loading..."}</span>{" "}
        {visits === 1 ? "person has" : "people have"} visited this page.
      </div>

      {/* 🔚 Footer */}
      {/* <footer className="bg-[#072146] text-white text-center py-6 mt-10">
        <p>
          © {new Date().getFullYear()} PF Bank (Wise Wallet) — Built with 💙 AI for Financial Wellness.
        </p>
      </footer> */}
      <Footer />
    </div>
  );
}
