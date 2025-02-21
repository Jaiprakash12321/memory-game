const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true },
  moves: { type: Number, required: true },
  time: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', GameSchema);

