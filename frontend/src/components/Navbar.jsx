// import React from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// export default function Navbar({ user, setUser, toggleSidebar }) {
//   const handleLogout = async () => {
//     await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
//     setUser(null);
//   };

//   return (
//     <nav className="bg-[#072146] text-white px-8 py-3 flex justify-between items-center shadow">
//       <div className="flex items-center gap-3">
//         <div className="text-2xl font-bold text-[#1FA2B6]">💰 PF Bank</div>
//       </div>
//       <div className="flex gap-6 items-center">
//         <Link to="/" className="hover:underline">Home</Link>
//         {!user && <Link to="/chatbot" className="hover:underline">Chatbot</Link>}
//         {user ? (
//           <>
//             <Link to="/dashboard" className="hover:underline">Dashboard</Link>
//             <button onClick={toggleSidebar} className="bg-[#1FA2B6] text-white px-3 py-1 rounded">☰</button>
//             <button onClick={handleLogout} className="border px-3 py-1 rounded">Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="hover:underline">Login</Link>
//             <Link to="/signup" className="hover:underline">Signup</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }



// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// export default function Navbar({ user, setUser, toggleSidebar }) {
//   const ref = useRef(null);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Scroll listener for shadow + background
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = async () => {
//     await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
//     setUser(null);
//   };

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "Chatbot", path: "/chatbot" },
//     { name: "Dashboard", path: "/dashboard", protected: true },
//   ];

//   return (
//     <nav
//       ref={ref}
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
//         isScrolled
//           ? "bg-white/90 backdrop-blur-lg shadow-md text-[#072146]"
//           : "bg-[#072146] text-white"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//         {/* ---- Logo ---- */}
//         <div className="flex items-center gap-3">
//           <div className="text-2xl font-bold text-[#1FA2B6]">💰 PF Bank</div>
//         </div>

//         {/* ---- Desktop Nav ---- */}
//         <div className="hidden md:flex items-center gap-6 font-medium">
//           {navLinks.map(
//             (link, i) =>
//               (!link.protected || user) && (
//                 <Link
//                   key={i}
//                   to={link.path}
//                   className={`group relative transition-all ${
//                     isScrolled ? "text-[#072146]" : "text-white"
//                   }`}
//                 >
//                   {link.name}
//                   <span
//                     className={`absolute left-0 bottom-[-4px] h-[2px] w-0 group-hover:w-full transition-all duration-300 ${
//                       isScrolled ? "bg-[#072146]" : "bg-[#1FA2B6]"
//                     }`}
//                   />
//                 </Link>
//               )
//           )}

//           {user ? (
//             <>
//               <button
//                 onClick={toggleSidebar}
//                 className="bg-[#1FA2B6] text-white px-3 py-1 rounded hover:opacity-90 transition"
//               >
//                 ☰
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className={`border px-3 py-1 rounded transition ${
//                   isScrolled ? "border-[#072146] text-[#072146]" : "border-white text-white"
//                 } hover:bg-[#1FA2B6] hover:text-white`}
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className={`px-4 py-1 rounded-full border transition ${
//                   isScrolled ? "border-[#072146] text-[#072146]" : "border-white text-white"
//                 } hover:bg-[#1FA2B6] hover:text-white`}
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className={`px-4 py-1 rounded-full bg-[#1FA2B6] text-white hover:opacity-90 transition`}
//               >
//                 Signup
//               </Link>
//             </>
//           )}
//         </div>

//         {/* ---- Mobile Menu Button ---- */}
//         <div className="md:hidden">
//           <svg
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             xmlns="http://www.w3.org/2000/svg"
//             className={`h-7 w-7 cursor-pointer transition ${
//               isScrolled ? "text-[#072146]" : "text-white"
//             }`}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             {isMenuOpen ? (
//               <>
//                 <line x1="18" y1="6" x2="6" y2="18" />
//                 <line x1="6" y1="6" x2="18" y2="18" />
//               </>
//             ) : (
//               <>
//                 <line x1="4" y1="6" x2="20" y2="6" />
//                 <line x1="4" y1="12" x2="20" y2="12" />
//                 <line x1="4" y1="18" x2="20" y2="18" />
//               </>
//             )}
//           </svg>
//         </div>
//       </div>

//       {/* ---- Mobile Menu ---- */}
//       <div
//         className={`fixed inset-0 bg-white text-[#072146] flex flex-col items-center justify-center gap-8 text-lg font-medium transition-all duration-500 md:hidden ${
//           isMenuOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {navLinks.map(
//           (link, i) =>
//             (!link.protected || user) && (
//               <Link
//                 key={i}
//                 to={link.path}
//                 onClick={() => setIsMenuOpen(false)}
//                 className="hover:text-[#1FA2B6] transition"
//               >
//                 {link.name}
//               </Link>
//             )
//         )}

//         {user ? (
//           <>
//             <button
//               onClick={toggleSidebar}
//               className="bg-[#1FA2B6] text-white px-5 py-2 rounded hover:opacity-90 transition"
//             >
//               ☰ Sidebar
//             </button>
//             <button
//               onClick={handleLogout}
//               className="border border-[#072146] px-5 py-2 rounded hover:bg-[#1FA2B6] hover:text-white transition"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link
//               to="/login"
//               className="border border-[#072146] px-5 py-2 rounded hover:bg-[#1FA2B6] hover:text-white transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className="bg-[#1FA2B6] text-white px-5 py-2 rounded hover:opacity-90 transition"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Signup
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }




import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import walletImg from "../assets/vite.svg";

export default function Navbar({ user, setUser, toggleSidebar }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add scroll shadow + background transition
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const handleLogout = async () => {
  //   await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
  //   setUser(null);
  // };
  const navigate = useNavigate();
  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/", { replace: true });
  };
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "Dashboard", path: "/dashboard", protected: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md text-[#072146]"
          : "bg-[#072146] text-white"
      }`}
    >
      {/* ---- Leftmost Sidebar Toggle ---- */}
      {user && (
        <button
          onClick={toggleSidebar}
          className={`h-full px-4 text-2xl font-bold flex items-center justify-center transition-all ${
            isScrolled ? "text-[#072146]" : "text-white"
          } hover:bg-[#1FA2B6]/20`}
          style={{
            borderRight: isScrolled ? "1px solid #d1d5db" : "1px solid rgba(255,255,255,0.2)",
            minHeight: "56px",
          }}
        >
          ☰
        </button>
      )}

      {/* ---- Main Navbar Container ---- */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
       <Link
          to="/"
          className="flex items-center gap-3 group cursor-pointer select-none"
        >
          <img
            src={walletImg}
            alt="Wise Wallet Logo"
            className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-2xl font-bold text-[#1FA2B6] group-hover:text-[#148C9E] transition-colors duration-300">
            Wise Wallet
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {navLinks.map(
            (link, i) =>
              (!link.protected || user) && (
                <Link
                  key={i}
                  to={link.path}
                  className={`group relative transition-all ${
                    isScrolled ? "text-[#072146]" : "text-white"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 bottom-[-4px] h-[2px] w-0 group-hover:w-full transition-all duration-300 ${
                      isScrolled ? "bg-[#072146]" : "bg-[#1FA2B6]"
                    }`}
                  />
                </Link>
              )
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className={`border px-3 py-1 rounded transition ${
                isScrolled ? "border-[#072146] text-[#072146]" : "border-white text-white"
              } hover:bg-[#1FA2B6] hover:text-white`}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-1 rounded-full border transition ${
                  isScrolled ? "border-[#072146] text-[#072146]" : "border-white text-white"
                } hover:bg-[#1FA2B6] hover:text-white`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 rounded-full bg-[#1FA2B6] text-white hover:opacity-90 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* ---- Mobile Menu Icon ---- */}
        <div className="md:hidden">
          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-7 w-7 cursor-pointer transition ${
              isScrolled ? "text-[#072146]" : "text-white"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* ---- Mobile Menu ---- */}
      <div
        className={`fixed inset-0 bg-white text-[#072146] flex flex-col items-center justify-center gap-8 text-lg font-medium transition-all duration-500 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navLinks.map(
          (link, i) =>
            (!link.protected || user) && (
              <Link
                key={i}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#1FA2B6] transition"
              >
                {link.name}
              </Link>
            )
        )}

        {user ? (
          <>
            <button
              onClick={() => {
                toggleSidebar();
                setIsMenuOpen(false);
              }}
              className="bg-[#1FA2B6] text-white px-5 py-2 rounded hover:opacity-90 transition"
            >
              ☰ Sidebar
            </button>
            <button
              onClick={handleLogout}
              className="border border-[#072146] px-5 py-2 rounded hover:bg-[#1FA2B6] hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-[#072146] px-5 py-2 rounded hover:bg-[#1FA2B6] hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#1FA2B6] text-white px-5 py-2 rounded hover:opacity-90 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
