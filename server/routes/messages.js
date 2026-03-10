import express from 'express';
const router = express.Router();
import db from '../db.js';


router.post('/createroom', async(req, res) => {
    let {userId, roomLogin} = req.body;
    try{
        const [users] = await db.execute("SELECT user_id FROM users WHERE login = ?", [roomLogin]);
        if (users.length === 0){
            res.status(401).send({message: "User not found"});
            console.log("User not found");
        }
        else{
            const id2 = users[0].user_id;
            if (id2 === userId){
                res.status(401).send({message: "Can't create a room with yourself"});
            }
            else{
                const [rows] = await db.execute('SELECT * FROM rooms WHERE (user1_id = ? AND user2_id = ?)', [Math.min(userId, id2), Math.max(userId, id2)]);
                if (rows.length === 0){
                    await db.execute('INSERT INTO rooms (user1_id, user2_id) VALUES(?, ?)',  [Math.min(userId, id2), Math.max(userId, id2)])
                    const [roomIdList] = await db.execute('SELECT room_id FROM rooms WHERE (user1_id = ? AND user2_id = ?)', [Math.min(userId, id2), Math.max(userId, id2)])
                    const roomId = roomIdList[0].room_id;
                    res.status(200).json({roomId: roomId, message: "Room created successfully."})
                    console.log("Room created")
                }
                else{
                    const [roomIdList] = await db.execute('SELECT room_id FROM rooms WHERE (user1_id = ? AND user2_id = ?)', [Math.min(userId, id2), Math.max(userId, id2)])
                    const roomId = roomIdList[0].room_id;
                    res.status(200).json({roomId: roomId, message: "Room found, putting you into room"})
                    console.log("Room found successfully.")
                }
            }

        }


    }
    catch(err){
        res.status(500).json({message: err});
        console.log(err)
    }
})
export default router;