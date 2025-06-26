const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const ChatMessage = require('./models/ChatMessage');

const app = express();
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.com']
    : 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('API Running'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const vibesRoutes = require('./routes/vibes');
app.use('/api/vibes', vibesRoutes);

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.com']
      : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', async (vibeId) => {
    socket.join(vibeId);
    // Send chat history
    const messages = await ChatMessage.find({ vibeId }).sort({ createdAt: 1 }).limit(100);
    socket.emit('chatHistory', messages);
  });

  socket.on('chatMessage', async ({ vibeId, userId, username, message }) => {
    const chatMsg = new ChatMessage({ vibeId, userId, username, message });
    await chatMsg.save();
    io.to(vibeId).emit('chatMessage', chatMsg);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 