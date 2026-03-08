import express from 'express';
import cors from 'cors';
import { createServer } from 'http';


const app = express();
const httpServer = createServer(app);



app.use(cors())
app.use(express.json())



import userRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';

app.use('/users', userRouter);
app.use('/messages', messagesRouter);

httpServer.listen(3000);