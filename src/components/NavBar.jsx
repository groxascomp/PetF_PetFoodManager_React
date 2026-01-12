import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const [irStatus, setIrStatus] = useState("none");
  const [mobileOpen, setMobileOpen] = useState(false);
  const ESP_IP = "http://10.58.198.63";
  const navigate = useNavigate();
  const prevStatus = useRef("none");

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${ESP_IP}/irStatus`);
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();

        setIrStatus((old) => {
          if (data.status !== "detected" && old === "detected") {
            const audio = new Audio("/discord-notification.mp3");
            audio.play().catch((err) =>
              console.error("Audio play failed:", err)
            );
          }
          prevStatus.current = data.status;
          return data.status;
        });
      } catch {
        setIrStatus("none");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full bg-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <span className="text-white font-bold text-lg">PetF.</span>

          {/* Desktop links */}
          <div className="hidden sm:flex space-x-4">
            <NavLink to="/" end className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }>
              Feed me!
            </NavLink>
            <NavLink to="/services" className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }>
              Tracker
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }>
              Trivia
            </NavLink>
            <NavLink to="/level" className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }>
              <span>Level</span>
              <span
                className={`w-3 h-3 rounded-full ${
                  irStatus === "detected" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </NavLink>

            {/* Log-Out */}
            <button
              onClick={handleLogout}
              className="hidden sm:inline-block px-3 py-1 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white transition"
            >
              Log-Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          <NavLink to="/" end className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Home
          </NavLink>
          <NavLink to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Feed me!
          </NavLink>
          <NavLink to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Tracker
          </NavLink>
          <NavLink to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Trivia
          </NavLink>
          <NavLink to="/level" className="flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            <span>Level</span>
            <span
              className={`w-3 h-3 rounded-full ${
                irStatus === "detected" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white transition"
          >
            Log-Out
          </button>
        </div>
      )}
    </nav>
  );
}
