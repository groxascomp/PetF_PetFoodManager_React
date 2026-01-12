// src/pages/LoginAnim.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBarlogin";
import Footer from "../components/Footer";

export default function LoginAnim() {
  const navigate = useNavigate();
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    // Show GIF immediately when page mounts
    setShowGif(true);

    // Redirect after 4 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <NavBar />
      <section
        id="home"
        className="hero h-[684px] flex items-center justify-center"
        style={{
          background: `
            linear-gradient(-90deg, rgba(81, 104, 124, 0), rgba(56, 73, 111, 0)),
            url("/cat-food-bg.jpg") center center / cover no-repeat fixed
          `,
        }}
      >
        <div className="text-center bg-[rgb(189,222,238)] border border-[#111827] rounded-lg shadow-lg px-8 py-6">
          <h1 className="text-5xl font-extrabold text-[rgb(13,58,81)]">
            Welcome 🎉
          </h1>
          <p className="mt-4 text-gray-700">Redirecting to home...</p>

          {/* ✅ Local cat GIF */}
          {showGif && (
            <div className="mt-6 flex justify-center">
              <img
                src="/oiia-cat.gif"
                alt="Spinning cat"
                className="w-40 h-40 rounded-lg shadow-md"
              />
            </div>
          )}

          {/* ✅ Local sound file (plays on page load) */}
          <audio autoPlay>
            <source src="/Sound2.m4a" type="audio/mp4" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </section>
      <Footer />
    </>
  );
}
