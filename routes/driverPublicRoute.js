const router=require('express').Router();
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config();

// import the database
const conn=require('../database')

// get all the drivers
router.get('/drivers',(req,res) =>
{
    const sql="SELECT `location` FROM `drivers`"
    conn.query(sql,(err,result) =>
    {
        if(err) throw err;
        res.status(200).send({"response": result})
    })
})

// add new driver
router.post('/new-driver',(req,res) =>
{
    const data={
        username: req.body.username,
        password: req.body.password
    }

    // check if the username already exsist
    let checkSQL="SELECT * FROM `drivers` WHERE `username`=?";
    conn.query(checkSQL,data.username,async (err,resultData) =>
    {
        if(err) throw err;
        if(resultData.length==0)
        {
            // hash the password
            const salt=await bcrypt.genSalt(10)
            const hash=await bcrypt.hash(data.password,salt)
            data.password=hash;

            // Username does not exsist so add new user
            let sql="INSERT INTO `drivers` SET ?";
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

// driver login
router.post('/driver-login',(req,res) =>
{
    const data={
        username: req.body.username,
        password: req.body.password
    }

    // check if the username exsist
    let sql="SELECT `username`,`password` FROM `drivers` WHERE `username`=?"
    conn.query(sql,data.username,async (err,result) =>
    {
        if(err) throw err
        if(result.length==0)
        {
            // the username does not exsist, return an error message
            res.status(201).send({error: "Username or password invalid"})
        } else
        {
            // the username exsist, now check the password
            const validPass=await bcrypt.compare(data.password,result[0].password)

            if(validPass)
            {
                // generate a jwt token
                const token=jwt.sign({username: result[0].username},process.env.TOKEN_SECRET)

                res.status(200).header({"auth-token": token}).send({msg: "Welcome back"})
            } else
            {
                res.status(201).send({error: "Username or password invalid"})

            }
        }
    })
})

module.exports=router