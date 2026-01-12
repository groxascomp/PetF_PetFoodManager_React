// src/pages/Login.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBarlogin";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const audioRef = useRef(null); // 👈 reference to audio element

  const handleLogin = () => {
    if (username === "ESP" && password === "676767") {
      navigate("/login-anim"); // 👈 go to animation page
    } else {
      setError("Invalid username or password");
      if (audioRef.current) {
        audioRef.current.play(); // 👈 play bonk sound
      }
    }
  };

  return (
    <>
      <NavBar />
      <section
        id="home"
        className="hero h-[684px]"
        style={{
          background: `
            linear-gradient(-90deg, rgba(81, 104, 124, 0), rgba(56, 73, 111, 0)),
            url("/cat-food-bg.jpg") center center / cover no-repeat fixed
          `,
          paddingBottom: "23px",
        }}
      >
        <div
          className="hero__content container h-[322px]"
          style={{ paddingTop: "37px", paddingLeft: "45px" }}
        >
          <h1 className="hero__title text-6xl font-extrabold text-gray-800">
            PetF.
          </h1>

          <div className="hero__login flex flex-col gap-4 mt-6 max-w-sm">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[rgb(189,222,238)] border border-[#111827] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(13,58,81)] placeholder-[#111827]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[rgb(189,222,238)] border border-[#111827] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(13,58,81)] placeholder-[#111827]"
            />
            <button
              onClick={handleLogin}
              className="bg-[rgb(13,58,81)] hover:bg-[rgb(83,126,149)] text-white font-bold py-2 px-4 rounded shadow"
            >
              Log In
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          {/* ✅ Hidden audio element for bonk sound */}
          <audio ref={audioRef}>
            <source src="/bonk.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </section>
      <Footer />
    </>
  );
}
