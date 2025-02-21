const express = require('express');
const { submitScore, getLeaderboard } = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/submit-score', authMiddleware, submitScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
