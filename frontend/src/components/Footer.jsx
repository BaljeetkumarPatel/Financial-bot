import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <footer className="flex flex-col md:flex-row gap-3 items-center justify-between w-full py-5 px-6 bg-[#072146] text-white">
        <p className="text-sm text-white/80">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#1FA2B6] font-medium">Wise Wallet</span>. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm">
          {/* ✅ Contact Page Link */}
          <Link
            to="/contact"
            className="hover:text-[#1FA2B6] transition-all duration-200"
          >
            Contact Us
          </Link>

          <div className="h-5 w-px bg-white/20"></div>

          {/* <a
            href="#"
            className="hover:text-[#1FA2B6] transition-all duration-200"
          >
            Privacy Policy
          </a> */}
          
          <Link
            to="/privacy-policy"
            className="hover:text-[#1FA2B6] transition-all duration-200"
          >
            Privacy Policy
          </Link>

          <div className="h-5 w-px bg-white/20"></div>
           <Link
            to="/terms-and-conditions"
            className="hover:text-[#1FA2B6] transition-all duration-200"
          >
            Terms & Conditions
          </Link>
          
        </div>
      </footer>
    </>
  );
}
