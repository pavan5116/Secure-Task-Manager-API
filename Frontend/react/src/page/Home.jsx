import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <section className="hero">
        <h1>Welcome to Secure Task Manager</h1>
        <p>Organize your tasks securely and efficiently. Sign in or create an account to get started.</p>
        <div className="actions">
          <Link to="/login">Get Started</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Secure Task Manager. All rights reserved.
      </footer>
    </div>
  );
}
