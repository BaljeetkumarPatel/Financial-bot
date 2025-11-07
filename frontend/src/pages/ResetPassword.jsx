import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/auth/reset-password", {
        token,
        new_password: password,
      });
      setMsg(res.data.msg);
      setTimeout(() => nav("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Invalid or expired link.");
    }
  };

  return (
    <div className="pt-[80px] flex justify-center items-center bg-[#F4F7FB] min-h-screen">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-xl p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl text-[#072146] font-bold text-center">Reset Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded focus:border-[#1FA2B6] outline-none"
          placeholder="Enter new password"
          required
        />
        <button
          type="submit"
          className="bg-[#1FA2B6] text-white w-full py-2 rounded hover:opacity-90 transition"
        >
          Update Password
        </button>
        {msg && <p className="text-sm text-center mt-2 text-[#072146]">{msg}</p>}
      </form>
    </div>
  );
}
