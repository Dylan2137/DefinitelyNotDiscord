import express from 'express';
const router = express.Router();
import db from '../db.js';
import upload from '../upload.js';



router.post('/get-messages', async(req, res) => {
    let {roomId} = req.body;
    try{
        const [messages] = await db.execute("SELECT message_content as text, login as sender, profile_picture as pfp, isPhoto FROM messages JOIN users ON messages.user_id = users.user_id WHERE room_id = ?", [roomId]);
        res.status(200).json({messages: messages});
    }
    catch(err){
        res.status(500).json({message: "Problem engine kaput"});
        console.log(err)

    }
})
router.post('/send-photo', upload.single('photo'), async(req, res) => {
    const userId = req.body.userId;
    const photoPath = `/uploads/${req.file.filename}`;
    const roomId = req.body.roomId;

    try {
        await db.execute("INSERT INTO messages (room_id, user_id, message_content, isPhoto) VALUES (?, ?, ?, true)", [roomId, userId, photoPath]);
        res.json({ message: "Photo uploaded successfully", path: photoPath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
export default router;