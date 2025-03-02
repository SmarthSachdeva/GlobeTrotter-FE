import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom"; // Redirect on unauthorized error
import "./Leaderboard.css";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Used to redirect user to login page if unauthorized

  useEffect(() => {
    fetchLeaderboard(limit);
  }, [limit]);

  const fetchLeaderboard = async (selectedLimit) => {
    setLoading(true);
    setError(null);

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("You need to log in to view the leaderboard.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/leaderboard/top?limit=${selectedLimit}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Ensure correct format
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("authToken"); // Clear invalid token
        alert("Session expired. Please log in again.");
        navigate("/login"); // Redirect to login
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from API");
      }

      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(error.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>

      <label>Show Top:</label>
      <select onChange={(e) => setLimit(parseInt(e.target.value, 10))} value={limit}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>

      {loading && <p>Loading leaderboard...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && leaderboard.length === 0 && <p>No leaderboard data available.</p>}

      {!loading && !error && leaderboard.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player) => (
              <tr key={player.userId}>
                <td>{player.rank}</td>
                <td>{player.username}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
