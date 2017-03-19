const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  console.log('hi');
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + '/chat.html');
});

const users = { };

// Sockets
io.on('connection', (socket) => {
  console.log(socket.id, ' has connected..');
  console.log('Users: ', users);

  socket.on('new user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('update users', name);
  });

  socket.on('connect', () => {
    console.log('user connected');
    io.emit('connect');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', users[socket.id], msg);
  });

  socket.on('disconnect', () => {
    console.log(socket.id, 'has disconnected..');
    const name = users[socket.id];
    delete users[socket.id];
    console.log('Users: ', users);

    io.emit('disconnect', name, users);
  });
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
