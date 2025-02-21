import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameBoard from './component/GameBoard';
import LeaderboardPage from './component/LeaderboardPage';
import Login from './component/Login';
import Signup from './component/Signup';
import FrontPage from './component/FrontPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/GameBoard" element={<GameBoard />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
