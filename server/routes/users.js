import express from 'express';
const router = express.Router();
import db from '../db.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

router.use('/uploads', express.static('uploads'));

router.post('/upload-photo', upload.single('photo'), async (req, res) => {
    const userId = req.body.userId;
    const photoPath = `/uploads/${req.file.filename}`;

    try {
        await db.execute("UPDATE users SET profile_picture = ? WHERE user_id = ?", [photoPath, userId]);
        res.json({ message: "Photo uploaded successfully", path: photoPath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/register', async(req, res) => {
    let {login, password} = req.body;
    const saltRounds = 12
    const loginRegex = /^[a-zA-Z0-9_]+$/;
    if (login.length >= 3 && password.length >= 8 && login.length <= 16 && password.length <= 24){
        if (loginRegex.test(login)){
            try{
                const query = 'INSERT INTO users (login, password) VALUES(?, ?)'

                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) throw err;
                    await db.query(query, [login, hash]);
                })
                res.status(201).json({message: 'User successfully registered'})
            }
            catch(err){
                if (err.code === "ER_DUP_ENTRY"){
                    return res.status(400).json({message: 'This login is already taken'})
                }
                console.log(err);
                res.status(500).json({message: 'Internal Server Error'})

            }
        }
        else{
            res.status(400).json({message: 'Login must follow A-z 0-9 _'})
        }

    }
    else{
        res.status(401).json({message: 'Login must be at least 3-16 chars, password must be 8-24 chars'})
    }

})

router.post('/login', async (req, res) => {
    const {login, password} = req.body;

    try{
        const query = 'SELECT * FROM users WHERE login=?';
        const [rows] = await db.query(query, [login]);
        if (rows.length === 0){
            res.status(401).json({message: 'Login incorrect'})
        }
        else
        {
            bcrypt.compare(password, rows[0].password)
                .then(result => {
                    if (result) {
                        res.status(201).json({message: 'Login successful', userId: rows[0].user_id, pfp: rows[0].profile_picture})
                    }else{
                        res.status(401).json({message: 'Password incorrect'})
                    }
                })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal Server Error'})
    }

})

export default router;

