const express = require('express');
const router = express.Router();
const Room = require('../models/Room');


// POST /api/rooms/join
router.post('/join', async (req, res) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      // Create a new room if it doesn't exist
      room = new Room({ roomId });
      await room.save();
    }

    res.json(room);
  } catch (err) {
    console.error('Error joining room:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
