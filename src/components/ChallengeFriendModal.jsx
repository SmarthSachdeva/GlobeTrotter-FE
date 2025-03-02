import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";
import "./ChallengeFriendModal.css";

const ChallengeFriendModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!username.trim()) {
      setError("Please enter a valid username.");
      return;
    }

    setLoading(true);
    setError(""); // Reset errors

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/v1/addfriend/invite/${username}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data); // Debugging

      if (!response.data || !response.data.inviteLink) {
        throw new Error("Invalid response from server.");
      }

      setInviteLink(response.data.inviteLink);
      setScore(response.data.score || 0);
    } catch (err) {
      console.error(
        "Error fetching invite:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to generate invite link. Please try again.");
    } finally {
      setLoading(false);
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

        <button onClick={handleInvite} disabled={loading}>
          {loading ? "Generating..." : "Generate Invite Link"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {inviteLink && (
          <div className="invite-section">
            <p>
              <strong>Username:</strong> {username}
            </p>
            <p>
              <strong>Score:</strong> {score}
            </p>
            <input type="text" value={inviteLink} readOnly />
            <button onClick={copyToClipboard}>Copy Link</button>
          </div>
        )}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ChallengeFriendModal;
