import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Upload, Save, Edit2, AlertTriangle } from "lucide-react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    sex: "",
    age: "",
    persona: "",
    financialComfort: "",
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const userId = "user123"; // 🔹 Replace this with your logged-in user id

  // 🔹 Load Profile from backend
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8000/profile/user123");
      if (res.data) {
        setProfile(res.data);
        if (res.data.profilePic)
          setPreview(`data:image/jpeg;base64,${res.data.profilePic}`);
      }
    } catch (err) {
      console.error("⚠️ Error fetching profile:", err);
    }
  };
  fetchProfile();
}, []);

  // 🖋 Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🖼 Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePic: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 💾 Save profile to backend
 const handleSave = async () => {
  try {
    const formData = new FormData();

    // 🔑 Temporary static ID (replace with logged-in user ID)
    formData.append("user_id", "user123");

    formData.append("name", profile.name || "");
    formData.append("sex", profile.sex || "");
    formData.append("age", profile.age || "");
    formData.append("persona", profile.persona || "");
    formData.append("financialComfort", profile.financialComfort || "");

    if (profile.profilePic instanceof File) {
      formData.append("file", profile.profilePic);
    }

    const res = await axios.post("http://localhost:8000/profile/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(res.data.message);
    setEditMode(false);
  } catch (err) {
    console.error("❌ Error saving profile:", err);
    alert("Error saving profile. Check backend logs.");
  }
};

  // 💣 Delete Profile from backend
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/profile/${userId}`);
      alert("🗑 Profile deleted successfully!");
      setProfile({
        name: "",
        sex: "",
        age: "",
        persona: "",
        financialComfort: "",
        profilePic: null,
      });
      setPreview(null);
    } catch (err) {
      console.error("❌ Error deleting profile:", err);
      alert("Error deleting profile from database.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#072146] pt-[90px] px-6 pb-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#072146]">
          Your <span className="text-[#1FA2B6]">Profile</span>
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          Manage and personalize your account details.
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-[#1FA2B6]/30 rounded-2xl p-8 max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-all"
      >
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-8 mb-8">
          <div className="relative w-28 h-28">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#1FA2B6]/70 shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-[#1FA2B6] p-2 rounded-full cursor-pointer hover:bg-[#148a9c] transition">
              <Upload className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-[#072146]">
              {profile.name || "Unnamed User"}
            </h2>
            <p className="text-gray-500 text-sm">
              {editMode ? "Editing mode" : "Viewing mode"}
            </p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-5">
          {[
            { label: "Name", key: "name" },
            { label: "Sex", key: "sex" },
            { label: "Age", key: "age" },
            { label: "Persona", key: "persona" },
            { label: "Financial Comfort", key: "financialComfort" },
          ].map(({ label, key }) => (
            <div
              key={key}
              className="flex justify-between items-center bg-[#F8FAFC] border border-[#E0E7EB] p-3 rounded-lg hover:shadow-md transition"
            >
              <p className="text-gray-500 text-sm">{label}</p>
              {editMode ? (
                <input
                  name={key}
                  value={profile[key] || ""}
                  onChange={handleChange}
                  className="bg-transparent text-[#072146] text-right outline-none border-none w-1/2 font-medium"
                />
              ) : (
                <p className="text-[#072146] font-medium text-right">
                  {profile[key]}
                </p>
              )}
              <Edit2 className="w-4 h-4 text-gray-400 ml-2" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          {editMode ? (
            <button
              onClick={handleSave}
              className="w-full py-3 bg-[#1FA2B6] hover:bg-[#148a9c] text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-3 bg-[#1FA2B6]/80 hover:bg-[#1FA2B6] text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              <Edit2 className="w-5 h-5" /> Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white border border-red-300/50 rounded-2xl p-8 mt-10 max-w-3xl mx-auto shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        </div>

        <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
          <div>
            <p className="text-[#072146] font-medium">
              Delete Profile (Database)
            </p>
            <p className="text-sm text-gray-500">
              This will permanently remove your profile from the database.
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition font-medium"
          >
            Delete Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}
