import express from 'express';
const router = express.Router();
import db from '../db.js';

router.post('/friend-request', async(req, res) => {
    const {userId, targetLogin} = req.body;
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
    const {userId, login} = req.body;
    try{

        const [friends] = await db.execute("SELECT room_id, login, user_id, profile_picture FROM rooms JOIN users ON (users.user_id = rooms.user1_id) OR (users.user_id = rooms.user2_id) WHERE (rooms.user1_id = ? OR rooms.user2_id = ?) AND login != ? AND isGroup = false", [userId, userId, login]);
        const [groups] = await db.execute('SELECT member_ids, room_id FROM rooms WHERE isGroup = true AND member_ids LIKE CONCAT("%", ?, "/%") OR member_ids LIKE CONCAT("%/", ?)', [userId, userId]);
        let groupMembers = [];
        for (let x in groups){
            let memberIds = groups[x].member_ids.split('/');
            let memberLogins = [];
            for (let y in memberIds){
                let memberLogin = await db.execute("SELECT login FROM users WHERE user_id = ?", [memberIds[y]])
                memberLogins.push(memberLogin[0][0].login);
            }
            console.log(memberLogins);
            groupMembers.push({roomId: groups[x].room_id, members: memberLogins})
        }
        console.log(groupMembers[0]);
        res.status(200).json({friends: friends, groups: groupMembers});
    }
    catch(err){
        res.status(500).json({message: err});
        console.log(err)
    }
})
router.post('/get-requests', async(req, res) => {
    const {userId} = req.body;
    try{
        const [requests] = await db.execute("SELECT login, req_id, sender_id FROM friend_requests JOIN users ON users.user_id = friend_requests.sender_id WHERE friend_requests.target_id = ?", [userId]);
        res.status(200).json(requests);
    }
    catch(err){
        res.status(500).json({message: err});
    }

})
router.post('/accept-request', async(req, res) => {
    const {senderId, userId, requestId} = req.body;
    try{
        await db.execute("DELETE FROM friend_requests WHERE req_id = ?", [requestId]);
        await db.execute('INSERT INTO rooms (user1_id, user2_id, isGroup, member_ids) VALUES(?, ?, false, "")', [Math.min(senderId, userId), Math.max(senderId, userId)]);
        res.status(200).json({message: "Request accepted successfully."})

    }
    catch(err){
        res.status(500).json({message: err});
    }
})
router.post('/reject-request', async(req, res) => {
    const {requestId} = req.body;
    try{
        await db.execute("DELETE FROM friend_requests WHERE req_id = ?", [requestId]);
        res.status(200).json({message: "Request rejected."})
    }
    catch(err){
        res.status(500).json({message: err});
    }
})
router.post('/create-group', async(req, res) => {
    const {members} = req.body;
    console.log(members);
    let memberIdArr = [];
    for(let x in members){
        memberIdArr.push(members[x].user_id);
    }
    memberIdArr = memberIdArr.sort();
    console.log(memberIdArr);
    const memberIds = memberIdArr.join('/');
    console.log(memberIds);
    try{
        const [rows] = await db.execute('SELECT * FROM rooms WHERE isGroup AND member_ids = ?', [memberIds])
        if (rows.length === 0){
            await db.execute('INSERT INTO rooms (user1_id, user2_id, isGroup, member_ids) VALUES(0, 0, true, ?)', [memberIds]);
            res.status(200).json({message: "Group created successfully."})
        }
        else{
            res.status(500).json({message: "Group already exists."})
        }

    }
    catch(err){
        res.status(500).json({message: "Problem engine kaput"});
        console.log(err);
    }

})
export default router;