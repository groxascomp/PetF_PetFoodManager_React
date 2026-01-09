import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Footer() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} PetF. All rights reserved.</p>
        <ul className="footer__links">
          <li>
            <button
  onClick={handleLogout}
  className="btn btn--outline btn--logout"
  style={{ padding: "0.4rem 0.8rem" }}
>
  Log-Out
</button>
          </li>
        </ul>
      </div>
    </footer>
  );
}