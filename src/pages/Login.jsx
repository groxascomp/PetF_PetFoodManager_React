import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // optional for styling

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "Work" && password === "Para_sa_pera") {
      navigate("/"); // redirect to Home
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <section className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </section>
  );
}