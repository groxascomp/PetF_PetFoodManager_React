import React from "react";
import "../App.css";

export default function Company() {
  return (
    <section id="about" className="company">
      <div className="container">
        <h2 className="section__title">Our Company</h2>
        <p className="section__text">
          Individualized quality care that meets the total needs of the patient. Individualized
          quality care that quality care that individualized quality care that meets the total.
        </p>
        <div className="company__grid">
          <div className="card">
            <h3 className="card__title">Mission</h3>
            <p className="card__text">
              Deliver reliable solutions that empower clients to make informed decisions and grow sustainably.
            </p>
          </div>
          <div className="card">
            <h3 className="card__title">Vision</h3>
            <p className="card__text">
              Be a trusted partner by combining technology, expertise, and care across every engagement.
            </p>
          </div>
          <div className="card">
            <h3 className="card__title">Values</h3>
            <p className="card__text">
              Integrity, transparency, and adaptability guide how we serve and innovate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}