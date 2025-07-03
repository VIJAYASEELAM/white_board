import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Toolbar from './Toolbar';

function Whiteboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const ctxRef = useRef(null);
  const socketRef = useRef(null); // ✅ Store socket here

  const [color, setColor] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const handleLeaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
      socketRef.current.disconnect();
    }
    navigate('/');
  };
 const handleClearCanvas = () => {
  const ctx = canvasRef.current.getContext('2d');
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  if (socketRef.current) {
    socketRef.current.emit('clear-canvas', roomId); // ✅ Correct reference
  }
};


  useEffect(() => {
    const socket = io('http://localhost:5000'); // ✅ create inside useEffect
    socketRef.current = socket;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctxRef.current = ctx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    socket.emit('join-room', roomId); // ✅ join room
      socket.on('clear-canvas', () => {
  const ctx = canvasRef.current.getContext('2d');
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
});

   const startDrawing = (e) => {
  isDrawing.current = true;

  // ✅ Apply the latest color and width before drawing
  ctxRef.current.strokeStyle = color;
  ctxRef.current.lineWidth = strokeWidth;

  ctxRef.current.beginPath();
  ctxRef.current.moveTo(e.clientX, e.clientY);

  socketRef.current.emit('draw', {
    x: e.clientX,
    y: e.clientY,
    type: 'begin',
    color,
    strokeWidth,
    roomId,

  });

};

    const draw = (e) => {
  if (!isDrawing.current) return;

  // ✅ Ensure context is using latest settings
  ctxRef.current.strokeStyle = color;
  ctxRef.current.lineWidth = strokeWidth;

  ctxRef.current.lineTo(e.clientX, e.clientY);
  ctxRef.current.stroke();

  socketRef.current.emit('draw', {
    x: e.clientX,
    y: e.clientY,
    type: 'draw',
    color,
    strokeWidth,
    roomId,
  });
};


    const stopDrawing = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    socket.on('draw', (data) => {
      if (data.roomId !== roomId) return;
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.strokeWidth;

      if (data.type === 'begin') {
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
      } else {
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
      }
    });

    return () => {
      socket.emit('leave-room', roomId);
      socket.off('draw');
      socket.disconnect();
    };
  }, [roomId, color, strokeWidth]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleLeaveRoom}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '10px 15px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 9999,
        }}
      >
        Leave Room
      </button>

      <Toolbar
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
      />

      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid black',
          display: 'block',
          backgroundColor: 'white',
          marginTop: '50px',
        }}
      />
      <button
  onClick={handleClearCanvas}
  style={{
    position: 'absolute',
    top: '10px',
    right: '120px',
    padding: '10px 15px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 9999,
  }}
>
  Clear Canvas
</button>

    </div>
  );
}

export default Whiteboard;
