import { useEffect, useState } from "react";
import { BASE_URL } from "../constants"; 
import "./Leaderboard.css"; 

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchLeaderboard(limit);
  }, [limit]);

  const fetchLeaderboard = async (selectedLimit) => {
    try {
      const response = await fetch(`${BASE_URL}/leaderboard/top?limit=${selectedLimit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>

      <label>Show Top:</label>
      <select onChange={(e) => setLimit(e.target.value)} value={limit}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>

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
    </div>
  );
}

export default Leaderboard;
