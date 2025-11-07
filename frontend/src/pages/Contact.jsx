import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import Footer from "../components/Footer";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Thank you for your message! We’ll get back to you shortly.");
    e.target.reset();
  };

  return (
    <div className="bg-[#F4F7FB] text-[#072146] min-h-screen flex flex-col pt-[100px]">
      {/* ---- Hero Section ---- */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 bg-gradient-to-r from-[#072146] to-[#1FA2B6] text-white rounded-b-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <h1 className="text-4xl font-bold mb-4">📞 Get in Touch</h1>
          <p className="text-white/90 text-lg leading-relaxed">
            We’re here to help you with your financial planning, budgeting,
            investments, or any query about Wise Wallet. Our team will respond
            promptly to guide you through your journey toward financial
            wellness.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[8rem] mt-10 md:mt-0 opacity-90"
        >
          <i className="fa-solid fa-headset"></i>
        </motion.div>
      </section>

      {/* ---- Contact Info & Form ---- */}
      <section className="flex flex-col md:flex-row gap-10 px-10 md:px-20 py-14">
        {/* Contact Info */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-8 flex-1 border border-gray-100"
        >
          <h2 className="text-2xl font-semibold mb-6 text-[#072146]">
            📍 Contact Information
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <MapPin className="text-[#1FA2B6] mt-1" />
              <div>
                <strong>Address:</strong>
                <br />
                Bmsit, Bengaluru, India 560064
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="text-[#1FA2B6] mt-1" />
              <div>
                <strong>Email:</strong>
                <br />
                <a
                  href="mailto:support@wisewallet.com"
                  className="text-[#1FA2B6] hover:underline"
                >
                  support@wisewallet.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="text-[#1FA2B6] mt-1" />
              <div>
                <strong>Phone:</strong>
                <br /> +91 987 654 3210
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-8 flex-[2] border border-gray-100"
        >
          <h2 className="text-2xl font-semibold mb-6 text-[#072146]">
            ✉️ Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1FA2B6] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1FA2B6] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="Inquiry about Financial Planner"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1FA2B6] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Message</label>
              <textarea
                rows="5"
                required
                placeholder="Type your message here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1FA2B6] outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#1FA2B6] hover:bg-[#148a9c] text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              <i className="fa-solid fa-paper-plane mr-2"></i> Send Message
            </button>
          </form>
        </motion.div>
      </section>

      {/* ---- Map Section ---- */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="px-10 md:px-20 pb-16"
      >
        <h2 className="text-2xl font-semibold mb-4 text-[#072146]">
          🗺️ Our Location
        </h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124385.50970034426!2d77.51268481541018!3d13.034789880196726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf80b01713363351d!2sBMS%20Institute%20of%20Technology%20and%20Management!5e0!3m2!1sen!2sin!4v1729883584857!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: "0", borderRadius: "12px" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </motion.section>
      <Footer />  
    </div>
  );
}
