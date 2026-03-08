import express from 'express';
const router = express.Router();
import db from '../db.js';


router.post('/createroom', async(req, res) => {
    let {userId, roomLogin} = req.body;
    try{
        const [users] = await db.execute("SELECT * FROM users WHERE login = ?", [roomLogin]);
        if (users.length === 0){
            res.status(401).send({message: "User not found"});
            console.log("User not found");
        }
        else{
            const [id] = await db.execute("SELECT user_id FROM users WHERE login = ?", [roomLogin])
            const id2 = id[0].user_id;
            if (id2 === userId){
                res.status(401).send({message: "Can't create a room with yourself"});
            }
            else{
                const [rows] = await db.execute('SELECT * FROM rooms WHERE (user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?)', [userId, id2, id2, userId]);
                if (rows.length === 0){
                    await db.execute('INSERT INTO rooms (user1_id, user2_id) VALUES(?, ?)', [userId, id2])
                    const [roomIdList] = await db.execute('SELECT room_id FROM rooms WHERE (user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?)', [userId, id2, id2, userId])
                    const roomId = roomIdList[0].room_id;
                    res.status(200).json({roomId: roomId, message: "Room created successfully."})
                    console.log("Room created")
                }
                else{
                    const [roomIdList] = await db.execute('SELECT room_id FROM rooms WHERE (user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?)', [userId, id2, id2, userId])
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