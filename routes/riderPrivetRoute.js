const router=require('express').Router();
const conn=require('../database');
const auth=require('./auth')

router.put('/update-location',auth,(req,res) =>
{
    const newLocation=req.body.currentLocation
    const username=res.user.username

    // check if the username already exsist or not
    const sql="UPDATE `riders` SET `location`="+newLocation+" WHERE `username`='"+username+"'"
    conn.query(sql,async (err,result) =>
    {
        if(err) throw err;
        if(result.length==0)
        {
            // the username does not exsist
            res.status(201).send({error: "Invalid"})
        } else
        {
            // the username exsist now run the query
            res.status(200).send({
                result
            })
        }
    })
})

module.exports=router