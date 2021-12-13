const express=require('express');
const app=express();
const mysql=require('mysql');
require('dotenv').config()

// import the database connection
const connection=require('./database');
