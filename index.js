const express=require('express');
const app=express();
require('dotenv').config()

// parse JSON from the body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// import the routes
const riderPrivetRoute=require('./routes/riderPrivetRoute');
const riderPublicRoute=require('./routes/riderPublicRoute');

const driverPublicRoute=require('./routes/driverPublicRoute')

// home page
app.get('/',(req,res) =>
{
    res.send({message: 'Hello WWW!'});
});

// Rider privet routes
app.use("/rider",riderPrivetRoute);

// Rider public routes
app.use("/api",riderPublicRoute)

// Driver public routes
app.use("/api",driverPublicRoute)

app.listen(3333,() =>
{
    console.log("server is running on port 3333");
})