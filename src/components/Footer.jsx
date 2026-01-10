import React from "react";
import "../App.css";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
  <div className="container footer__inner">
    <p>© {new Date().getFullYear()} PetF. All rights reserved.</p>
    <ul className="footer__links">
      <li>
        <span className="text-white font-semibold">College of Engineering</span>
      </li>
    </ul>
  </div>
</footer>


  );
}
