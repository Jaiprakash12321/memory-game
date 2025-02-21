import React, { useState, useEffect } from 'react';
import Card from './Card';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler'; // Import Howler for sound effects
import './GameBoard.css';

function GameBoard() {
  const cardIcons = ['🍎', '🍌', '🍓', '🍇', '🥝', '🍍', '🍒', '🍉', '🐍', '🍑', '🥥', '🥭'];

  const difficultyLevels = {
    easy: { gridSize: 4, timeLimit: 60 },
    medium: { gridSize: 6, timeLimit: 120 },
    hard: { gridSize: 8, timeLimit: 180 },
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  // Sound effects
  const flipSound = new Howl({ src: ['page_flip.mp3'] });
  const matchSound = new Howl({ src: ['match_sound.mp3'] });
  const errorSound = new Howl({ src: ['error_sound.mp3'] });
  const winSound = new Howl({ src: ['win_sound.mp3'] });

  // State variables
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLimit, setTimeLimit] = useState(difficultyLevels[difficulty].timeLimit);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState(
    JSON.parse(localStorage.getItem('leaderboard')) || []
  );

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Function to create and shuffle the deck
  function createShuffledDeck(gridSize) {
    const selectedIcons = cardIcons.slice(0, (gridSize * gridSize) / 2);
    const deck = [...selectedIcons, ...selectedIcons]
      .map((icon, index) => ({ id: index, icon, matched: false }))
      .sort(() => Math.random() - 0.5);
    return deck;
  }

  // Timer functionality
  useEffect(() => {
    let interval;
    if (gameStarted) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev + 1 >= timeLimit) {
            setGameStarted(false);
            setShowPopup(true);
            clearInterval(interval);
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLimit]);

  // Reset the game when difficulty changes
  useEffect(() => {
    const { gridSize, timeLimit } = difficultyLevels[difficulty];
    setCards(createShuffledDeck(gridSize));
    setTimer(0);
    setTimeLimit(timeLimit);
    setGameStarted(false);
    setMoveCount(0);
    setShowPopup(false);
    setFlippedCards([]);
  }, [difficulty]);

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      winSound.play(); // Play win sound
      setGameStarted(false);
      setShowPopup(true);
    }
  }, [cards]);

  function handleFlip(card) {
    if (flippedCards.length === 2 || flippedCards.some((c) => c.id === card.id)) return;
    if (!gameStarted) setGameStarted(true);

    flipSound.play(); // Play flip sound
    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (first.icon === second.icon) {
        matchSound.play(); // Play match sound
        setCards((prev) =>
          prev.map((c) => (c.icon === first.icon ? { ...c, matched: true } : c))
        );
      } else {
        errorSound.play(); // Play error sound
      }
      setMoveCount((prev) => prev + 1);
      setTimeout(() => setFlippedCards([]), 1500);
    }
  }

  function restartGame() {
    const { gridSize } = difficultyLevels[difficulty];
    setCards(createShuffledDeck(gridSize));
    setFlippedCards([]);
    setMoveCount(0);
    setTimer(0);
    setGameStarted(false);
    setShowPopup(false);
  }

  function saveToLeaderboard() {
    if (!playerName.trim()) return;

    const newEntry = { name: playerName.trim(), time: timer, moves: moveCount };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => a.time - b.time);

    // Save to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));

    // Update local state
    setLeaderboard(updatedLeaderboard);

    setPlayerName('');
  }

  // Navigation for leaderboard
  const navigate = useNavigate();
  const goToLeaderboard = () => navigate('/leaderboard');

  return (
    <div className="game-board">
      <h1 className="game-title">Memory Game</h1>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      <div className="info">
        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <p>Moves: {moveCount}</p>
        <p>Time: {timer} / {timeLimit} seconds</p>
        <button onClick={restartGame}>Restart Game</button>
        <button onClick={goToLeaderboard}>Go to Leaderboard</button>
      </div>

      {showPopup && (
        <Popup onClose={() => setShowPopup(false)}>
          <h2>{timer >= timeLimit ? 'Time Up!' : 'Congratulations!'}</h2>
          <p>
            {timer >= timeLimit
              ? 'You ran out of time.'
              : `You completed the game in ${timer} seconds with ${moveCount} moves.`}
          </p>
          {timer < timeLimit && (
            <>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button
                onClick={() => {
                  saveToLeaderboard();
                  restartGame();
                }}
              >
                Save & Restart
              </button>
            </>
          )}
        </Popup>
      )}

      <div
        className="card-container"
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: `repeat(${difficultyLevels[difficulty].gridSize}, 1fr)`,
          justifyContent: 'center',
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={flippedCards.includes(card) || card.matched}
            handleFlip={handleFlip}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
