import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants"; // Use your constants file

const ChallengeFriendModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");

  const handleInvite = async () => {
    if (!username.trim()) {
      setError("Please enter a valid username.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/v1/addfriend/invite/${username}`);
      if (response.data.inviteLink.includes("Error")) {
        setError("Error generating invite link.");
        setInviteLink("");
        setScore(0);
      } else {
        setInviteLink(response.data.inviteLink);
        setScore(response.data.score);
        setError(""); // Clear any previous errors
      }
    } catch (err) {
      setError("Failed to generate invite link. Try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Challenge a Friend</h2>
        
        <label>Enter Friend's Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username..."
        />
        
        <button onClick={handleInvite}>Generate Invite Link</button>
        
        {error && <p className="error-text">{error}</p>}

        {inviteLink && (
          <div className="invite-section">
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Score:</strong> {score}</p>
            <input type="text" value={inviteLink} readOnly />
            <button onClick={copyToClipboard}>Copy Link</button>
          </div>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ChallengeFriendModal;
