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
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined ${roomId}`);
    });

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

app.use('/users', userRouter);
app.use('/messages', messagesRouter);

httpServer.listen(3000);