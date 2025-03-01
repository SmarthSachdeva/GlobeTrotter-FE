import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeFriendModal from "./ChallengeFriendModal";
import "./WelcomePage.css"; // Import the CSS file

const WelcomePage = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Guest";
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">WELCOME TO Globetrotter</h1>
      <p className="welcome-email">Your Email: <strong>{userEmail}</strong></p>

      <div className="button-container">
        <button className="welcome-button" onClick={() => navigate("/quiz")}>Play Game</button>
        <button className="welcome-button" onClick={() => setShowModal(true)}>Challenge Your Friend</button>
        <button className="welcome-button" onClick={() => navigate("/leaderboard")}>View Leaderboard</button>
      </div>

      {showModal && <ChallengeFriendModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default WelcomePage;
