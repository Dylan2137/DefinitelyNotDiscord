import express from 'express';
const router = express.Router();
import db from '../db.js';

router.post('/friend-request', async(req, res) => {
    let {userId, targetLogin} = req.body;
    try{
        const [users] = await db.execute("SELECT user_id FROM users WHERE login = ?", [targetLogin]);
        if (users.length === 0){
            res.status(401).send({message: "User not found"});
            console.log("User not found");
        }
        else{
            const targetId = users[0].user_id;
            if (targetId === userId){
                res.status(401).send({message: "Can't send a friend request to yourself"});
            }
            else{
                const [rooms] = await db.execute('SELECT * FROM rooms WHERE (user1_id = ? AND user2_id = ?)', [Math.min(userId, targetId), Math.max(userId, targetId)]);
                const [requests] = await db.execute('SELECT * FROM friend_requests WHERE (sender_id = ? AND target_id = ?) OR (sender_id = ? AND target_id = ?)', [userId, targetId, targetId, userId]);
                if (rooms.length === 0 && requests.length === 0){
                    await db.execute('INSERT INTO friend_requests (sender_id, target_id) VALUES(?, ?)',  [userId, targetId]);

                    res.status(200).json({message: "Request sent successfully."})
                }
                else if (rooms.length > 0){
                    res.status(401).json({message: "You are already friends"});
                }
                else if (requests.length > 0){
                    res.status(401).json({message: "Request has already been sent."})
                }

            }

        }


    }
    catch(err){
        res.status(500).json({message: err});
        console.log(err)
    }
});

router.post('/get-friends', async(req, res) => {
    let {userId} = req.body;
    try{
        const [friends] = await db.execute("SELECT room_id, login FROM rooms JOIN users ON (users.user_id = rooms.user1_id) OR (users.user_id = rooms.user2_id) WHERE rooms.user1_id = ? OR rooms.user2_id = ?", [userId, userId]);
        res.status(200).json(friends);
    }
    catch(err){
        res.status(500).json({message: err});
        console.log(err)
    }
})
router.post('/get-requests', async(req, res) => {
    let {userId} = req.body;
    try{
        const [requests] = await db.execute("SELECT login, req_id, sender_id FROM friend_requests JOIN users ON users.user_id = friend_requests.sender_id WHERE friend_requests.target_id = ?", [userId]);
        res.status(200).json(requests);
    }
    catch(err){
        res.status(500).json({message: err});
    }

})
router.post('/accept-request', async(req, res) => {
    let {senderId, userId, requestId} = req.body;
    try{
        await db.execute("INSERT INTO rooms (user1_id, user2_id) VALUES(?, ?)", [Math.min(senderId, userId), Math.max(senderId, userId)]);
        await db.execute("DELETE FROM friend_requests WHERE req_id = ?", [requestId]);
    }
    catch(err){
        res.status(500).json({message: err});
    }
})
export default router;