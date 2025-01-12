const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const allowedOrigins = [
  // 'http://localhost:4200', 
  'https://live-room-chat.netlify.app',
];

// folders
const { socketMethods } = require('./sockets/socket')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Angular's default development server
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

app.use(cors({
  origin: allowedOrigins, // Allow your Angular app
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// / Pass `io` to the socketMethods function
socketMethods(io);

const PORT = process.env.PORT || 3000;

server.listen( PORT, () => {
  console.log('Server is running on http://localhost:3000');
});
