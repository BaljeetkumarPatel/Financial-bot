import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/auth/forgot-password", { email });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div className="pt-[80px] flex justify-center items-center bg-[#F4F7FB] min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl text-[#072146] font-bold text-center">Forgot Password?</h2>
        <p className="text-gray-500 text-sm text-center">
          Enter your registered email to get a reset link.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded focus:border-[#1FA2B6] outline-none"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="bg-[#1FA2B6] text-white w-full py-2 rounded hover:opacity-90 transition"
        >
          Send Reset Link
        </button>
        {msg && <p className="text-green-600 font-medium text-center">{msg}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}
