// src/pages/LoginAnim.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBarlogin";
import Footer from "../components/Footer";

export default function LoginAnim() {
  const navigate = useNavigate();
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    setShowGif(true);

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
          className="hero__content container h-[322px] flex flex-col items-center justify-center"
          style={{ paddingTop: "37px", paddingLeft: "45px" }}
        >
          {/* ✅ Welcome + GIF in same line */}
          <div className="flex items-center justify-center gap-4">
            <h1 className="hero__title text-6xl font-extrabold text-gray-800">
              Welcome 🎉
            </h1>
            {showGif && (
              <img
                src="/oiia-cat.gif"
                alt="Spinning cat"
                className="w-40 h-40 rounded-lg" // 👈 shadow removed
              />
            )}
          </div>

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
