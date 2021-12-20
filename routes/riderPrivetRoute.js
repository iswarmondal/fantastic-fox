const router=require('express').Router();
const auth=require('./auth')

router.put('/update-location',auth,(req,res) =>
{
    const data={
        location: req.currentLocation
    }
    res.send(res.user)
})

module.exports=router