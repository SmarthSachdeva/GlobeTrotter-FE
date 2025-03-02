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

    let authToken = localStorage.getItem("authToken");

    console.log("Auth Token:", authToken); // ✅ Debugging Step

    if (!authToken) {
      setError("You need to log in to view the leaderboard.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/leaderboard/top?limit=${selectedLimit}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Response Status:", response.status); // ✅ Debugging Step

      if (response.status === 401) {
        // Try refreshing the token (if supported by backend)
        authToken = await refreshToken();
        if (!authToken) return;

        // Retry API call with refreshed token
        return fetchLeaderboard(selectedLimit);
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Leaderboard Data:", data); // ✅ Debugging Step

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

  // 🔄 Token Refresh Function (Only works if backend supports refresh tokens)
  const refreshToken = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Required if refresh token is stored in HTTP-only cookies
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.accessToken);
        console.log("Token refreshed successfully!");
        return data.accessToken;
      } else {
        console.error("Failed to refresh token. Logging out.");
        handleLogout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
    }
    return null;
  };

  // 🚪 Logout function (Clears session and redirects user)
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    alert("Session expired. Please log in again.");
    navigate("/login");
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
