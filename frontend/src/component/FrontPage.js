import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';

function FrontPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">Memory Game</h1>
      <p className="description">
        Welcome to the ultimate memory challenge! Log in or sign up to track your scores.
      </p>
      <div className="button-group">
        <button onClick={() => navigate('/login')} className="login-button">
          Login
        </button>
        <button onClick={() => navigate('/signup')} className="signup-button">
          Signup
        </button>
      </div>
      <button
        onClick={() => navigate('/gameboard')}
        className="play-as-guest-button"
      >
        Play as Guest
      </button>
    </div>
  );
}

export default FrontPage;
