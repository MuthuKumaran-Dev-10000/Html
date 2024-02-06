const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Ask for the username
    socket.emit('request username');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('set username', (username) => {
        socket.username = username;
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', { message: data.message, username: socket.username });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
