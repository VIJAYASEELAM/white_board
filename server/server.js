const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // 👈 new
const { Server } = require('socket.io'); // 👈 new


const app = express();
const PORT = process.env.PORT || 5000;
const roomRoutes = require('./routes/RoomRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRoutes);

// DB connection
const MONGO_URI = 'mongodb+srv://whiteboard:gamer@cluster0.hvxstlk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB error:', err));

// Create HTTP server from Express app
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  
}

});


// Socket.io connection
io.on('connection', socket => {
  socket.on('join-room', roomId => {
    socket.join(roomId);
    console.log(`🔵 ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', roomId => {
    socket.leave(roomId);
    console.log(`🔴 ${socket.id} left room ${roomId}`);
  });
socket.on('clear-canvas', (roomId) => {
  socket.to(roomId).emit('clear-canvas'); // broadcast to all others
});

  socket.on('draw', ({ roomId, ...data }) => {
    socket.to(roomId).emit('draw', { ...data, roomId });
  });

  socket.on('disconnect', () => {
    console.log(`⚪ ${socket.id} disconnected`);
  });
});


// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
