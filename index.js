const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

// 룸 라우터
app.get(`/:id`, (req, res) => {
    res.sendFile(__dirname + '/index.html')
    //console.log(req.params.id);
});

// 소켓(유저) 서버에 들어옴
io.on('connection', (socket) => {
    console.log(`${socket.id}이 들어왔다.`);

    // 서버에 접속한 모두에게 보냄(ex.공지)
    io.emit('민트 공지: 화이팅');

    // 룸 접속
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        // 소켓 포함 모두에게
        //io.to(roomId).emit('message', `${socket.id}님이 접속하셨습니다.`);
        // 소켓 제외
        socket.broadcast.to(roomId).emit('message', `${socket.id}님이 접속하셨습니다.`);
    });

    // !!! 메시지
    socket.on('message', (roomId, msg) => {
        console.log(msg);
        io.to(roomId).emit('message', msg);
    });

    // 룸에서 나갈때
    socket.on('disconnecting', () => {
        console.log(socket.rooms);
        //if(socket.rooms)
        console.log(socket.rooms);
        socket.broadcast.to(socket.roomId).emit('message', `${socket.id}님이 나갔습니다.`);
    })

    // 서버에서 나갈때
    socket.on('disconnect', () => {
        if(socket.rooms.size === 0){
            console.log(`${socket.id}이 아예 나갔습니다..`);
        }
    })
});

server.listen(3000, () => {
    console.log('listening on 3000');
});