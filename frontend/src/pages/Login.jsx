import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import walletImg from "../assets/vite.svg";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        "http://localhost:8000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const res = await axios.get("http://localhost:8000/auth/dashboard", {
        withCredentials: true,
      });
      setUser(res.data.user);
      nav("/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="bg-[#F4F7FB] min-h-[calc(100vh-80px)] flex justify-center items-center overflow-hidden mt-20">
      {/* container ensures it sits below navbar (navbar height ≈ 80px) */}
      <div className="flex w-full max-w-6xl h-[550px] bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Left Image */}
        <div className="hidden md:block w-1/2 bg-[#072146]">
          <img
            src={walletImg}
            alt="login Wise Wallet"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 lg:px-16">
          <form onSubmit={handleLogin} className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-[#072146] text-center">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm text-center mt-2">
              Unlock your financial potential
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mt-4">{error}</p>
            )}

            {/* Email input */}
            <div className="mt-8">
              <label className="block text-gray-700 text-sm mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-full px-4">
                <svg
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                    fill="#6B7280"
                  />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-3 bg-transparent outline-none text-gray-700 text-sm rounded-full"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mt-5">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-full px-4">
                <svg
                  width="13"
                  height="17"
                  viewBox="0 0 13 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                    fill="#6B7280"
                  />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-3 bg-transparent outline-none text-gray-700 text-sm rounded-full"
                  required
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mt-5 text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#1FA2B6]" />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="hover:text-[#1FA2B6] underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="mt-8 bg-[#1FA2B6] hover:bg-[#178b9d] text-white w-full py-3 rounded-full text-sm font-medium transition-all"
            >
              Login
            </button>

            {/* Signup link */}
            <p className="text-gray-500 text-sm text-center mt-6">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#1FA2B6] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
