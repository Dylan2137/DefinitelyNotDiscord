import express from 'express';
const router = express.Router();
import db from '../db.js';

router.post('/add-gif', async(req, res) => {
    const userId = req.body.userId;
    const gifPath = req.body.gifPath;
    try{
        const [rows] = await db.execute('SELECT * FROM gifs WHERE user_id = ? AND gifs LIKE CONCAT("%", ?, ";%")',[userId, gifPath] );
        if (rows.length > 0){
            res.status(500).json({message: "Gif already saved"})
        }
        else{
            await db.execute("UPDATE gifs SET gifs = CONCAT(gifs, ?, ';') WHERE user_id = ?", [gifPath, userId]);
            res.status(200).json({message: "Gif saved successfully"})
        }
    }
    catch(err){
        res.status(500).json({message: "Internal server error"})
        console.log(err);
    }
});
router.post('/get-gifs', async(req, res) => {
    const userId = req.body.userId;
    try{
        const [gifs] = await db.execute("SELECT gifs FROM gifs WHERE user_id = ?", [userId]);
        res.status(200).json(gifs[0].gifs);
        console.log(gifs[0].gifs);
    }catch(err){
        res.status(500).json({message: err})
    }


})
export default router;