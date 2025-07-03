const mongoose = require('mongoose');

const drawingCommandSchema = new mongoose.Schema({
  type: String, // 'stroke' or 'clear'
  data: Object, // stroke path, color, width etc.
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  drawingData: [drawingCommandSchema]
});

module.exports = mongoose.model('Room', roomSchema);
