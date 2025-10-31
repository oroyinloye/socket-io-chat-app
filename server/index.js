require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
app.get('/', (req, res) => {
  res.send('✅ Backend is live!');
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
  origin: 'http://localhost:3000', // allow requests from React frontend
  methods: ['GET', 'POST'],
}));

const messageRoutes = require('./routes/messageRoutes');

app.use(express.json());
app.use('/api', messageRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is live and reachable!');
});

