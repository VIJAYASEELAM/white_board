import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RoomJoin() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomId.trim()) return alert('Please enter room code');

    try {
      const res = await axios.post('http://localhost:5000/api/rooms/join', { roomId });
      console.log('✅ Joined room:', res.data);
      navigate(`/room/${roomId}`); // move to Whiteboard
    } catch (err) {
      console.error('❌ Error joining room:', err);
      alert('Could not join room.');
    }
  };

  return (
    <div>
      <h2>Join Whiteboard Room</h2>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}

export default RoomJoin;
