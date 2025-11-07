// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name,setName]= useState("");
//   const nav = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     await axios.post('http://localhost:8000/auth/register', { email, password });
//     nav("/login");
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#F4F7FB]">
//       <form onSubmit={handleSignup} className="bg-white shadow-xl p-8 rounded-lg w-96">
//         <h2 className="text-2xl mb-4 text-[#072146] font-bold">Create Account</h2>
//         <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mb-3 border p-2 rounded" placeholder="Email" />
//         <input value={name} onChange={e=>setName(e.target.value)} className="w-full mb-3 border p-2 rounded" placeholder="Full Name" />
//         <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mb-4 border p-2 rounded" placeholder="Password" />
//         <button className="bg-[#1FA2B6] text-white w-full py-2 rounded">Sign Up</button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/auth/register", {
        email,
        password,
        full_name: fullName,
      });
      nav("/login");
    } catch {
      setError("Email already exists or invalid input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F7FB] min-h-screen flex justify-center items-start pt-[100px]">
      {/* Signup Card */}
      <div className="bg-white shadow-lg rounded-2xl w-[90%] max-w-sm px-8 py-8 flex flex-col items-center animate-fade-in border border-gray-100">
        <h2 className="text-3xl font-semibold text-[#072146] mb-1 tracking-tight text-center">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Join <span className="text-[#1FA2B6] font-semibold">Wise Wallet</span> today
        </p>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 w-full rounded-lg py-2 px-3 mb-4 text-center">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSignup}
          className="w-full flex flex-col gap-4 mt-2"
        >
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#1FA2B6] text-gray-700 text-sm transition-all"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#1FA2B6] text-gray-700 text-sm transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-[#1FA2B6] text-gray-700 text-sm transition-all"
              required
            />
          </div>

          {/* Terms */}
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <input
              type="checkbox"
              className="accent-[#1FA2B6] w-4 h-4 mr-2 cursor-pointer"
              required
            />
            <span>
              I agree to the{" "}
              <a
                href="#"
                className="text-[#1FA2B6] hover:underline font-medium"
              >
                Terms & Conditions
              </a>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-2.5 rounded-full text-white font-medium text-sm tracking-wide shadow-md transition-all ${
              loading
                ? "bg-[#1FA2B6]/60 cursor-not-allowed"
                : "bg-[#1FA2B6] hover:bg-[#178b9d] hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Login link */}
          <p className="text-gray-500 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1FA2B6] hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Inline Animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
