import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">PetF.</div>
      <ul className="navbar__links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/about">Feed me!</NavLink></li>
        <li><NavLink to="/services">Tracker</NavLink></li>
        <li><NavLink to="/blog">Trivia</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
    </nav>
  );
}