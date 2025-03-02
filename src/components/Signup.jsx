import React, { useState } from "react";
import { BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Sending username, email, and password in the body
      });

      const data = await response.json();

      if (data.registered) {
        alert("Signup successful! Redirecting to login...");
        navigate("/"); 
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" onChange={handleChange} required />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/login")}>
          Login here
        </span>
      </p>
    </div>
  );
};

export default Signup;
