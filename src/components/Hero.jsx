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
        <h1 className="hero__title">WELCOME</h1>
        <p className="hero__subtitle">
          “Your pet misses you—and we’re here to make sure they feel loved,
          cared for, and happy while you’re away.”
        </p>
        <div className="hero__actions">
          <button
            onClick={() => navigate("/about")}
            className="btn btn--primary"
          >
            Feed Me!
          </button>
          <button
  onClick={() => navigate("/services")}
  className="btn btn--outline btn--tracker"
>
  Tracker
</button>
        </div>
      </div>
    </section>
  );
}