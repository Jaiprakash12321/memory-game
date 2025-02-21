import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch and sort leaderboard data from localStorage on component mount
  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const sortedLeaderboard = storedLeaderboard.sort((a, b) => a.time - b.time); // Sort by time (ascending)
    setLeaderboard(sortedLeaderboard);
  }, []);

  // Clear leaderboard function
  const clearLeaderboard = () => {
    localStorage.removeItem('leaderboard');
    setLeaderboard([]);
  };

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>
      <ul>
        {leaderboard.length > 0 ? (
          leaderboard.map((entry, index) => (
            <li key={index}>
              {index + 1}. {entry.name} - {entry.time}s, {entry.moves} moves
            </li>
          ))
        ) : (
          <p>No leaderboard entries yet!</p>
        )}
      </ul>

      <div className="buttons">
        <Link to="/">
          <button>Back to Game</button>
        </Link>
        {leaderboard.length > 0 && (
          <button onClick={clearLeaderboard}>Clear Leaderboard</button>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
