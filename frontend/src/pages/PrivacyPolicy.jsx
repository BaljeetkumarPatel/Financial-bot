import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Info, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="pt-[90px] px-6 pb-16 bg-[#F4F7FB] min-h-screen text-[#072146] font-[Inter]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-[#072146] mb-3">
          <span className="text-[#1FA2B6]">Privacy</span> Policy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your personal data while using our financial tools.
        </p>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto bg-white border border-[#E0E7EB] rounded-2xl shadow-lg p-8 space-y-10">
        {/* Section 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <Info className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We collect personal details such as your name, age, and persona
              when you create or update your profile. We also store financial
              information you provide (like goals or budgets) to generate
              insights, forecasts, and personalized suggestions.
            </p>
          </div>
        </motion.div>

        {/* Section 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <UserCheck className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              2. How We Use Your Data
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your data is used solely for improving your financial experience.
              This includes generating AI-based recommendations, tracking your
              progress, and providing forecasts tailored to your spending and
              saving patterns. We never sell or share your data with third
              parties.
            </p>
          </div>
        </motion.div>

        {/* Section 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <Lock className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              3. Data Protection & Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement advanced security measures to protect your data from
              unauthorized access, modification, or disclosure. All communication
              with our servers is encrypted. Passwords and financial records are
              securely stored and never exposed in plain text.
            </p>
          </div>
        </motion.div>

        {/* Section 4 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <Shield className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              4. Your Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You have full control over your information. You can view, edit,
              or delete your profile data anytime. You may also request the
              permanent deletion of your account, which will erase all
              associated financial and chatbot history.
            </p>
          </div>
        </motion.div>

        {/* Section 5 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <Info className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              5. Cookies & Analytics
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website uses essential cookies to provide a better user
              experience. Analytics may be collected anonymously to understand
              how features are used, helping us improve the dashboard and AI
              performance.
            </p>
          </div>
        </motion.div>

        {/* Section 6 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <Lock className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              6. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your financial and chatbot data only as long as needed
              to provide the services you use. If you delete your profile, all
              associated data will be permanently removed from our database.
            </p>
          </div>
        </motion.div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center pt-6 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600">
            Last updated: <strong>{new Date().toLocaleDateString()}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            If you have any questions about this Privacy Policy, please contact
            us at <span className="text-[#1FA2B6] font-medium">support@wisewallet.in</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
