const router=require('express').Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();

// import the database
const conn=require('../database');

// get all riders
router.get("/riders",(req,res) =>
{

    const sql="SELECT `location` FROM `riders`";
    conn.query(sql,(err,result) =>
    {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200,"error": null,"response": result}))
    })
})

// new rider registration
router.post('/new-rider',async (req,res) =>
{
    // GENERATE A HASH OF THE PASSWORD
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(req.body.password,salt)

    const data={
        username: req.body.username,
        password: hash
    };

    // Check if the username already exsist or not
    let checkSQL="SELECT * FROM `riders` WHERE `username`=?";
    conn.query(checkSQL,data.username,(err,resultData) =>
    {
        if(err) throw err;
        if(resultData.length==0)
        {
            // Username does not exsist so add new user
            let sql="INSERT INTO `riders` SET ?";
            conn.query(sql,data,(err,result) =>
            {
                if(err) throw err;
                res.send(JSON.stringify({"status": 200,"error": null,"effectedID": result.insertId}))
            });
        } else
        {
            // Username exsist so send an object with error message
            res.status(400).send({error: "Username already exsist"})
        }
    })

})

// rider login
router.post('/rider-login',async (req,res) =>
{
    const data={
        username: req.body.username,
        password: req.body.password
    };

    // check if the username exsist or not
    let checkSQL="SELECT * FROM `riders` WHERE `username`=?";
    conn.query(checkSQL,data.username,(err,resultData) =>
    {
        if(err) throw err;
        if(resultData.length==0)
        {
            // Username does not exsist so return an error message
            res.status(201).send({error: "Username or password invalid"});
        } else
        {
            // Username does exsist so check the password
            let sql="SELECT `password` FROM `riders` WHERE `username` = ?";
            conn.query(sql,data.username,async (err,results) =>
            {
                if(err) throw err;

                // validate the password if it's correct or not
                const validPass=await bcrypt.compare(data.password,results[0].password)
                if(!validPass)
                {
                    // The password is wrong
                    res.status(400).send({error: "Username or password invalid"})
                } else
                {
                    // the password is correct so sign a JWT and send it to the user
                    const token=jwt.sign({"username": data.username},process.env.TOKEN_SECRET)
                    res.header('auth-token',token).status(200).send(token)
                }
            })
        }
    })
})

module.exports=router;