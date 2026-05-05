//server creation + socket functionality

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from './db.js';



const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('identify', (userId) => {
        const personalRoom = `user_${userId}`;
        socket.join(personalRoom);
    });

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined ${roomId}`);
    });

    socket.on('reloadFriends', ({userId, senderId}) => {
        io.to(`user_${userId}`).emit('reloadFriends');
        io.to(`user_${senderId}`).emit('reloadFriends');
        console.log("reloading friends")
    });

    socket.on('reloadRequests', async (targetLogin) => {
        const targetId = await db.execute("SELECT user_id FROM users WHERE login = ?", [targetLogin]);
        io.to(`user_${targetId[0][0].user_id}`).emit('reloadRequests');
        console.log("sending reloading requests")
    })

    socket.on('sendMessage', async (data) => {
        const {roomId, message, senderLogin} = data;
        const userId = await db.execute("SELECT user_id FROM users WHERE login = ?", [senderLogin]);
        await db.execute("INSERT INTO messages (room_id, user_id, message_content) VALUES (?, ?, ?)", [roomId, userId[0][0].user_id, message]);
        io.to(roomId).emit('receiveMessage', {
            text: message,
            sender: senderLogin
        });
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    })


})



app.use(cors())
app.use(express.json())



import userRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import friendsRouter from './routes/friends.js';

app.use('/users', userRouter);
app.use('/messages', messagesRouter);
app.use('/friends', friendsRouter);


httpServer.listen(3000);