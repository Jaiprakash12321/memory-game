const Game = require('../models/Game');

exports.submitScore = async (req, res) => {
  try {
    const { userId, score, moves, time } = req.body;
    const newGame = new Game({ userId, score, moves, time });
    await newGame.save();
    res.status(201).json({ message: 'Score submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Game.find().sort({ score: -1 }).limit(10).populate('userId', 'username');
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
