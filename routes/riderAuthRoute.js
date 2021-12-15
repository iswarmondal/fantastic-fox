const router=require('express').Router();

router.get("/login",(req,res) =>
{
    res.send({message: 'Hello WWW!'});
})

router.get("/register",(req,res) =>
{
    res.send("Holla! You can also become a hero")
})

module.exports=router