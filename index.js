const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    // test용
    res.sendFile(__dirname + '/index.html')
});
let a = 0;
io.on('connection', (socket) => {
    console.log('1 user connected');
    console.log(socket.id);
    a++;
    socket.join("room" + a);
    console.log(socket.rooms);

    // 나를 제외
    socket.broadcast.emit('어서오세요');

    // 모두
    io.emit('어서와라');
    
    socket.on('disconnect', () => {
        console.log('1 user disconnect');
    })

    socket.on('chat message', (msg) => {
        console.log(msg);
        io.emit('chat all', msg);
        io.to("room1").emit('room1', '여긴 룸1이양');
    });


});

server.listen(3000, () => {
    console.log('listening on 3000');
});