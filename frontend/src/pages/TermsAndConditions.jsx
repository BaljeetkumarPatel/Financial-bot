import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, ScrollText, CheckCircle2, Info } from "lucide-react";

export default function TermsAndConditions() {
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
          <span className="text-[#1FA2B6]">Terms</span> & Conditions
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          These Terms and Conditions outline the rules and guidelines for using
          our Wise Wallet platform and services.
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
            <FileText className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using Wise Wallet, you agree to comply with these
              Terms and Conditions. If you do not agree, please discontinue the
              use of our services immediately.
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
            <ShieldCheck className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              2. Use of Services
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to use our tools and dashboards only for lawful and
              personal financial management purposes. Misuse, unauthorized data
              access, or sharing of private user information is strictly
              prohibited.
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
            <ScrollText className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              3. Account Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account credentials. Any activity that occurs under your login is
              your responsibility. Please report unauthorized access immediately
              to our support team.
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
            <CheckCircle2 className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              4. AI Forecasting & Chatbot
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our AI features, including forecasting and chat assistance, are
              for informational and educational purposes only. Wise Wallet does
              not guarantee accuracy and should not be considered financial
              advice. You are solely responsible for decisions based on these
              insights.
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
              5. Data & Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We respect your privacy. All user data is handled in accordance
              with our{" "}
              <a
                href="/privacy-policy"
                className="text-[#1FA2B6] font-medium hover:underline"
              >
                Privacy Policy
              </a>
              . By using our services, you consent to the processing of your
              personal information as described there.
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
            <ShieldCheck className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content, code, and AI-generated materials in Wise Wallet are
              the intellectual property of the developers. Unauthorized copying,
              redistribution, or modification is prohibited.
            </p>
          </div>
        </motion.div>

        {/* Section 7 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <FileText className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Wise Wallet and its creators are not liable for any financial
              losses, data issues, or indirect damages arising from your use of
              our services. The app is provided “as is” without warranties of
              any kind.
            </p>
          </div>
        </motion.div>

        {/* Section 8 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-4"
        >
          <div className="bg-[#E0F7FA] p-3 rounded-xl">
            <ScrollText className="text-[#1FA2B6] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[#072146]">
              8. Updates to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms periodically. Updated versions will be
              posted on this page, and continued use of Wise Wallet after such
              changes constitutes your acceptance.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center pt-6 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600">
            Last updated: <strong>{new Date().toLocaleDateString()}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            For inquiries, contact us at{" "}
            <span className="text-[#1FA2B6] font-medium">
              support@wisewallet.in
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
