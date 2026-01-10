import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="hero"
      style={{
        background: `
          linear-gradient(-90deg, rgba(81, 104, 124, 0.0), rgba(56, 73, 111, 0.0)),
          url("/cat-food-bg.jpg") center/cover no-repeat fixed
        `,
      }}
    >
      <div className="hero__content container">
        {/* Updated heading */}
        <h1 className="hero__title text-6xl font-extrabold text-gray-800">
          WELCOME!
        </h1>

        <p className="hero__subtitle">
          “Your pet misses you—and we’re here to make sure they feel loved,
          cared for, and happy while you’re away.”
        </p>

        <div className="hero__actions">
          <button
  onClick={() => navigate("/about")}
  className="bg-[rgb(13,58,81)] hover:bg-[rgb(83,126,149)] text-white font-bold py-2 px-4 rounded shadow flex items-center"
>
  Feed Me!
</button>

          <button
  onClick={() => navigate("/services")}
  className="bg-white text-[rgb(13,58,81)] font-bold py-2 px-4 rounded shadow flex items-center border border-[rgb(13,58,81)] hover:bg-[rgb(83,126,149)] hover:text-white transition-colors"
>
  Tracker
</button>

        </div>
      </div>
    </section>
  );
}
