const mysql=require('mysql');

const conn=mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectionLimit: 10
})

module.exports=conn;