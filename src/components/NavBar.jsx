import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

export default function NavBar() {
  const [irStatus, setIrStatus] = useState("none");
  const ESP_IP = "http://192.168.8.139"; // your ESP8266 IP

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${ESP_IP}/irStatus`);
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        setIrStatus(data.status); // "detected" or "none"
      } catch (err) {
        setIrStatus("none"); // fallback if error
      }
    };

    fetchStatus(); // initial call
    const interval = setInterval(fetchStatus, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__brand">PetF.</div>
      <ul className="navbar__links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/about">Feed me!</NavLink></li>
        <li><NavLink to="/services">Tracker</NavLink></li>
        <li><NavLink to="/blog">Trivia</NavLink></li>
        {/* Level indicator */}
        <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>Level</span>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: irStatus === "detected" ? "green" : "red",
              display: "inline-block"
            }}
          ></span>
        </li>
      </ul>
    </nav>
  );
}
