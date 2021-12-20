const jwt=require('jsonwebtoken')

module.exports=(req,res,next) =>
{
    const token=req.header('auth-token')

    if(!token) res.status(401).send({error: "Access denied!"})

    try
    {
        const verified=jwt.verify(token,process.env.TOKEN_SECRET)
        res.user=verified
        next()
    } catch(error)
    {
        console.warn(error)
        res.status(400).send({error: "Invalid token"})
    }
}