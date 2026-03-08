import express from 'express';
const router = express.Router();
import db from '../db.js';
import bcrypt from 'bcrypt';

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
                        res.status(201).json({message: 'Login successful', userId: rows[0].user_id})
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

