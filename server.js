const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
 
//middleware
app.use(express.json())
app.use(cors())

// Connect to MongoDB
const connectionString = process.env.CONNECTIONSTRING;
console.log(connectionString)