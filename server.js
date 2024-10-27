const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./UserModel');
require("dotenv").config()

const app = express();
 
//middleware
app.use(express.json())
app.use(cors())

// Connect to MongoDB
mongoose.connect(process.env.CONNECTIONSTRING)

UserModel.find({})
  .then((users) => console.log(users))
  .catch((err) => console.error(err));