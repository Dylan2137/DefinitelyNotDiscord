import express from 'express';
const router = express.Router();
import db from '../db.js';




router.post('/get-messages', async(req, res) => {
    let {roomId} = req.body;
    try{
        const [messages] = await db.execute("SELECT message_content as text, login  as sender FROM messages JOIN users ON messages.user_id = users.user_id WHERE room_id = ?", [roomId]);
        res.status(200).json(messages);
    }
    catch(err){
        res.status(500).json({message: "Problem engine kaput"});
        console.log(err)

    }
})
export default router;