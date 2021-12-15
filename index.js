const express=require('express');
const app=express();
require('dotenv').config()

// import the database connection
const conn=require('./database');

// parse JSON from the body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// import the routes
const riderAuthRoute=require('./routes/riderAuthRoute');
const riderPublicRoute=require('./routes/riderPublicRoute');

// home page
app.get('/',(req,res) =>
{
    res.send({message: 'Hello WWW!'});
});

// Route middlewares
app.use("/api/rider",riderAuthRoute);

// Rider public routes
app.use("/api",riderPublicRoute)

// add new driver
app.post('/api/new-driver',(req,res) =>
{
    console.log(req.body);
    const data={
        username: req.body.username,
        password: req.body.password
    };

    let sql="INSERT INTO `drivers` SET ?";
    conn.query(sql,data,(err,result) =>
    {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200,"error": null,"response": result}))
    });
})

// fetch all the users
app.get("/api/drivers",(req,res) =>
{
    const sql="SELECT `username`, `location` FROM `drivers`";
    conn.query(sql,(err,result) =>
    {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200,"error": null,"response": result}))
    })
})

app.listen(3333,() =>
{
    console.log("server is running on port 3333");
})