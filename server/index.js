const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let userSockets = new Map();     // username -> socket.id
let onlineUsers = new Map();     // socket.id -> username

io.on('connection', (socket) => {
  console.log(`🔌 Connected: ${socket.id}`);

  // ✅ This is where 'socket' is defined — keep all socket.on(...) inside here

  socket.on('register', (username) => {
    userSockets.set(username, socket.id);
    onlineUsers.set(socket.id, username);
    io.emit('onlineUsers', Array.from(userSockets.keys()));
  });

  socket.on('privateMessage', ({ to, from, message }) => {
    const targetSocketId = userSockets.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('privateMessage', {
        from,
        message,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('message', (data) => {
    io.emit('message', {
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    userSockets.delete(username);
    onlineUsers.delete(socket.id);
    io.emit('onlineUsers', Array.from(userSockets.keys()));
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});